# 📈 Gerenciador de Investimentos / Investment Manager

> 🇧🇷 Português abaixo · 🇬🇧 English below

---

## 🇧🇷 Português (Brasil)

### Sobre o Projeto

Um sistema web de **gerenciamento de investimentos** com três perfis de acesso distintos: **Gerente**, **Cliente** e **Pagador**. A aplicação foi criada para operações de investimento privadas onde um gestor administra os recursos de múltiplos clientes, com rendimentos configuráveis por frequência (semanal, quinzenal ou mensal), e um pagador acompanha os repasses devidos.

Desenvolvido com **React + TypeScript + Vite** e integrado ao **Firebase** (autenticação e banco de dados em tempo real). O sistema conta com cálculo automático de **juros compostos**, projeções de crescimento e alertas visuais de vencimento.

---

### 👥 Perfis de Acesso

O sistema possui três papéis com permissões completamente diferentes:

#### 🧑‍💼 Gerente (`manager`)
É o administrador do sistema. Tem controle total sobre os clientes e seus investimentos.

#### 👤 Cliente (`client`)
Acesso somente leitura ao próprio painel. Visualiza o crescimento do seu patrimônio sem poder fazer alterações.

#### 💳 Pagador (`payer`)
Acessa uma visão consolidada de todos os clientes vinculados ao gerente, para acompanhar os repasses que precisam ser realizados.

---

### ✨ Funcionalidades por Perfil

#### 🧑‍💼 Painel do Gerente

**Visão Geral (Dashboard)**
- Cards de resumo: total de clientes, patrimônio total sob gestão e rentabilidade média
- Tabela de clientes com: valor investido, saldo atual com juros compostos, taxa de rendimento, frequência e data do próximo pagamento
- Indicadores visuais de status de pagamento: ✅ Pago · ⚠️ Próximo · 🔴 Vencido (com animação pulsante)
- Busca de clientes por nome ou e-mail

**Adicionar Cliente**
- Vinculação por e-mail (o cliente precisa ter conta criada previamente)
- Configuração individual de taxa de rendimento (%)
- Escolha de frequência de pagamento: **Mensal**, **Quinzenal** ou **Semanal**
- Definição do dia de pagamento (dia do mês para mensal, dia da semana para semanal)

**Configurações do Pagador**
- Campo para vincular um pagador por e-mail
- Definição de uma **taxa global semanal** que sobrepõe as taxas individuais na visão do pagador

**Gerenciamento Individual de Cliente** (tela dedicada)
- Cards de resumo: saldo atual, total investido, previsão do próximo período
- Gráfico de área interativo com evolução do saldo (histórico + projeção)
- Registro de **depósitos** com valor e data
- Registro de **pagamentos/saques** com valor e data
- Edição de transações existentes (depósitos e pagamentos)
- Exclusão de transações com confirmação
- Alteração de taxa, frequência e dia de pagamento do cliente
- Histórico completo de movimentações

#### 👤 Painel do Cliente

- Saudação personalizada com nome do cliente
- Indicador de status do próximo pagamento no topo
- 3 cards principais:
  - **Saldo Atual** — com juros compostos acumulados e taxa configurada
  - **Total Investido** — soma de todos os aportes
  - **Previsão do Próximo Período** — lucro estimado e total projetado
- **Gráfico de crescimento** com os últimos 6 meses reais e 6 meses de projeção futura, com linha de referência "Hoje"
- Histórico de atividades: todos os aportes e pagamentos em ordem cronológica
- Interface somente leitura — o cliente não pode alterar nada

#### 💳 Painel do Pagador

- Visão consolidada de todos os clientes gerenciados
- 3 cards de resumo: total de clientes, capital total sob gestão, total de repasses da semana
- Exibição da **taxa global semanal** definida pelo gerente
- Tabela com: nome do cliente, capital (saldo atual), valor do repasse semanal, data do próximo pagamento e status
- Status visual de cada pagamento: Aguardando · Próximo · Vencido · Pago
- Busca por nome ou e-mail

---

### 🧮 Lógica Financeira

- **Juros Compostos** — o rendimento é calculado com `valor × (1 + taxa%)^períodos`, onde os períodos são contados por semanas, quinzenas ou meses desde cada depósito
- **Saldo atual** — soma dos juros compostos de todos os depósitos, descontados os saques/pagamentos registrados
- **Projeção** — saldo atual × (1 + taxa%) para o próximo período
- **Status de pagamento** — calculado com base na data do último pagamento registrado vs. a data esperada do ciclo atual

---

### 🔐 Autenticação e Segurança

