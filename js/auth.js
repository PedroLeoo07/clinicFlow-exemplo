// ==================== AUTENTICAÇÃO ====================

// Preencher Credenciais de Demonstração
function fillDemoCredentials() {
    document.getElementById('loginEmail').value = 'paciente@clinicflow.com';
    document.getElementById('loginPassword').value = '123456';
    document.getElementById('loginRole').value = 'paciente';
    
    showNotification('Credenciais preenchidas! Clique em Entrar', 'info');
}

// Resetar Sistema
function resetSystem() {
    if (confirm('⚠️ Isso vai limpar todos os dados do sistema. Deseja continuar?')) {
        // Limpar todo o localStorage
        localStorage.clear();
        
        // Reinicializar dados de demonstração
        initializeDemoData();
        
        showNotification('Sistema resetado com sucesso! Tente fazer login novamente.', 'success');
        
        console.log('Sistema resetado. Novos usuários:', JSON.parse(localStorage.getItem('users')));
    }
}

// Alternar entre Login e Cadastro
function toggleForm(formType) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const tabButtons = document.querySelectorAll('.tab-button');
    const body = document.body;
    
    if (formType === 'register') {
        loginForm.classList.remove('active');
        registerForm.classList.add('active');
        tabButtons[0].classList.remove('active');
        tabButtons[1].classList.add('active');
        body.classList.add('register-active');
    } else {
        registerForm.classList.remove('active');
        loginForm.classList.add('active');
        tabButtons[1].classList.remove('active');
        tabButtons[0].classList.add('active');
        body.classList.remove('register-active');
    }
}

// Alternar visibilidade da senha
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const button = input.parentElement.querySelector('.toggle-password i');
    
    if (input.type === 'password') {
        input.type = 'text';
        button.classList.remove('fa-eye');
        button.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        button.classList.remove('fa-eye-slash');
        button.classList.add('fa-eye');
    }
}

// Máscara para CPF
document.addEventListener('DOMContentLoaded', () => {
    const cpfInput = document.getElementById('registerCPF');
    if (cpfInput) {
        cpfInput.addEventListener('input', (e) => {
            e.target.value = formatCPF(e.target.value);
        });
    }
    
    const phoneInput = document.getElementById('registerPhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            e.target.value = formatPhone(e.target.value);
        });
    }
});

// Handle Login
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const role = document.getElementById('loginRole').value;
    
    console.log('Tentando login:', { email, password, role });
    
    // Validações
    if (!email || !password) {
        showNotification('Preencha todos os campos', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showNotification('Email inválido', 'error');
        return;
    }
    
    // Garantir que os dados de demonstração existem
    initializeDemoData();
    
    // Buscar usuários
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    console.log('Usuários cadastrados:', users);
    
    const user = users.find(u => u.email === email && u.password === password && u.role === role);
    console.log('Usuário encontrado:', user);
    
    if (user) {
        // Salvar usuário atual
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        showNotification(`Bem-vindo(a), ${user.name}!`, 'success');
        
        // Redirecionar baseado no role
        setTimeout(() => {
            if (role === 'paciente') {
                window.location.href = 'pages/marcar-consulta.html';
            } else if (role === 'medico' || role === 'secretaria') {
                window.location.href = 'pages/painel-medico.html';
            }
        }, 1000);
    } else {
        showNotification('Email, senha ou tipo de usuário incorretos', 'error');
        console.error('Login falhou. Verifique as credenciais.');
    }
}

// Handle Register
function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const cpf = document.getElementById('registerCPF').value;
    const phone = document.getElementById('registerPhone').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    const termsAccept = document.getElementById('termsAccept').checked;
    
    // Validações
    if (!name || !email || !cpf || !phone || !password) {
        showNotification('Preencha todos os campos', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showNotification('Email inválido', 'error');
        return;
    }
    
    if (!validateCPF(cpf)) {
        showNotification('CPF inválido', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('A senha deve ter pelo menos 6 caracteres', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('As senhas não coincidem', 'error');
        return;
    }
    
    if (!termsAccept) {
        showNotification('Você deve aceitar os termos de uso', 'error');
        return;
    }
    
    // Verificar se email já existe
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const emailExists = users.some(u => u.email === email);
    
    if (emailExists) {
        showNotification('Este email já está cadastrado', 'error');
        return;
    }
    
    // Criar novo usuário
    const newUser = {
        id: Date.now(),
        name,
        email,
        cpf: cpf.replace(/\D/g, ''),
        phone: phone.replace(/\D/g, ''),
        password,
        role: 'paciente',
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    showNotification('Cadastro realizado com sucesso!', 'success');
    
    // Fazer login automático
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    setTimeout(() => {
        window.location.href = 'pages/marcar-consulta.html';
    }, 1500);
}

// Mostrar Termos de Uso
function showTerms() {
    const termsModal = document.createElement('div');
    termsModal.className = 'modal active';
    termsModal.innerHTML = `
        <div class="modal-content large">
            <button class="modal-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
            <h2><i class="fas fa-file-contract"></i> Termos de Uso e Política de Privacidade (LGPD)</h2>
            <div style="max-height: 400px; overflow-y: auto; margin-top: 1rem; line-height: 1.8;">
                <h3>1. Coleta de Dados</h3>
                <p>Coletamos apenas os dados necessários para o agendamento de consultas e manutenção de prontuários médicos.</p>
                
                <h3>2. Uso dos Dados</h3>
                <p>Seus dados serão utilizados exclusivamente para:</p>
                <ul>
                    <li>Agendamento de consultas</li>
                    <li>Manutenção de histórico médico</li>
                    <li>Comunicação sobre consultas</li>
                </ul>
                
                <h3>3. Proteção de Dados</h3>
                <p>Seus dados médicos são protegidos e criptografados, seguindo as normas da LGPD (Lei Geral de Proteção de Dados).</p>
                
                <h3>4. Direitos do Titular</h3>
                <p>Você tem direito a:</p>
                <ul>
                    <li>Acessar seus dados</li>
                    <li>Corrigir dados incorretos</li>
                    <li>Solicitar exclusão de dados</li>
                    <li>Revogar consentimento</li>
                </ul>
                
                <h3>5. Compartilhamento</h3>
                <p>Seus dados não serão compartilhados com terceiros sem seu consentimento explícito.</p>
                
                <h3>6. Segurança</h3>
                <p>Utilizamos medidas técnicas e administrativas para proteger seus dados contra acesso não autorizado.</p>
            </div>
            <div style="margin-top: 1.5rem;">
                <button class="btn btn-primary" onclick="this.closest('.modal').remove()">
                    <i class="fas fa-check"></i> Entendi
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(termsModal);
}

// Verificar se já está logado e inicializar dados
window.addEventListener('DOMContentLoaded', () => {
    // Garantir que os dados de demonstração existem
    initializeDemoData();
    
    console.log('Página carregada. Usuários disponíveis:', JSON.parse(localStorage.getItem('users')));
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    if (currentUser && (window.location.pathname.endsWith('index.html') || window.location.pathname === '/')) {
        // Já está logado, redirecionar
        if (currentUser.role === 'paciente') {
            window.location.href = 'pages/marcar-consulta.html';
        } else {
            window.location.href = 'pages/painel-medico.html';
        }
    }
});
