import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc, setDoc, onSnapshot } from "firebase/firestore";

export { setDoc, onSnapshot };

// ─── Firebase ─────────────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyDeuubrFek-3cY5BSFSM2ZdDv_6YeVZpQY",
  authDomain: "liberdade-a20f7.firebaseapp.com",
  projectId: "liberdade-a20f7",
  storageBucket: "liberdade-a20f7.firebasestorage.app",
  messagingSenderId: "451530474024",
  appId: "1:451530474024:web:e7caff92f6f4782fa26b1d",
};
const fbApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(fbApp);
export const firestoreRef = doc(db, "dashboard", "matheus");

// ─── Constants ────────────────────────────────────────────────────────────────
export const ADMIN_PWD = "mathe0us";
export const BIRTH = new Date(2006, 10, 12);
export const LS_KEY = "rotaDaLiberdade_v3";

export const MONTH_NAMES = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro",
];

export const WALLPAPERS: Record<string, string> = {
  madrugada: "https://images.unsplash.com/photo-1595520519880-a86c48ea536c?w=1920&h=1080&fit=crop&auto=format",
  manha:     "https://images.unsplash.com/photo-1582084770885-36767753763d?w=1920&h=1080&fit=crop&auto=format",
  tarde:     "https://images.unsplash.com/photo-1772723686160-fa538b716c17?w=1920&h=1080&fit=crop&auto=format",
  noite:     "https://images.unsplash.com/photo-1760098477277-8f6fc32f2346?w=1920&h=1080&fit=crop&auto=format",
};

export const ALLOC_NORMAL = [
  { key: "fiis",    icon: "🏢", label: "FIIs (MXRF11)",                    pct: 32 },
  { key: "moto",    icon: "⚙️", label: "Caixinha Moto (Lander)",           pct: 24 },
  { key: "reserva", icon: "🛡️", label: "Reserva de Emergência — CDB 120%", pct: 16 },
  { key: "cabana",  icon: "🪵", label: "Fundo Cabana São Dimas — CDB 120%",pct: 12 },
  { key: "viagens", icon: "⛺", label: "Fundo Viagens",                    pct: 8  },
  { key: "lazer",   icon: "📚", label: "Lazer, Livros & Mente",            pct: 8  },
];

export const ALLOC_VIRADA = [
  { key: "fiis",    icon: "🏢", label: "FIIs (MXRF11)",                          pct: 32 },
  { key: "cabana",  icon: "🪵", label: "Fundo Cabana São Dimas — Virada (36%)",  pct: 36 },
  { key: "reserva", icon: "🛡️", label: "Reserva de Emergência — CDB 120%",       pct: 16 },
  { key: "viagens", icon: "⛺", label: "Fundo Viagens",                          pct: 8  },
  { key: "lazer",   icon: "📚", label: "Lazer, Livros & Mente",                  pct: 8  },
];

export const PIE_COLORS: Record<string, string> = {
  fiis: "#e07b39", moto: "#818cf8", reserva: "#4ade80",
  cabana: "#f59e0b", viagens: "#22d3ee", lazer: "#f472b6",
};

export const CAT_LABELS: Record<string, string> = {
  fiis: "FIIs", moto: "Caixinha Moto", reserva: "Reserva",
  cabana: "Fundo Cabana", viagens: "Fundo Viagens", lazer: "Lazer",
};

export const GOALS_DEF = [
  { id: "tiros",     icon: "⛺", name: "Tiros de Lucidez",           sub: "Pico do Agudo / Uruguai",                    defaultTarget: 2000,   ageGoal: "19–21 Anos", key: "viagens" },
  { id: "cabana",    icon: "🪵", name: "Terreno + Cabana São Dimas", sub: "São Dimas, PR",                              defaultTarget: 120000, ageGoal: "32 Anos",    key: "cabana"  },
  { id: "vstrom",    icon: "🏍️", name: "Upgrade Big Trail V-Strom",  sub: "V-Strom 650 — A moto dos sonhos",           defaultTarget: 45000,  ageGoal: "30–32 Anos", key: "moto"    },
  { id: "liberdade", icon: "💰", name: "Liberdade Financeira",       sub: "FIIs — Renda Passiva 100% do custo de vida", defaultTarget: 300000, ageGoal: "40 Anos",    key: "fiis"    },
  { id: "expedicoes",icon: "🗺️", name: "Grandes Expedições Globais", sub: "Atacama, Escócia, NZ, EUA",                  defaultTarget: 50000,  ageGoal: "40 Anos",    key: "viagens" },
] as const;

