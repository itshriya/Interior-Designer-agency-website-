const API_URL = "http://127.0.0.1:8000";

// SIGNUP
async function signup(name, email, password) {

    const response = await fetch(
        `${API_URL}/signup`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password
            })
        }
    );

    return await response.json();
}


// LOGIN
async function login(email, password) {

    const response = await fetch(
        `${API_URL}/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        }
    );

    const data = await response.json();

    if (response.ok) {

        localStorage.setItem(
            "token",
            data.access_token
        );

        return true;
    }

    return false;
}


// LOGOUT
function logout() {

    localStorage.removeItem(
        "token"
    );

    window.location.href =
        "../auth/login.html";
}


// CHECK LOGIN
function isLoggedIn() {

    return localStorage.getItem(
        "token"
    ) !== null;
}