import requests

BASE_URL = "http://localhost:5500"
LOGIN_ENDPOINT = "/users/login"
TIMEOUT = 30

def test_user_login_authentication():
    url = BASE_URL + LOGIN_ENDPOINT
    headers = {
        "Content-Type": "application/json"
    }
    payload = {
        "email": "jimmy.tole@example.com",
        "password": "Jimmytole@2030"
    }

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=TIMEOUT)
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

    assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"
    try:
        data = response.json()
    except ValueError:
        assert False, "Response is not valid JSON"

    # Validate presence of JWT token (assuming token is returned in a field named 'token')
    assert "token" in data, "Response JSON does not contain 'token'"
    token = data.get("token")
    assert isinstance(token, str) and len(token) > 0, "Token is empty or not a string"


test_user_login_authentication()