export const MILESTONES_DEF = [
  { icon: "🎓", label: "MARCO 01 — Concluir Engenharia de Software" },
  { icon: "🏍️", label: "MARCO 02 — Quitar / Finalizar meta da Lander 250" },
  { icon: "⛺", label: "MARCO 03 — Tiro de Lucidez: Acampar no Pico do Agudo (Sapopema)" },
  { icon: "🌎", label: "MARCO 04 — Cruzar a fronteira do Uruguai de moto" },
  { icon: "🪵", label: "MARCO 05 — Comprar terreno no São Dimas e construir a Cabana Rústica (Meta: 32 Anos)" },
  { icon: "🏔️", label: "MARCO 06 — Upgrade para a Big Trail (V-Strom)" },
  { icon: "💰", label: "MARCO 07 — Liberdade Financeira (Renda Passiva cobrindo 100% do custo de vida)" },
  { icon: "🗺️", label: "MARCO 08 — Grandes Expedições Globais: Atacama, Patagônia, Escócia, NZ e EUA (Meta: 40 Anos)" },
];

export const DESTINATIONS = [
  { name: "Pico do Agudo",      loc: "Sapopema, PR",               tag: "PRÓXIMA MISSÃO", tagCls: "bg-amber-500/20 text-amber-400 border-amber-500/30",  img: "https://images.unsplash.com/photo-1622825853012-7ea64affd29a?w=600&h=400&fit=crop&auto=format",  alt: "Topo de montanha com torre metálica" },
  { name: "Cânions do RS",      loc: "Rio Grande do Sul, Brasil",  tag: "BRASIL",         tagCls: "bg-green-500/20 text-green-400 border-green-500/30",  img: "https://images.unsplash.com/photo-1646576166221-ae8dd8472fbc?w=600&h=400&fit=crop&auto=format",  alt: "Vista de vale no sul do Brasil" },
  { name: "Uruguai",            loc: "Fronteira Sul — de moto",    tag: "FRONTEIRA",      tagCls: "bg-blue-500/20 text-blue-400 border-blue-500/30",     img: "https://images.unsplash.com/photo-1494783329112-4a6795291178?w=600&h=400&fit=crop&auto=format",  alt: "Corpo d'água cercado por montanhas" },
  { name: "Atacama",            loc: "Chile",                      tag: "META 40A",       tagCls: "bg-orange-500/20 text-orange-400 border-orange-500/30",img: "https://images.unsplash.com/photo-1510940402025-b2c518ff4085?w=600&h=400&fit=crop&auto=format",  alt: "Formação rochosa no Atacama" },
  { name: "Escócia",            loc: "Highlands Selvagens",        tag: "META 40A",       tagCls: "bg-purple-500/20 text-purple-400 border-purple-500/30",img: "https://images.unsplash.com/photo-1650502389524-2b4a0258d14d?w=600&h=400&fit=crop&auto=format",  alt: "Estrada nas Highlands escocesas" },
  { name: "Nova Zelândia",      loc: "Fiordos do Sul",             tag: "META 40A",       tagCls: "bg-teal-500/20 text-teal-400 border-teal-500/30",     img: "https://images.unsplash.com/photo-1495072667656-424d680e6299?w=600&h=400&fit=crop&auto=format",  alt: "Pico montanhoso na Nova Zelândia" },
  { name: "EUA",                loc: "Route 66 & Parques Nacionais",tag: "META 40A",      tagCls: "bg-red-500/20 text-red-400 border-red-500/30",         img: "https://images.unsplash.com/photo-1707327404225-ab55ca266253?w=600&h=400&fit=crop&auto=format",  alt: "Rodovia no deserto americano" },
];

