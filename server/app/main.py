"""
Application factory — creates and configures the FastAPI app.
"""

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes.flights import router as flights_router
from app.api.routes.stands import router as stands_router


def create_app() -> FastAPI:
    app = FastAPI(
        title="Flight Schedule API",
        description=(
            "REST API for querying and manipulating airport flight schedule data. "
            "Supports filtering, pagination, and stand reassignment with conflict detection."
        ),
        version="1.0.0",
    )
    app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
    # ------------------------------------------------------------------
    # Global exception handlers
    # ------------------------------------------------------------------

    # Catch HTTPExceptions raised by our routes and normalise them to a
    # consistent { "error": { "code": ..., "message": ... } } envelope.
    # FastAPI's own validation errors (422) keep their default shape so
    # that Pydantic field errors remain readable.
    @app.exception_handler(HTTPException)
    async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
        # Our route handlers raise HTTPException with a dict `detail`
        # containing {"code": ..., "message": ...}.
        if isinstance(exc.detail, dict):
            return JSONResponse(
                status_code=exc.status_code,
                content={"error": exc.detail},
            )
        # Fallback for any plain-string HTTPException (e.g. FastAPI internals)
        return JSONResponse(
            status_code=exc.status_code,
            content={"error": {"code": "HTTP_ERROR", "message": str(exc.detail)}},
        )

    # ------------------------------------------------------------------
    # Routers
    # ------------------------------------------------------------------

    app.include_router(flights_router)
    app.include_router(stands_router)

    @app.get("/health", tags=["Health"])
    async def health() -> dict:
        return {"status": "ok"}

    return app


app = create_app()
