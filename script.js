// Funzione per visualizzare le attività salvate con data in formato italiano
function renderActivities() {
    const activityList = document.getElementById("activityList");
    if (!activityList) return;

    activityList.innerHTML = ""; // Pulisce la lista

    const activities = JSON.parse(localStorage.getItem("activities") || "[]");
    activities.forEach(activity => {
        const dateFormatted = new Intl.DateTimeFormat("it-IT").format(new Date(activity.date));
        const listItem = document.createElement("li");
        listItem.textContent = `${dateFormatted} | ${activity.startTime} - ${activity.endTime} | ${activity.activityType} | ${activity.activityDesc}`;
        activityList.appendChild(listItem);
    });
}

// Funzione per aggiungere una nuova attività
function addActivity() {
    const date = document.getElementById("date").value;
    const startTime = document.getElementById("startTime").value;
    const endTime = document.getElementById("endTime").value;
    const activityType = document.getElementById("activityType").value;
    const activityDesc = document.getElementById("activityDesc").value;

    if (!date || !startTime || !endTime || !activityType) {
        alert("Compila tutti i campi obbligatori.");
        return;
    }

    const activities = JSON.parse(localStorage.getItem("activities") || "[]");
    activities.push({ date, startTime, endTime, activityType, activityDesc });
    localStorage.setItem("activities", JSON.stringify(activities));

    renderActivities(); // Aggiorna la visualizzazione
}

// Funzione per esportare le attività in formato CSV
function downloadCSV() {
    const activities = JSON.parse(localStorage.getItem("activities") || "[]");
    if (activities.length === 0) return alert("Nessuna attività da scaricare.");

    let csvContent = "Data,Ora Ingresso,Ora Uscita,Tipo,Descrizione\n";
    activities.forEach(activity => {
        const dateFormatted = new Intl.DateTimeFormat("it-IT").format(new Date(activity.date));
        const formattedDesc = activity.activityDesc.replace(/[,;]/g, "\n");
        const row = `${dateFormatted},${activity.startTime},${activity.endTime},${activity.activityType},"${formattedDesc}"`;
        csvContent += row + "\n";
    });

    // Crea un Blob per il CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    // Crea un link per il download
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.setAttribute("download", "attivita.csv");

    // Aggiungi il link al documento, simula il click e rimuovilo
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    // Libera l'oggetto URL
    URL.revokeObjectURL(url);

    alert("CSV scaricato! Puoi trovarlo nell'app File.");
}

// Funzione per inviare un'email
function openMailClient() {
    const email = document.getElementById("email").value;
    if (!email) {
        alert("Inserisci una email valida.");
        return;
    }

    const subject = encodeURIComponent("Attività Lavoro");
    const body = encodeURIComponent("Hai delle attività salvate. Utilizza il pulsante di download per scaricare il file CSV.");
    const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
}

// Funzione per resettare tutte le attività con conferma
function resetActivities() {
    const confirmation = confirm("Sei sicuro di voler resettare tutte le attività?");
    if (confirmation) {
        localStorage.removeItem("activities");
        renderActivities();
        alert("Tutte le attività sono state resettate.");
    }
}

// Imposta valori di default per le ore di ingresso e uscita
window.onload = function() {
    const startTime = document.getElementById("startTime");
    startTime.value = "09:00";

    const endTime = document.getElementById("endTime");
    endTime.value = "17:00";

    renderActivities(); // Carica le attività salvate
};
