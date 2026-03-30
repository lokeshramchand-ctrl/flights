"""
Stand service — queries and occupancy enrichment for stand data.
"""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from app.core.constants import VALID_STAND_TYPES
from app.core.exceptions import NotFoundError, ValidationError
from app.data.mock_data import DataStore


def _now_utc() -> datetime:
    return datetime.now(timezone.utc)


def _parse_dt(value: str) -> datetime:
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def _is_currently_occupied(flight: dict[str, Any]) -> bool:
    now = _now_utc()
    start = _parse_dt(flight["block_time_start"])
    end = _parse_dt(flight["block_time_end"])
    return start <= now < end


class StandService:
    def __init__(self, store: DataStore) -> None:
        self._store = store

    # ------------------------------------------------------------------
    # List stands (with optional filters + live occupancy enrichment)
    # ------------------------------------------------------------------

    def list_stands(
        self,
        *,
        terminal: str | None = None,
        stand_type: str | None = None,
    ) -> list[dict[str, Any]]:
        if stand_type is not None and stand_type not in VALID_STAND_TYPES:
            raise ValidationError(
                f"Invalid stand type '{stand_type}'. Must be one of: {', '.join(sorted(VALID_STAND_TYPES))}."
            )

        stands = self._store.get_stands()

        if terminal:
            stands = [s for s in stands if s["terminal"].upper() == terminal.upper()]
        if stand_type:
            stands = [s for s in stands if s["type"] == stand_type]

        return [self._enrich_occupancy(s) for s in stands]

    # ------------------------------------------------------------------
    # Stand schedule
    # ------------------------------------------------------------------

    def get_stand_schedule(self, stand_id: str) -> dict[str, Any]:
        stand = self._store.get_stand_by_id(stand_id)
        if not stand:
            raise NotFoundError("Stand", stand_id)

        flights = self._store.get_flights()
        assigned = [f for f in flights if f["assigned_stand"] == stand_id]
        assigned.sort(key=lambda f: f["block_time_start"])

        schedule = [
            {
                "flight_id": f["id"],
                "flight_number": f["flight_number"],
                "airline": f["airline"],
                "operation": f["operation"],
                "block_time_start": f["block_time_start"],
                "block_time_end": f["block_time_end"],
                "status": f["status"],
            }
            for f in assigned
        ]

        return {
            "stand_id": stand_id,
            "terminal": stand["terminal"],
            "schedule": schedule,
        }

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------

    def _enrich_occupancy(self, stand: dict[str, Any]) -> dict[str, Any]:
        """Attach live occupancy fields to a stand dict."""
        flights = self._store.get_flights()
        current = next(
            (
                f
                for f in flights
                if f["assigned_stand"] == stand["id"] and _is_currently_occupied(f)
            ),
            None,
        )
        return {
            **stand,
            "is_occupied": current is not None,
            "current_flight_id": current["id"] if current else None,
        }
