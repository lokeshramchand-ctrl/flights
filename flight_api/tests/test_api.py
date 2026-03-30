"""
Test suite for the Flight Schedule API.

Covers:
  - GET /flights  (listing, filtering, sorting, pagination)
  - GET /flights/{id}  (happy path + 404)
  - GET /stands  (listing, type filter)
  - GET /stands/{id}/schedule  (happy path + 404)
  - POST /flights/{id}/reassign  (happy path, size conflict, time conflict, 404)
"""

from __future__ import annotations

import pytest
from copy import deepcopy
from fastapi.testclient import TestClient

from app.main import create_app
from app.core.dependencies import get_flight_service, get_stand_service
from app.data.mock_data import DataStore
from app.services.flight_service import FlightService
from app.services.stand_service import StandService


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------


@pytest.fixture()
def fresh_store() -> DataStore:
    """Return a fresh DataStore so mutations between tests are isolated."""
    return DataStore()


@pytest.fixture()
def client(fresh_store: DataStore) -> TestClient:
    app = create_app()

    # Override DI to use the isolated store
    app.dependency_overrides[get_flight_service] = lambda: FlightService(fresh_store)
    app.dependency_overrides[get_stand_service] = lambda: StandService(fresh_store)

    return TestClient(app)


# ---------------------------------------------------------------------------
# Helper
# ---------------------------------------------------------------------------


def assert_error(response, *, status_code: int, code: str) -> None:
    assert response.status_code == status_code, response.text
    body = response.json()
    # Our global HTTPException handler wraps errors as {"error": {"code": ..., "message": ...}}
    assert "error" in body, f"Expected 'error' key in response body, got: {body}"
    assert body["error"]["code"] == code, f"Expected code={code!r}, got: {body['error']}"


# ===========================================================================
# GET /flights
# ===========================================================================


class TestListFlights:
    def test_returns_all_flights_with_pagination_meta(self, client: TestClient) -> None:
        r = client.get("/flights")
        assert r.status_code == 200
        body = r.json()
        assert "data" in body
        assert "pagination" in body
        pagination = body["pagination"]
        assert pagination["total"] == 10
        assert pagination["page"] == 1
        assert pagination["per_page"] == 10
        assert pagination["total_pages"] == 1

    def test_filter_by_terminal(self, client: TestClient) -> None:
        r = client.get("/flights?terminal=T1")
        assert r.status_code == 200
        flights = r.json()["data"]
        assert len(flights) == 6
        assert all(f["terminal"] == "T1" for f in flights)

    def test_filter_by_status_delayed(self, client: TestClient) -> None:
        r = client.get("/flights?status=delayed")
        assert r.status_code == 200
        flights = r.json()["data"]
        assert len(flights) == 2
        assert all(f["status"] == "delayed" for f in flights)

    def test_filter_by_status_early(self, client: TestClient) -> None:
        r = client.get("/flights?status=early")
        assert r.status_code == 200
        flights = r.json()["data"]
        assert len(flights) == 2
        assert all(f["status"] == "early" for f in flights)

    def test_filter_by_time_range(self, client: TestClient) -> None:
        r = client.get("/flights?from=2025-01-15T06:00:00Z&to=2025-01-15T09:00:00Z")
        assert r.status_code == 200
        flights = r.json()["data"]
        # FL001 (06:30), FL003 (07:00), FL007 (05:30) is excluded (05:30 < 06:00)
        # FL005 (08:45) is included; FL007 (05:30) is before from
        scheduled_times = [f["scheduled_time"] for f in flights]
        assert all("2025-01-15T06" <= t[:19] or "2025-01-15T07" <= t[:19] or "2025-01-15T08" <= t[:19] for t in scheduled_times)

    def test_sort_by_airline_desc(self, client: TestClient) -> None:
        r = client.get("/flights?sort=airline&order=desc")
        assert r.status_code == 200
        airlines = [f["airline"] for f in r.json()["data"]]
        assert airlines == sorted(airlines, reverse=True)

    def test_sort_by_flight_number_asc(self, client: TestClient) -> None:
        r = client.get("/flights?sort=flight_number&order=asc")
        assert r.status_code == 200
        numbers = [f["flight_number"] for f in r.json()["data"]]
        assert numbers == sorted(numbers)

    def test_pagination_second_page(self, client: TestClient) -> None:
        r = client.get("/flights?per_page=4&page=2")
        assert r.status_code == 200
        body = r.json()
        assert len(body["data"]) == 4
        assert body["pagination"]["page"] == 2
        assert body["pagination"]["total_pages"] == 3

    def test_pagination_last_page_partial(self, client: TestClient) -> None:
        r = client.get("/flights?per_page=4&page=3")
        assert r.status_code == 200
        body = r.json()
        assert len(body["data"]) == 2  # 10 total, pages of 4 → last page has 2

    def test_invalid_status_returns_422(self, client: TestClient) -> None:
        r = client.get("/flights?status=unknown")
        assert_error(r, status_code=422, code="VALIDATION_ERROR")

    def test_invalid_sort_field_returns_422(self, client: TestClient) -> None:
        r = client.get("/flights?sort=pax_count")
        assert_error(r, status_code=422, code="VALIDATION_ERROR")

    def test_invalid_order_returns_422(self, client: TestClient) -> None:
        r = client.get("/flights?order=random")
        assert_error(r, status_code=422, code="VALIDATION_ERROR")

    def test_invalid_from_datetime_returns_422(self, client: TestClient) -> None:
        r = client.get("/flights?from=not-a-date")
        assert_error(r, status_code=422, code="VALIDATION_ERROR")

    def test_terminal_filter_case_insensitive(self, client: TestClient) -> None:
        r1 = client.get("/flights?terminal=T2")
        r2 = client.get("/flights?terminal=t2")
        assert r1.json()["pagination"]["total"] == r2.json()["pagination"]["total"]