// ─── Types ────────────────────────────────────────────────────────────────────
export type AllocKey = "fiis" | "moto" | "reserva" | "cabana" | "viagens" | "lazer";

export interface MonthAllocations {
  fiis: number; moto: number; reserva: number;
  cabana: number; viagens: number; lazer: number;
}

export interface MonthRecord {
  yearMonth: string;
  availableAmount: number;
  faculdadeConcluida: boolean;
  motoQuitada: boolean;
  allocations: MonthAllocations;
  confirmed: boolean;
}

export interface GoalTargets {
  tiros: number; cabana: number; vstrom: number;
  liberdade: number; expedicoes: number;
}

export interface AppData {
  faculdadeConcluida: boolean;
  motoQuitada: boolean;
  salary: number;
  months: MonthRecord[];
  milestones: boolean[];
  goalTargets: GoalTargets;
}

export const ZERO_ALLOC: MonthAllocations = { fiis:0, moto:0, reserva:0, cabana:0, viagens:0, lazer:0 };

export const DEFAULT_DATA: AppData = {
  faculdadeConcluida: false,
  motoQuitada: false,
  salary: 2500,
  months: [],
  milestones: Array(8).fill(false),
  goalTargets: { tiros: 2000, cabana: 120000, vstrom: 45000, liberdade: 300000, expedicoes: 50000 },
};

// ─── Utils ────────────────────────────────────────────────────────────────────
export function tod(h: number) {
  if (h < 6) return "madrugada";
  if (h < 12) return "manha";
  if (h < 18) return "tarde";
  return "noite";
}

// ─── Quotes pool ──────────────────────────────────────────────────────────────
export const QUOTES: { text: string; author: string }[] = [
  // Músicas (traduzidas)
  { text: "Ninguém lhe disse quando correr, você perdeu o tiro de largada.", author: "Pink Floyd — Time" },
  { text: "No final, a vida é justa depois de tudo.", author: "Pink Floyd — Pigs (Three Different Ones)" },
  { text: "A minha vida é minha e eu sei como viver.", author: "Black Sabbath — Sabbra Cadabra" },
  { text: "A vida é sua, você a vive do seu jeito!", author: "Black Sabbath — A National Acrobat" },
  { text: "Aonde quer que eu vá, lá eu estou. Onde quer que eu deite a minha cabeça é o meu lar.", author: "Metallica — Wherever I May Roam" },
  { text: "E nada mais importa...", author: "Metallica — Nothing Else Matters" },
  { text: "Se nós escutarmos com muita atenção, a melodia finalmente chegará até nós.", author: "Led Zeppelin — Stairway to Heaven" },
  { text: "Ainda na estrada, deixando para trás os dias que já se foram.", author: "Led Zeppelin — Ramble On" },
  { text: "Lembre-se de onde você veio, não se esqueça de quem você é!", author: "Slayer — Threshold" },
  { text: "Estou caminhando pela estrada, e meu destino me chama.", author: "Pantera — Cemetery Gates" },
  { text: "Abra seus olhos e veja a luz, não viva na escuridão da mente dos outros.", author: "Death — Misanthrope" },
  { text: "Siga em frente pela estrada, independentemente do peso da carga.", author: "Crowbar — Planets Collide" },
  { text: "É uma escolha que você faz, é a vida que você leva.", author: "Anthrax — In the End" },
  { text: "Mantenha seus olhos na estrada e suas mãos no volante.", author: "The Doors — Roadhouse Blues" },
  { text: "Se você procura por encrenca, veio ao lugar certo.", author: "Elvis Presley — Trouble" },
  { text: "Ouvi o trovão rugir — mas eu sei que é apenas o começo.", author: "Creedence Clearwater Revival — Have You Ever Seen the Rain?" },
  { text: "Na estrada aberta, o motor urra e eu sou o dono do meu próprio destino.", author: "Judas Priest — Heading Out to the Highway" },
  { text: "Quebre as correntes e corra livre contra o vento.", author: "Judas Priest — Breaking the Law" },
  { text: "Viva para hoje, pois o amanhã é uma incerteza que você não pode controlar.", author: "Death — Pull the Plug" },
  { text: "Com o coração de um guerreiro e a mente focada, nada pode me parar.", author: "Pantera — Walk" },
  // Filósofos
  { text: "Aquele que tem um 'porquê' para viver pode suportar quase qualquer 'como'.", author: "Friedrich Nietzsche" },
  { text: "A vida não examinada não vale a pena ser vivida.", author: "Sócrates" },
  { text: "Você tem poder sobre sua mente, não sobre eventos externos. Perceba isso e encontrará sua força.", author: "Marco Aurélio" },
  { text: "Nenhum homem é livre se não for senhor de si mesmo.", author: "Epicteto" },
  { text: "Nós somos o que fazemos repetidamente. A excelência não é um ato, mas um hábito.", author: "Aristóteles" },
  { text: "Saber é poder.", author: "Francis Bacon" },
  { text: "Se você quer a paz, prepare-se para a guerra interna contra as suas próprias fraquezas.", author: "Sêneca" },
  { text: "A liberdade é o que você faz com o que foi feito de você.", author: "Jean-Paul Sartre" },
  { text: "A dúvida é o princípio da sabedoria.", author: "René Descartes" },
  { text: "Quem domina os outros é forte; quem domina a si mesmo é poderoso.", author: "Lao Tzu" },
  { text: "A mente que se abre a uma nova ideia jamais voltará ao seu tamanho original.", author: "Albert Einstein" },
  { text: "O homem está condenado a ser livre.", author: "Jean-Paul Sartre" },
  { text: "Na abundância de opções, o sábio escolhe o essencial e ignora o fútil.", author: "Sêneca" },
  { text: "Não é a carga que o derruba, é a forma como você a carrega.", author: "Filosofia Estoica" },
];

