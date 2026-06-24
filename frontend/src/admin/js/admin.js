const API_URL = "http://127.0.0.1:8000";

async function loadDashboard() {

    try {

        const projects =
            await fetch(`${API_URL}/projects`)
            .then(res => res.json());

        const contacts =
            await fetch(`${API_URL}/contacts`)
            .then(res => res.json());

        const consultations =
            await fetch(`${API_URL}/consultations`)
            .then(res => res.json());

        document.getElementById(
            "projectCount"
        ).innerText = projects.length;

        document.getElementById(
            "consultationCount"
        ).innerText = consultations.length;

        document.getElementById(
            "contactCount"
        ).innerText = contacts.length;

    }
    catch(error){

        console.error(
            "Dashboard Error",
            error
        );

    }

}

loadDashboard();