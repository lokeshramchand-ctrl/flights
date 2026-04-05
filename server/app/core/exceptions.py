"""
Domain-level exceptions used by the service layer.
The API layer catches these and maps them to HTTP responses.
"""


class NotFoundError(Exception):
    """Raised when a requested resource does not exist."""

    def __init__(self, resource: str, identifier: str) -> None:
        self.resource = resource
        self.identifier = identifier
        super().__init__(f"{resource} '{identifier}' not found.")


class ConflictError(Exception):
    """Raised when a reassignment would create a scheduling conflict."""

    def __init__(self, message: str) -> None:
        super().__init__(message)


class ValidationError(Exception):
    """Raised when input data fails domain-level validation."""

    def __init__(self, message: str) -> None:
        super().__init__(message)


def format_error_response(code: str, message: str) -> dict:
    """Helper to format error responses consistently."""
    return {"error": {"code": code, "message": message}}
