import requests
from requests.auth import HTTPBasicAuth

BASE_URL = "http://localhost:5500"
AUTH_USERNAME = "Jimmy Tole"
AUTH_PASSWORD = "Jimmytole@2030"
TIMEOUT = 30

def test_view_all_events_listing():
    url = f"{BASE_URL}/events/viewAllEvents"
    try:
        response = requests.get(url, auth=HTTPBasicAuth(AUTH_USERNAME, AUTH_PASSWORD), timeout=TIMEOUT)
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

    assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"

    try:
        data = response.json()
    except ValueError:
        assert False, "Response is not valid JSON"

    # The response should be a list (possibly empty) of events
    assert isinstance(data, list), f"Expected response to be a list, got {type(data)}"

    # Each event should be a dict containing at least 'id', 'user_id', and/or 'event_id'
    for event in data:
        assert isinstance(event, dict), f"Expected each event to be a dict, got {type(event)}"
        assert 'id' in event, "'id' field missing from event"
        # Either user_id or event_id or both should be present
        has_user_id = 'user_id' in event
        has_event_id = 'event_id' in event
        assert has_user_id or has_event_id, "Event must contain at least 'user_id' or 'event_id'"

test_view_all_events_listing()