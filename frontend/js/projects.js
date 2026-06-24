document.addEventListener("DOMContentLoaded", async () => {

    const container =
        document.getElementById("projectsContainer");

    const loading =
        document.getElementById("loading");

    try {

        const response =
            await fetch(`${API_URL}/projects`);

        const projects =
            await response.json();

        loading.style.display = "none";

        if(projects.length === 0){

            container.innerHTML = `
                <div class="col-span-full text-center text-gray-400">
                    No Projects Available
                </div>
            `;

            return;
        }

        projects.forEach(project => {

            const image =
                project.images?.length > 0
                ? project.images[0]
                : "https://placehold.co/800x600";

            container.innerHTML += `

                <div class="project-card">

                    <img
                        src="${image}"
                        alt="${project.title}"
                        class="w-full h-72 object-cover">

                    <div class="p-6">

                        <p class="text-[#c59d5f] text-xs uppercase tracking-[0.2em] mb-2">
                            ${project.category}
                        </p>

                        <h3 class="font-serif text-2xl mb-3">
                            ${project.title}
                        </h3>

                        <p class="text-gray-400 text-sm mb-3">
                            📍 ${project.location}
                        </p>

                        <p class="text-gray-400 line-clamp-3">
                            ${project.description}
                        </p>

                    </div>

                </div>

            `;

        });

    }
    catch(error){

        console.error(error);

        loading.innerHTML =
            "Failed to load projects.";

    }

});

