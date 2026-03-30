"""
Stand-related API endpoints.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.core.dependencies import get_stand_service
from app.core.exceptions import NotFoundError, ValidationError
from app.schemas.schemas import (
    ErrorResponse,
    StandResponse,
    StandScheduleResponse,
)
from app.services.stand_service import StandService

router = APIRouter(prefix="/stands", tags=["Stands"])


@router.get(
    "",
    response_model=list[StandResponse],
    summary="List stands",
    description="Returns all stands with live occupancy status. Supports filtering by terminal and type.",
)
def list_stands(
    terminal: str | None = Query(None, description="Filter by terminal (e.g. T1, T2)"),
    type: str | None = Query(None, description="Filter by stand type: contact | remote"),
    service: StandService = Depends(get_stand_service),
) -> list[StandResponse]:
    try:
        stands = service.list_stands(terminal=terminal, stand_type=type)
    except ValidationError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={"code": "VALIDATION_ERROR", "message": str(exc)},
        )
    return [StandResponse(**s) for s in stands]


@router.get(
    "/{stand_id}/schedule",
    response_model=StandScheduleResponse,
    summary="Get stand schedule",
    description="Returns the chronological sequence of flights assigned to a stand for the day.",
    responses={404: {"model": ErrorResponse}},
)
def get_stand_schedule(
    stand_id: str,
    service: StandService = Depends(get_stand_service),
) -> StandScheduleResponse:
    try:
        result = service.get_stand_schedule(stand_id)
    except NotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "NOT_FOUND", "message": str(exc)},
        )
    return StandScheduleResponse(**result)