export function getRandomQuote(): { text: string; author: string } {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

// ─── Dynamic objective for night greeting ─────────────────────────────────────
// Each entry: if milestone at `milestoneIdx` is NOT yet done → use this phrase
const OBJECTIVE_PHRASES: { milestoneIdx: number; phrase: string }[] = [
  { milestoneIdx: 2, phrase: "O céu estrelado do Pico do Agudo te espera." },
  { milestoneIdx: 3, phrase: "A fronteira do Uruguai está no mapa. Vai lá." },
  { milestoneIdx: 4, phrase: "O terreno do São Dimas ainda aguarda sua assinatura." },
  { milestoneIdx: 5, phrase: "A V-Strom está no horizonte — quase lá." },
  { milestoneIdx: 6, phrase: "A liberdade financeira se aproxima aporte a aporte." },
  { milestoneIdx: 7, phrase: "O Atacama, a Escócia e o mundo te esperam lá fora." },
];

function getNextObjectivePhrase(milestones: boolean[]): string {
  for (const obj of OBJECTIVE_PHRASES) {
    if (!milestones[obj.milestoneIdx]) return obj.phrase;
  }
  return "Todos os marcos conquistados. A estrada continua, sempre.";
}

// Simple time-based greeting for lock screen — no objectives here
export function greeting(h: number) {
  const t = tod(h);
  if (t === "manha") return "Bom dia, Matheus. O sol nasceu na estrada.";
  if (t === "tarde") return "Boa tarde. O motor não para.";
  if (t === "noite") return "Boa noite.";
  return "Madrugada de código e estratégia.";
}

// Objective phrase for inside the dashboard (Home page)
export function getNextObjective(milestones: boolean[]): string {
  for (const obj of OBJECTIVE_PHRASES) {
    if (!milestones[obj.milestoneIdx]) return obj.phrase;
  }
  return "Todos os marcos conquistados. A estrada continua, sempre.";
}

// ─── Progress cache (for lock screen before login) ────────────────────────────
export const PROGRESS_CACHE_KEY = "rotaDaLiberdade_progressCache";

export function saveProgressCache(milestones: boolean[]) {
  localStorage.setItem(PROGRESS_CACHE_KEY, JSON.stringify({ milestones }));
}

export function loadProgressCache(): boolean[] {
  try {
    const s = localStorage.getItem(PROGRESS_CACHE_KEY);
    if (!s) return Array(8).fill(false);
    return JSON.parse(s).milestones ?? Array(8).fill(false);
  } catch { return Array(8).fill(false); }
}

export function calcAge() {
  const now = new Date();
  let age = now.getFullYear() - BIRTH.getFullYear();
  const m = now.getMonth() - BIRTH.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < BIRTH.getDate())) age--;
  return age;
}

