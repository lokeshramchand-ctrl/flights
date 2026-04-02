# Full Stack Intern — Take-Home Exercise

**Time Limit:** 72 hours from receipt
**Submission:** GitHub repository link with a README explaining your approach, design decisions, and setup instructions.

---

## Overview

You'll build three components (+ one optional bonus) that reflect the type of work you'd do at Aleph. We're building an AI-powered platform that optimizes how airports assign aircraft to stands and gates — replacing legacy spreadsheets and batch systems with intelligent, real-time interfaces.

Each task tests different skills. **Tasks are independent — you don't need to connect them into a single app** (though you'll get bonus points if you do).

Use the provided mock data at the bottom of this document.

---

## Task 1: Flight Schedule API (Backend)

**Tech:** Python (FastAPI preferred, Flask acceptable) · ~3-4 hours

Build a small REST API that serves and manipulates flight schedule data.

### Endpoints

**GET `/flights`**
- Returns the list of flights from the mock data
- Support query parameters:
  - `terminal` — filter by terminal (e.g., `?terminal=T1`)
  - `status` — filter by status (`on_time`, `delayed`, `early`)
  - `from` / `to` — filter by scheduled time range (ISO format)
  - `sort` — sort by field (`scheduled_time`, `flight_number`, `airline`) with `order=asc|desc`
- Paginate results: `page` and `per_page` (default 10)
- Response should include pagination metadata (`total`, `page`, `per_page`, `total_pages`)

**GET `/flights/{flight_id}`**
- Returns a single flight with full details
- Return 404 with a meaningful error body if not found

**GET `/stands`**
- Returns all stands with their current occupancy status
- Support `terminal` filter and `type` filter (`contact`, `remote`)

**GET `/stands/{stand_id}/schedule`**
- Returns the sequence of flights assigned to a specific stand for the day
- Ordered chronologically

**POST `/flights/{flight_id}/reassign`**
- Request body: `{ "target_stand_id": "A1-04" }`
- Validates:
  - Flight exists
  - Target stand exists
  - Target stand is not occupied during the flight's time window (check for overlap with other assignments)
  - Aircraft type is compatible with stand size (use `max_aircraft_size` from stand data)
- Returns the updated flight on success, or a descriptive error on failure

### What We're Looking For

- Clean API design (consistent response shapes, proper HTTP status codes, meaningful errors)
- Input validation and edge case handling
- Code organization (routes, models/schemas, data layer separated)
- A working test suite — at least 5-6 tests covering happy paths and key error cases
- Brief API documentation (can be in the README or a simple route table — no need for Swagger unless you want to)

---

## Task 2: Stand Assignment Timeline (Frontend)

**Tech:** React, Tailwind CSS (required). Any additional libraries of your choice. · ~3-4 hours

Build a timeline/Gantt-style visualization showing aircraft assignments to airport stands over a day.

### Requirements

- Display stands (rows) on the Y-axis and time (hours) on the X-axis
- Show each flight as a block on its assigned stand, spanning arrival → departure time
- Flight blocks should display: flight number and airline code
- Implement hover/click interaction to show flight details (full info from data)
- Timeline should be horizontally scrollable for the full 24-hour period
- Visually distinguish between different terminals (T1, T2, T3) using color or grouping
- Show a "current time" indicator line

### Minimal Wireframe

```
          06:00  08:00  10:00  12:00  14:00  16:00  18:00  20:00
          |------|------|------|------|------|------|------|------|
  T1-A1   |  ████ EK203 ████  |      ██ QR501 ██      |          |
  T1-A2   |     ██ BA107 ██   |        ████ LH752 ████       |   |
  T1-A3   |          |  █ SQ321 █  |        ████ EK512 ████      |
  T2-B1   |   █ QF001 █   |      ██ CX888 ██    |    █ JL043 █  |
  ...                    ▼ NOW
```

### Bonus (optional)

- Drag-and-drop to reassign a flight to a different stand (visual only is fine)
- Conflict detection — highlight overlapping assignments in red
- Zoom controls for the time axis

### Evaluation Focus

- Handling time-based data and pixel positioning
- Clean, reusable component structure
- Interaction design (hover states, detail panels, scrolling)
- Visual polish and spacing

---

## Task 3: Operations Chat Interface (Frontend)

**Tech:** React, Tailwind CSS (required). · ~3-4 hours

Build a chat interface for an AI operations assistant that airport planners would use.

### Requirements

