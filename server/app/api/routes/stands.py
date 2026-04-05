"""
Stand-related API endpoints.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, JSONResponse, status
from pydantic import BaseModel
from typing import Any, Optional


from app.core.dependencies import get_stand_service
from app.core.exceptions import NotFoundError, ValidationError, format_error_response
from app.schemas.schemas import (
    ErrorResponse,
    StandScheduleResponse,
    StandardResponse,
)
from app.services.stand_service import StandService

router = APIRouter(prefix="/stands", tags=["Stands"])


@router.get(
    "",
    response_model=StandardResponse,
    summary="List stands with occupancy",
    description="Returns all stands with live occupancy status, filtered by terminal and type.",
)
def list_stands_with_occupancy(
    terminal: str | None = None,
    type: str | None = None,
    service: StandService = Depends(get_stand_service),
) -> StandardResponse:
    try:
        stands = service.list_stands(terminal=terminal, stand_type=type)
        meta = {
            "total": len(stands),
            "filters": {
                "terminal": terminal,
                "type": type,
            },
        }
        return {"data": stands, "meta": meta}
    except ValidationError as exc:
        raise JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=format_error_response("VALIDATION_ERROR", str(exc)),
        )


@router.get(
    "/{stand_id}/schedule",
    response_model=StandardResponse,
    summary="Get stand schedule",
    description="Returns the chronological sequence of flights assigned to a stand for the day.",
    responses={404: {"model": ErrorResponse}},
)
def get_stand_schedule(
    stand_id: str,
    service: StandService = Depends(get_stand_service),
) -> StandardResponse:
    try:
        result = service.get_stand_schedule(stand_id)
        return {"data": StandScheduleResponse(**result)}
    except NotFoundError as exc:
        raise JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=format_error_response("NOT_FOUND", str(exc)),
        )