export function fmtBRL(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
}

export function fmtDateLong(d: Date) {
  return d.toLocaleDateString("pt-BR", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

export function ymStr(year: number, month: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

export function ymParse(s: string): [number, number] {
  const [y, m] = s.split("-").map(Number);
  return [y, m - 1];
}

export function ymLabel(s: string) {
  const [y, m] = ymParse(s);
  return `${MONTH_NAMES[m]} / ${y}`;
}

export function ymShort(s: string) {
  const [y, m] = ymParse(s);
  return `${MONTH_NAMES[m].slice(0, 3)}/${String(y).slice(2)}`;
}

export function currentYM() {
  const n = new Date();
  return ymStr(n.getFullYear(), n.getMonth());
}

export function prevYM(s: string) {
  const [y, m] = ymParse(s);
  return m === 0 ? ymStr(y - 1, 11) : ymStr(y, m - 1);
}

export function nextYM(s: string) {
  const [y, m] = ymParse(s);
  return m === 11 ? ymStr(y + 1, 0) : ymStr(y, m + 1);
}

export function computeAlloc(amount: number, motoQuitada: boolean): MonthAllocations {
  const pcts = motoQuitada ? ALLOC_VIRADA : ALLOC_NORMAL;
  const r: MonthAllocations = { ...ZERO_ALLOC };
  for (const p of pcts) r[p.key as AllocKey] = Math.round(amount * p.pct) / 100;
  return r;
}

export function getCumulativeBalances(months: MonthRecord[]): MonthAllocations {
  return months.filter(m => m.confirmed).reduce((acc, m) => ({
    fiis:    acc.fiis    + m.allocations.fiis,
    moto:    acc.moto    + m.allocations.moto,
    reserva: acc.reserva + m.allocations.reserva,
    cabana:  acc.cabana  + m.allocations.cabana,
    viagens: acc.viagens + m.allocations.viagens,
    lazer:   acc.lazer   + m.allocations.lazer,
  }), { ...ZERO_ALLOC });
}

export function totalFromBalances(b: MonthAllocations) {
  return b.fiis + b.moto + b.reserva + b.cabana + b.viagens + b.lazer;
}

export function getLineData(months: MonthRecord[]) {
  const sorted = [...months].filter(m => m.confirmed).sort((a, b) => a.yearMonth.localeCompare(b.yearMonth));
  let cumul = 0;
  return sorted.map(m => {
    const aportado = totalFromBalances(m.allocations);
    cumul += aportado;
    return { month: ymShort(m.yearMonth), patrimonio: cumul, aportado };
  });
}

export function loadLS(): AppData {
  try {
    const s = localStorage.getItem(LS_KEY);
    if (!s) return { ...DEFAULT_DATA, milestones: Array(8).fill(false) };
    const p = JSON.parse(s);
    return {
      ...DEFAULT_DATA, ...p,
      milestones: p.milestones ?? Array(8).fill(false),
      months: p.months ?? [],
      goalTargets: { ...DEFAULT_DATA.goalTargets, ...(p.goalTargets ?? {}) },
    };
  } catch { return { ...DEFAULT_DATA, milestones: Array(8).fill(false) }; }
}

export function saveLS(data: AppData) { localStorage.setItem(LS_KEY, JSON.stringify(data)); }
