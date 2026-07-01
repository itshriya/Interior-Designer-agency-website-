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

const usersTableBody = document.getElementById("usersTableBody");
const searchInput = document.getElementById("searchUser");
const roleFilter = document.getElementById("roleFilter");

const modal = document.getElementById("userModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelModalBtn = document.getElementById("cancelModalBtn");

const deleteModal = document.getElementById("deleteModal");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
const deleteUserName = document.getElementById("deleteUserName");

let users = [];
let selectedDeleteId = null;

async function loadUsers() {

    try {

        const response = await fetch(
            `${API_URL}/users`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch users");
        }

        users = await response.json();

        renderUsers(users);

    }

    catch (error) {

        console.error(error);
        alert("Unable to load users.");

    }

}

function renderUsers(data) {

    usersTableBody.innerHTML = "";

    if (data.length === 0) {

        usersTableBody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center py-6 text-gray-500">
                    No users found.
                </td>
            </tr>
        `;

        return;

    }

    data.forEach(user => {

        const initials = user.name
            ? user.name
                .split(" ")
                .map(word => word[0])
                .join("")
                .substring(0,2)
                .toUpperCase()
            : "U";

        const roleBadge =
            user.role === "admin"
            ? `<span class="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 border border-yellow-300">Admin</span>`
            : `<span class="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700 border">User</span>`;

        const joinedDate = user.created_at
            ? new Date(user.created_at).toLocaleDateString()
            : "-";

        usersTableBody.innerHTML += `

        <tr class="hover:bg-gray-50 border-b">

            <td class="px-6 py-4">

                <div class="flex items-center gap-3">

                    <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold">

                        ${initials}

                    </div>

                    <div>

                        <p class="font-medium">
                            ${user.name || "-"}
                        </p>

                        <p class="text-xs text-gray-500">
                            ${user.email}
                        </p>

                    </div>

                </div>

            </td>

            <td class="px-6 py-4">

                ${roleBadge}

            </td>

            <td class="px-6 py-4">

                ${joinedDate}

            </td>

            <td class="px-6 py-4 text-right">

                <button
                    class="view-btn text-blue-600 hover:text-blue-800 mr-4"
                    data-id="${user.id}">

                    View

                </button>

                ${
                    user.role !== "admin"
                    ?
                    `
                    <button
                        class="delete-btn text-red-600 hover:text-red-800"
                        data-id="${user.id}"
                        data-name="${user.name}">
                        Delete
                    </button>
                    `
                    :
                    ""
                }

            </td>

        </tr>

        `;

    });

    attachViewEvents();
    attachDeleteEvents();

}

function filterUsers() {

    const search = searchInput.value.toLowerCase();
    const selectedRole = roleFilter.value;

    const filtered = users.filter(user => {

        const matchesSearch =
            (user.name || "")
                .toLowerCase()
                .includes(search)

            ||

            user.email
                .toLowerCase()
                .includes(search);

        const matchesRole =
            selectedRole === "all"
            ||
            user.role === selectedRole;

        return matchesSearch && matchesRole;

    });

    renderUsers(filtered);

}

searchInput.addEventListener(
    "input",
    filterUsers
);

roleFilter.addEventListener(
    "change",
    filterUsers
);
function attachViewEvents() {

    document.querySelectorAll(".view-btn").forEach(button => {

        button.addEventListener("click", async () => {

            const id = button.dataset.id;

            try {

                const response = await fetch(
                    `${API_URL}/users/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const user = await response.json();

                if (!response.ok) {

                    alert(user.detail);
                    return;

                }

                document.getElementById("modalUserName").innerText =
                    user.name || "-";

                document.getElementById("modalUserEmail").innerText =
                    user.email || "-";

                document.getElementById("modalUserRole").innerText =
                    user.role || "-";

                document.getElementById("modalUserId").innerText =
                    user.id;

                const initials = user.name
                    ? user.name
                        .split(" ")
                        .map(word => word[0])
                        .join("")
                        .substring(0, 2)
                        .toUpperCase()
                    : "U";

                document.getElementById(
                    "modalUserInitials"
                ).innerText = initials;

                if(document.getElementById("modalJoinedDate")){

                    document.getElementById(
                        "modalJoinedDate"
                    ).innerText =
                    user.created_at
                    ? new Date(user.created_at).toLocaleDateString()
                    : "-";

                }

                modal.classList.remove("hidden");
                modal.classList.add("flex");

            }

            catch(error){

                console.error(error);
                alert("Unable to load user.");

            }

        });

    });

}

function attachDeleteEvents(){

    document.querySelectorAll(".delete-btn").forEach(button=>{

        button.addEventListener("click",()=>{

            selectedDeleteId =
            button.dataset.id;

            deleteUserName.innerText =
            button.dataset.name;

            deleteModal.classList.remove("hidden");
            deleteModal.classList.add("flex");

        });

    });

}

async function deleteUser(){

    try{

        const response =
        await fetch(

            `${API_URL}/users/${selectedDeleteId}`,

            {

                method:"DELETE",

                headers:{
                    Authorization:`Bearer ${token}`
                }

            }

        );

        const data =
        await response.json();

        if(!response.ok){

            alert(data.detail);
            return;

        }

        alert(data.message);

        deleteModal.classList.add("hidden");
        deleteModal.classList.remove("flex");

        selectedDeleteId = null;

        loadUsers();

    }

    catch(error){

        console.error(error);

        alert(
            "Unable to delete user."
        );

    }

}

confirmDeleteBtn.addEventListener(

    "click",

    deleteUser

);

cancelDeleteBtn.addEventListener(

    "click",

    ()=>{

        deleteModal.classList.add(
            "hidden"
        );

        deleteModal.classList.remove(
            "flex"
        );

        selectedDeleteId = null;

    }

);

function closeModal(){

    modal.classList.add(
        "hidden"
    );

    modal.classList.remove(
        "flex"
    );

}

closeModalBtn.addEventListener(

    "click",

    closeModal

);

cancelModalBtn.addEventListener(

    "click",

    closeModal

);

modal.addEventListener(

    "click",

    (e)=>{

        if(e.target===modal){

            closeModal();

        }

    }

);

deleteModal.addEventListener(

    "click",

    (e)=>{

        if(e.target===deleteModal){

            deleteModal.classList.add(
                "hidden"
            );

            deleteModal.classList.remove(
                "flex"
            );

            selectedDeleteId = null;

        }

    }

);

loadUsers();