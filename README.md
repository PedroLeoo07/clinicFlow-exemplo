# 🏥 ClinicFlow - Sistema de Gestão de Agendamentos e Prontuários

Sistema web completo para gestão de clínicas médicas, permitindo agendamento online de consultas e gerenciamento digital de prontuários, em conformidade com a LGPD.

## 📋 Funcionalidades

### 👤 Para Pacientes

- ✅ **Cadastro e Login** - Registro seguro com validação de dados
- 📅 **Agendamento de Consultas** - Fluxo intuitivo em 4 etapas:
  1. Escolher especialidade
  2. Selecionar médico
  3. Definir data e horário
  4. Confirmar agendamento
- 📋 **Meus Agendamentos** - Visualização de consultas futuras e históricas
- ❌ **Cancelamento** - Cancelar consultas agendadas

### ⚕️ Para Médicos e Secretárias

- 📊 **Dashboard** - Estatísticas em tempo real
- 📅 **Gestão de Agendamentos** - Visualizar, confirmar e cancelar consultas
- 📝 **Prontuários Digitais** - Criar e gerenciar prontuários médicos
- 🔍 **Filtros Avançados** - Buscar por data e status
- 📈 **Relatórios** - Consultas do dia, semana e pacientes ativos

## 🚀 Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Estilização moderna e responsiva
- **JavaScript (Vanilla)** - Lógica de aplicação
- **LocalStorage** - Persistência de dados no navegador
- **Font Awesome** - Ícones

## 📁 Estrutura do Projeto

```
prototipo/
│
├── index.html                 # Página de login/cadastro
│
├── pages/
│   ├── marcar-consulta.html  # Agendamento de consultas
│   ├── meus-agendamentos.html # Lista de agendamentos do paciente
│   └── painel-medico.html    # Dashboard médico/secretária
│
├── css/
│   └── styles.css            # Estilos globais
│
├── js/
│   ├── auth.js               # Autenticação e cadastro
│   ├── booking.js            # Sistema de agendamento
│   ├── appointments.js       # Gerenciamento de agendamentos (paciente)
│   ├── doctor-panel.js       # Painel médico/secretária
│   └── utils.js              # Funções utilitárias
│
└── .github/
    └── copilot-instructions.md
```

## 🎯 Como Usar

### 1. Abrir o Sistema

- Abra o arquivo `index.html` em um navegador web moderno
- Ou use Live Server no VS Code para melhor experiência

### 2. Criar Conta ou Fazer Login

#### **👤 Usuário Padrão de Demonstração:**

Na tela de login, você verá uma caixa azul com as credenciais prontas:

**Paciente Demo:**

- Email: `paciente@clinicflow.com`
- Senha: `123456`
- Tipo: Paciente

💡 **Dica:** Clique no botão "Preencher Automaticamente" para inserir as credenciais!

#### **Outros Usuários Pré-cadastrados:**

**Médico:**

- Email: `joao@clinicflow.com`
- Senha: `123456`
- Tipo: Médico

**Médica:**

- Email: `maria@clinicflow.com`
- Senha: `123456`
- Tipo: Médico

**Secretária:**

- Email: `ana@clinicflow.com`
- Senha: `123456`
- Tipo: Secretária

**Ou crie uma nova conta de paciente:**

- Clique em "Cadastre-se"
- Preencha todos os campos
- Aceite os termos da LGPD
- Faça login automaticamente

### 3. Fluxo do Paciente

1. **Login** como paciente
2. **Marcar Consulta:**
   - Escolha a especialidade (Cardiologia, Dermatologia, etc.)
   - Selecione o médico desejado
   - Escolha data e horário disponível
   - Confirme o agendamento
3. **Ver Agendamentos:**
   - Acesse "Meus Agendamentos"
   - Veja consultas futuras e passadas
   - Cancele se necessário

### 4. Fluxo do Médico/Secretária

1. **Login** como médico ou secretária
2. **Dashboard:**
   - Veja estatísticas em tempo real
   - Consultas do dia, semana
   - Pacientes ativos
3. **Gerenciar Agendamentos:**
   - Visualize todos os agendamentos
   - Confirme ou cancele consultas
   - Filtre por data e status
4. **Prontuários:**
   - Crie prontuários para consultas
   - Preencha: queixa, exame, diagnóstico, prescrição
   - Consulte prontuários anteriores

## 🔒 Conformidade LGPD

O sistema foi desenvolvido considerando as diretrizes da LGPD:

- ✅ **Consentimento Explícito** - Aceite de termos obrigatório
- ✅ **Transparência** - Política de privacidade clara
- ✅ **Finalidade Específica** - Dados usados apenas para agendamentos e prontuários
- ✅ **Segurança** - Dados armazenados localmente com validação
- ✅ **Direitos do Titular** - Usuário pode acessar e excluir seus dados
- ⚠️ **Nota:** Em produção, usar criptografia e backend seguro

## 💾 Armazenamento de Dados

O sistema utiliza **localStorage** para simular um banco de dados:

- `users` - Usuários cadastrados
- `currentUser` - Usuário logado
- `specialties` - Especialidades médicas
- `doctors` - Médicos cadastrados
- `appointments` - Agendamentos
- `medicalRecords` - Prontuários médicos

## 🎨 Design Responsivo

- ✅ Desktop (1200px+)
- ✅ Tablet (768px - 1199px)
- ✅ Mobile (< 768px)

## 📱 Funcionalidades Técnicas

### Validações Implementadas

- ✅ Email válido
- ✅ CPF (formato e básico)
- ✅ Senha mínima de 6 caracteres
- ✅ Confirmação de senha
- ✅ Máscaras de entrada (CPF, telefone)

### Sistema de Notificações

- ✅ Sucesso (verde)
- ✅ Erro (vermelho)
- ✅ Informação (azul)

### Navegação

- ✅ Sistema de rotas por páginas HTML
- ✅ Verificação de autenticação
- ✅ Controle de acesso por role (paciente/médico/secretária)

## 🔧 Melhorias Futuras (Produção)

Para um sistema em produção, considere:

1. **Backend Real**

   - Node.js + Express ou similar
   - Banco de dados (PostgreSQL, MySQL)
   - API RESTful

2. **Segurança**

   - Hash de senhas (bcrypt)
   - JWT para autenticação
   - HTTPS obrigatório
   - Rate limiting

3. **Funcionalidades Adicionais**

   - Notificações por email/SMS
   - Lembretes de consulta
   - Histórico médico completo
   - Upload de exames
   - Telemedicina
   - Sistema de pagamento
   - Relatórios em PDF

4. **Infraestrutura**
   - Deploy em servidor seguro
   - Backups automáticos
   - Logs de auditoria
   - Monitoramento

## 📄 Licença

Este é um projeto educacional/protótipo. Para uso comercial, implemente as melhorias de segurança necessárias.

## 👨‍💻 Desenvolvimento

Projeto desenvolvido como protótipo de sistema de gestão para clínicas, focando em:

- UX/UI intuitiva
- Conformidade com LGPD
- Código limpo e bem documentado
- Design responsivo
- Acessibilidade

---

**ClinicFlow** - Facilitando a gestão de clínicas e o cuidado com pacientes 🏥💙
