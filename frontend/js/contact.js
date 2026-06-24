

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("contactForm");

    if (!form) {
        console.error("Contact form not found");
        return;
    }

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        console.log("FORM SUBMITTED");

        const submitBtn =
            document.getElementById("submitBtn");

        const status =
            document.getElementById("formStatus");

        const firstName =
            document.getElementById("firstName").value.trim();

        const lastName =
            document.getElementById("lastName").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const message =
            document.getElementById("message").value.trim();

        submitBtn.disabled = true;
        submitBtn.innerText = "Sending...";

        try {

            const response = await fetch(
                `${API_URL}/contact`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: `${firstName} ${lastName}`,
                        email: email,
                        message: message
                    })
                }
            );

            const data = await response.json();

            console.log(data);

            if (response.ok) {

                status.textContent =
                    "Message sent successfully!";

                status.className =
                    "text-green-400 text-center text-sm mt-4";

                form.reset();

            } else {

                status.textContent =
                    data.detail || "Failed to send message.";

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
        submitBtn.innerText = "Send Message";

    });

});