- Standard chat layout: message history area + input area at bottom
- Support three message types with distinct visual treatment:
  - **User messages** — right-aligned
  - **Assistant messages** — left-aligned, with an avatar/icon
  - **Tool/system messages** — compact, centered or left-aligned with a distinct style (e.g., monospace, muted background). These represent backend actions the AI took (API calls, data lookups).
- Implement a **typing indicator** when the assistant is "responding"
- Assistant messages should **stream in** character-by-character (simulate with a timer, ~20ms per character)
- Pre-populate the chat with the conversation history from the mock data
- Input should support:
  - Enter to send, Shift+Enter for newline
  - Disabled state while assistant is responding
  - Character count or subtle visual feedback

### Suggested Prompts

Display a row of clickable suggested prompts above the input (see mock data for examples). Clicking one should populate the input and auto-send.

### Bonus (optional)

- Render structured data in assistant messages (e.g., a small inline table or card when the assistant references flight data)
- Animate message entry (fade in, slide up)
- Dark mode toggle

### Evaluation Focus

- Handling async UI patterns (streaming, loading states, optimistic updates)
- Three-way message type rendering (user / assistant / tool)
- Input interaction polish
- Layout and typography

---

## Task 4: Airport Resource Graph (Bonus)

**Tech:** React + any visualization library (D3, vis.js, react-flow, or custom SVG/Canvas). · ~3-4 hours

Build an interactive visualization of an airport's resource network — stands, gates, and their connections.

### Context

Our platform models airports as multi-layer graphs. Stands connect to gates, some stands share gates, and physical adjacency creates constraints (wingtip clearance). Visualizing these relationships helps operators understand resource dependencies.

### Requirements

- Render the graph as a **node-link diagram** (force-directed, hierarchical, or custom layout)
- **Node types** should be visually distinct:
  - Stands → squares or rounded rectangles
  - Gates → circles
  - Use color to indicate terminal (T1 vs T2)
- **Edge types** should be visually distinct:
  - PLB connections (solid lines)
  - Walking/bus connections (dashed lines)
  - Constraint edges between adjacent stands (red, dotted)
- **Interactions:**
  - Hover on a node → highlight it and all connected edges/nodes
  - Click on a node → show a detail panel with node properties
  - Show current occupancy on stand nodes (occupied vs available)

### Bonus (optional)

- Layer toggles: show/hide stands, gates, or constraint edges independently
- Zoom and pan
- Animate occupied stands (pulse or glow)
- Click a flight in the detail panel → highlight its assigned stand and all eligible stands

### Evaluation Focus

- Working with graph/network data structures
- Creative layout and clear visual hierarchy
- Interaction design for complex relational data

---

## Mock Data

Use the following JSON data across your tasks. You may extend it (add fields, more entries) but don't reduce it.

### Flights

