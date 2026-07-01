const API_URL = "http://127.0.0.1:8000";

const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

if (!token || role !== "admin") {
    window.location.href = "../auth/login.html";
}

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "../auth/login.html";
    });
}

async function loadProfile() {
    try {
        const response = await fetch(`${API_URL}/settings`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to load profile");
        }

        const data = await response.json();

        document.getElementById("adminName").value = data.name || "";
        document.getElementById("adminEmail").value = data.email || "";

    } catch (error) {
        console.error(error);
        alert("Unable to load profile.");
    }
}

document.getElementById("settingsForm").addEventListener("submit", async (e) => {

    e.preventDefault();

    const name = document.getElementById("adminName").value.trim();
    const email = document.getElementById("adminEmail").value.trim();

    const currentPassword =
        document.getElementById("currentPassword").value.trim();

    const newPassword =
        document.getElementById("newPassword").value.trim();

    const confirmPassword =
        document.getElementById("confirmPassword").value.trim();

    // Validate password fields only if user wants to change password
    if (
        currentPassword ||
        newPassword ||
        confirmPassword
    ) {

        if (
            !currentPassword ||
            !newPassword ||
            !confirmPassword
        ) {
            alert("Please fill all password fields.");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("New passwords do not match.");
            return;
        }

    }

    const payload = {
        name,
        email
    };

    // Add password fields only when provided
    if (currentPassword && newPassword) {
        payload.current_password = currentPassword;
        payload.new_password = newPassword;
    }

    try {

        const response = await fetch(`${API_URL}/settings`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },

            body: JSON.stringify(payload)

        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.detail);
            return;
        }

        alert(data.message);

        document.getElementById("currentPassword").value = "";
        document.getElementById("newPassword").value = "";
        document.getElementById("confirmPassword").value = "";

    } catch (error) {

        console.error(error);
        alert("Something went wrong.");

    }

});

loadProfile();