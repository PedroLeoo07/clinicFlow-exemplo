// ==================== UTILIDADES GLOBAIS ====================

// Formatar CPF
function formatCPF(value) {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
}

// Formatar Telefone
function formatPhone(value) {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');
}

// Formatar Data para Exibição
function formatDate(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
}

// Formatar Data para Input
function formatDateInput(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Validar Email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validar CPF
function validateCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11) return false;
    
    // Validação básica (não verifica dígitos verificadores)
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    return true;
}

// Mostrar Notificação
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-times-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Adicionar estilos inline
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInRight 0.3s;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-weight: 500;
    `;
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Verificar Autenticação
function checkAuth(requiredRole = null) {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    if (!user) {
        window.location.href = '../index.html';
        return null;
    }
    
    if (requiredRole && user.role !== requiredRole) {
        showNotification('Você não tem permissão para acessar esta página', 'error');
        setTimeout(() => {
            if (user.role === 'paciente') {
                window.location.href = 'marcar-consulta.html';
            } else {
                window.location.href = 'painel-medico.html';
            }
        }, 2000);
        return null;
    }
    
    return user;
}

// Logout
function logout() {
    if (confirm('Deseja realmente sair?')) {
        localStorage.removeItem('currentUser');
        showNotification('Logout realizado com sucesso', 'success');
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1000);
    }
}

// Inicializar Dados de Demonstração
function initializeDemoData() {
    if (!localStorage.getItem('users')) {
        const demoUsers = [
            {
                id: 1,
                name: 'Paciente Demo',
                email: 'paciente@clinicflow.com',
                password: '123456',
                cpf: '12345678900',
                phone: '11999999999',
                role: 'paciente',
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                name: 'Dr. João Silva',
                email: 'joao@clinicflow.com',
                password: '123456',
                role: 'medico',
                specialty: 'Cardiologia',
                crm: 'CRM/SP 123456'
            },
            {
                id: 3,
                name: 'Dra. Maria Santos',
                email: 'maria@clinicflow.com',
                password: '123456',
                role: 'medico',
                specialty: 'Dermatologia',
                crm: 'CRM/SP 234567'
            },
            {
                id: 4,
                name: 'Ana Secretária',
                email: 'ana@clinicflow.com',
                password: '123456',
                role: 'secretaria'
            }
        ];
        localStorage.setItem('users', JSON.stringify(demoUsers));
    }
    
    if (!localStorage.getItem('specialties')) {
        const specialties = [
            { id: 1, name: 'Cardiologia', icon: 'fa-heart-pulse' },
            { id: 2, name: 'Dermatologia', icon: 'fa-hand-dots' },
            { id: 3, name: 'Ortopedia', icon: 'fa-bone' },
            { id: 4, name: 'Pediatria', icon: 'fa-baby' },
            { id: 5, name: 'Neurologia', icon: 'fa-brain' },
            { id: 6, name: 'Oftalmologia', icon: 'fa-eye' }
        ];
        localStorage.setItem('specialties', JSON.stringify(specialties));
    }
    
    if (!localStorage.getItem('doctors')) {
        const doctors = [
            {
                id: 1,
                name: 'Dr. João Silva',
                specialty: 'Cardiologia',
                specialtyId: 1,
                crm: 'CRM/SP 123456',
                available: true
            },
            {
                id: 2,
                name: 'Dra. Maria Santos',
                specialty: 'Dermatologia',
                specialtyId: 2,
                crm: 'CRM/SP 234567',
                available: true
            },
            {
                id: 3,
                name: 'Dr. Carlos Oliveira',
                specialty: 'Ortopedia',
                specialtyId: 3,
                crm: 'CRM/SP 345678',
                available: true
            },
            {
                id: 4,
                name: 'Dra. Ana Paula',
                specialty: 'Pediatria',
                specialtyId: 4,
                crm: 'CRM/SP 456789',
                available: true
            }
        ];
        localStorage.setItem('doctors', JSON.stringify(doctors));
    }
}

// Gerar Horários Disponíveis
function generateTimeSlots() {
    const slots = [];
    const startHour = 8;
    const endHour = 18;
    
    for (let hour = startHour; hour < endHour; hour++) {
        slots.push(`${String(hour).padStart(2, '0')}:00`);
        slots.push(`${String(hour).padStart(2, '0')}:30`);
    }
    
    return slots;
}

// Verificar se Data é Futura
function isFutureDate(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate >= today;
}

// Verificar se Data é Dia Útil
function isWeekday(date) {
    const day = new Date(date).getDay();
    return day !== 0 && day !== 6; // 0 = Domingo, 6 = Sábado
}

// Carregar Usuário Atual
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
}

// Atualizar Nome do Usuário na Navbar
function updateUserName() {
    const user = getCurrentUser();
    const userNameElement = document.getElementById('userName');
    if (userNameElement && user) {
        userNameElement.textContent = user.name;
    }
}

// Inicializar dados ao carregar
if (typeof window !== 'undefined') {
    initializeDemoData();
}

// Adicionar estilos para notificações
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}
