"""
Stand-related API endpoints.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.dependencies import get_stand_service
from app.core.exceptions import NotFoundError, ValidationError
from app.schemas.schemas import (
    ErrorResponse,
    StandScheduleResponse,
)
from app.services.stand_service import StandService

router = APIRouter(prefix="/stands", tags=["Stands"])


@router.get(
    "",
    response_model=dict,
    summary="List stands with occupancy",
    description="Returns all stands with live occupancy status, filtered by terminal and type.",
)
def list_stands_with_occupancy(
    terminal: str | None = None,
    type: str | None = None,
    service: StandService = Depends(get_stand_service),
) -> dict:
    try:
        stands = service.list_stands(terminal=terminal, stand_type=type)
        return {"data": stands}
    except ValidationError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={"code": "VALIDATION_ERROR", "message": str(exc)},
        )


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
