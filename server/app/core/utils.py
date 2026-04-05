from datetime import datetime

def parse_iso(dt: str) -> datetime:
    """Parse an ISO-8601 datetime string, handling trailing 'Z'."""
    return datetime.fromisoformat(dt.replace("Z", "+00:00"))