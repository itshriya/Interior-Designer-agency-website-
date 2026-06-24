const API_URL =
"http://127.0.0.1:8000";

async function signup(
    name,
    email,
    password
){

    const response =
    await fetch(
        `${API_URL}/signup`,
        {
            method:"POST",
            headers:{
                "Content-Type":
                "application/json"
            },
            body:JSON.stringify({
                name,
                email,
                password
            })
        }
    );

    return await response.json();

}

async function login(
    email,
    password
){

    const response =
    await fetch(
        `${API_URL}/login`,
        {
            method:"POST",
            headers:{
                "Content-Type":
                "application/json"
            },
            body:JSON.stringify({
                email,
                password
            })
        }
    );

    const data =
    await response.json();

    if(response.ok){

        localStorage.setItem(
            "token",
            data.access_token
        );

        localStorage.setItem(
            "role",
            data.role
        );

        return data;

    }

    return null;

}

function logout(){

    localStorage.removeItem(
        "token"
    );

    localStorage.removeItem(
        "role"
    );

    window.location.href =
    "../auth/login.html";

}

function isLoggedIn(){

    return localStorage.getItem(
        "token"
    ) !== null;

}