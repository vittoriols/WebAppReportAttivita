// Funzione per leggere il file activities.json
async function readActivitiesFile() {
    try {
        const response = await fetch('activities.json');
        if (!response.ok) throw new Error('Errore nel caricamento del file activities.json');
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

// Funzione per salvare dati nel file activities.json
async function saveActivitiesFile(data) {
    try {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'activities.json';
        a.click();
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Errore durante il salvataggio di activities.json:', error);
    }
}

// Funzione per aggiungere una nuova attività
async function addActivity() {
    const date = document.getElementById('date').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    const activityType = document.getElementById('activityType').value;
    const activityDesc = document.getElementById('activityDesc').value;

    if (!date || !startTime || !endTime || !activityType) {
        alert('Compila tutti i campi obbligatori.');
        return;
    }

    const newActivity = { date, startTime, endTime, activityType, activityDesc };

    // Leggi le attività esistenti
    const activities = await readActivitiesFile();
    activities.push(newActivity);

    // Salva il nuovo elenco
    await saveActivitiesFile(activities);

    renderActivities(); // Aggiorna la visualizzazione
}

// Funzione per visualizzare le attività
async function renderActivities() {
    const activityList = document.getElementById('activityList');
    activityList.innerHTML = ''; // Pulisce la lista

    const activities = await readActivitiesFile();

    activities.forEach(activity => {
        const dateFormatted = new Intl.DateTimeFormat('it-IT').format(new Date(activity.date));
        const listItem = document.createElement('li');
        listItem.textContent = `${dateFormatted} | ${activity.startTime} - ${activity.endTime} | ${activity.activityType} | ${activity.activityDesc}`;
        activityList.appendChild(listItem);
    });
}

// Funzione per resettare tutte le attività e fare un backup
async function resetActivities() {
    const confirmation = confirm('Sei sicuro di voler resettare tutte le attività?');
    if (!confirmation) return;

    // Leggi le attività correnti
    const activities = await readActivitiesFile();
    if (activities.length === 0) {
        alert('Nessuna attività da resettare.');
        return;
    }

    // Crea il nome del file di backup
    const now = new Date();
    const timestamp = now.toISOString().replace(/[-:.]/g, '').slice(0, 15);
    const backupFileName = `activities_backup_${timestamp}.json`;

    // Salva il backup
    const blob = new Blob([JSON.stringify(activities, null, 2)], { type: 'application/json' });
    const backupUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = backupUrl;
    a.download = backupFileName;
    a.click();
    URL.revokeObjectURL(backupUrl);

    // Ripristina il file activities.json vuoto
    await saveActivitiesFile([]);
    renderActivities(); // Aggiorna la visualizzazione

    alert('Backup completato e attività resettate.');
}

// Funzione per esportare le attività in formato CSV
async function downloadCSV() {
    const activities = await readActivitiesFile();
    if (activities.length === 0) {
        alert('Nessuna attività da esportare.');
        return;
    }

    let csvContent = 'Data,Ora Ingresso,Ora Uscita,Tipo,Descrizione\n';
    activities.forEach(activity => {
        const dateFormatted = new Intl.DateTimeFormat('it-IT').format(new Date(activity.date));
        const formattedDesc = activity.activityDesc.replace(/[,;]/g, '\n'); // Gestione della virgola
        csvContent += `${dateFormatted},${activity.startTime},${activity.endTime},${activity.activityType},"${formattedDesc}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attivita.csv';
    a.click();
    URL.revokeObjectURL(url);

    alert('CSV scaricato con successo!');
}

// Imposta valori di default e carica le attività al caricamento della pagina
window.onload = function () {
    const startTime = document.getElementById('startTime');
    startTime.value = '09:00';

    const endTime = document.getElementById('endTime');
    endTime.value = '17:00';

    renderActivities();
};
