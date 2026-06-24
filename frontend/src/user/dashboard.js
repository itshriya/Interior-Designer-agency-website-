const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}
/* prevents users from opening the dashboard without logging in.*/