// ==================== PAINEL MÉDICO/SECRETÁRIA ====================

let currentFilters = {
    date: null,
    status: 'all'
};

let selectedAppointmentId = null;
let currentRecordAppointmentId = null;

// Verificar autenticação ao carregar
window.addEventListener('DOMContentLoaded', () => {
    const user = checkAuth();
    if (user && (user.role === 'medico' || user.role === 'secretaria')) {
        updateUserName();
        loadDashboard();
        loadDoctorAppointments();
        loadRecentRecords();
    }
});

// Carregar Dashboard (Estatísticas)
function loadDashboard() {
    const user = getCurrentUser();
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    
    // Filtrar agendamentos do médico
    const doctorAppointments = user.role === 'medico' 
        ? appointments.filter(a => a.doctorId === user.id)
        : appointments; // Secretária vê todos
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Consultas de hoje
    const todayAppointments = doctorAppointments.filter(a => {
        const appointmentDate = new Date(a.date);
        appointmentDate.setHours(0, 0, 0, 0);
        return appointmentDate.getTime() === today.getTime() && a.status !== 'cancelada';
    });
    
    // Consultas desta semana
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    const weekAppointments = doctorAppointments.filter(a => {
        const appointmentDate = new Date(a.date);
        appointmentDate.setHours(0, 0, 0, 0);
        return appointmentDate >= weekStart && appointmentDate <= weekEnd && a.status !== 'cancelada';
    });
    
    // Pacientes únicos
    const uniquePatients = new Set(doctorAppointments.map(a => a.patientId));
    
    // Próxima consulta
    const futureAppointments = doctorAppointments
        .filter(a => {
            const appointmentDateTime = new Date(a.date + ' ' + a.time);
            return appointmentDateTime > new Date() && a.status !== 'cancelada';
        })
        .sort((a, b) => {
            const dateA = new Date(a.date + ' ' + a.time);
            const dateB = new Date(b.date + ' ' + b.time);
            return dateA - dateB;
        });
    
    const nextAppointment = futureAppointments.length > 0 
        ? futureAppointments[0].time 
        : '-';
    
    // Atualizar estatísticas
    document.getElementById('todayCount').textContent = todayAppointments.length;
    document.getElementById('weekCount').textContent = weekAppointments.length;
    document.getElementById('patientCount').textContent = uniquePatients.size;
    document.getElementById('nextAppointment').textContent = nextAppointment;
}

// Carregar Agendamentos do Médico
function loadDoctorAppointments() {
    const user = getCurrentUser();
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    
    // Filtrar agendamentos
    let filteredAppointments = user.role === 'medico'
        ? appointments.filter(a => a.doctorId === user.id)
        : appointments;
    
    // Aplicar filtros
    if (currentFilters.date) {
        filteredAppointments = filteredAppointments.filter(a => a.date === currentFilters.date);
    }
    
    if (currentFilters.status !== 'all') {
        filteredAppointments = filteredAppointments.filter(a => a.status === currentFilters.status);
    }
    
    // Ordenar por data e hora (mais recentes primeiro)
    filteredAppointments.sort((a, b) => {
        const dateA = new Date(a.date + ' ' + a.time);
        const dateB = new Date(b.date + ' ' + b.time);
        return dateB - dateA;
    });
    
    // Renderizar tabela
    renderAppointmentsTable(filteredAppointments);
}

