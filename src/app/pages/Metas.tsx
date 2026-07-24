import { useState } from "react";
import { Pencil, Check } from "lucide-react";
import { useApp } from "../context";
import { PageWrapper, PageTitle, Toggle } from "../components";
import {
  fmtBRL, getCumulativeBalances, GOALS_DEF, calcAge,
  type AllocKey, type GoalTargets,
} from "../data";

function GoalCard({
  goal,
  balance,
  target,
  isAdmin,
  onChangeTarget,
}: {
  goal: typeof GOALS_DEF[number];
  balance: number;
  target: number;
  isAdmin: boolean;
  onChangeTarget: (v: number) => void;
}) {
  const pct = Math.min(100, (balance / target) * 100);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(target));

  const commitEdit = () => {
    const v = parseFloat(draft.replace(/[^0-9,.]/g, "").replace(",", "."));
    if (!isNaN(v) && v > 0) onChangeTarget(v);
    setEditing(false);
  };

  return (
    <div className="bg-[#111417] border border-white/7 rounded-2xl p-6 hover:border-white/12 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <span className="text-3xl">{goal.icon}</span>
        <span className="text-white/25 text-xs font-mono bg-white/5 border border-white/8 px-2 py-1 rounded-lg">
          {goal.ageGoal}
        </span>
      </div>

      <h3 className="text-white/90 font-bold text-base mb-1" style={{ fontFamily: "'Exo 2', sans-serif" }}>
        {goal.name}
      </h3>
      <p className="text-white/30 text-xs font-mono mb-5">{goal.sub}</p>

      {/* Target editable */}
      <div className="mb-4">
        <label className="text-white/30 text-xs font-mono tracking-widest uppercase block mb-2">
          Preço Alvo
        </label>
        {isAdmin && editing ? (
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-1.5 bg-black/30 border border-amber-500/30 rounded-xl px-3 py-2">
              <span className="text-amber-500/70 text-sm font-mono">R$</span>
              <input
                type="text"
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onKeyDown={e => e.key === "Enter" && commitEdit()}
                autoFocus
                className="flex-1 bg-transparent text-white text-lg font-bold font-mono focus:outline-none"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              />
            </div>
            <button onClick={commitEdit}
              className="w-9 h-9 rounded-lg bg-amber-500 hover:bg-amber-400 flex items-center justify-center transition-colors">
              <Check className="w-4 h-4 text-black" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <p className="text-amber-400/80 text-xl font-bold font-mono flex-1"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {fmtBRL(target)}
            </p>
            {isAdmin && (
              <button onClick={() => { setDraft(String(target)); setEditing(true); }}
                className="text-white/20 hover:text-amber-400/60 transition-colors p-1">
                <Pencil className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-white/40">{fmtBRL(balance)} acumulado</span>
          <span className="text-amber-500 font-bold">{pct.toFixed(1)}%</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-white/20 text-xs font-mono leading-snug">
          Você está a <span className="text-white/45">{pct.toFixed(1)}%</span> de conquistar este objetivo
          {" "}— <span className="text-amber-500/50">Meta: {goal.ageGoal}</span>
        </p>
      </div>
    </div>
  );
}

export default function Metas() {
  const { data, isAdmin, saveData } = useApp();
  const balances = getCumulativeBalances(data.months);

  const updateTarget = (id: string, value: number) => {
    saveData({ ...data, goalTargets: { ...data.goalTargets, [id]: value } as GoalTargets });
  };

  return (
    <PageWrapper>
      <PageTitle sub="Acompanhe e edite suas metas financeiras de vida">Metas & Objetivos</PageTitle>

      {/* ── Configurações ──────────────────────────────────────── */}
      <div className="bg-[#111417] border border-white/7 rounded-2xl p-6">
        <p className="text-white/40 text-xs font-mono tracking-widest uppercase mb-5">Configurações Globais</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Salary */}
          <div>
            <label className="text-white/35 text-xs font-mono tracking-widest uppercase block mb-2">
              Salário Base (Faculdade Concluída)
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-2 flex-1 bg-black/30 border border-white/8 rounded-xl px-3 py-2.5 min-w-[140px]">
                <span className="text-amber-500/70 font-mono text-sm">R$</span>
                <input
                  type="number"
                  value={data.salary}
                  onChange={e => isAdmin && saveData({ ...data, salary: parseFloat(e.target.value) || 0 })}
                  disabled={!isAdmin}
                  className="flex-1 bg-transparent text-white text-lg font-bold font-mono focus:outline-none disabled:opacity-50"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                />
              </div>
              {isAdmin && (
                <div className="flex gap-2">
                  {[2500, 3500].map(v => (
                    <button key={v} onClick={() => saveData({ ...data, salary: v })}
                      className={`px-3 py-2 rounded-lg text-xs font-mono border transition-all ${
                        data.salary === v
                          ? "bg-amber-500/20 border-amber-500/40 text-amber-400"
                          : "border-white/10 text-white/30 hover:border-white/25 hover:text-white/60"
                      }`}>
                      {fmtBRL(v)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Status toggles */}
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-black/20 rounded-xl px-4 py-3">
              <p className="text-white/65 text-sm">Faculdade Concluída?</p>
              <Toggle
                on={data.faculdadeConcluida}
                onChange={v => isAdmin && saveData({ ...data, faculdadeConcluida: v })}
                disabled={!isAdmin}
              />
            </div>
            <div className="flex items-center justify-between bg-black/20 rounded-xl px-4 py-3">
              <p className={`text-sm ${data.motoQuitada ? "text-green-400" : "text-white/65"}`}>
                {data.motoQuitada ? "🔑 Moto Quitada" : "⚙️ Moto Em Quitação"}
              </p>
              <Toggle
                on={data.motoQuitada}
                onChange={v => isAdmin && saveData({ ...data, motoQuitada: v })}
                disabled={!isAdmin}
              />
            </div>
          </div>
        </div>

        {!isAdmin && (
          <p className="text-white/20 text-xs font-mono mt-4">
            Entre como Administrador para editar configurações e metas.
          </p>
        )}
      </div>

      {/* ── Goals grid ─────────────────────────────────────────── */}
      <div>
        <p className="text-white/35 text-xs font-mono tracking-widest uppercase mb-5">
          Objetivos de Vida — {calcAge()} Anos
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {GOALS_DEF.map(g => {
            const target = data.goalTargets[g.id as keyof GoalTargets] ?? g.defaultTarget;
            const balance = balances[g.key as AllocKey] ?? 0;
            return (
              <GoalCard
                key={g.id}
                goal={g}
                balance={balance}
                target={target}
                isAdmin={isAdmin}
                onChangeTarget={v => updateTarget(g.id, v)}
              />
            );
          })}
        </div>
      </div>
    </PageWrapper>
  );
}
