// ==================== MEUS AGENDAMENTOS ====================

let appointmentToCancel = null;

// Verificar autenticação ao carregar
window.addEventListener('DOMContentLoaded', () => {
    const user = checkAuth('paciente');
    if (user) {
        loadAppointments();
    }
});

// Alternar entre abas
function switchTab(tab) {
    // Remover classe active de todas as abas
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Adicionar classe active na aba selecionada
    if (tab === 'upcoming') {
        document.querySelector('.tab-btn:first-child').classList.add('active');
        document.getElementById('upcomingTab').classList.add('active');
    } else {
        document.querySelector('.tab-btn:last-child').classList.add('active');
        document.getElementById('pastTab').classList.add('active');
    }
}

// Carregar Agendamentos
function loadAppointments() {
    const user = getCurrentUser();
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    
    // Filtrar agendamentos do usuário
    const userAppointments = appointments.filter(a => a.patientId === user.id);
    
    // Separar em futuros e passados
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const upcoming = userAppointments.filter(a => {
        const appointmentDate = new Date(a.date);
        appointmentDate.setHours(0, 0, 0, 0);
        return appointmentDate >= today && a.status !== 'cancelada' && a.status !== 'concluida';
    });
    
    const past = userAppointments.filter(a => {
        const appointmentDate = new Date(a.date);
        appointmentDate.setHours(0, 0, 0, 0);
        return appointmentDate < today || a.status === 'cancelada' || a.status === 'concluida';
    });
    
    // Renderizar listas
    renderAppointmentsList('upcomingAppointments', upcoming, true);
    renderAppointmentsList('pastAppointments', past, false);
}

// Renderizar lista de agendamentos
function renderAppointmentsList(elementId, appointments, showActions) {
    const container = document.getElementById(elementId);
    
    if (appointments.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-times"></i>
                <p>Nenhuma consulta encontrada</p>
                ${showActions ? '<a href="marcar-consulta.html" class="btn btn-primary"><i class="fas fa-calendar-plus"></i> Marcar Consulta</a>' : ''}
            </div>
        `;
        return;
    }
    
    // Ordenar por data e hora
    appointments.sort((a, b) => {
        const dateA = new Date(a.date + ' ' + a.time);
        const dateB = new Date(b.date + ' ' + b.time);
        return showActions ? dateA - dateB : dateB - dateA; // Crescente para futuras, decrescente para passadas
    });
    
    container.innerHTML = appointments.map(appointment => `
        <div class="appointment-card">
            <div class="appointment-info">
                <div class="appointment-header">
                    <div class="appointment-icon">
                        <i class="fas fa-stethoscope"></i>
                    </div>
                    <div>
                        <h3>${appointment.specialty}</h3>
                        <p style="color: var(--secondary); margin-top: 0.25rem;">${appointment.doctorName}</p>
                    </div>
                </div>
                <div class="appointment-details">
                    <div class="appointment-detail">
                        <i class="fas fa-calendar"></i>
                        <span>${formatDate(appointment.date)}</span>
                    </div>
                    <div class="appointment-detail">
                        <i class="fas fa-clock"></i>
                        <span>${appointment.time}</span>
                    </div>
                    <div class="appointment-detail">
                        <i class="fas fa-hospital"></i>
                        <span>${appointment.doctorCRM}</span>
                    </div>
                </div>
            </div>
            <div class="appointment-actions">
                <span class="status-badge status-${appointment.status}">${getStatusText(appointment.status)}</span>
                ${showActions && appointment.status === 'agendada' ? 
                    `<button class="btn btn-danger" onclick="openCancelModal(${appointment.id})">
                        <i class="fas fa-times"></i> Cancelar
                    </button>` : ''}
            </div>
        </div>
    `).join('');
}

// Obter texto do status
function getStatusText(status) {
    const statusMap = {
        'agendada': 'Agendada',
        'confirmada': 'Confirmada',
        'concluida': 'Concluída',
        'cancelada': 'Cancelada'
    };
    return statusMap[status] || status;
}

// Abrir modal de cancelamento
function openCancelModal(appointmentId) {
    appointmentToCancel = appointmentId;
    const modal = document.getElementById('cancelModal');
    modal.classList.add('active');
}

// Fechar modal de cancelamento
function closeCancelModal() {
    appointmentToCancel = null;
    const modal = document.getElementById('cancelModal');
    modal.classList.remove('active');
}

// Confirmar cancelamento
function confirmCancel() {
    if (!appointmentToCancel) return;
    
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const index = appointments.findIndex(a => a.id === appointmentToCancel);
    
    if (index !== -1) {
        appointments[index].status = 'cancelada';
        appointments[index].canceledAt = new Date().toISOString();
        localStorage.setItem('appointments', JSON.stringify(appointments));
        
        showNotification('Consulta cancelada com sucesso', 'success');
        closeCancelModal();
        loadAppointments();
    } else {
        showNotification('Erro ao cancelar consulta', 'error');
    }
}
