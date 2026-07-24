
# Dashboard A Rota da Liberdade 🗺️💰

Um dashboard interativo para rastrear metas financeiras, expedições e milestones de vida. Construído com **React**, **Vite**, **TailwindCSS** e sincronização em tempo real com **Firebase Firestore**.

**🌐 [Acesse o site ao vivo aqui](https://MatheusPiresDEV.github.io/Liberdade/)**

---

## 🎯 O que é?

Este dashboard é um planejador de vida e investimentos que acompanha:

- **💰 Metas Financeiras**
  - Liberdade Financeira (FIIs - Renda Passiva)
  - Terreno + Cabana em São Dimas
  - Upgrade Big Trail (V-Strom 650)
  - Fundo de Viagens e Expedições

- **🗺️ Expedições e Marcos**
  - Pico do Agudo (Tiro de Lucidez)
  - Cruzar fronteira do Uruguai de moto
  - Grandes expedições globais (Atacama, Escócia, NZ, EUA)

- **📊 Alocação de Recursos**
  - FIIs (32%) | Caixinha Moto (24%) | Reserva (16%)
  - Fundo Cabana (12%) | Viagens (8%) | Lazer (8%)

- **📅 Histórico Mensal**
  - Aportes, confirmações e progresso por mês
  - Sincronização em tempo real com Firebase

---

## 🔧 Tecnologias

| Stack | Versão |
|-------|--------|
| **React** | 18.3.1 |
| **Vite** | 6.3.5 |
| **TypeScript** | Latest |
| **TailwindCSS** | 4.1.12 |
| **Firebase** | 12.16.0 |
| **Recharts** | 2.15.2 |
| **Radix UI** | Latest |

---

## 🔐 Autenticação

Dois modos de acesso:

### Usuário Normal
- Visualiza dados
- Sem permissão de edição

### Admin (Modo Administrador)
- **Senha:** `mathe0us`
- Permissões:
  - ✏️ Editar metas e aportes
  - 📝 Alterar estados de milestones
  - 🔄 Sincroniza em tempo real no Firestore
  - 🗂️ Grava histórico mensal

---

## 🚀 Como Usar

### Instalação Local

```bash
# 1. Instale as dependências
npm install

# 2. Inicie o servidor de desenvolvimento
npm run dev

# O site abrirá em http://localhost:5173
```

### Build para Produção

```bash
npm run build

# A pasta 'dist/' contém os arquivos estáticos prontos para deploy
```

---

## 🔥 Firebase Firestore

O projeto está **100% conectado e sincronizado** com Firebase Firestore em tempo real.

### Configuração ✅ Ativa

```typescript
Firebase Project: liberdade-a20f7
Auth Domain: liberdade-a20f7.firebaseapp.com
Database: Cloud Firestore (Tempo Real)
Storage: Firebase Storage
```

### Dados Sincronizados

Quando logado como **Admin**:
- Alterações são salvas **instantaneamente** no Firestore
- Histórico mensal é gravado automaticamente
- Dados persistem entre sessões

---

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── App.tsx                 # Componente principal
│   ├── Layout.tsx              # Layout geral
│   ├── data.ts                 # Configuração Firebase + constantes
│   ├── routes.ts               # Definição de rotas
│   ├── context.tsx             # Context API (estado global)
│   ├── components.tsx           # Componentes customizados
│   ├── pages/
│   │   ├── Home.tsx            # Dashboard principal
│   │   ├── Expedicoes.tsx      # Expedições e destinos
│   │   ├── Graficos.tsx        # Gráficos e análises
│   │   ├── Metas.tsx           # Metas financeiras
│   │   ├── Marcos.tsx          # Milestones de vida
│   │   └── Mes.tsx             # Histórico mensal
│   └── components/
│       ├── figma/              # Componentes do Figma
│       └── ui/                 # Componentes Radix UI + shadcn
└── styles/
    ├── globals.css
    ├── tailwind.css
    └── theme.css
```

---

## 📊 Páginas Principais

| Página | Descrição |
|--------|-----------|
| **Home** | Dashboard geral com metas, progresso e estatísticas |
| **Metas** | Detalhes e edição de metas financeiras |
| **Expedições** | Destinos, marcos e planejamento de viagens |
| **Gráficos** | Análises visuais de alocação e progresso |
| **Marcos** | Checklist de milestones de vida |
| **Mês** | Histórico mensal de aportes e confirmações |

---

## 🎨 Tema e Design

- **Design System:** Figma → código (Auto-generated)
- **Paleta:** Dark Mode (Tema escuro customizado)
- **Componentes:** Radix UI + shadcn/ui
- **Animações:** Motion.js + TailwindCSS animations

---

## 📝 Variáveis de Ambiente

Não é necessário configurar `.env` - o Firebase está pré-configurado no código:

```typescript
// src/app/data.ts
const firebaseConfig = {
  apiKey: "AIzaSyDeuubrFek-...",
  authDomain: "liberdade-a20f7.firebaseapp.com",
  projectId: "liberdade-a20f7",
  // ... resto das credenciais
};
```

⚠️ **Nota:** Em um projeto real, essas credenciais deveriam estar em `.env.local`.

---

## 🚀 Deploy

Hospedado em **GitHub Pages** com CI/CD automático:

- **URL:** `https://MatheusPiresDEV.github.io/Liberdade/`
- **Build:** Automático a cada push para `main`
- **Base Path:** `/Liberdade/` (configurado no Vite)

---

## 🐛 Troubleshooting

**Problema:** Dados não sincronizam com Firebase
- ✅ Verifique se está logado como Admin (`mathe0us`)
- ✅ Confirme conexão com internet
- ✅ Abra Console (F12) para ver erros

**Problema:** Página em branco
- ✅ Execute `npm install` novamente
- ✅ Delete a pasta `node_modules` e `.next` e reinstale
- ✅ Limpe o cache do navegador

---

## 📞 Informações

- **Projeto Original (Figma):** [Dashboard A ROTA DA LIBERDADE](https://www.figma.com/design/3JKyo1yYPMZQFKodcj6i2n/Dashboard-A-ROTA-DA-LIBERDADE)
- **Desenvolvido por:** Matheus Pires
- **Status:** ✅ Ativo e em desenvolvimento

---

## 📄 Licença

Este projeto é privado. Todos os direitos reservados.
  