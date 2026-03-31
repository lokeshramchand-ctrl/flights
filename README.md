


---

## What Was Built

All three required tasks completed and connected into a single cohesive platform. Task 4 (graph visualization) is partially implemented with the data model and architecture documented.

| Task | Description | Status |
|------|-------------|--------|
| Task 1 | Flight Schedule REST API (FastAPI) |  Complete — 42 tests passing |
| Task 2 | Stand Assignment Gantt Timeline (React) |  Complete — live drag-and-drop |
| Task 3 | AI Operations Chat Interface (React) |  Complete — live API responses |
| Task 4 | Airport Resource Graph |  Data model complete, visualization documented |

**Bonus achieved:** Tasks 1, 2, and 3 are fully connected — the frontend fetches live data from the backend. Drag-and-drop reassignments in the Gantt call the real API and roll back on conflict. The chat assistant routes natural language to real API endpoints and streams the response back.



## Project Structure

```
/
├── server/                        # Task 1 — FastAPI Backend
│   ├── app/
│   │   ├── main.py                    # App factory, CORS, global exception handler
│   │   ├── api/routes/
│   │   │   ├── flights.py             # Flight endpoints
│   │   │   └── stands.py              # Stand endpoints
│   │   ├── core/
│   │   │   ├── constants.py           # ICAO size codes, valid enums
│   │   │   ├── dependencies.py        # FastAPI DI providers
│   │   │   └── exceptions.py          # Domain exceptions
│   │   ├── data/
│   │   │   └── mock_data.py           # In-memory DataStore singleton
│   │   ├── schemas/
│   │   │   └── schemas.py             # Pydantic v2 request/response models
│   │   └── services/
│   │       ├── flight_service.py      # All flight business logic
│   │       └── stand_service.py       # Stand occupancy + schedule logic
│   ├── tests/
│   │   └── test_api.py                # 42 tests, 0 failures
│   └── requirements.txt
│
└── client/                          # Tasks 2 & 3 — React Frontend
    └── src/
        ├── gantt/                     # Task 2 — Operations Dashboard + Gantt
        │   ├── components/
        │   │   ├── GanttTimeline.tsx  # Main chart — stands from API, not static data
        │   │   ├── FlightBlock.tsx    # Draggable flight bar with tooltip
        │   │   ├── DashboardMetrics.tsx
        │   │   └── AppHeader.tsx      # Zoom slider
        │   ├── hooks/
        │   │   ├── useFlights.ts      # Loads from API, handles D&D + optimistic rollback
        │   │   └── useTimeline.ts     # Zoom level + animated scroll-to-now
        │   └── OpsControl.tsx         # Root — wires hooks to components
        │
        └── chat/                      # Task 3 — AI Chat Assistant
            ├── components/
            │   ├── MessageBubble.tsx  # 3-way renderer: user / tool / assistant
            │   ├── MessageList.tsx    # Scrollable history + live tool indicator
            │   ├── ChatInput.tsx      # Textarea, Enter to send, disabled while streaming
            │   └── Sidebar.tsx        # Suggested prompts + live telemetry stats
            ├── hooks/
            │   ├── useChat.ts         # sendMessage → resolveIntent → API → stream
            │   └── useTelemetry.ts    # Live sidebar stats, refreshes every 30s
            ├── services/
            │   └── api.ts             # Typed fetch wrappers for all endpoints
            └── data/
                └── index.ts           # Seed messages, themes, suggested prompts
```

---

## Setup & Running



### 1. Start the Backend (Task 1)

```bash
cd server

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
venv\Scripts\activate
# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn app.main:app --reload
```

Backend running at **http://localhost:8000**
Interactive API docs at **http://localhost:8000/docs**

### 2. Start the Frontend (Tasks 2 & 3)

```bash
cd client
npm install
npm run dev
```

Frontend running at **http://localhost:5173**

> Both must be running simultaneously — the frontend fetches live data from the backend.

---

## API Reference