```json
[
  {
    "id": "FL001",
    "flight_number": "EK203",
    "airline": "Emirates",
    "aircraft_type": "A380",
    "aircraft_size": "F",
    "origin": "LHR",
    "destination": "DXB",
    "terminal": "T1",
    "assigned_stand": "A1-01",
    "operation": "arrival",
    "scheduled_time": "2025-01-15T06:30:00Z",
    "estimated_time": "2025-01-15T06:25:00Z",
    "block_time_start": "2025-01-15T06:30:00Z",
    "block_time_end": "2025-01-15T08:45:00Z",
    "status": "on_time",
    "pax_count": 489
  },
  {
    "id": "FL002",
    "flight_number": "QR501",
    "airline": "Qatar Airways",
    "aircraft_type": "B777-300ER",
    "aircraft_size": "E",
    "origin": "DOH",
    "destination": "DXB",
    "terminal": "T1",
    "assigned_stand": "A1-01",
    "operation": "arrival",
    "scheduled_time": "2025-01-15T10:15:00Z",
    "estimated_time": "2025-01-15T10:40:00Z",
    "block_time_start": "2025-01-15T10:15:00Z",
    "block_time_end": "2025-01-15T12:30:00Z",
    "status": "delayed",
    "pax_count": 356
  },
  {
    "id": "FL003",
    "flight_number": "BA107",
    "airline": "British Airways",
    "aircraft_type": "B787-9",
    "aircraft_size": "E",
    "origin": "LHR",
    "destination": "DXB",
    "terminal": "T1",
    "assigned_stand": "A1-02",
    "operation": "arrival",
    "scheduled_time": "2025-01-15T07:00:00Z",
    "estimated_time": "2025-01-15T07:00:00Z",
    "block_time_start": "2025-01-15T07:00:00Z",
    "block_time_end": "2025-01-15T09:15:00Z",
    "status": "on_time",
    "pax_count": 264
  },
  {
    "id": "FL004",
    "flight_number": "LH752",
    "airline": "Lufthansa",
    "aircraft_type": "A340-600",
    "aircraft_size": "E",
    "origin": "FRA",
    "destination": "DXB",
    "terminal": "T1",
    "assigned_stand": "A1-02",
    "operation": "arrival",
    "scheduled_time": "2025-01-15T11:30:00Z",
    "estimated_time": "2025-01-15T11:30:00Z",
    "block_time_start": "2025-01-15T11:30:00Z",
    "block_time_end": "2025-01-15T14:00:00Z",
    "status": "on_time",
    "pax_count": 291
  },
  {
    "id": "FL005",
    "flight_number": "SQ321",
    "airline": "Singapore Airlines",
    "aircraft_type": "A350-900",
    "aircraft_size": "E",
    "origin": "SIN",
    "destination": "DXB",
    "terminal": "T1",
    "assigned_stand": "A1-03",
    "operation": "arrival",
    "scheduled_time": "2025-01-15T08:45:00Z",
    "estimated_time": "2025-01-15T08:50:00Z",
    "block_time_start": "2025-01-15T08:45:00Z",
    "block_time_end": "2025-01-15T11:00:00Z",
    "status": "on_time",
    "pax_count": 303
  },
  {
    "id": "FL006",
    "flight_number": "EK512",
    "airline": "Emirates",
    "aircraft_type": "B777-300ER",
    "aircraft_size": "E",
    "origin": "DXB",
    "destination": "JFK",
    "terminal": "T1",
    "assigned_stand": "A1-03",
    "operation": "departure",
    "scheduled_time": "2025-01-15T13:00:00Z",
    "estimated_time": "2025-01-15T13:00:00Z",
    "block_time_start": "2025-01-15T11:30:00Z",
    "block_time_end": "2025-01-15T13:00:00Z",
    "status": "on_time",
    "pax_count": 396
  },
  {
    "id": "FL007",
    "flight_number": "QF001",
    "airline": "Qantas",
    "aircraft_type": "A380",
    "aircraft_size": "F",
    "origin": "SYD",
    "destination": "DXB",
    "terminal": "T2",
    "assigned_stand": "B1-01",
    "operation": "arrival",
    "scheduled_time": "2025-01-15T05:30:00Z",
    "estimated_time": "2025-01-15T05:20:00Z",
    "block_time_start": "2025-01-15T05:30:00Z",
    "block_time_end": "2025-01-15T08:00:00Z",
    "status": "early",
    "pax_count": 450
  },
  {
    "id": "FL008",
    "flight_number": "CX888",
    "airline": "Cathay Pacific",
    "aircraft_type": "A350-1000",
    "aircraft_size": "E",
    "origin": "HKG",
    "destination": "DXB",
    "terminal": "T2",
    "assigned_stand": "B1-01",
    "operation": "arrival",
    "scheduled_time": "2025-01-15T10:00:00Z",
    "estimated_time": "2025-01-15T09:50:00Z",
    "block_time_start": "2025-01-15T10:00:00Z",
    "block_time_end": "2025-01-15T12:30:00Z",
    "status": "early",
    "pax_count": 334
  },
  {
    "id": "FL009",
    "flight_number": "JL043",
    "airline": "Japan Airlines",
    "aircraft_type": "B787-9",
    "aircraft_size": "E",
    "origin": "NRT",
    "destination": "DXB",
    "terminal": "T2",
    "assigned_stand": "B1-02",
    "operation": "arrival",
    "scheduled_time": "2025-01-15T14:30:00Z",
    "estimated_time": "2025-01-15T14:30:00Z",
    "block_time_start": "2025-01-15T14:30:00Z",
    "block_time_end": "2025-01-15T16:45:00Z",
    "status": "on_time",
    "pax_count": 186
  },
  {
    "id": "FL010",
    "flight_number": "AF218",
    "airline": "Air France",
    "aircraft_type": "A330-200",
    "aircraft_size": "D",
    "origin": "CDG",
    "destination": "DXB",
    "terminal": "T2",
    "assigned_stand": "B1-03",
    "operation": "arrival",
    "scheduled_time": "2025-01-15T16:00:00Z",
    "estimated_time": "2025-01-15T16:15:00Z",
    "block_time_start": "2025-01-15T16:00:00Z",
    "block_time_end": "2025-01-15T18:30:00Z",
    "status": "delayed",
    "pax_count": 224
  }
]
```

### Stands

