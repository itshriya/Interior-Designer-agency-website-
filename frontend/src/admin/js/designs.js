const API_URL =
"http://127.0.0.1:8000";

async function loadProjects() {

    try {

        const response =
        await fetch(
            `${API_URL}/projects`
        );

        const projects =
        await response.json();

        const tableBody =
        document.getElementById(
            "designsTableBody"
        );

        tableBody.innerHTML = "";

        projects.forEach(project => {

            const image =
            project.images?.length
            ? project.images[0]
            : "https://via.placeholder.com/150";

            tableBody.innerHTML += `

            <tr class="hover:bg-gray-50 border-b">

                <td class="px-6 py-3">

                    <div class="w-16 h-12 rounded overflow-hidden">

                        <img
                            src="${image}"
                            class="w-full h-full object-cover">

                    </div>

                </td>

                <td class="px-6 py-4">

                    <p class="font-medium">
                        ${project.title}
                    </p>

                    <p class="text-xs text-gray-500 truncate w-48">
                        ${project.description}
                    </p>

                </td>

                <td class="px-6 py-4">
                    ${project.category}
                </td>

                <td class="px-6 py-4">
                    ${project.location}
                </td>

                <td class="px-6 py-4 text-right">

                    <a
                        href="edit-design.html?id=${project._id}"
                        class="text-blue-600 mr-3">
                        Edit
                    </a>

                    <button
                        onclick="deleteProject('${project._id}')"
                        class="text-red-500">
                        Delete
                    </button>

                </td>

            </tr>

            `;

        });

    }

    catch(error){

        console.error(error);

    }

}

async function deleteProject(id){

    const confirmDelete =
    confirm(
        "Delete this project?"
    );

    if(!confirmDelete)
        return;

    try{

        await fetch(
            `${API_URL}/project/${id}`,
            {
                method:"DELETE"
            }
        );

        alert(
            "Project Deleted"
        );

        loadProjects();

    }

    catch(error){

        console.error(error);

    }

}

loadProjects();