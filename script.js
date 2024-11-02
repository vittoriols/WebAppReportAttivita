const activityTableBody = document.querySelector("#activityTable tbody");

function addActivity() {
    const date = document.getElementById("date").value;
    const startTime = document.getElementById("startTime").value;
    const endTime = document.getElementById("endTime").value;
    const activityType = document.getElementById("activityType").value;
    const activityDesc = document.getElementById("activityDesc").value;
    
    if (date && startTime && endTime && activityType && activityDesc) {
        const activity = { date, startTime, endTime, activityType, activityDesc };
        const activities = JSON.parse(localStorage.getItem("activities") || "[]");
        activities.push(activity);
        localStorage.setItem("activities", JSON.stringify(activities));
        renderActivities();
        document.getElementById("activityForm").reset();
    }
}

function renderActivities() {
    activityTableBody.innerHTML = "";
    const activities = JSON.parse(localStorage.getItem("activities") || "[]");
    activities.forEach(activity => {
        const row = `<tr>
            <td>${activity.date}</td>
            <td>${activity.startTime}</td>
            <td>${activity.endTime}</td>
            <td>${activity.activityType}</td>
            <td>${activity.activityDesc}</td>
        </tr>`;
        activityTableBody.innerHTML += row;
    });
}

function exportCSV() {
    const activities = JSON.parse(localStorage.getItem("activities") || "[]");
    if (activities.length === 0) return alert("Nessuna attività da esportare.");
    
    let csvContent = "data:text/csv;charset=utf-8,Data,Ora Ingresso,Ora Uscita,Tipo,Descrizione\n";
    activities.forEach(activity => {
        const row = `${activity.date},${activity.startTime},${activity.endTime},${activity.activityType},${activity.activityDesc}`;
        csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const email = document.getElementById("email").value;
    if (email) {
        window.location.href = `mailto:${email}?subject=Attività Lavoro&body=Scarica il CSV da questo link: ${encodedUri}`;
    } else {
        alert("Inserisci una email valida.");
    }
}

function resetActivities() {
    localStorage.removeItem("activities");
    renderActivities();
}

window.onload = renderActivities;
