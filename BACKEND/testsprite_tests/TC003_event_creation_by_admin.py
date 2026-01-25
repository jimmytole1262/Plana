import requests
from requests.auth import HTTPBasicAuth

BASE_URL = "http://localhost:5500"
AUTH = HTTPBasicAuth("Jimmy Tole", "Jimmytole@2030")
TIMEOUT = 30

def test_event_creation_by_admin():
    headers = {
        "Content-Type": "application/json"
    }
    event_payload = {
        "title": "Annual Tech Conference 2026",
        "description": "A conference covering the latest in technology trends and innovations.",
        "location": "Convention Center, Cityville",
        "start_date": "2026-10-10T09:00:00Z",
        "end_date": "2026-10-12T17:00:00Z",
        "capacity": 300,
        "price": 199.99,
        "categories": ["Technology", "Conference"],
        "organizer": "Plana Events Admin",
        "is_approved": True
    }
    created_event_id = None
    try:
        # Create new event as admin
        response = requests.post(
            f"{BASE_URL}/events/createEvent",
            auth=AUTH,
            headers=headers,
            json=event_payload,
            timeout=TIMEOUT
        )
        assert response.status_code == 201 or response.status_code == 200, f"Unexpected status code: {response.status_code}"
        resp_json = response.json()
        # Validate that 'id' and event details exist in response per schema updates
        assert "id" in resp_json, "Response missing event 'id'"
        assert "title" in resp_json and resp_json["title"] == event_payload["title"], "Event title mismatch"
        assert "description" in resp_json and resp_json["description"] == event_payload["description"], "Event description mismatch"
        created_event_id = resp_json["id"]
        # Validate other relevant fields returned
        assert resp_json.get("location") == event_payload["location"], "Event location mismatch"
        assert resp_json.get("capacity") == event_payload["capacity"], "Event capacity mismatch"
        assert resp_json.get("price") == event_payload["price"], "Event price mismatch"
        assert isinstance(resp_json.get("categories"), list), "Categories should be a list"
        assert resp_json.get("is_approved") is True, "Event should be approved"
    finally:
        # Cleanup: delete the created event
        if created_event_id:
            try:
                delete_response = requests.delete(
                    f"{BASE_URL}/events/{created_event_id}",
                    auth=AUTH,
                    timeout=TIMEOUT
                )
                assert delete_response.status_code == 200 or delete_response.status_code == 204, f"Failed to delete event with id {created_event_id}"
            except Exception:
                pass

test_event_creation_by_admin()