- Login e cadastro por e-mail e senha (Firebase Auth)
- Ao criar a conta, o usuário escolhe seu papel: Gerente, Cliente ou Pagador
- Cada usuário só acessa os dados permitidos para o seu papel
- Regras de segurança do Firestore garantem isolamento entre usuários

#### Regras do Firestore incluídas (`firestore.rules`)

O repositório já inclui um arquivo `firestore.rules` configurado para proteger os dados.

---

### 🛠️ Tecnologias Utilizadas

| Tecnologia | Uso |
|---|---|
| [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) | Interface e lógica da aplicação |
| [Vite](https://vitejs.dev/) | Build tool e servidor de desenvolvimento |
| [Tailwind CSS](https://tailwindcss.com/) | Estilização |
| [Firebase Auth](https://firebase.google.com/docs/auth) | Autenticação de usuários |
| [Firebase Firestore](https://firebase.google.com/docs/firestore) | Banco de dados em tempo real |
| [Recharts](https://recharts.org/) | Gráficos interativos |
| [Motion (Framer Motion)](https://motion.dev/) | Animações de interface |
| [date-fns](https://date-fns.org/) | Manipulação de datas |
| [Lucide React](https://lucide.dev/) | Ícones |

---

### 🚀 Como Rodar Localmente

**Pré-requisitos:** Node.js instalado

1. Clone o repositório:
   ```bash
   git clone https://github.com/HerminioHenrique/Gerenciador-de-investimentos.git
   cd Gerenciador-de-investimentos
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente. Crie um arquivo `.env.local` na raiz do projeto com base no `.env.example`:
   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```

4. Rode o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

5. Acesse `http://localhost:5173` no navegador.

> ⚠️ **Importante:** O arquivo `.env.local` nunca deve ser commitado. Ele já está no `.gitignore`.

---

### 📁 Estrutura do Projeto

```
src/
  components/
    Login.tsx              → Tela de login/cadastro com seleção de papel
    Layout.tsx             → Layout com navbar e menu de usuário
    ManagerDashboard.tsx   → Painel principal do gerente (lista de clientes)
    ClientManagement.tsx   → Gerenciamento detalhado de um cliente
    ClientDashboard.tsx    → Painel somente-leitura do cliente
    PayerDashboard.tsx     → Painel do pagador com visão de repasses
    ErrorBoundary.tsx      → Tratamento global de erros de renderização
  utils/
    calculations.ts        → Lógica de juros compostos e cálculo de stats
    errorHandlers.ts       → Tratamento padronizado de erros do Firestore
  types.ts                 → Tipagens TypeScript (UserProfile, Deposit, Payment...)
  firebase.ts              → Inicialização do Firebase
  App.tsx                  → Componente raiz com roteamento por papel
  main.tsx                 → Entry point da aplicação
```

---

### 📋 Estrutura do Firestore

```
users/
  {uid}  →  { uid, email, name, role, interestRate?, paymentDay?,
              paymentFrequency?, managerId?, payerEmail?,
              globalInterestRate?, createdAt }

deposits/
  {id}   →  { clientId, clientEmail, managerId, payerEmail,
              amount, date }

payments/
  {id}   →  { clientId, clientEmail, managerId, payerEmail,
              amount, date, type? }
```

---

---

## 🇬🇧 English

### About the Project

A web-based **investment management system** with three distinct access profiles: **Manager**, **Client**, and **Payer**. The application was built for private investment operations where a manager oversees the funds of multiple clients, with configurable yield frequencies (weekly, biweekly, or monthly), and a payer monitors the disbursements due.

Built with **React + TypeScript + Vite** and integrated with **Firebase** (authentication and real-time database). The system features automatic **compound interest** calculations, growth projections, and visual payment status alerts.

---

### 👥 Access Profiles

The system has three roles with completely different permissions:

#### 🧑‍💼 Manager (`manager`)
The system administrator. Has full control over clients and their investments.

#### 👤 Client (`client`)
Read-only access to their own dashboard. Views the growth of their portfolio without being able to make any changes.

#### 💳 Payer (`payer`)
Accesses a consolidated view of all clients linked to the manager, to track disbursements that need to be made.

---

### ✨ Features by Profile

#### 🧑‍💼 Manager Panel

**Overview (Dashboard)**
- Summary cards: total clients, total assets under management, and average yield rate
- Client table with: amount invested, current balance with compound interest, yield rate, frequency, and next payment date
- Visual payment status indicators: ✅ Paid · ⚠️ Upcoming · 🔴 Overdue (with pulsing animation)
- Client search by name or email

**Add Client**
- Link by email (the client must have a pre-existing account)
- Individual yield rate configuration (%)
- Payment frequency choice: **Monthly**, **Biweekly**, or **Weekly**
- Payment day definition (day of the month for monthly, day of the week for weekly)

**Payer Settings**
- Field to link a payer by email
- Definition of a **global weekly rate** that overrides individual rates in the payer's view

**Individual Client Management** (dedicated screen)
- Summary cards: current balance, total invested, next period projection
- Interactive area chart showing balance history and future projections
- Register **deposits** with amount and date
- Register **payments/withdrawals** with amount and date
- Edit existing transactions (deposits and payments)
- Delete transactions with confirmation
- Change client's rate, frequency, and payment day
- Full transaction history

#### 👤 Client Panel

- Personalized greeting with the client's name
- Next payment status indicator at the top
- 3 main cards:
  - **Current Balance** — with accumulated compound interest and configured rate
  - **Total Invested** — sum of all contributions
  - **Next Period Projection** — estimated profit and projected total
- **Growth chart** showing the past 6 real months and 6 months of future projection, with a "Today" reference line
- Activity history: all deposits and payments in chronological order
- Read-only interface — the client cannot change anything

#### 💳 Payer Panel

- Consolidated view of all managed clients
- 3 summary cards: total clients, total capital under management, total weekly disbursements
- Display of the **global weekly rate** set by the manager
- Table with: client name, capital (current balance), weekly disbursement amount, next payment date, and status
- Visual status for each payment: Waiting · Upcoming · Overdue · Paid
- Search by name or email

---

### 🧮 Financial Logic

- **Compound Interest** — yield is calculated as `amount × (1 + rate%)^periods`, where periods are counted in weeks, biweeks, or months since each deposit
- **Current balance** — sum of compound interest across all deposits, minus registered withdrawals/payments
- **Projection** — current balance × (1 + rate%) for the next period
- **Payment status** — calculated based on the last registered payment date vs. the expected date in the current cycle

---

### 🔐 Authentication & Security

- Email and password login/signup (Firebase Auth)
- When creating an account, the user chooses their role: Manager, Client, or Payer
- Each user only accesses data permitted for their role
- Firestore security rules ensure isolation between users

#### Included Firestore Rules (`firestore.rules`)

The repository already includes a `firestore.rules` file configured to protect the data.

---

### 🛠️ Technologies Used

| Technology | Usage |
|---|---|
| [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) | UI and application logic |
| [Vite](https://vitejs.dev/) | Build tool and dev server |
| [Tailwind CSS](https://tailwindcss.com/) | Styling |
| [Firebase Auth](https://firebase.google.com/docs/auth) | User authentication |
| [Firebase Firestore](https://firebase.google.com/docs/firestore) | Real-time database |
| [Recharts](https://recharts.org/) | Interactive charts |
| [Motion (Framer Motion)](https://motion.dev/) | UI animations |
| [date-fns](https://date-fns.org/) | Date manipulation |
| [Lucide React](https://lucide.dev/) | Icons |

---

### 🚀 How to Run Locally

**Prerequisites:** Node.js installed

1. Clone the repository:
   ```bash
   git clone https://github.com/HerminioHenrique/Gerenciador-de-investimentos.git
   cd Gerenciador-de-investimentos
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables. Create a `.env.local` file at the root of the project based on `.env.example`:
   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open `http://localhost:5173` in your browser.

> ⚠️ **Important:** The `.env.local` file should never be committed. It is already listed in `.gitignore`.

---

### 📁 Project Structure

```
src/
  components/
    Login.tsx              → Login/signup screen with role selection
    Layout.tsx             → Layout with navbar and user menu
    ManagerDashboard.tsx   → Manager's main panel (client list)
    ClientManagement.tsx   → Detailed management of a single client
    ClientDashboard.tsx    → Read-only client panel
    PayerDashboard.tsx     → Payer panel with disbursement overview
    ErrorBoundary.tsx      → Global render error handling
  utils/
    calculations.ts        → Compound interest logic and stats calculation
    errorHandlers.ts       → Standardized Firestore error handling
  types.ts                 → TypeScript types (UserProfile, Deposit, Payment...)
  firebase.ts              → Firebase initialization
  App.tsx                  → Root component with role-based routing
  main.tsx                 → Application entry point
```

---

### 📋 Firestore Data Structure

```
users/
  {uid}  →  { uid, email, name, role, interestRate?, paymentDay?,
              paymentFrequency?, managerId?, payerEmail?,
              globalInterestRate?, createdAt }

deposits/
  {id}   →  { clientId, clientEmail, managerId, payerEmail,
              amount, date }

payments/
  {id}   →  { clientId, clientEmail, managerId, payerEmail,
              amount, date, type? }
```
