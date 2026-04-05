"""
Flight-related API endpoints.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.core.dependencies import get_flight_service
from app.core.exceptions import ConflictError, NotFoundError, ValidationError
from app.schemas.schemas import (
    ErrorResponse,
    FlightResponse,
    ReassignRequest,
)
from app.services.flight_service import FlightService
from server.app.api.routes.stands import StandardResponse

router = APIRouter(prefix="/flights", tags=["Flights"])


def _validation_error_response(msg: str) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        detail={"code": "VALIDATION_ERROR", "message": msg},
    )


def _not_found_response(exc: NotFoundError) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail={"code": "NOT_FOUND", "message": str(exc)},
    )


def _conflict_response(exc: ConflictError) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_409_CONFLICT,
        detail={"code": "CONFLICT", "message": str(exc)},
    )


@router.get(
    "",
    response_model=StandardResponse,
    summary="List flights",
    description="Returns a paginated list of flights with optional filtering and sorting.",
)
def list_flights(
    terminal: str | None = Query(None, description="Filter by terminal (e.g. T1, T2)"),
    status: str | None = Query(None, description="Filter by status: on_time | delayed | early"),
    from_: str | None = Query(None, alias="from", description="ISO datetime lower bound on scheduled_time"),
    to: str | None = Query(None, description="ISO datetime upper bound on scheduled_time"),
    sort: str = Query("scheduled_time", description="Sort field: scheduled_time | flight_number | airline"),
    order: str = Query("asc", description="Sort direction: asc | desc"),
    page: int = Query(1, ge=1, description="Page number (1-based)"),
    per_page: int = Query(10, ge=1, le=100, description="Number of items per page"),
    service: FlightService = Depends(get_flight_service),
) -> dict:
    try:
        flights, total = service.list_flights(
            terminal=terminal,
            status=status,
            from_time=from_,
            to_time=to,
            sort=sort,
            order=order,
            page=page,
            per_page=per_page,
        )
        meta = {
            "total": total,
            "page": page,
            "per_page": per_page,
            "total_pages": (total + per_page - 1) // per_page,
        }
        return {"data": flights, "meta": meta}
    except ValidationError as exc:
        raise _validation_error_response(str(exc))


@router.get(
    "/{flight_id}",
    response_model=StandardResponse,
    summary="Get a single flight",
    responses={404: {"model": ErrorResponse}},
)
def get_flight(
    flight_id: str,
    service: FlightService = Depends(get_flight_service),
) -> StandardResponse:
    try:
        flight = service.get_flight(flight_id)
        return {"data": FlightResponse(**flight)}
    except NotFoundError as exc:
        raise _not_found_response(exc)


@router.post(
    "/{flight_id}/reassign",
    response_model=StandardResponse,
    summary="Reassign a flight to a different stand",
    responses={
        404: {"model": ErrorResponse},
        409: {"model": ErrorResponse},
        422: {"model": ErrorResponse},
    },
)
def reassign_flight(
    flight_id: str,
    body: ReassignRequest,
    service: FlightService = Depends(get_flight_service),
) -> dict:
    try:
        updated = service.reassign_flight(flight_id, body.target_stand_id)
        return {"data": FlightResponse(**updated)}
    except NotFoundError as exc:
        raise _not_found_response(exc)
    except ValidationError as exc:
        raise _validation_error_response(str(exc))
    except ConflictError as exc:
        raise _conflict_response(exc)
