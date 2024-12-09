let activities = []; // Array per salvare le attività

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

    // Aggiungi la nuova attività all'array
    const newActivity = { date, startTime, endTime, activityType, activityDesc };
    activities.push(newActivity);

    // Salva l'array aggiornato nel file JSON
    saveActivitiesToJSON();
    renderActivities(); // Aggiorna la lista a schermo
}

// Funzione per salvare tutte le attività nel file JSON
function saveActivitiesToJSON() {
    const jsonContent = JSON.stringify(activities, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    // Forza il download del file come "activities.json"
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.setAttribute("download", "activities.json");

    // Simula il clic per scaricare il file
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    // Libera l'URL generato
    URL.revokeObjectURL(url);
}

// Funzione per visualizzare le attività nella lista
function renderActivities() {
    const activityList = document.getElementById("activityList");
    if (!activityList) return;

    activityList.innerHTML = ""; // Pulisce la lista

    activities.forEach(activity => {
        const dateFormatted = new Intl.DateTimeFormat("it-IT").format(new Date(activity.date));
        const listItem = document.createElement("li");
        listItem.textContent = `${dateFormatted} | ${activity.startTime} - ${activity.endTime} | ${activity.activityType} | ${activity.activityDesc}`;
        activityList.appendChild(listItem);
    });
}

// Funzione per resettare tutte le attività con backup
function resetActivities() {
    const confirmation = confirm("Sei sicuro di voler resettare tutte le attività?");
    if (!confirmation) return;

    if (activities.length > 0) {
        // Crea un backup con nome specifico
        const backupContent = JSON.stringify(activities, null, 2);
        const blob = new Blob([backupContent], { type: "application/json" });
        const backupName = `activities_backup_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
        const backupLink = document.createElement("a");
        backupLink.href = URL.createObjectURL(blob);
        backupLink.setAttribute("download", backupName);

        // Simula il clic per scaricare il backup
        document.body.appendChild(backupLink);
        backupLink.click();
        document.body.removeChild(backupLink);

        // Libera l'URL generato
        URL.revokeObjectURL(backupLink.href);
    }

    // Pulisci l'array delle attività
    activities = [];
    saveActivitiesToJSON(); // Salva un file JSON vuoto
    renderActivities();
}

// Funzione per caricare un backup JSON da un file
function loadBackupFromFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const backupData = JSON.parse(e.target.result);
            if (Array.isArray(backupData)) {
                activities = backupData;
                renderActivities(); // Mostra le attività caricate
            } else {
                alert("Il file selezionato non contiene un formato valido di attività.");
            }
        } catch (err) {
            alert("Errore nel caricamento del file: " + err.message);
        }
    };

    reader.readAsText(file);
}

// Funzione per esportare le attività in Excel
function downloadExcel() {
    const wb = XLSX.utils.book_new();
    const wsData = activities.map(activity => {
        // Formattare la data nel formato gg/mm/aaaa
        const formattedDate = new Intl.DateTimeFormat("it-IT").format(new Date(activity.date));

        return [
            formattedDate, // Data formattata
            activity.startTime,
            activity.endTime,
            activity.activityType,
            activity.activityDesc.replace(/[,;]/g, '\n') // Gestione di virgola e punto e virgola (line break)
        ];
    });

    const ws = XLSX.utils.aoa_to_sheet([["Data", "Ora Ingresso", "Ora Uscita", "Tipo Attività", "Descrizione"]].concat(wsData));
    XLSX.utils.book_append_sheet(wb, ws, "Attività");

    // Genera il file Excel e lo scarica
    XLSX.writeFile(wb, "attività_lavoro.xlsx");
}


// Inizializzazione al caricamento della pagina
window.onload = function () {
    renderActivities(); // Mostra le attività salvate a schermo

    // Aggiungi listener per il caricamento del file JSON
    const fileInput = document.getElementById("backupFileInput");
    fileInput.addEventListener("change", loadBackupFromFile);
};