# ===========================================================================
# GET /flights/{flight_id}
# ===========================================================================


class TestGetFlight:
    def test_returns_correct_flight(self, client: TestClient) -> None:
        r = client.get("/flights/FL001")
        assert r.status_code == 200
        body = r.json()
        assert body["id"] == "FL001"
        assert body["flight_number"] == "EK203"
        assert body["airline"] == "Emirates"
        assert body["aircraft_size"] == "F"

    def test_returns_all_required_fields(self, client: TestClient) -> None:
        r = client.get("/flights/FL007")
        body = r.json()
        required_fields = {
            "id", "flight_number", "airline", "aircraft_type", "aircraft_size",
            "origin", "destination", "terminal", "assigned_stand", "operation",
            "scheduled_time", "estimated_time", "block_time_start", "block_time_end",
            "status", "pax_count",
        }
        assert required_fields.issubset(body.keys())

    def test_not_found_returns_404(self, client: TestClient) -> None:
        r = client.get("/flights/FL999")
        assert_error(r, status_code=404, code="NOT_FOUND")

    def test_not_found_body_contains_id(self, client: TestClient) -> None:
        r = client.get("/flights/GHOST")
        assert "GHOST" in r.json()["error"]["message"]


# ===========================================================================
# GET /stands
# ===========================================================================


class TestListStands:
    def test_returns_all_stands(self, client: TestClient) -> None:
        r = client.get("/stands")
        assert r.status_code == 200
        assert len(r.json()) == 10

    def test_filter_by_terminal_t1(self, client: TestClient) -> None:
        r = client.get("/stands?terminal=T1")
        stands = r.json()
        assert len(stands) == 5
        assert all(s["terminal"] == "T1" for s in stands)

    def test_filter_by_type_contact(self, client: TestClient) -> None:
        r = client.get("/stands?type=contact")
        stands = r.json()
        assert all(s["type"] == "contact" for s in stands)
        assert len(stands) == 7

    def test_filter_by_type_remote(self, client: TestClient) -> None:
        r = client.get("/stands?type=remote")
        stands = r.json()
        assert all(s["type"] == "remote" for s in stands)
        assert len(stands) == 3

    def test_occupancy_fields_present(self, client: TestClient) -> None:
        r = client.get("/stands")
        for stand in r.json():
            assert "is_occupied" in stand
            assert "current_flight_id" in stand

    def test_invalid_type_returns_422(self, client: TestClient) -> None:
        r = client.get("/stands?type=gate")
        assert_error(r, status_code=422, code="VALIDATION_ERROR")

    def test_combined_terminal_and_type_filter(self, client: TestClient) -> None:
        r = client.get("/stands?terminal=T2&type=remote")
        stands = r.json()
        assert all(s["terminal"] == "T2" and s["type"] == "remote" for s in stands)
        assert len(stands) == 2


# ===========================================================================
# GET /stands/{stand_id}/schedule
# ===========================================================================