### Flights

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/flights` | List with filtering, sorting, pagination |
| `GET` | `/flights/{id}` | Single flight by ID |
| `POST` | `/flights/{id}/reassign` | Reassign to a different stand |

**`GET /flights` — Query Parameters**

| Param | Type | Description |
|-------|------|-------------|
| `terminal` | string | Filter by terminal — `T1`, `T2` (case-insensitive) |
| `status` | string | `on_time` \| `delayed` \| `early` |
| `from` | ISO datetime | Lower bound on `scheduled_time` |
| `to` | ISO datetime | Upper bound on `scheduled_time` |
| `sort` | string | `scheduled_time` \| `flight_number` \| `airline` |
| `order` | string | `asc` \| `desc` |
| `page` | int | Page number, 1-indexed |
| `per_page` | int | Results per page, max 100 |

**`POST /flights/{id}/reassign` — Request Body**
```json
{ "target_stand_id": "A1-04" }
```

**Reassignment validation (in order):**
1. Flight must exist → `404`
2. Target stand must exist → `404`
3. Aircraft ICAO size ≤ stand `max_aircraft_size` (A < B < C < D < E < F) → `422`
4. No block-time overlap with other flights at the target stand → `409`

### Stands

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/stands` | All stands with live occupancy status |
| `GET` | `/stands/{id}/schedule` | Chronological flight sequence for a stand |

**`GET /stands` — Query Parameters**

| Param | Type | Description |
|-------|------|-------------|
| `terminal` | string | Filter by terminal |
| `type` | string | `contact` \| `remote` |

### Consistent Error Shape

Every error across every endpoint returns the same envelope:

```json
{
  "error": {
    "code": "CONFLICT",
    "message": "Stand 'A1-03' is occupied during the flight's block time by: EK512."
  }
}
```

| Code | HTTP Status | Meaning |
|------|-------------|---------|
| `NOT_FOUND` | 404 | Flight or stand doesn't exist |
| `VALIDATION_ERROR` | 422 | Invalid param or aircraft too large for stand |
| `CONFLICT` | 409 | Stand occupied during the flight's time window |

---

## Running Tests

```bash
cd server
pytest tests/ -v
```

**42 tests, 0 failures.**

| Area | Count | What's covered |
|------|-------|----------------|
| `GET /flights` | 14 | Filtering, sorting, pagination, invalid params, case sensitivity |
| `GET /flights/{id}` | 4 | Happy path, 404, error body content |
| `GET /stands` | 7 | Listing, terminal filter, type filter, occupancy fields |
| `GET /stands/{id}/schedule` | 5 | Multiple flights, single, empty stand, field shape, 404 |
| `POST /reassign` | 11 | Success, persistence, terminal update, size conflict, time overlap, self-reassign, edge cases |
| Health | 1 | Sanity check |

Each test uses a fresh `DataStore` instance via FastAPI's dependency override — mutations between tests don't bleed through.

---

## Architecture Decisions

- **Routes** — HTTP concerns only (parsing query params, mapping domain exceptions to status codes)
- **Services** — all business logic; no HTTP dependencies
- **Data** — the `DataStore` is a thin in-memory store; swapping it for a real DB only requires changing the data layer
- **Schemas** — Pydantic models for serialisation; kept separate from services so domain logic never has to import HTTP types

### Optimistic updates in drag-and-drop

When a flight block is dragged to a new stand, the UI updates instantly rather than waiting for the network round-trip. If the API rejects the move (size mismatch or time conflict), the block snaps back to its original position and the full flight list is re-fetched from the server to guarantee consistency.

Valid moves feel immediate. Invalid moves are always caught and corrected. The user is never left looking at a state that doesn't match the backend.

### Deterministic intent routing in the chat

The chat assistant uses a pattern-matching intent router (`resolveIntent` in `useChat.ts`) rather than an LLM API call. This keeps the demo fully self-contained — no API keys, no latency, no external dependencies.

