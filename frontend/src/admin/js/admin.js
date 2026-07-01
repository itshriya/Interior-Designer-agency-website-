// ========================
//  ADMIN DASHBOARD LOGIC
// ========================

const API_URL = "http://127.0.0.1:8000";
const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

// ---------- Auth guard ----------
if (!token || role !== "admin") {
    window.location.href = "../auth/login.html";
}

// ---------- Logout ----------
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "../auth/login.html";
    });
}

// ---------- Helper: fetch with auth ----------
async function fetchJSON(endpoint) {
    const res = await fetch(`${API_URL}${endpoint}`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
    return res.json();
}

// ---------- Load stats (individually, so one failure doesn't break others) ----------
async function loadStats() {
    // Users
    try {
        const users = await fetchJSON("/users");
        document.getElementById("userCount").innerText = users.length;
    } catch {
        document.getElementById("userCount").innerText = "—";
        console.warn("Users endpoint not available");
    }

    // Projects
    try {
        const projects = await fetchJSON("/designs");
        document.getElementById("projectCount").innerText = projects.length;
    } catch {
        document.getElementById("projectCount").innerText = "—";
        console.warn("Designs endpoint not available");
    }

    // Contacts
    try {
        const contacts = await fetchJSON("/contacts");
        document.getElementById("contactCount").innerText = contacts.length;
    } catch {
        document.getElementById("contactCount").innerText = "—";
        console.warn("Contacts endpoint not available");
    }

    // Consultation count will be updated by the consultation table loader
}

// ---------- Load & render consultations (ALWAYS runs) ----------
async function loadConsultations() {
    const tbody = document.getElementById("consultationTableBody");
    tbody.innerHTML = `<tr><td colspan="7" class="px-6 py-4 text-center text-gray-500">Loading...</td></tr>`;

    try {
        const consultations = await fetchJSON("/consultations");
        document.getElementById("consultationCount").innerText = consultations.length;
        renderConsultationTable(consultations);
    } catch (error) {
        console.error("Failed to load consultations:", error);
        tbody.innerHTML = `<tr><td colspan="7" class="px-6 py-4 text-center text-red-500">Failed to load consultations</td></tr>`;
    }
}

// ---------- Render the consultation table ----------
function renderConsultationTable(consultations) {
    const tbody = document.getElementById("consultationTableBody");
    tbody.innerHTML = "";

    if (consultations.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="px-6 py-4 text-center text-gray-500">No consultation requests yet</td></tr>`;
        return;
    }

    consultations.forEach(cons => {
        const id = cons._id;
        const status = cons.status || "pending";
        const statusClass = {
            "pending":   "bg-yellow-100 text-yellow-800",
            "confirmed": "bg-blue-100 text-blue-800",
            "completed": "bg-green-100 text-green-800",
            "cancelled": "bg-red-100 text-red-800"
        }[status] || "bg-gray-100 text-gray-800";

        const row = document.createElement("tr");
        row.className = "hover:bg-gray-50 border-b border-gray-50";
        row.innerHTML = `
            <td class="px-6 py-4 text-sm">${cons.name || "N/A"}</td>
            <td class="px-6 py-4 text-sm">${cons.email || "N/A"}</td>
            <td class="px-6 py-4 text-sm">${cons.project_type || "N/A"}</td>
            <td class="px-6 py-4 text-sm">${cons.preferred_date || "N/A"}</td>
            <td class="px-6 py-4 text-sm">${cons.budget || "N/A"}</td>
            <td class="px-6 py-4">
                <select class="status-dropdown text-xs rounded border px-2 py-1 ${statusClass}" data-id="${id}">
                    <option value="pending" ${status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="confirmed" ${status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                    <option value="completed" ${status === 'completed' ? 'selected' : ''}>Completed</option>
                    <option value="cancelled" ${status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
            </td>
            <td class="px-6 py-4">
                <button class="delete-consultation text-xs text-red-600 hover:text-red-800" data-id="${id}">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    // Attach event listeners AFTER the table is in the DOM
    document.querySelectorAll('.status-dropdown').forEach(select => {
        select.addEventListener('change', async (e) => {
            const consultationId = e.target.dataset.id;
            const newStatus = e.target.value;
            try {
                await fetch(`${API_URL}/consultation/${consultationId}/status?status=${newStatus}`, {
                    method: 'PUT',
                    headers: { "Authorization": `Bearer ${token}` }
                });
                loadConsultations(); // refresh table
            } catch (err) {
                alert("Failed to update status");
            }
        });
    });

    document.querySelectorAll('.delete-consultation').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            if (!confirm("Delete this consultation?")) return;
            const consultationId = e.target.dataset.id;
            try {
                await fetch(`${API_URL}/consultation/${consultationId}`, {
                    method: 'DELETE',
                    headers: { "Authorization": `Bearer ${token}` }
                });
                loadConsultations(); // refresh
            } catch (err) {
                alert("Failed to delete consultation");
            }
        });
    });
}

// ---------- Load recent orders ----------
async function loadRecentOrders() {
    const tableBody = document.getElementById("recentOrdersTable");
    tableBody.innerHTML = "";

    try {
        const orders = await fetchJSON("/orders");
        const recentOrders = orders.slice(-5).reverse();

        if (recentOrders.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="4" class="px-6 py-4 text-center text-gray-500">No orders found</td></tr>`;
            return;
        }

        recentOrders.forEach(order => {
            const orderId = order._id ? order._id.slice(-6).toUpperCase() : order.id;
            const userEmail = order.user_email || order.email || "N/A";
            const designName = order.design_name || order.name || "N/A";
            const status = order.status || "pending";
            const statusBadge = {
                "pending":   "bg-yellow-100 text-yellow-800",
                "completed": "bg-green-100 text-green-800",
                "cancelled": "bg-red-100 text-red-800",
                "shipped":   "bg-blue-100 text-blue-800"
            }[status] || "bg-gray-100 text-gray-800";

            const row = document.createElement("tr");
            row.className = "hover:bg-gray-50 border-b border-gray-50";
            row.innerHTML = `
                <td class="px-6 py-4 text-sm">#ORD-${orderId}</td>
                <td class="px-6 py-4 text-sm">${userEmail}</td>
                <td class="px-6 py-4 text-sm">${designName}</td>
                <td class="px-6 py-4"><span class="px-2 py-1 text-xs rounded ${statusBadge}">${status}</span></td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.warn("Orders endpoint not available", error);
        tableBody.innerHTML = `<tr><td colspan="4" class="px-6 py-4 text-center text-gray-500">Orders data not available</td></tr>`;
    }
}

// ---------- Initialise everything ----------
loadStats();
loadConsultations();
loadRecentOrders();