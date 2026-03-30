# Flight Schedule API

A REST API built with **FastAPI** for querying and manipulating airport flight schedule data.

---

## Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Run the development server
uvicorn app.main:app --reload

# API is available at http://localhost:8000
# Interactive docs at http://localhost:8000/docs
```

---

## Project Structure

```
flight_api/
├── app/
│   ├── main.py                  # App factory, router registration, exception handlers
│   ├── api/
│   │   └── routes/
│   │       ├── flights.py       # Flight endpoints (list, get, reassign)
│   │       └── stands.py        # Stand endpoints (list, schedule)
│   ├── core/
│   │   ├── constants.py         # ICAO size codes, valid enum values
│   │   ├── dependencies.py      # FastAPI DI providers
│   │   └── exceptions.py        # Domain exceptions (NotFoundError, ConflictError, ValidationError)
│   ├── data/
│   │   └── mock_data.py         # In-memory DataStore singleton + raw mock data
│   ├── schemas/
│   │   └── schemas.py           # Pydantic v2 request/response models
│   └── services/
│       ├── flight_service.py    # Flight business logic (filter, sort, paginate, reassign)
│       └── stand_service.py     # Stand business logic (occupancy enrichment, schedule)
└── tests/
    └── test_api.py              # 42 tests covering all endpoints
```

### Architecture

The project follows a layered architecture:

- **Routes** — HTTP concerns only (parsing query params, mapping domain exceptions to status codes)
- **Services** — all business logic; no HTTP dependencies
- **Data** — the `DataStore` is a thin in-memory store; swapping it for a real DB only requires changing the data layer
- **Schemas** — Pydantic models for serialisation; kept separate from services so domain logic never has to import HTTP types

---

## Running Tests

```bash
pytest tests/ -v
```

42 tests, 0 failures. Coverage includes:

- Happy paths for every endpoint
- Filtering by terminal, status, time range
- Sorting and pagination edge cases
- Stand type and terminal filters
- Schedule ordering
- Reassignment: success, size conflict (422), time overlap (409), missing resources (404)
- Invalid query parameters returning 422 with descriptive messages

---

## Error Response Shape

All errors return a consistent envelope:

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Flight 'FL999' not found."
  }
}
```

| Code               | HTTP Status | Meaning                                              |
|--------------------|-------------|------------------------------------------------------|
| `NOT_FOUND`        | 404         | Flight or stand does not exist                       |
| `VALIDATION_ERROR` | 422         | Invalid query param or aircraft/stand incompatibility|
| `CONFLICT`         | 409         | Stand occupied during the requested time window       |

---

## API Reference

### `GET /flights`

Returns a paginated list of flights.

**Query Parameters**

| Parameter  | Type   | Default        | Description                                              |
|------------|--------|----------------|----------------------------------------------------------|
| `terminal` | string | —              | Filter by terminal, e.g. `T1`, `T2` (case-insensitive)  |
| `status`   | string | —              | `on_time` \| `delayed` \| `early`                        |
| `from`     | string | —              | ISO 8601 lower bound on `scheduled_time`                 |
| `to`       | string | —              | ISO 8601 upper bound on `scheduled_time`                 |
| `sort`     | string | `scheduled_time` | `scheduled_time` \| `flight_number` \| `airline`       |
| `order`    | string | `asc`          | `asc` \| `desc`                                          |
| `page`     | int    | `1`            | Page number (1-indexed)                                  |
| `per_page` | int    | `10`           | Results per page (1–100)                                 |

**Response `200 OK`**

```json
{
  "data": [ /* FlightResponse[] */ ],
  "pagination": {
    "total": 10,
    "page": 1,
    "per_page": 10,
    "total_pages": 1
  }
}
```

---

### `GET /flights/{flight_id}`

Returns a single flight by ID.

**Response `200 OK`** — `FlightResponse`

**Response `404 Not Found`** — `{ "error": { "code": "NOT_FOUND", "message": "..." } }`

---

### `POST /flights/{flight_id}/reassign`

Reassigns a flight to a different stand.

**Request Body**

```json
{ "target_stand_id": "A1-04" }
```

**Validation Rules**

1. Flight must exist
2. Target stand must exist
3. Aircraft ICAO size code must be ≤ stand's `max_aircraft_size`
4. No block-time overlap with other flights already assigned to the target stand

**Response `200 OK`** — updated `FlightResponse`

**Errors**

| Condition                          | Status | Code               |
|------------------------------------|--------|--------------------|
| Flight not found                   | 404    | `NOT_FOUND`        |
| Stand not found                    | 404    | `NOT_FOUND`        |
| Aircraft too large for stand       | 422    | `VALIDATION_ERROR` |
| Stand occupied during flight window| 409    | `CONFLICT`         |

---

### `GET /stands`

Returns all stands with live occupancy status.

**Query Parameters**

| Parameter  | Type   | Description                          |
|------------|--------|--------------------------------------|
| `terminal` | string | Filter by terminal (`T1`, `T2`, …)   |
| `type`     | string | `contact` \| `remote`                |

**Response `200 OK`** — `StandResponse[]`

Each stand includes:

```json
{
  "id": "A1-01",
  "terminal": "T1",
  "type": "contact",
  "has_plb": true,
  "max_aircraft_size": "F",
  "associated_gate": "G01",
  "position": { "x": 100, "y": 50 },
  "is_occupied": false,
  "current_flight_id": null
}
```

---

### `GET /stands/{stand_id}/schedule`

Returns the chronologically ordered list of flights assigned to a stand.

**Response `200 OK`**

```json
{
  "stand_id": "A1-01",
  "terminal": "T1",
  "schedule": [
    {
      "flight_id": "FL001",
      "flight_number": "EK203",
      "airline": "Emirates",
      "operation": "arrival",
      "block_time_start": "2025-01-15T06:30:00Z",
      "block_time_end": "2025-01-15T08:45:00Z",
      "status": "on_time"
    }
  ]
}
```

**Response `404 Not Found`** if the stand ID does not exist.

---

### `GET /health`

```json
{ "status": "ok" }
```

---

## Aircraft Size Compatibility

ICAO size codes in ascending order: `A < B < C < D < E < F`

A stand with `max_aircraft_size: "E"` will accept codes A–E but reject F.
