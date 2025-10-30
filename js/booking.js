// ==================== MARCAR CONSULTA ====================

let bookingData = {
    specialty: null,
    doctor: null,
    date: null,
    time: null
};

let currentStep = 1;

// Verificar autenticação ao carregar
window.addEventListener('DOMContentLoaded', () => {
    const user = checkAuth('paciente');
    if (user) {
        loadSpecialties();
    }
});

// Carregar Especialidades
function loadSpecialties() {
    const specialties = JSON.parse(localStorage.getItem('specialties') || '[]');
    const grid = document.getElementById('specialtyGrid');
    
    grid.innerHTML = specialties.map(specialty => `
        <div class="specialty-card" onclick="selectSpecialty(${specialty.id}, '${specialty.name}')">
            <i class="fas ${specialty.icon}"></i>
            <h3>${specialty.name}</h3>
            <p>Clique para selecionar</p>
        </div>
    `).join('');
}

// Selecionar Especialidade
function selectSpecialty(id, name) {
    bookingData.specialty = { id, name };
    goToStep(2);
    loadDoctors(id);
}

// Carregar Médicos
function loadDoctors(specialtyId) {
    const doctors = JSON.parse(localStorage.getItem('doctors') || '[]');
    const filteredDoctors = doctors.filter(d => d.specialtyId === specialtyId && d.available);
    const list = document.getElementById('doctorList');
    
    if (filteredDoctors.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-user-doctor"></i>
                <p>Nenhum médico disponível para esta especialidade no momento.</p>
                <button class="btn btn-secondary" onclick="goToStep(1)">
                    <i class="fas fa-arrow-left"></i> Voltar
                </button>
            </div>
        `;
        return;
    }
    
    list.innerHTML = filteredDoctors.map(doctor => `
        <div class="doctor-card" onclick="selectDoctor(${doctor.id}, '${doctor.name}', '${doctor.crm}')">
            <div class="doctor-avatar">
                <i class="fas fa-user-doctor"></i>
            </div>
            <div class="doctor-info">
                <h3>${doctor.name}</h3>
                <p class="specialty">${doctor.specialty}</p>
                <p class="crm">${doctor.crm}</p>
            </div>
        </div>
    `).join('');
}

// Selecionar Médico
function selectDoctor(id, name, crm) {
    bookingData.doctor = { id, name, crm };
    goToStep(3);
    loadCalendar();
}

// Carregar Calendário
function loadCalendar() {
    const calendar = document.getElementById('calendar');
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Cabeçalho do calendário
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
    let html = `
        <div class="calendar-header">
            <button onclick="changeMonth(-1)"><i class="fas fa-chevron-left"></i></button>
            <h3>${monthNames[currentMonth]} ${currentYear}</h3>
            <button onclick="changeMonth(1)"><i class="fas fa-chevron-right"></i></button>
        </div>
        <div class="calendar-days">
            <div style="font-weight: bold;">Dom</div>
            <div style="font-weight: bold;">Seg</div>
            <div style="font-weight: bold;">Ter</div>
            <div style="font-weight: bold;">Qua</div>
            <div style="font-weight: bold;">Qui</div>
            <div style="font-weight: bold;">Sex</div>
            <div style="font-weight: bold;">Sáb</div>
    `;
    
    // Primeiro dia do mês
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    
    // Dias vazios antes do primeiro dia
    for (let i = 0; i < firstDay; i++) {
        html += '<div></div>';
    }
    
    // Dias do mês
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear, currentMonth, day);
        const dateStr = formatDateInput(date);
        const isDisabled = !isFutureDate(date) || !isWeekday(date);
        const isSelected = bookingData.date === dateStr;
        
        html += `
            <div class="calendar-day ${isDisabled ? 'disabled' : ''} ${isSelected ? 'selected' : ''}"
                 onclick="${isDisabled ? '' : `selectDate('${dateStr}')`}">
                ${day}
            </div>
        `;
    }
    
    html += '</div>';
    calendar.innerHTML = html;
}

// Mudar Mês (funcionalidade simplificada - apenas visualização)
function changeMonth(direction) {
    showNotification('Funcionalidade de navegação entre meses em desenvolvimento', 'info');
}

// Selecionar Data
function selectDate(dateStr) {
    bookingData.date = dateStr;
    loadCalendar();
    loadTimeSlots(dateStr);
}

// Carregar Horários
function loadTimeSlots(date) {
    const slots = generateTimeSlots();
    const timeSlotsDiv = document.getElementById('timeSlots');
    
    // Buscar agendamentos existentes
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const bookedSlots = appointments
        .filter(a => a.doctorId === bookingData.doctor.id && a.date === date && a.status !== 'cancelada')
        .map(a => a.time);
    
    timeSlotsDiv.innerHTML = slots.map(slot => {
        const isBooked = bookedSlots.includes(slot);
        const isSelected = bookingData.time === slot;
        
        return `
            <div class="time-slot ${isBooked ? 'disabled' : ''} ${isSelected ? 'selected' : ''}"
                 onclick="${isBooked ? '' : `selectTime('${slot}')`}">
                ${slot}
            </div>
        `;
    }).join('');
}

// Selecionar Horário
function selectTime(time) {
    bookingData.time = time;
    loadTimeSlots(bookingData.date);
    goToStep(4);
    showSummary();
}

// Mostrar Resumo
function showSummary() {
    document.getElementById('summarySpecialty').textContent = bookingData.specialty.name;
    document.getElementById('summaryDoctor').textContent = bookingData.doctor.name;
    document.getElementById('summaryDate').textContent = formatDate(bookingData.date);
    document.getElementById('summaryTime').textContent = bookingData.time;
}

// Navegar entre Steps
function goToStep(step) {
    // Esconder todos os steps
    for (let i = 1; i <= 4; i++) {
        document.getElementById(`step${i}`).classList.remove('active');
    }
    
    // Mostrar step atual
    document.getElementById(`step${step}`).classList.add('active');
    currentStep = step;
}

// Confirmar Agendamento
function confirmBooking() {
    const user = getCurrentUser();
    
    if (!bookingData.specialty || !bookingData.doctor || !bookingData.date || !bookingData.time) {
        showNotification('Dados incompletos para agendamento', 'error');
        return;
    }
    
    // Criar agendamento
    const appointment = {
        id: Date.now(),
        patientId: user.id,
        patientName: user.name,
        patientEmail: user.email,
        patientPhone: user.phone,
        specialty: bookingData.specialty.name,
        specialtyId: bookingData.specialty.id,
        doctorId: bookingData.doctor.id,
        doctorName: bookingData.doctor.name,
        doctorCRM: bookingData.doctor.crm,
        date: bookingData.date,
        time: bookingData.time,
        status: 'agendada',
        createdAt: new Date().toISOString()
    };
    
    // Salvar no localStorage
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    appointments.push(appointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));
    
    // Mostrar modal de sucesso
    const modal = document.getElementById('successModal');
    modal.classList.add('active');
    
    // Resetar dados
    bookingData = {
        specialty: null,
        doctor: null,
        date: null,
        time: null
    };
}

// Fechar Modal
function closeModal() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('active');
    window.location.href = 'meus-agendamentos.html';
}
