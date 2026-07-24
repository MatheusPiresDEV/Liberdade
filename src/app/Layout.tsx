import { useState, useRef } from "react";
import { NavLink, Outlet } from "react-router";
import {
  LayoutDashboard, CalendarDays, Target, BarChart3, CheckSquare, Map, LogOut,
  Upload, Download, Copy, Check, X, AlertTriangle,
} from "lucide-react";
import { useApp } from "./context";
import { calcAge, DEFAULT_DATA, type AppData } from "./data";

// ─── Data Portal Modal ────────────────────────────────────────────────────────
function DataPortal({ onClose }: { onClose: () => void }) {
  const { data, saveData, isAdmin } = useApp();
  const [tab, setTab] = useState<"export" | "import">("export");
  const [importText, setImportText] = useState("");
  const [copied, setCopied] = useState(false);
  const [importStatus, setImportStatus] = useState<"idle" | "ok" | "err">("idle");
  const [importMsg, setImportMsg] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const exportJson = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(exportJson).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleImport = () => {
    try {
      const parsed = JSON.parse(importText) as Partial<AppData>;
      if (!parsed || typeof parsed !== "object") throw new Error("JSON inválido");

      const merged: AppData = {
        ...DEFAULT_DATA,
        ...parsed,
        milestones: Array.isArray(parsed.milestones) ? parsed.milestones : Array(8).fill(false),
        months: Array.isArray(parsed.months) ? parsed.months : [],
        goalTargets: { ...DEFAULT_DATA.goalTargets, ...(parsed.goalTargets ?? {}) },
      };

      saveData(merged);
      setImportStatus("ok");
      setImportMsg("Dados importados com sucesso! Todas as páginas foram atualizadas.");
      setTimeout(onClose, 1800);
    } catch (e) {
      setImportStatus("err");
      setImportMsg(`Erro ao importar: ${(e as Error).message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-lg bg-[#111417] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/7">
          <div>
            <h3
              className="text-white font-bold text-base tracking-wide"
              style={{ fontFamily: "'Exo 2', sans-serif" }}
            >
              Portabilidade de Dados
            </h3>
            <p className="text-white/30 text-xs font-mono mt-0.5">
              Exporte ou importe todo o sistema via JSON
            </p>
          </div>
          <button onClick={onClose} className="text-white/25 hover:text-white/60 transition-colors p-1.5">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/7">
          {(["export", "import"] as const).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setImportStatus("idle"); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-mono tracking-widest uppercase transition-colors ${
                tab === t
                  ? "text-amber-400 border-b-2 border-amber-500 bg-amber-500/5"
                  : "text-white/30 hover:text-white/50"
              }`}
            >
              {t === "export" ? <Download className="w-3.5 h-3.5" /> : <Upload className="w-3.5 h-3.5" />}
              {t === "export" ? "Exportar" : "Importar"}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-4">
          {tab === "export" ? (
            <>
              <p className="text-white/40 text-xs font-mono leading-relaxed">
                Copie o JSON abaixo. Ele contém <span className="text-amber-400">todos os seus dados</span> —
                histórico mensal, metas, marcos, salário e configurações.
              </p>
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  readOnly
                  value={exportJson}
                  rows={10}
                  className="w-full bg-black/40 border border-white/8 rounded-xl px-4 py-3 text-xs text-green-400/80 font-mono resize-none focus:outline-none leading-relaxed"
                  onClick={e => (e.target as HTMLTextAreaElement).select()}
                />
              </div>
              <button
                onClick={handleCopy}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm tracking-widest transition-all ${
                  copied
                    ? "bg-green-600/80 text-white"
                    : "bg-amber-500 hover:bg-amber-400 text-black"
                }`}
                style={{ fontFamily: "'Exo 2', sans-serif" }}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "COPIADO!" : "COPIAR JSON"}
              </button>
            </>
          ) : (
            <>
              <p className="text-white/40 text-xs font-mono leading-relaxed">
                Cole um JSON exportado anteriormente. {!isAdmin && (
                  <span className="text-amber-400/60">No modo visitante, os dados ficam salvos localmente no navegador.</span>
                )}
              </p>
              <textarea
                value={importText}
                onChange={e => { setImportText(e.target.value); setImportStatus("idle"); }}
                placeholder={'Cole o JSON aqui...\n{\n  "salary": 3000,\n  "months": [...]\n}'}
                rows={10}
                className="w-full bg-black/40 border border-white/8 rounded-xl px-4 py-3 text-xs text-white/70 font-mono resize-none focus:outline-none focus:border-amber-500/40 transition-colors leading-relaxed placeholder-white/15"
              />

              {importStatus !== "idle" && (
                <div className={`flex items-start gap-3 px-4 py-3 rounded-xl text-xs font-mono ${
                  importStatus === "ok"
                    ? "bg-green-500/10 border border-green-500/20 text-green-400"
                    : "bg-red-500/10 border border-red-500/20 text-red-400"
                }`}>
                  {importStatus === "ok"
                    ? <Check className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    : <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />}
                  {importMsg}
                </div>
              )}

              <button
                onClick={handleImport}
                disabled={!importText.trim()}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm tracking-widest bg-amber-500 hover:bg-amber-400 text-black transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ fontFamily: "'Exo 2', sans-serif" }}
              >
                <Upload className="w-4 h-4" />
                IMPORTAR E RESTAURAR
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
const NAV = [
  { to: "/",           icon: LayoutDashboard, label: "Visão Geral"  },
  { to: "/mes",        icon: CalendarDays,     label: "Mês a Mês"   },
  { to: "/metas",      icon: Target,           label: "Metas"        },
  { to: "/graficos",   icon: BarChart3,        label: "Gráficos"     },
  { to: "/marcos",     icon: CheckSquare,      label: "Marcos"       },
  { to: "/expedicoes", icon: Map,              label: "Expedições"   },
];

function NavItem({ to, icon: Icon, label }: { to: string; icon: React.ElementType; label: string }) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
          isActive
            ? "bg-amber-500/15 text-amber-400 border border-amber-500/20"
            : "text-white/35 hover:text-white/70 hover:bg-white/5 border border-transparent"
        }`
      }
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span style={{ fontFamily: "'Exo 2', sans-serif", fontWeight: 500 }}>{label}</span>
    </NavLink>
  );
}

export default function Layout() {
  const { mode, isAdmin, onLogout } = useApp();
  const [showPortal, setShowPortal] = useState(false);

  return (
    <div
      className="flex h-screen overflow-hidden text-[#e4e1db]"
      style={{ background: "#0b0c0e", fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── Sidebar (desktop) ─────────────────────────── */}
      <aside className="hidden md:flex w-[220px] flex-col border-r border-white/5 bg-[#0d0f12] flex-shrink-0">
        {/* Logo */}
        <div className="p-5 border-b border-white/5">
          <p
            className="text-amber-500 font-black text-xs tracking-[0.2em] leading-tight uppercase"
            style={{ fontFamily: "'Exo 2', sans-serif" }}
          >
            A ROTA DA<br />LIBERDADE
          </p>
          <p className="text-white/25 text-xs mt-2 font-mono">
            Matheus Pires · {calcAge()} anos
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV.map(n => <NavItem key={n.to} {...n} />)}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 space-y-2">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono ${
            isAdmin
              ? "bg-amber-500/10 border border-amber-500/20 text-amber-400"
              : "bg-white/5 border border-white/8 text-white/40"
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${isAdmin ? "bg-amber-500" : "bg-white/30"}`} />
            {isAdmin ? "ADMIN" : "VISITANTE"}
          </div>
          <button
            onClick={() => setShowPortal(true)}
            className="flex items-center gap-2 text-white/25 hover:text-amber-400/70 transition-colors text-xs font-mono px-3 py-2 w-full rounded-lg hover:bg-amber-500/5"
          >
            <Download className="w-3.5 h-3.5" />
            Exportar / Importar
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-white/25 hover:text-white/60 transition-colors text-xs font-mono px-3 py-2 w-full rounded-lg hover:bg-white/5"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sair
          </button>
        </div>
      </aside>

      {/* ── Main area ─────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#0d0f12] flex-shrink-0">
          <p
            className="text-amber-500 font-black text-xs tracking-[0.2em] uppercase"
            style={{ fontFamily: "'Exo 2', sans-serif" }}
          >
            A ROTA DA LIBERDADE
          </p>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowPortal(true)} className="text-white/30 hover:text-amber-400/70">
              <Download className="w-4 h-4" />
            </button>
            <button onClick={onLogout} className="text-white/30 hover:text-white/60">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Visitor badge */}
        {!isAdmin && (
          <div className="flex justify-center py-2 bg-amber-900/20 border-b border-amber-600/15 flex-shrink-0">
            <span className="text-amber-400/80 text-xs font-mono tracking-wider">
              MODO VISITANTE — dados salvos localmente no seu navegador
            </span>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>

        {/* ── Bottom nav (mobile) ─────────────────────── */}
        <nav className="md:hidden flex border-t border-white/5 bg-[#0d0f12] flex-shrink-0">
          {NAV.map(n => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === "/"}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center gap-1 py-2.5 transition-colors text-xs ${
                  isActive ? "text-amber-400" : "text-white/25 hover:text-white/50"
                }`
              }
            >
              <n.icon className="w-5 h-5" />
              <span style={{ fontFamily: "'Exo 2', sans-serif", fontSize: "0.6rem", fontWeight: 500 }}>
                {n.label.split(" ")[0]}
              </span>
            </NavLink>
          ))}
        </nav>
      </div>

      {showPortal && <DataPortal onClose={() => setShowPortal(false)} />}
    </div>
  );
}
