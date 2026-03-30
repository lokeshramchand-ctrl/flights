"""
Shared constants used across the application.
"""

# ICAO aircraft size codes in ascending order of size.
# Used to validate stand compatibility.
AIRCRAFT_SIZE_ORDER: list[str] = ["A", "B", "C", "D", "E", "F"]

VALID_STATUSES = {"on_time", "delayed", "early"}
VALID_OPERATIONS = {"arrival", "departure"}
VALID_STAND_TYPES = {"contact", "remote"}
VALID_SORT_FIELDS = {"scheduled_time", "flight_number", "airline"}
VALID_SORT_ORDERS = {"asc", "desc"}
