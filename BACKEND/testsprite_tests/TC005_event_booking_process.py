import requests
from requests.auth import HTTPBasicAuth

BASE_URL = "http://localhost:5500"
AUTH = HTTPBasicAuth("Jimmy Tole", "Jimmytole@2030")
HEADERS = {"Content-Type": "application/json"}
TIMEOUT = 30

def test_event_booking_process():
    # Step 1: Get all events to find one with available tickets
    events_resp = requests.get(f"{BASE_URL}/events/viewAllEvents", auth=AUTH, headers=HEADERS, timeout=TIMEOUT)
    assert events_resp.status_code == 200, f"Failed to get events: {events_resp.text}"
    events = events_resp.json()
    assert isinstance(events, list), f"Events response is not a list: {events}"

    # Find an event with available tickets (assuming event object has "tickets_available" or similar)
    event_to_book = None
    for event in events:
        if isinstance(event, dict) and event.get("tickets_available", 0) > 0:
            event_to_book = event
            break

    # If no event has tickets or no events available, create a new event first
    event_id = None
    created_event_id = None
    if event_to_book is None:
        # Create a new event (dummy minimal required fields)
        event_payload = {
            "title": "Test Event for Booking",
            "description": "Event created for booking test",
            "date": "2030-12-31T20:00:00Z",
            "location": "Test Venue",
            "tickets_available": 10,
            "price": 50.0
        }
        create_event_resp = requests.post(f"{BASE_URL}/events/createEvent", auth=AUTH, headers=HEADERS, json=event_payload, timeout=TIMEOUT)
        assert create_event_resp.status_code == 201, f"Failed to create event: {create_event_resp.text}"
        created_event = create_event_resp.json()
        assert "id" in created_event, f"No event ID returned on create: {created_event}"
        created_event_id = created_event["id"]
        event_id = created_event_id
    else:
        event_id = event_to_book["id"]

    # Step 2: Create booking for the selected event
    booking_payload = {
        "event_id": event_id,
        "user_id": None  # user_id is usually obtained from user profile or JWT; assume backend infers from auth or use dummy
    }
    # Since auth is basic token, backend may identify user from that; omit user_id if not required or set to None/null
    # Remove user_id if None to avoid sending null
    if booking_payload["user_id"] is None:
        booking_payload.pop("user_id")

    try:
        create_booking_resp = requests.post(f"{BASE_URL}/bookings/createBooking", auth=AUTH, headers=HEADERS, json=booking_payload, timeout=TIMEOUT)
        assert create_booking_resp.status_code == 201, f"Booking creation failed: {create_booking_resp.text}"
        booking = create_booking_resp.json()
        # Validate booking response fields
        assert "id" in booking, "Booking id missing in response"
        assert "user_id" in booking, "Booking user_id missing in response"
        assert "event_id" in booking, "Booking event_id missing in response"
        assert booking["event_id"] == event_id, "Booked event_id mismatch"
        # Optionally check booking confirmation details
        assert isinstance(booking.get("confirmation"), str) or booking.get("confirmation") is None, "Invalid confirmation field"
    finally:
        # Cleanup: Delete created booking if booking creation succeeded
        if 'booking' in locals() and booking.get("id"):
            booking_id = booking["id"]
            resp = requests.delete(f"{BASE_URL}/bookings/{booking_id}", auth=AUTH, headers=HEADERS, timeout=TIMEOUT)
            # Not assert here, just attempt cleanup

        # Cleanup: Delete created event if event was created in this test
        if created_event_id:
            resp = requests.delete(f"{BASE_URL}/events/{created_event_id}", auth=AUTH, headers=HEADERS, timeout=TIMEOUT)
            # Not assert here, just attempt cleanup

test_event_booking_process()