// Renderizar Tabela de Agendamentos
function renderAppointmentsTable(appointments) {
    const container = document.getElementById('doctorAppointments');
    
    if (appointments.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-times"></i>
                <p>Nenhum agendamento encontrado</p>
            </div>
        `;
        return;
    }
    
    const html = `
        <table>
            <thead>
                <tr>
                    <th>Data</th>
                    <th>Horário</th>
                    <th>Paciente</th>
                    <th>Especialidade</th>
                    <th>Status</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                ${appointments.map(appointment => `
                    <tr>
                        <td>${formatDate(appointment.date)}</td>
                        <td>${appointment.time}</td>
                        <td>${appointment.patientName}</td>
                        <td>${appointment.specialty}</td>
                        <td><span class="status-badge status-${appointment.status}">${getStatusText(appointment.status)}</span></td>
                        <td>
                            <button class="btn btn-primary" onclick="viewAppointmentDetails(${appointment.id})" title="Ver Detalhes">
                                <i class="fas fa-eye"></i>
                            </button>
                            ${appointment.status === 'agendada' || appointment.status === 'confirmada' ? `
                                <button class="btn btn-success" onclick="openRecordModal(${appointment.id})" title="Prontuário">
                                    <i class="fas fa-file-medical"></i>
                                </button>
                            ` : ''}
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    container.innerHTML = html;
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

// Filtrar Agendamentos
function filterAppointments() {
    const dateValue = document.getElementById('filterDate').value;
    const statusValue = document.getElementById('filterStatus').value;
    
    currentFilters.date = dateValue || null;
    currentFilters.status = statusValue;
    
    loadDoctorAppointments();
}

// Limpar Filtros
function clearFilters() {
    document.getElementById('filterDate').value = '';
    document.getElementById('filterStatus').value = 'all';
    currentFilters = { date: null, status: 'all' };
    loadDoctorAppointments();
}

// Ver Detalhes do Agendamento
function viewAppointmentDetails(appointmentId) {
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const appointment = appointments.find(a => a.id === appointmentId);
    
    if (!appointment) return;
    
    const modal = document.getElementById('appointmentModal');
    const details = document.getElementById('appointmentDetails');
    
    details.innerHTML = `
        <div class="summary-details">
            <div class="summary-item">
                <label>Paciente:</label>
                <span>${appointment.patientName}</span>
            </div>
            <div class="summary-item">
                <label>Email:</label>
                <span>${appointment.patientEmail}</span>
            </div>
            <div class="summary-item">
                <label>Telefone:</label>
                <span>${appointment.patientPhone || 'Não informado'}</span>
            </div>
            <div class="summary-item">
                <label>Especialidade:</label>
                <span>${appointment.specialty}</span>
            </div>
            <div class="summary-item">
                <label>Médico:</label>
                <span>${appointment.doctorName} - ${appointment.doctorCRM}</span>
            </div>
            <div class="summary-item">
                <label>Data:</label>
                <span>${formatDate(appointment.date)}</span>
            </div>
            <div class="summary-item">
                <label>Horário:</label>
                <span>${appointment.time}</span>
            </div>
            <div class="summary-item">
                <label>Status:</label>
                <span class="status-badge status-${appointment.status}">${getStatusText(appointment.status)}</span>
            </div>
            <div class="summary-item">
                <label>Agendado em:</label>
                <span>${new Date(appointment.createdAt).toLocaleString('pt-BR')}</span>
            </div>
        </div>
        ${appointment.status === 'agendada' ? `
            <div style="margin-top: 1.5rem; display: flex; gap: 1rem;">
                <button class="btn btn-success" onclick="confirmAppointment(${appointmentId})">
                    <i class="fas fa-check"></i> Confirmar Consulta
                </button>
                <button class="btn btn-danger" onclick="cancelAppointment(${appointmentId})">
                    <i class="fas fa-times"></i> Cancelar Consulta
                </button>
            </div>
        ` : ''}
    `;
    
    modal.classList.add('active');
}

// Fechar Modal de Detalhes
function closeAppointmentModal() {
    const modal = document.getElementById('appointmentModal');
    modal.classList.remove('active');
}

// Confirmar Consulta
function confirmAppointment(appointmentId) {
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const index = appointments.findIndex(a => a.id === appointmentId);
    
    if (index !== -1) {
        appointments[index].status = 'confirmada';
        localStorage.setItem('appointments', JSON.stringify(appointments));
        showNotification('Consulta confirmada com sucesso', 'success');
        closeAppointmentModal();
        loadDoctorAppointments();
        loadDashboard();
    }
}

// Cancelar Consulta
function cancelAppointment(appointmentId) {
    if (confirm('Tem certeza que deseja cancelar esta consulta?')) {
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        const index = appointments.findIndex(a => a.id === appointmentId);
        
        if (index !== -1) {
            appointments[index].status = 'cancelada';
            localStorage.setItem('appointments', JSON.stringify(appointments));
            showNotification('Consulta cancelada', 'success');
            closeAppointmentModal();
            loadDoctorAppointments();
            loadDashboard();
        }
    }
}

// Abrir Modal de Prontuário
function openRecordModal(appointmentId) {
    currentRecordAppointmentId = appointmentId;
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const appointment = appointments.find(a => a.id === appointmentId);
    
    if (!appointment) return;
    
    // Verificar se já existe prontuário
    const records = JSON.parse(localStorage.getItem('medicalRecords') || '[]');
    const existingRecord = records.find(r => r.appointmentId === appointmentId);
    
    const modal = document.getElementById('recordModal');
    
    // Preencher campos
    document.getElementById('recordPatient').value = appointment.patientName;
    document.getElementById('recordDate').value = formatDate(appointment.date) + ' às ' + appointment.time;
    
    if (existingRecord) {
        document.getElementById('recordComplaint').value = existingRecord.complaint || '';
        document.getElementById('recordExam').value = existingRecord.exam || '';
        document.getElementById('recordDiagnosis').value = existingRecord.diagnosis || '';
        document.getElementById('recordPrescription').value = existingRecord.prescription || '';
        document.getElementById('recordNotes').value = existingRecord.notes || '';
    } else {
        // Limpar campos
        document.getElementById('recordComplaint').value = '';
        document.getElementById('recordExam').value = '';
        document.getElementById('recordDiagnosis').value = '';
        document.getElementById('recordPrescription').value = '';
        document.getElementById('recordNotes').value = '';
    }
    
    modal.classList.add('active');
}

// Fechar Modal de Prontuário
function closeRecordModal() {
    currentRecordAppointmentId = null;
    const modal = document.getElementById('recordModal');
    modal.classList.remove('active');
}

// Salvar Prontuário
function saveRecord() {
    if (!currentRecordAppointmentId) return;
    
    const user = getCurrentUser();
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const appointment = appointments.find(a => a.id === currentRecordAppointmentId);
    
    if (!appointment) return;
    
    const complaint = document.getElementById('recordComplaint').value;
    const exam = document.getElementById('recordExam').value;
    const diagnosis = document.getElementById('recordDiagnosis').value;
    const prescription = document.getElementById('recordPrescription').value;
    const notes = document.getElementById('recordNotes').value;
    
    if (!complaint || !diagnosis) {
        showNotification('Preencha pelo menos a queixa e o diagnóstico', 'error');
        return;
    }
    
    // Criar ou atualizar prontuário
    const records = JSON.parse(localStorage.getItem('medicalRecords') || '[]');
    const existingIndex = records.findIndex(r => r.appointmentId === currentRecordAppointmentId);
    
    const record = {
        id: existingIndex !== -1 ? records[existingIndex].id : Date.now(),
        appointmentId: currentRecordAppointmentId,
        patientId: appointment.patientId,
        patientName: appointment.patientName,
        doctorId: user.id,
        doctorName: user.name,
        date: appointment.date,
        time: appointment.time,
        complaint,
        exam,
        diagnosis,
        prescription,
        notes,
        createdAt: existingIndex !== -1 ? records[existingIndex].createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    if (existingIndex !== -1) {
        records[existingIndex] = record;
    } else {
        records.push(record);
    }
    
    localStorage.setItem('medicalRecords', JSON.stringify(records));
    
    // Atualizar status da consulta para concluída
    const appointmentIndex = appointments.findIndex(a => a.id === currentRecordAppointmentId);
    if (appointmentIndex !== -1) {
        appointments[appointmentIndex].status = 'concluida';
        localStorage.setItem('appointments', JSON.stringify(appointments));
    }
    
    showNotification('Prontuário salvo com sucesso', 'success');
    closeRecordModal();
    loadDoctorAppointments();
    loadRecentRecords();
    loadDashboard();
}

// Carregar Prontuários Recentes
function loadRecentRecords() {
    const user = getCurrentUser();
    const records = JSON.parse(localStorage.getItem('medicalRecords') || '[]');
    
    // Filtrar prontuários do médico
    const doctorRecords = user.role === 'medico'
        ? records.filter(r => r.doctorId === user.id)
        : records;
    
    // Ordenar por data (mais recentes primeiro)
    doctorRecords.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    
    // Pegar os 5 mais recentes
    const recentRecords = doctorRecords.slice(0, 5);
    
    const container = document.getElementById('recentRecords');
    
    if (recentRecords.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-file-medical"></i>
                <p>Nenhum prontuário registrado ainda</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = recentRecords.map(record => `
        <div class="record-card" onclick="viewRecord(${record.id})">
            <div class="record-header">
                <h4>${record.patientName}</h4>
                <span class="record-date">${formatDate(record.date)} - ${record.time}</span>
            </div>
            <div class="record-preview">
                <strong>Diagnóstico:</strong> ${record.diagnosis.substring(0, 100)}${record.diagnosis.length > 100 ? '...' : ''}
            </div>
        </div>
    `).join('');
}

// Visualizar Prontuário Completo
function viewRecord(recordId) {
    const records = JSON.parse(localStorage.getItem('medicalRecords') || '[]');
    const record = records.find(r => r.id === recordId);
    
    if (!record) return;
    
    const modal = document.getElementById('recordModal');
    
    document.getElementById('recordPatient').value = record.patientName;
    document.getElementById('recordDate').value = formatDate(record.date) + ' às ' + record.time;
    document.getElementById('recordComplaint').value = record.complaint || '';
    document.getElementById('recordExam').value = record.exam || '';
    document.getElementById('recordDiagnosis').value = record.diagnosis || '';
    document.getElementById('recordPrescription').value = record.prescription || '';
    document.getElementById('recordNotes').value = record.notes || '';
    
    // Desabilitar edição (apenas visualização)
    document.querySelectorAll('#recordForm textarea').forEach(textarea => {
        textarea.setAttribute('readonly', true);
    });
    
    // Esconder botões de ação
    document.querySelector('.modal-actions').style.display = 'none';
    
    modal.classList.add('active');
    
    // Re-habilitar edição ao fechar
    modal.addEventListener('click', function handler(e) {
        if (e.target === modal || e.target.classList.contains('modal-close')) {
            document.querySelectorAll('#recordForm textarea').forEach(textarea => {
                textarea.removeAttribute('readonly');
            });
            document.querySelector('.modal-actions').style.display = 'flex';
            modal.removeEventListener('click', handler);
        }
    });
}