The architecture deliberately isolates this choice: `resolveIntent` is a single async function that takes a string and returns a string. Replacing it with a real LLM (Claude, GPT-4) with the API endpoints as tools means changing exactly one function — every other piece (streaming animation, tool-call indicators, message history, scroll behavior) stays identical.

### Streaming simulation

Even though `resolveIntent` returns synchronously, responses stream character-by-character at ~12ms per character. This gives users continuous feedback, communicates response length before they've finished reading, and accurately represents how a production version backed by a real LLM would behave. The typing indicator and tool-call animation run before every response to signal that work is happening.

### Consistent error envelopes

All API errors return `{ "error": { "code": "...", "message": "..." } }`. A single global `HTTPException` handler in `main.py` enforces this uniformly — individual routes raise domain-level exceptions (`NotFoundError`, `ConflictError`, `ValidationError`) and the handler converts them. Frontend error handling is a single pattern regardless of which endpoint fails.

---

## Chat Assistant — Supported Queries

Type naturally in the chat input:

| What to say | What happens |
|-------------|--------------|
| `Show me all delayed flights` | `GET /flights?status=delayed` |
| `What's the current stand utilization?` | `GET /stands` → calculates T1/T2 breakdown |
| `Which flights arrive in the next hour?` | `GET /flights?from=...&to=...` |
| `Show T1 capacity forecast` | `GET /flights?terminal=T1` |
| `Stand A1-01 schedule` | `GET /stands/A1-01/schedule` |


---

## Task 4 — Airport Resource Graph

The graph data is fully modelled in the mock data: PLB connections, walking/bus connections, and adjacency constraints with clearance distances. The data layer is ready.

**What a complete implementation would look like:**

A `GET /graph` endpoint returning the full node-link structure, and a React component using D3 force simulation or React Flow rendering:

- **Stands** as rounded rectangles, **Gates** as circles, colored by terminal (T1 blue / T2 violet)
- **PLB edges** as solid lines, **walking/bus edges** as dashed, **adjacency constraints** as red dotted lines with clearance distance labels
- Hover → highlight node and all connected edges/nodes, dim everything else
- Click → detail panel showing stand properties, current occupancy, and connected gates
- Layer toggles to show/hide PLB connections, walking connections, and constraint edges independently
- Occupied stands with a pulse animation; available stands in a neutral state

The adjacency constraint data is already being used implicitly today — `detectConflicts` in the frontend flags flights at adjacent stands when a larger aircraft would violate wingtip clearance. The graph visualization would make these relationships visible and inspectable rather than just silently flagged.

---

## Known Tradeoffs & Assumptions

**In-memory state** — the `DataStore` resets on server restart. All reassignments made through the UI are lost when uvicorn restarts. This is appropriate for a demo; a production system would use PostgreSQL with proper persistence.

**Mock dates** — flights are dated `2025-01-15`. Time-range filters work correctly relative to that date but return empty results for real-time queries against today's date. Documented as a data limitation.

**Single-file intent router** — `resolveIntent` lives inside `useChat.ts` for simplicity. In a production codebase this would be extracted to a dedicated `services/intentRouter.ts` with its own unit tests.

---

## Quick Reference

```bash
# Check API is alive
curl http://localhost:8000/health

# List all delayed flights
curl "http://localhost:8000/flights?status=delayed"

# Get stand schedule
curl "http://localhost:8000/stands/A1-01/schedule"

# Reassign a flight — valid (JL043 to empty stand A1-04)
curl -X POST http://localhost:8000/flights/FL009/reassign \
  -H "Content-Type: application/json" \
  -d '{"target_stand_id": "A1-04"}'

# Trigger a 422 — aircraft too large (A380 size F into max-D stand)
curl -X POST http://localhost:8000/flights/FL001/reassign \
  -H "Content-Type: application/json" \
  -d '{"target_stand_id": "A1-04"}'

# Trigger a 409 — time conflict
curl -X POST http://localhost:8000/flights/FL004/reassign \
  -H "Content-Type: application/json" \
  -d '{"target_stand_id": "A1-03"}'
```