class TestStandSchedule:
    def test_stand_with_multiple_flights(self, client: TestClient) -> None:
        # A1-01 has FL001 and FL002
        r = client.get("/stands/A1-01/schedule")
        assert r.status_code == 200
        body = r.json()
        assert body["stand_id"] == "A1-01"
        assert len(body["schedule"]) == 2
        # Must be chronologically ordered
        times = [e["block_time_start"] for e in body["schedule"]]
        assert times == sorted(times)

    def test_stand_with_single_flight(self, client: TestClient) -> None:
        r = client.get("/stands/B1-02/schedule")
        assert r.status_code == 200
        body = r.json()
        assert len(body["schedule"]) == 1
        assert body["schedule"][0]["flight_number"] == "JL043"

    def test_stand_with_no_flights(self, client: TestClient) -> None:
        r = client.get("/stands/A1-04/schedule")
        assert r.status_code == 200
        body = r.json()
        assert body["schedule"] == []

    def test_schedule_entry_fields(self, client: TestClient) -> None:
        r = client.get("/stands/A1-03/schedule")
        entry = r.json()["schedule"][0]
        expected_fields = {"flight_id", "flight_number", "airline", "operation", "block_time_start", "block_time_end", "status"}
        assert expected_fields.issubset(entry.keys())

    def test_not_found_returns_404(self, client: TestClient) -> None:
        r = client.get("/stands/Z9-99/schedule")
        assert_error(r, status_code=404, code="NOT_FOUND")


# ===========================================================================
# POST /flights/{flight_id}/reassign
# ===========================================================================


class TestReassignFlight:
    def test_happy_path_valid_reassignment(self, client: TestClient) -> None:
        # FL009 (B1-02, E size) → A1-05 (remote, max E, no conflicts)
        r = client.post("/flights/FL009/reassign", json={"target_stand_id": "A1-05"})
        assert r.status_code == 200
        body = r.json()
        assert body["assigned_stand"] == "A1-05"
        assert body["id"] == "FL009"

    def test_reassignment_persists(self, client: TestClient) -> None:
        client.post("/flights/FL009/reassign", json={"target_stand_id": "A1-05"})
        r = client.get("/flights/FL009")
        assert r.json()["assigned_stand"] == "A1-05"

    def test_terminal_updated_on_reassignment(self, client: TestClient) -> None:
        # FL009 is T2; A1-05 is T1 — terminal should update
        r = client.post("/flights/FL009/reassign", json={"target_stand_id": "A1-05"})
        assert r.json()["terminal"] == "T1"

    def test_flight_not_found_returns_404(self, client: TestClient) -> None:
        r = client.post("/flights/FL999/reassign", json={"target_stand_id": "A1-05"})
        assert_error(r, status_code=404, code="NOT_FOUND")

    def test_stand_not_found_returns_404(self, client: TestClient) -> None:
        r = client.post("/flights/FL009/reassign", json={"target_stand_id": "Z9-99"})
        assert_error(r, status_code=404, code="NOT_FOUND")

    def test_aircraft_size_too_large_returns_422(self, client: TestClient) -> None:
        # FL001 is size F (A380); A1-04 max is D
        r = client.post("/flights/FL001/reassign", json={"target_stand_id": "A1-04"})
        assert_error(r, status_code=422, code="VALIDATION_ERROR")
        assert "size" in r.json()["error"]["message"].lower()

    def test_time_conflict_returns_409(self, client: TestClient) -> None:
        # FL005 is on A1-03 (block 08:45–11:00); FL006 is on A1-03 (block 11:30–13:00)
        # Trying to move FL004 (block 11:30–14:00) onto A1-03 should conflict with FL006
        r = client.post("/flights/FL004/reassign", json={"target_stand_id": "A1-03"})
        assert_error(r, status_code=409, code="CONFLICT")

    def test_reassign_to_same_stand_no_self_conflict(self, client: TestClient) -> None:
        # Reassigning a flight to its own current stand should not conflict with itself
        r = client.post("/flights/FL009/reassign", json={"target_stand_id": "B1-02"})
        assert r.status_code == 200

    def test_missing_target_stand_id_returns_422(self, client: TestClient) -> None:
        r = client.post("/flights/FL009/reassign", json={})
        assert r.status_code == 422

    def test_size_equal_to_max_is_allowed(self, client: TestClient) -> None:
        # FL001 is size F; A1-01 max is F — should be allowed (reassign to same, no conflict)
        r = client.post("/flights/FL001/reassign", json={"target_stand_id": "A1-01"})
        assert r.status_code == 200

    def test_smaller_aircraft_fits_larger_stand(self, client: TestClient) -> None:
        # FL010 is size D (A330-200); B1-01 max is F — should be allowed, no time conflicts
        r = client.post("/flights/FL010/reassign", json={"target_stand_id": "B1-04"})
        assert r.status_code == 200


# ===========================================================================
# Health check
# ===========================================================================


class TestHealth:
    def test_health_endpoint(self, client: TestClient) -> None:
        r = client.get("/health")
        assert r.status_code == 200
        assert r.json() == {"status": "ok"}
