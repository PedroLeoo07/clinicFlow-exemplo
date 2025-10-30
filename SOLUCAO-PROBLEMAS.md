# 🔧 Guia de Solução de Problemas - ClinicFlow

## ❌ Problema: "Não está entrando no sistema"

### 🔍 Diagnóstico Rápido

1. **Abra o arquivo `teste.html` no navegador**

   - Clique em "1. Inicializar Dados"
   - Clique em "3. Ver Usuários"
   - Verifique se aparecem 4 usuários

2. **Se não aparecer usuários:**
   - Clique em "4. Limpar Tudo"
   - Clique em "1. Inicializar Dados"
   - Clique em "3. Ver Usuários" novamente

### 🛠️ Solução Passo a Passo

#### Opção 1: Usar o Botão de Reset (RECOMENDADO)

1. Abra `index.html`
2. Clique no botão **"Resetar Sistema"** (abaixo do botão azul)
3. Confirme a ação
4. Tente fazer login novamente

#### Opção 2: Limpar Cache do Navegador

1. Pressione `F12` para abrir o DevTools
2. Vá em **Application** (ou Console)
3. No menu lateral, clique em **Local Storage**
4. Clique com botão direito e selecione **Clear**
5. Recarregue a página (`F5`)

#### Opção 3: Usar Console do Navegador

1. Pressione `F12` para abrir o DevTools
2. Vá na aba **Console**
3. Digite e execute:

```javascript
localStorage.clear();
location.reload();
```

### ✅ Credenciais de Teste

Após resetar o sistema, use:

**Paciente:**

- Email: `paciente@clinicflow.com`
- Senha: `123456`
- Tipo: Paciente

**Médico:**

- Email: `joao@clinicflow.com`
- Senha: `123456`
- Tipo: Médico

### 🐛 Debug no Console

Abra o Console (F12) e verifique:

1. **Ver usuários cadastrados:**

```javascript
JSON.parse(localStorage.getItem("users"));
```

2. **Reinicializar dados:**

```javascript
localStorage.clear();
initializeDemoData();
```

3. **Testar login manualmente:**

```javascript
const users = JSON.parse(localStorage.getItem("users"));
const user = users.find(
  (u) =>
    u.email === "paciente@clinicflow.com" &&
    u.password === "123456" &&
    u.role === "paciente"
);
console.log("Usuário encontrado:", user);
```

### 🔴 Erros Comuns

#### 1. "Email inválido"

- ✅ Use o formato correto: `paciente@clinicflow.com`
- ✅ Sem espaços extras

#### 2. "Email, senha ou tipo incorretos"

- ✅ Verifique se selecionou o tipo correto (Paciente/Médico/Secretária)
- ✅ Senha é case-sensitive: `123456`

#### 3. "Página em branco"

- ✅ Verifique se todos os arquivos JS estão na pasta correta
- ✅ Abra o Console (F12) e veja se há erros vermelhos

#### 4. "Botão não funciona"

- ✅ Verifique se o JavaScript está carregado
- ✅ Veja mensagens de erro no Console

### 📁 Estrutura Necessária

Verifique se você tem todos os arquivos:

```
prototipo/
├── index.html
├── teste.html (arquivo de diagnóstico)
├── css/
│   └── styles.css
├── js/
│   ├── auth.js
│   ├── utils.js
│   ├── booking.js
│   ├── appointments.js
│   └── doctor-panel.js
└── pages/
    ├── marcar-consulta.html
    ├── meus-agendamentos.html
    └── painel-medico.html
```

### 🚀 Teste Definitivo

1. **Abra `teste.html` no navegador**
2. Execute os botões na ordem:

   - Botão 4: Limpar Tudo
   - Botão 1: Inicializar Dados
   - Botão 3: Ver Usuários (deve mostrar 4 usuários)
   - Botão 2: Testar Login (deve mostrar sucesso)
   - Botão 5: Ir para Login

3. **Se tudo funcionar no teste.html, o problema é no index.html**
   - Limpe o cache do navegador
   - Reabra o index.html

### 💡 Dica Importante

O sistema usa **LocalStorage** do navegador para armazenar dados. Cada navegador tem seu próprio storage:

- Chrome: storage separado
- Firefox: storage separado
- Edge: storage separado

Se testou em um navegador e não funcionou, tente outro!

### 📞 Última Solução

Se nada funcionar:

1. Feche TODAS as abas do navegador
2. Reabra o navegador
3. Abra `teste.html` primeiro
4. Inicialize os dados
5. Depois abra `index.html`

---

**Lembre-se:** O botão "Resetar Sistema" na tela de login resolve 99% dos problemas! 🎯
