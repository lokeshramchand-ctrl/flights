"""
Pydantic v2 schemas for API request and response bodies.
Keeping schemas separate from domain models keeps serialisation concerns isolated.
"""

from __future__ import annotations

from datetime import datetime
from typing import Any, Generic, Optional, TypeVar

from pydantic import BaseModel, Field, field_validator

T = TypeVar("T")


# ---------------------------------------------------------------------------
# Shared / Pagination
# ---------------------------------------------------------------------------


class PaginationMeta(BaseModel):
    total: int
    page: int
    per_page: int
    total_pages: int


class PaginatedResponse(BaseModel, Generic[T]):
    data: list[T]
    pagination: PaginationMeta


class ErrorDetail(BaseModel):
    code: str
    message: str
    detail: str | None = None


class ErrorResponse(BaseModel):
    error: ErrorDetail


# ---------------------------------------------------------------------------
# Flight schemas
# ---------------------------------------------------------------------------


class Position(BaseModel):
    x: float
    y: float


class FlightResponse(BaseModel):
    id: str
    flight_number: str
    airline: str
    aircraft_type: str
    aircraft_size: str
    origin: str
    destination: str
    terminal: str
    assigned_stand: str
    operation: str
    scheduled_time: str
    estimated_time: str
    block_time_start: str
    block_time_end: str
    status: str
    pax_count: int

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Stand schemas
# ---------------------------------------------------------------------------


class StandResponse(BaseModel):
    id: str
    terminal: str
    type: str
    has_plb: bool
    max_aircraft_size: str
    associated_gate: str | None
    position: dict[str, float]
    is_occupied: bool = False
    current_flight_id: str | None = None

    model_config = {"from_attributes": True}


class StandScheduleEntry(BaseModel):
    flight_id: str
    flight_number: str
    airline: str
    operation: str
    block_time_start: str
    block_time_end: str
    status: str


class StandScheduleResponse(BaseModel):
    stand_id: str
    terminal: str
    schedule: list[StandScheduleEntry]


# ---------------------------------------------------------------------------
# Reassign request
# ---------------------------------------------------------------------------


class ReassignRequest(BaseModel):
    target_stand_id: str = Field(..., min_length=1, description="ID of the target stand")

    @field_validator("target_stand_id")
    @classmethod
    def strip_whitespace(cls, v: str) -> str:
        return v.strip()

class StandardResponse(BaseModel):
    data: Any
    meta: Optional[dict] = None
    