```json
[
  {
    "id": "A1-01",
    "terminal": "T1",
    "type": "contact",
    "has_plb": true,
    "max_aircraft_size": "F",
    "associated_gate": "G01",
    "position": { "x": 100, "y": 50 }
  },
  {
    "id": "A1-02",
    "terminal": "T1",
    "type": "contact",
    "has_plb": true,
    "max_aircraft_size": "E",
    "associated_gate": "G02",
    "position": { "x": 100, "y": 120 }
  },
  {
    "id": "A1-03",
    "terminal": "T1",
    "type": "contact",
    "has_plb": true,
    "max_aircraft_size": "E",
    "associated_gate": "G03",
    "position": { "x": 100, "y": 190 }
  },
  {
    "id": "A1-04",
    "terminal": "T1",
    "type": "contact",
    "has_plb": true,
    "max_aircraft_size": "D",
    "associated_gate": "G04",
    "position": { "x": 100, "y": 260 }
  },
  {
    "id": "A1-05",
    "terminal": "T1",
    "type": "remote",
    "has_plb": false,
    "max_aircraft_size": "E",
    "associated_gate": null,
    "position": { "x": 100, "y": 330 }
  },
  {
    "id": "B1-01",
    "terminal": "T2",
    "type": "contact",
    "has_plb": true,
    "max_aircraft_size": "F",
    "associated_gate": "G05",
    "position": { "x": 400, "y": 50 }
  },
  {
    "id": "B1-02",
    "terminal": "T2",
    "type": "contact",
    "has_plb": true,
    "max_aircraft_size": "E",
    "associated_gate": "G06",
    "position": { "x": 400, "y": 120 }
  },
  {
    "id": "B1-03",
    "terminal": "T2",
    "type": "contact",
    "has_plb": false,
    "max_aircraft_size": "D",
    "associated_gate": "G07",
    "position": { "x": 400, "y": 190 }
  },
  {
    "id": "B1-04",
    "terminal": "T2",
    "type": "remote",
    "has_plb": false,
    "max_aircraft_size": "F",
    "associated_gate": null,
    "position": { "x": 400, "y": 260 }
  },
  {
    "id": "B1-05",
    "terminal": "T2",
    "type": "remote",
    "has_plb": false,
    "max_aircraft_size": "D",
    "associated_gate": null,
    "position": { "x": 400, "y": 330 }
  }
]
```

### Gates

```json
[
  { "id": "G01", "terminal": "T1", "type": "contact", "is_plb": true, "connected_stands": ["A1-01"], "position": { "x": 250, "y": 50 } },
  { "id": "G02", "terminal": "T1", "type": "contact", "is_plb": true, "connected_stands": ["A1-02"], "position": { "x": 250, "y": 120 } },
  { "id": "G03", "terminal": "T1", "type": "contact", "is_plb": true, "connected_stands": ["A1-03", "A1-04"], "position": { "x": 250, "y": 225 } },
  { "id": "G04", "terminal": "T1", "type": "contact", "is_plb": true, "connected_stands": ["A1-04"], "position": { "x": 250, "y": 260 } },
  { "id": "G05", "terminal": "T2", "type": "contact", "is_plb": true, "connected_stands": ["B1-01"], "position": { "x": 550, "y": 50 } },
  { "id": "G06", "terminal": "T2", "type": "contact", "is_plb": true, "connected_stands": ["B1-02"], "position": { "x": 550, "y": 120 } },
  { "id": "G07", "terminal": "T2", "type": "non_contact", "is_plb": false, "connected_stands": ["B1-03", "B1-04", "B1-05"], "position": { "x": 550, "y": 260 } }
]
```

### Graph Edges (for Task 4)

```json
{
  "plb_connections": [
    { "stand": "A1-01", "gate": "G01", "type": "plb" },
    { "stand": "A1-02", "gate": "G02", "type": "plb" },
    { "stand": "A1-03", "gate": "G03", "type": "plb" },
    { "stand": "A1-04", "gate": "G04", "type": "plb" },
    { "stand": "B1-01", "gate": "G05", "type": "plb" },
    { "stand": "B1-02", "gate": "G06", "type": "plb" }
  ],
  "walking_connections": [
    { "stand": "A1-04", "gate": "G03", "type": "walking", "distance_meters": 85 },
    { "stand": "B1-03", "gate": "G07", "type": "walking", "distance_meters": 120 },
    { "stand": "B1-04", "gate": "G07", "type": "bus", "distance_meters": 450 },
    { "stand": "B1-05", "gate": "G07", "type": "bus", "distance_meters": 520 }
  ],
  "adjacency_constraints": [
    { "stand_a": "A1-01", "stand_b": "A1-02", "type": "wingtip", "min_clearance_meters": 7.5 },
    { "stand_a": "A1-03", "stand_b": "A1-04", "type": "wingtip", "min_clearance_meters": 7.5 },
    { "stand_a": "B1-01", "stand_b": "B1-02", "type": "adjacency", "min_clearance_meters": 5.0 }
  ]
}
```

