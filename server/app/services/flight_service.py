"""
Flight service — all business logic for flight queries and mutations.
No HTTP concerns live here; the service works purely with domain data.
"""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from app.core.constants import (
    AIRCRAFT_SIZE_ORDER,
    VALID_SORT_FIELDS,
    VALID_SORT_ORDERS,
    VALID_STATUSES,
)
from app.core.exceptions import ConflictError, NotFoundError, ValidationError
from app.data.mock_data import DataStore
from app.core.utils import parse_iso


def _aircraft_size_index(size: str) -> int:
    try:
        return AIRCRAFT_SIZE_ORDER.index(size.upper())
    except ValueError:
        raise ValidationError(f"Invalid aircraft size: '{size}'")


def _blocks_overlap(start_a: str, end_a: str, start_b: str, end_b: str) -> bool:
    """Return True if two block-time windows overlap (exclusive boundary comparison)."""
    a_start = parse_iso(start_a)
    a_end = parse_iso(end_a)
    b_start = parse_iso(start_b)
    b_end = parse_iso(end_b)
    return a_start < b_end and b_start < a_end


class FlightService:
    def __init__(self, store: DataStore) -> None:
        self._store = store

    # ------------------------------------------------------------------
    # List flights with filtering, sorting, pagination
    # ------------------------------------------------------------------

    def list_flights(
        self,
        *,
        terminal: str | None = None,
        status: str | None = None,
        from_time: str | None = None,
        to_time: str | None = None,
        sort: str = "scheduled_time",
        order: str = "asc",
        page: int = 1,
        per_page: int = 10,
    ) -> tuple[Any, int]:
        # --- validate query params ---
        if status is not None and status not in VALID_STATUSES:
            raise ValidationError(
                f"Invalid status '{status}'. Must be one of: {', '.join(sorted(VALID_STATUSES))}."
            )
        if sort not in VALID_SORT_FIELDS:
            raise ValidationError(
                f"Invalid sort field '{sort}'. Must be one of: {', '.join(sorted(VALID_SORT_FIELDS))}."
            )
        if order not in VALID_SORT_ORDERS:
            raise ValidationError("Order must be 'asc' or 'desc'.")
        if page < 1:
            raise ValidationError("Page must be >= 1.")
        if per_page < 1 or per_page > 100:
            raise ValidationError("per_page must be between 1 and 100.")

        from_dt: datetime | None = None
        to_dt: datetime | None = None
        if from_time:
            try:
                from_dt = parse_iso(from_time)
            except ValueError:
                raise ValidationError(f"Invalid 'from' datetime: '{from_time}'.")
        if to_time:
            try:
                to_dt = parse_iso(to_time)
            except ValueError:
                raise ValidationError(f"Invalid 'to' datetime: '{to_time}'.")

        flights = self._store.get_flights()

        # --- filter ---
        if terminal:
            flights = [f for f in flights if f["terminal"].upper() == terminal.upper()]
        if status:
            flights = [f for f in flights if f["status"].lower() == status.lower()]
        if from_dt:
            flights = [f for f in flights if parse_iso(f["scheduled_time"]) >= from_dt]
        if to_dt:
            flights = [f for f in flights if parse_iso(f["scheduled_time"]) <= to_dt]

        # --- sort ---
        def _sort_key(f):
            if sort in ["scheduled_time"]:
                return parse_iso(f[sort])
            return f[sort]

        reverse = order == "desc"
        flights = sorted(flights, key=_sort_key, reverse=reverse)

        # --- paginate ---
        total = len(flights)
        start = (page - 1) * per_page
        end = start + per_page
        page_data = flights[start:end]

        return page_data, total

    # ------------------------------------------------------------------
    # Single flight
    # ------------------------------------------------------------------

    def get_flight(self, flight_id: str) -> dict[str, Any]:
        flight = self._store.get_flight_by_id(flight_id)
        if not flight:
            raise NotFoundError("Flight", flight_id)
        return flight

    # ------------------------------------------------------------------
    # Reassign
    # ------------------------------------------------------------------

    def reassign_flight(self, flight_id: str, target_stand_id: str) -> dict[str, Any]:
        # 1. Flight must exist
        flight = self._store.get_flight_by_id(flight_id)
        if not flight:
            raise NotFoundError("Flight", flight_id)

        # Check if the flight is already assigned to the target stand
        if flight["assigned_stand"] == target_stand_id:
            raise ConflictError(
                f"Flight '{flight_id}' is already assigned to stand '{target_stand_id}'."
            )

        # 2. Target stand must exist
        stand = self._store.get_stand_by_id(target_stand_id)
        if not stand:
            raise NotFoundError("Stand", target_stand_id)

        # 3. Aircraft size compatibility
        aircraft_idx = _aircraft_size_index(flight["aircraft_size"])
        stand_max_idx = _aircraft_size_index(stand["max_aircraft_size"])
        if aircraft_idx > stand_max_idx:
            raise ValidationError(
                f"Aircraft size '{flight['aircraft_size']}' exceeds stand '{target_stand_id}' "
                f"maximum allowed size '{stand['max_aircraft_size']}'."
            )

        # 4. No time-window overlap with other flights already at target stand
        conflicts = [
            f
            for f in self._store.get_flights()
            if f["assigned_stand"] == target_stand_id
            and f["id"] != flight_id
            and _blocks_overlap(
                flight["block_time_start"],
                flight["block_time_end"],
                f["block_time_start"],
                f["block_time_end"],
            )
        ]
        if conflicts:
            conflict_ids = ", ".join(c["flight_number"] for c in conflicts)
            raise ConflictError(
                f"Stand '{target_stand_id}' is occupied during the flight's block time "
                f"by: {conflict_ids}."
            )

        # 5. Persist the change
        updated = self._store.update_flight(
            flight_id,
            {
                "assigned_stand": target_stand_id,
                "terminal": stand["terminal"],
            },
        )
        return updated  # type: ignore[return-value]
