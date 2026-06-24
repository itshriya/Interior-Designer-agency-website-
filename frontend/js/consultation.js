console.log("CONSULTATION JS LOADED");

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("consultationForm");

    if (!form) {
        console.error("Consultation form not found");
        return;
    }

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        const submitBtn =
            document.getElementById("submitBtn");

        const status =
            document.getElementById("formStatus");

        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const phone =
            document.getElementById("phone").value.trim();

        const project_type =
            document.getElementById("projectType").value;

        const budget =
            document.getElementById("budget").value;

        const preferred_date =
            document.getElementById("consultationDate").value;

        const message =
            document.getElementById("details").value.trim();

        submitBtn.disabled = true;
        submitBtn.innerText = "Booking...";

        try {

            const response = await fetch(
                `${API_URL}/consultation`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        phone,
                        project_type,
                        budget,
                        preferred_date,
                        message
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {

                status.textContent =
                    "Consultation booked successfully.";

                status.className =
                    "text-green-400 text-center text-sm mt-4";

                form.reset();

            } else {

                status.textContent =
                    data.detail || "Booking failed.";

                status.className =
                    "text-red-400 text-center text-sm mt-4";
            }

        } catch (error) {

            console.error(error);

            status.textContent =
                "Server unavailable.";

            status.className =
                "text-red-400 text-center text-sm mt-4";
        }

        submitBtn.disabled = false;
        submitBtn.innerText = "Book Consultation";

    });

});