### Dashboard Metrics (for Task 2)

```json
{
  "on_time_performance": {
    "current": 78,
    "previous": 82,
    "unit": "%"
  },
  "stand_utilization": {
    "occupied": 7,
    "total": 10,
    "unit": "stands"
  },
  "upcoming_arrivals_2h": {
    "total": 4,
    "on_time": 3,
    "delayed": 1
  },
  "plb_usage": {
    "current": 71,
    "target": 85,
    "unit": "%"
  }
}
```

### Chat History (for Task 3)

```json
{
  "messages": [
    {
      "id": "msg-1",
      "role": "user",
      "content": "What's the current stand utilization for Terminal 1?",
      "timestamp": "2025-01-15T08:05:00Z"
    },
    {
      "id": "msg-2",
      "role": "tool",
      "tool_name": "fetch_stand_status",
      "status": "complete",
      "duration": "0.3s",
      "content": "T1: 4/5 stands occupied (80%). A1-05 available (remote).",
      "timestamp": "2025-01-15T08:05:01Z"
    },
    {
      "id": "msg-3",
      "role": "assistant",
      "content": "Terminal 1 currently has 4 out of 5 stands occupied — that's 80% utilization. The only available stand is A1-05, which is a remote stand (no PLB). All contact stands with passenger loading bridges are currently in use.\n\nThe next stand to free up will be A1-01 at approximately 08:45 when EK203 completes turnaround.",
      "timestamp": "2025-01-15T08:05:02Z"
    },
    {
      "id": "msg-4",
      "role": "user",
      "content": "QR501 is showing delayed. Can it still go to A1-01?",
      "timestamp": "2025-01-15T08:20:00Z"
    },
    {
      "id": "msg-5",
      "role": "tool",
      "tool_name": "check_assignment_feasibility",
      "status": "complete",
      "duration": "0.6s",
      "content": "QR501 ETA revised to 10:40. A1-01 clear from 08:45. B777-300ER compatible with A1-01 (max size F). No conflict detected.",
      "timestamp": "2025-01-15T08:20:01Z"
    },
    {
      "id": "msg-6",
      "role": "assistant",
      "content": "Yes, QR501 can still use A1-01. Even with the 25-minute delay (revised ETA 10:40), there's a comfortable 2-hour buffer after EK203 clears the stand at 08:45.\n\nA1-01 supports up to Code F aircraft, so the B777-300ER has no size issues. No conflicts with adjacent stands either — A1-02 has BA107 departing at 09:15, well before QR501 arrives.\n\nWant me to confirm this assignment or check alternatives?",
      "timestamp": "2025-01-15T08:20:02Z"
    }
  ],

  "suggested_prompts": [
    "Show me all delayed flights",
    "What's the current stand utilization?",
    "Which flights arrive in the next hour?",
    "Reassign EK512 to a PLB stand",
    "Show T1 capacity forecast"
  ]
}
```

---

## Submission Checklist

- [ ] GitHub repository with clear README
- [ ] Setup instructions (`npm install && npm run dev` for frontend, `pip install && uvicorn` or similar for backend)
- [ ] Tasks 1-3 completed; Task 4 is bonus
- [ ] Clean, readable code (meaningful names, reasonable structure)
- [ ] Tests for Task 1 (backend)
- [ ] Brief notes on design decisions or tradeoffs

---

## Evaluation Criteria

| Criteria | Weight | What We Look For |
|----------|--------|------------------|
| **Code Quality** | 25% | Clean structure, separation of concerns, reusable components, readable code |
| **Visual Design** | 25% | Polish, spacing, typography, color choices, consistency across tasks |
| **Problem Solving** | 25% | Edge case handling, smart data manipulation, good UX decisions, validation logic |
| **Technical Execution** | 25% | React patterns, API design, state management, performance awareness |

**Bonus points for:**
- Connecting Task 1 API to Task 2 or 3 (frontend fetching from your own backend)
- Thoughtful README explaining architecture decisions
- Completing Task 4
- Anything that shows you think about the user, not just the code

---

## Questions?

If anything is unclear, make a reasonable assumption and document it in your README. We value judgment and initiative over asking for clarification on every detail.

Good luck!
