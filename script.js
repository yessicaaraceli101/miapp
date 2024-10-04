// Variables globales
const totalCollected = document.getElementById('totalCollected');
const teamList = document.getElementById('teamList').getElementsByTagName('tbody')[0];
const winningTeam = document.getElementById('winningTeam');
let total = 0;
let teams = [];

// Cargar equipos desde Local Storage al inicio
document.addEventListener('DOMContentLoaded', function() {
    const storedTeams = JSON.parse(localStorage.getItem('teams'));
    if (storedTeams) {
        teams = storedTeams; // Cargar equipos desde Local Storage
        updateTeamList(); // Actualizar la lista de equipos
        updateTotalCollected(); // Actualizar el total recaudado
    }
});

// Evento para manejar el formulario de inscripción
document.getElementById('inscripcionForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Evita el comportamiento por defecto del formulario
    const teamName = document.getElementById('teamName').value;
    const registrationCost = 50000;

    // Crear un nuevo equipo
    const team = {
        name: teamName,
        cost: registrationCost,
        goals: 0,
        yellowCards: 0,
        redCards: 0
    };
    
    teams.push(team); // Agregar el equipo a la lista de equipos
    updateTeamList(); // Actualizar la lista de equipos
    updateTotalCollected(); // Actualizar el total recaudado

    // Limpiar el formulario
    document.getElementById('inscripcionForm').reset();
    saveTeamsToLocalStorage(); // Guardar equipos en Local Storage
});

// Función para actualizar la lista de equipos en la tabla
function updateTeamList() {
    teamList.innerHTML = ''; // Limpiar la tabla
    teams.forEach((team, index) => {
        const row = teamList.insertRow();
        row.innerHTML = `
            <td>${team.name}</td>
            <td>${team.cost} gs</td>
            <td><input type="number" value="${team.goals}" min="0" data-index="${index}" class="goalsInput"></td>
            <td><input type="number" value="${team.yellowCards}" min="0" data-index="${index}" class="yellowCardsInput"></td>
            <td><input type="number" value="${team.redCards}" min="0" data-index="${index}" class="redCardsInput"></td>
            <td><button class="deleteBtn" data-index="${index}">Eliminar</button></td>
        `;
    });
}

// Actualizar el total recaudado
function updateTotalCollected() {
    total = teams.reduce((sum, team) => sum + team.cost, 0);
    totalCollected.textContent = total;
    updateWinningTeam();
    saveTeamsToLocalStorage(); // Guardar equipos en Local Storage
}

// Actualizar el equipo ganador
function updateWinningTeam() {
    let maxGoals = -1;
    let winning = "N/A";
    
    teams.forEach(team => {
        if (team.goals > maxGoals) {
            maxGoals = team.goals;
            winning = team.name;
        }
    });
    winningTeam.textContent = winning;
}

// Manejar la eliminación de equipos
teamList.addEventListener('click', function(e) {
    if (e.target.classList.contains('deleteBtn')) {
        const index = e.target.dataset.index; // Obtener el índice del equipo
        teams.splice(index, 1); // Eliminar el equipo de la lista
        updateTeamList(); // Actualizar la lista de equipos
        updateTotalCollected(); // Actualizar el total recaudado
    }
});

// Manejar los cambios en los goles y tarjetas
teamList.addEventListener('input', function(e) {
    const index = e.target.dataset.index; // Obtener el índice del equipo
    const value = parseInt(e.target.value) || 0; // Obtener el valor o 0

    if (e.target.classList.contains('goalsInput')) {
        teams[index].goals = value; // Actualizar goles
    } else if (e.target.classList.contains('yellowCardsInput')) {
        teams[index].yellowCards = value; // Actualizar tarjetas amarillas
    } else if (e.target.classList.contains('redCardsInput')) {
        teams[index].redCards = value; // Actualizar tarjetas rojas
    }

    updateWinningTeam(); // Actualizar el equipo ganador
    saveTeamsToLocalStorage(); // Guardar equipos en Local Storage
});

// Función para guardar equipos en Local Storage
function saveTeamsToLocalStorage() {
    localStorage.setItem('teams', JSON.stringify(teams));
}

// Generar el PDF de la lista de equipos y estadísticas
document.getElementById('downloadPDF').addEventListener('click', function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Lista de Equipos y Estadísticas", 20, 20);
    
    let y = 30;
    teams.forEach(team => {
        doc.setFontSize(14);
        doc.text(`Equipo: ${team.name}`, 20, y);
        doc.text(`Costo de Inscripción: ${team.cost} gs`, 20, y + 10);
        doc.text(`Goles: ${team.goals}`, 20, y + 20);
        doc.text(`Tarjetas Amarillas: ${team.yellowCards}`, 20, y + 30);
        doc.text(`Tarjetas Rojas: ${team.redCards}`, 20, y + 40);
        y += 60; // Espacio entre equipos
    });

    doc.setFontSize(16);
    doc.text(`Total Recaudado: ${total}`, 20, y);
    doc.text(`Equipo Ganador: ${winningTeam.textContent}`, 20, y + 10);
    doc.save("Equipos_y_Estadisticas.pdf");
});

// Generar el PDF de los goles
document.getElementById('downloadGoalsPDF').addEventListener('click', function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Estadísticas de Goles", 20, 20);

    let y = 30;
    teams.forEach(team => {
        doc.setFontSize(14);
        doc.text(`Equipo: ${team.name}`, 20, y);
        doc.text(`Goles: ${team.goals}`, 20, y + 10);
        y += 20; // Espacio entre equipos
    });

    doc.save("Estadisticas_de_Goles.pdf");
});