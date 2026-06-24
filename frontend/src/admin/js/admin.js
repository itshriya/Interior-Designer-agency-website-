const API_URL =
"http://127.0.0.1:8000";

const token =
localStorage.getItem(
    "token"
);

const role =
localStorage.getItem(
    "role"
);

if(
    !token ||
    role !== "admin"
){

    window.location.href =
    "../auth/login.html";

}

async function loadDashboard(){

    const projectCount =
    document.getElementById(
        "projectCount"
    );

    const consultationCount =
    document.getElementById(
        "consultationCount"
    );

    const contactCount =
    document.getElementById(
        "contactCount"
    );

    if(
        !projectCount &&
        !consultationCount &&
        !contactCount
    ){
        return;
    }

    try{

        const projects =
        await fetch(
            `${API_URL}/projects`
        ).then(
            res => res.json()
        );

        const contacts =
        await fetch(
            `${API_URL}/contacts`
        ).then(
            res => res.json()
        );

        const consultations =
        await fetch(
            `${API_URL}/consultations`
        ).then(
            res => res.json()
        );

        if(projectCount){

            projectCount.innerText =
            projects.length;

        }

        if(consultationCount){

            consultationCount.innerText =
            consultations.length;

        }

        if(contactCount){

            contactCount.innerText =
            contacts.length;

        }

    }

    catch(error){

        console.error(
            "Dashboard Error",
            error
        );

    }

}

const logoutBtn =
document.getElementById(
    "logoutBtn"
);

if(logoutBtn){

    logoutBtn.addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "role"
            );

            window.location.href =
            "../auth/login.html";

        }
    );

}

loadDashboard();