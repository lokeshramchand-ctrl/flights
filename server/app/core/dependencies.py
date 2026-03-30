"""
FastAPI dependency-injection providers.
Centralising DI here means tests can override dependencies in one place.
"""

from app.data.mock_data import store
from app.services.flight_service import FlightService
from app.services.stand_service import StandService


def get_flight_service() -> FlightService:
    return FlightService(store)


def get_stand_service() -> StandService:
    return StandService(store)
