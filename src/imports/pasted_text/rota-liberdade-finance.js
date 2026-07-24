Atualize a aplicação Web SPA "A ROTA DA LIBERDADE" (desenvolvida em HTML/CSS/Tailwind CSS e JavaScript/React) com um novo motor financeiro dinâmico focado em gestão temporal mês a mês, cálculo de porcentagens e progresso de metas baseado na idade do usuário.

---

### 1. AUTENTICAÇÃO, TELA DE BLOQUEIO & DADOS PESSOAIS
- **Proprietário:** Matheus Pires
- **Data de Nascimento:** 12/11/2006 (O sistema DEVE calcular a idade atual exata dinamicamente).
- **Lock Screen Estilo Windows:** Fundo com wallpapers de alta definição que trocam conforme o horário do dia (Manhã, Tarde, Noite, Madrugada) com relógio digital e saudações personalizadas.
- **Controle de Acesso:**
  - Senha `mathe0us` $\rightarrow$ **MODO ADMINISTRADOR**. Permite lançar aportes, editar metas, alterar estados e **sincroniza tudo em tempo real no Firebase Firestore**.
  - Qualquer outra senha / "Modo Visitante" $\rightarrow$ **MODO VISITANTE (Sandbox)**. Permite testar todas as telas e botões, mas salva alterações exclusivamente no `localStorage` do navegador do visitante.

---

### 2. MÓDULO TEMPORAL "MÊS A MÊS" (HISTÓRICO VIVO)

#### A. Seletor de Período
- No topo do Dashboard, inclua um seletor de mês/ano no formato: `< [ Julho / 2026 ] >` (com botões de avançar e voltar).
- Ao selecionar um mês anterior, o site exibe o **histórico congelado** daquele mês (quanto foi ganho, quanto foi aportado em cada caixinha e quais metas foram atingidas).

#### B. Painel do Mês Atual (Workflow de Lançamento)
Exibir um card interativo com o seguinte fluxo:

1. **Switch de Status da Faculdade:**
   - Toggle `[ ] Faculdade Concluída?` (Sim / Não).

2. **Lógica para SE "FACULDADE NÃO CONCLUÍDA" (Fase Atual):**
   - Exibe o campo: *"Quanto sobrou do salário para aportar este mês? (R$)"*.
   - Ao digitar o valor (ex: R$ 350,00), o sistema calcula e exibe automaticamente em tempo real a divisão exata com base nas % predefinidas:
     - 🏢 **32%** — FIIs (MXRF11)
     - ⚙️ **24%** — Caixinha Moto (Lander)
     - 🛡️ **16%** — Reserva de Emergência (CDB 120% CDI)
     - 🪵 **12%** — Fundo Cabana São Dimas (CDB 120% CDI)
     - ⛺ **8%** — Fundo Viagens
     - 📚 **8%** — Lazer, Livros & Mente

3. **Lógica para SE "FACULDADE CONCLUÍDA":**
   - Fixa automaticamente o salário base de aceleração (Padrão: R$ 2.500,00 ou R$ 3.500,00, com opção de edição caso receba aumento).
   - Se o toggle `[X] Moto Quitada` estiver ativo, o sistema aplica a **Regra da Virada**: os 24% da moto são somados ao Fundo Cabana (subindo o Fundo Cabana para **36%** do orçamento).

4. **Confirmação do Mês:**
   - Pergunta: *"Aportes deste mês realizados com sucesso?"* `[ Confirmar e Salvar Mês ]`.
   - Ao clicar:
     - Grava os dados daquele mês no histórico do Firebase.
     - Incrementa o contador geral (ex: *"5 Meses Concluídos na Jornada"*).
     - Soma os valores aos saldos acumulados de cada caixinha.

---

### 3. METAS, VALORES ESTIMADOS (R$) E PROGRESSO VS. IDADE

O site deve calcular o progresso individual e geral com base no saldo acumulado no histórico vs. os preços estimados dos objetivos:

1. **Tiros de Lucidez (Pico do Agudo / Uruguai):**
   - Preço Alvo: R$ 2.000,00 | Meta de Idade: **19–21 Anos** | `[Progresso %]`
2. **Terreno + Construção Cabana São Dimas:**
   - Preço Alvo: R$ 120.000,00 (Ajustável) | Meta de Idade: **32 Anos** | `[Progresso %]`
3. **Upgrade Big Trail (V-Strom 650):**
   - Preço Alvo: R$ 45.000,00 | Meta de Idade: **30–32 Anos** | `[Progresso %]`
4. **Liberdade Financeira (FIIs Renda Passiva):**
   - Preço Alvo: R$ 300.000,00 | Meta de Idade: **40 Anos** | `[Progresso %]`
5. **Grandes Expedições Globais (Atacama, Escócia, NZ, EUA):**
   - Preço Alvo: R$ 50.000,00 | Meta de Idade: **40 Anos** | `[Progresso %]`

- **Display de Progresso:** Cada card de objetivo deve exibir a frase: `"Você está a X% de conquistar este objetivo (Meta: XX Anos)"`, atualizado automaticamente a cada mês concluído.

---

### 4. DASHBOARDS E GRÁFICOS
- **Gráfico de Evolução:** Gráfico de linha/barras (Chart.js ou Recharts) mostrando o crescimento do Patrimônio Total mês a mês.
- **Gráfico "Aonde Foi o Dinheiro":** Gráfico de rosca/pizza mostrando a soma histórica total de quanto já foi aportado em cada categoria.

---

### 5. INTEGRAÇÃO COM FIREBASE (FIRESTORE)

Utilize as credenciais abaixo para salvar o estado global e a coleção de meses no Firestore:

```javascript
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDeuubrFek-3cY5BSFSM2ZdDv_6YeVZpQY",
  authDomain: "liberdade-a20f7.firebaseapp.com",
  projectId: "liberdade-a20f7",
  storageBucket: "liberdade-a20f7.firebasestorage.app",
  messagingSenderId: "451530474024",
  appId: "1:451530474024:web:e7caff92f6f4782fa26b1d",
  measurementId: "G-2F0CC1T8JX"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);