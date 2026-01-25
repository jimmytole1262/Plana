import requests
import hashlib
import time

BASE_URL = "http://localhost:5500"
TIMEOUT = 30

AUTH_HEADER = {
    "Authorization": "Basic Sm1teSBUb2xlOkptaW15dG9sZUAyMDMw"
}

def test_user_registration_functionality():
    url = f"{BASE_URL}/users/register"
    # Construct a unique username and email to avoid conflicts
    timestamp = str(int(time.time()))
    test_user = {
        "username": f"testuser_{timestamp}",
        "email": f"testuser_{timestamp}@example.com",
        "password": "TestPassword@123"
    }
    headers = {
        "Content-Type": "application/json"
    }
    try:
        # Register new user
        response = requests.post(url, json=test_user, headers=headers, timeout=TIMEOUT)
        assert response.status_code == 201 or response.status_code == 200, f"Expected 200/201, got {response.status_code}"
        data = response.json()
        # Validate response contains 'id' and 'user_id'
        assert "id" in data, "Response JSON missing 'id'"
        assert "user_id" in data, "Response JSON missing 'user_id'"
        # Validate user_id matches id
        assert data["id"] == data["user_id"], "'id' and 'user_id' do not match"
        # Password should not be returned in response
        assert "password" not in data, "Password found in response JSON"
        
    finally:
        # Cleanup: Attempt to delete the created user if API supports it
        # Assuming DELETE /users/{id} exists for cleanup
        if 'data' in locals() and "id" in data:
            delete_url = f"{BASE_URL}/users/{data['id']}"
            try:
                requests.delete(delete_url, timeout=TIMEOUT)
            except Exception:
                pass

test_user_registration_functionality()