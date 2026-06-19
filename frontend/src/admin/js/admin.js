// js/admin.js

document.addEventListener("DOMContentLoaded", () => {
    // 1. Updated to match the "token" key from login.html
    const token = localStorage.getItem("token"); 
    
    if (!token) {
        // If no token exists, kick them back to login
        window.location.href = "../auth/login.html";
        return;
    }
    
    // Future: Call GET /auth/me here to verify the token is valid and role === 'admin'
});

// Logout handler
document.getElementById('logoutBtn')?.addEventListener('click', () => {
    // 2. Updated to remove the correct "token" key
    localStorage.removeItem("token"); 
    
    // Redirect to login page
    window.location.href = "../auth/login.html";
});