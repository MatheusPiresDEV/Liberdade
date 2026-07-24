import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Check, RotateCcw } from "lucide-react";
import { useApp } from "../context";
import { PageWrapper, PageTitle, Toggle } from "../components";
import {
  fmtBRL, ymLabel, currentYM, prevYM, nextYM, ymParse,
  computeAlloc, ALLOC_NORMAL, ALLOC_VIRADA, type AllocKey,
  type MonthAllocations, type MonthRecord, type AppData,
} from "../data";

// ─── Editable allocation row ──────────────────────────────────────────────────
function AllocRow({
  icon,
  label,
  pct,
  suggested,
  actual,
  onChange,
  isAdmin,
}: {
  icon: string;
  label: string;
  pct: number;
  suggested: number;
  actual: number;
  onChange: (v: number) => void;
  isAdmin: boolean;
}) {
  const [raw, setRaw] = useState(actual.toFixed(2).replace(".", ","));
  const isModified = Math.abs(actual - suggested) > 0.01;

  // Sync external changes (e.g. when total amount changes and resets)
  useEffect(() => {
    setRaw(actual.toFixed(2).replace(".", ","));
  }, [actual]);

  const commit = (str: string) => {
    const v = parseFloat(str.replace(",", "."));
    if (!isNaN(v) && v >= 0) onChange(v);
  };

  return (
    <div className={`flex items-center gap-3 rounded-xl px-4 py-3 border transition-colors ${
      isModified
        ? "bg-amber-500/5 border-amber-500/20"
        : "bg-black/20 border-white/5 hover:border-white/10"
    }`}>
      <span className="text-xl flex-shrink-0">{icon}</span>

      <div className="flex-1 min-w-0">
        <p className="text-white/60 text-xs truncate mb-1.5">{label}</p>
        <div className="h-0.5 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-amber-500/60 rounded-full" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        {/* Suggested badge */}
        <span className="text-white/20 text-xs font-mono">{pct}% sugerido: {fmtBRL(suggested)}</span>

        {/* Editable actual value */}
        {isAdmin ? (
          <div className={`flex items-center gap-1 rounded-lg px-2.5 py-1 border ${
            isModified ? "border-amber-500/30 bg-amber-500/8" : "border-white/8 bg-black/30"
          }`}>
            <span className="text-amber-500/60 text-xs font-mono">R$</span>
            <input
              type="text"
              inputMode="decimal"
              value={raw}
              onChange={e => setRaw(e.target.value)}
              onBlur={e => commit(e.target.value)}
              onKeyDown={e => e.key === "Enter" && commit(raw)}
              className="w-20 bg-transparent text-right text-white font-bold font-mono text-sm focus:outline-none"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            />
          </div>
        ) : (
          <p className="text-amber-400 font-mono font-bold text-sm"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {fmtBRL(actual)}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Month Panel ──────────────────────────────────────────────────────────────
function MonthPanel({
  period,
  data,
  isAdmin,
  onSave,
}: {
  period: string;
  data: AppData;
  isAdmin: boolean;
  onSave: (d: AppData) => void;
}) {
  const todayYM = currentYM();
  const [y, m] = ymParse(period);
  const now = new Date();
  const isCurrent = period === todayYM;
  const isFuture = new Date(y, m) > new Date(now.getFullYear(), now.getMonth());
  const existingRecord = data.months.find(r => r.yearMonth === period);

  const [amountStr, setAmountStr] = useState("");
  // editedAllocs: null = use computed percentages; otherwise holds user-adjusted values
  const [editedAllocs, setEditedAllocs] = useState<MonthAllocations | null>(null);

  const amount = parseFloat(amountStr.replace(",", ".")) || 0;

  const faculdadeConcluida = isCurrent ? data.faculdadeConcluida : (existingRecord?.faculdadeConcluida ?? false);
  const motoQuitada        = isCurrent ? data.motoQuitada        : (existingRecord?.motoQuitada        ?? false);
  const effectiveAmount    = isCurrent
    ? (faculdadeConcluida ? data.salary : amount)
    : (existingRecord?.availableAmount ?? 0);

  const suggestedAllocs = computeAlloc(effectiveAmount, motoQuitada);
  const activeAllocs    = editedAllocs ?? suggestedAllocs;
  const pcts            = motoQuitada ? ALLOC_VIRADA : ALLOC_NORMAL;
  const confirmedCount  = data.months.filter(m => m.confirmed).length;

  // Reset edited allocs when total amount or allocation mode changes
  useEffect(() => { setEditedAllocs(null); }, [effectiveAmount, motoQuitada]);

  const updateAllocKey = (key: AllocKey, value: number) => {
    setEditedAllocs(prev => ({
      ...(prev ?? suggestedAllocs),
      [key]: value,
    }));
  };

  const resetToSuggested = () => setEditedAllocs(null);

  const totalActual    = Object.values(activeAllocs).reduce((s, v) => s + v, 0);
  const totalSuggested = effectiveAmount;
  const diff           = totalSuggested - totalActual;
  const isEdited       = editedAllocs !== null;

  const confirmMonth = () => {
    const record: MonthRecord = {
      yearMonth: period,
      availableAmount: effectiveAmount > 0 ? effectiveAmount : totalActual,
      faculdadeConcluida,
      motoQuitada,
      allocations: activeAllocs,
      confirmed: true,
    };
    const months = existingRecord
      ? data.months.map(r => r.yearMonth === period ? record : r)
      : [...data.months, record];
    onSave({ ...data, months });
    setAmountStr("");
    setEditedAllocs(null);
  };

  const reopenMonth = () => {
    const months = data.months.map(r =>
      r.yearMonth === period ? { ...r, confirmed: false } : r
    );
    onSave({ ...data, months });
  };

  // ── Historical confirmed view ──
  if (!isCurrent && existingRecord?.confirmed) {
    const rec = existingRecord;
    const recPcts = rec.motoQuitada ? ALLOC_VIRADA : ALLOC_NORMAL;
    return (
      <div className="bg-[#111417] border border-green-500/20 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="w-3.5 h-3.5 text-black" />
            </div>
            <span className="text-green-400 font-semibold text-sm" style={{ fontFamily: "'Exo 2', sans-serif" }}>
              Mês Concluído
            </span>
          </div>
          {isAdmin && (
            <button onClick={reopenMonth}
              className="text-white/25 hover:text-red-400/60 text-xs font-mono transition-colors border border-white/10 hover:border-red-400/30 px-3 py-1 rounded-lg">
              Reabrir
            </button>
          )}
        </div>
        <p className="text-white/40 text-xs font-mono mb-5">
          Disponível: <span className="text-white/70 font-bold">{fmtBRL(rec.availableAmount)}</span>
          {" · "}{rec.faculdadeConcluida ? "Faculdade Concluída" : "Sobra do mês"}
          {rec.motoQuitada ? " · Moto Quitada (Regra da Virada)" : ""}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {recPcts.map(p => {
            const val = rec.allocations[p.key as AllocKey];
            const suggested = Math.round(rec.availableAmount * p.pct) / 100;
            const isModified = Math.abs(val - suggested) > 0.01;
            return (
              <div key={p.key} className={`flex items-center gap-3 rounded-xl px-4 py-3 border ${
                isModified ? "bg-amber-500/5 border-amber-500/15" : "bg-black/20 border-white/5"
              }`}>
                <span>{p.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white/50 text-xs truncate">{p.label}</p>
                  {isModified && (
                    <p className="text-white/20 text-xs font-mono">sugerido: {fmtBRL(suggested)}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-amber-400 font-mono font-bold text-sm">{fmtBRL(val)}</p>
                  <p className="text-white/25 font-mono text-xs">{p.pct}%</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs font-mono">
          <span className="text-white/30">Total aportado</span>
          <span className="text-white/70 font-bold">
            {fmtBRL(Object.values(rec.allocations).reduce((s, v) => s + v, 0))}
          </span>
        </div>
      </div>
    );
  }

  if (isFuture) {
    return (
      <div className="bg-[#111417] border border-white/7 rounded-2xl p-10 text-center">
        <p className="text-white/25 text-sm font-mono">Período futuro — ainda não disponível.</p>
      </div>
    );
  }

  if (!isCurrent && !existingRecord) {
    return (
      <div className="bg-[#111417] border border-white/7 rounded-2xl p-10 text-center">
        <p className="text-white/25 text-sm font-mono">Nenhum registro para este período.</p>
      </div>
    );
  }

  // ── Interactive form ──
  return (
    <div className="bg-[#111417] border border-amber-500/15 rounded-2xl p-6 space-y-6">
      <p className="text-amber-500/50 text-xs font-mono tracking-widest">
        LANÇAMENTO DO MÊS · {confirmedCount} {confirmedCount === 1 ? "MÊS CONCLUÍDO" : "MESES CONCLUÍDOS"} NA JORNADA
      </p>

      {/* Toggles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex items-center justify-between bg-black/20 rounded-xl px-4 py-3.5">
          <div>
            <p className="text-white/75 text-sm font-medium">Faculdade Concluída?</p>
            <p className="text-white/30 text-xs font-mono mt-0.5">
              {faculdadeConcluida ? "Salário fixo ativo" : "Digitar o que sobrou"}
            </p>
          </div>
          <Toggle on={faculdadeConcluida}
            onChange={v => isAdmin && onSave({ ...data, faculdadeConcluida: v })}
            disabled={!isAdmin} />
        </div>
        <div className="flex items-center justify-between bg-black/20 rounded-xl px-4 py-3.5">
          <div>
            <p className={`text-sm font-medium ${motoQuitada ? "text-green-400" : "text-white/75"}`}>
              {motoQuitada ? "🔑 Moto Quitada" : "⚙️ Moto Em Quitação"}
            </p>
            <p className="text-white/30 text-xs font-mono mt-0.5">
              {motoQuitada ? "24% → Cabana (total 36%)" : "24% na Caixinha Moto"}
            </p>
          </div>
          <Toggle on={motoQuitada}
            onChange={v => isAdmin && onSave({ ...data, motoQuitada: v })}
            disabled={!isAdmin} />
        </div>
      </div>

      {/* Amount input */}
      {faculdadeConcluida ? (
        <div>
          <label className="text-white/35 text-xs font-mono tracking-widest uppercase block mb-2">
            Salário Base de Aceleração
          </label>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 flex-1 bg-black/30 border border-white/8 rounded-xl px-4 py-3 min-w-[140px]">
              <span className="text-amber-500 font-mono text-sm">R$</span>
              <input
                type="number"
                value={data.salary}
                onChange={e => isAdmin && onSave({ ...data, salary: parseFloat(e.target.value) || 0 })}
                disabled={!isAdmin}
                className="flex-1 bg-transparent text-white text-2xl font-bold font-mono focus:outline-none disabled:opacity-50"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              />
            </div>
            {isAdmin && (
              <div className="flex gap-2">
                {[2500, 3500].map(v => (
                  <button key={v} onClick={() => onSave({ ...data, salary: v })}
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
      ) : (
        <div>
          <label className="text-white/35 text-xs font-mono tracking-widest uppercase block mb-2">
            Quanto sobrou do salário para aportar este mês?
          </label>
          <div className="flex items-center gap-2 bg-black/30 border border-white/8 rounded-xl px-4 py-3">
            <span className="text-amber-500 font-mono">R$</span>
            <input
              type="text"
              value={amountStr}
              onChange={e => setAmountStr(e.target.value)}
              disabled={!isAdmin}
              placeholder="0,00"
              className="flex-1 bg-transparent text-white text-2xl font-bold font-mono focus:outline-none placeholder-white/15 disabled:opacity-50"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            />
          </div>
        </div>
      )}

      {/* Allocation breakdown — editable */}
      {(effectiveAmount > 0 || isEdited) && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-white/30 text-xs font-mono tracking-widest uppercase">
              Divisão dos Aportes
              {isAdmin && <span className="text-amber-500/50 ml-2">(edite os valores reais abaixo)</span>}
            </p>
            {isEdited && isAdmin && (
              <button onClick={resetToSuggested}
                className="flex items-center gap-1.5 text-white/25 hover:text-amber-400/60 text-xs font-mono transition-colors">
                <RotateCcw className="w-3 h-3" />
                Restaurar sugestão
              </button>
            )}
          </div>

          <div className="space-y-2">
            {pcts.map(p => (
              <AllocRow
                key={p.key}
                icon={p.icon}
                label={p.label}
                pct={p.pct}
                suggested={suggestedAllocs[p.key as AllocKey]}
                actual={activeAllocs[p.key as AllocKey]}
                onChange={v => updateAllocKey(p.key as AllocKey, v)}
                isAdmin={isAdmin}
              />
            ))}
          </div>

          {/* Total row */}
          <div className={`flex items-center justify-between mt-3 px-4 py-3 rounded-xl border ${
            Math.abs(diff) < 0.01
              ? "bg-green-500/5 border-green-500/15"
              : "bg-white/3 border-white/8"
          }`}>
            <div>
              <p className="text-white/50 text-xs font-mono">Total aportado</p>
              {effectiveAmount > 0 && Math.abs(diff) >= 0.01 && (
                <p className={`text-xs font-mono mt-0.5 ${diff > 0 ? "text-amber-400/70" : "text-red-400/70"}`}>
                  {diff > 0 ? `sobram ${fmtBRL(diff)} não alocados` : `${fmtBRL(Math.abs(diff))} a mais do que o disponível`}
                </p>
              )}
            </div>
            <p className={`font-mono font-bold text-lg ${
              Math.abs(diff) < 0.01 ? "text-green-400" : "text-white"
            }`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {fmtBRL(totalActual)}
            </p>
          </div>
        </div>
      )}

      {/* Confirm */}
      {isAdmin ? (
        <button
          onClick={confirmMonth}
          disabled={totalActual <= 0}
          className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-30 disabled:cursor-not-allowed text-black font-bold py-4 rounded-xl transition-colors tracking-[0.15em] text-sm"
          style={{ fontFamily: "'Exo 2', sans-serif" }}
        >
          ✓ CONFIRMAR E SALVAR MÊS — {fmtBRL(totalActual)}
        </button>
      ) : (
        <p className="text-center text-white/20 text-xs font-mono py-2">
          Acesse como Administrador para lançar aportes
        </p>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Mes() {
  const { data, isAdmin, saveData } = useApp();
  const [period, setPeriod] = useState(currentYM());
  const todayYM = currentYM();

  return (
    <PageWrapper>
      <PageTitle sub="Registre e acompanhe os aportes de cada mês">Motor Financeiro — Mês a Mês</PageTitle>

      {/* Period selector */}
      <div className="flex items-center justify-center gap-5 mb-6">
        <button onClick={() => setPeriod(prevYM(period))}
          className="w-9 h-9 rounded-full border border-white/10 hover:border-amber-500/40 flex items-center justify-center text-white/40 hover:text-amber-400 transition-all">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="text-center min-w-[220px]">
          <p className="text-white text-xl font-bold tracking-wide" style={{ fontFamily: "'Exo 2', sans-serif" }}>
            {ymLabel(period)}
          </p>
          {period === todayYM && (
            <span className="text-amber-500/50 text-xs font-mono">MÊS ATUAL</span>
          )}
        </div>
        <button onClick={() => setPeriod(nextYM(period))}
          disabled={period === todayYM}
          className="w-9 h-9 rounded-full border border-white/10 hover:border-amber-500/40 disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center text-white/40 hover:text-amber-400 transition-all">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <MonthPanel period={period} data={data} isAdmin={isAdmin} onSave={saveData} />

      {/* Confirmed history list */}
      {data.months.filter(m => m.confirmed).length > 0 && (
        <div>
          <p className="text-white/30 text-xs font-mono tracking-widest uppercase mb-4">
            Histórico Confirmado ({data.months.filter(m => m.confirmed).length} meses)
          </p>
          <div className="space-y-2">
            {[...data.months]
              .filter(m => m.confirmed)
              .sort((a, b) => b.yearMonth.localeCompare(a.yearMonth))
              .map(m => (
                <button key={m.yearMonth} onClick={() => setPeriod(m.yearMonth)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left ${
                    period === m.yearMonth
                      ? "bg-amber-500/10 border-amber-500/25"
                      : "bg-[#111417] border-white/5 hover:border-white/15"
                  }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
                      <Check className="w-3 h-3 text-green-400" />
                    </div>
                    <span className="text-white/70 text-sm font-medium" style={{ fontFamily: "'Exo 2', sans-serif" }}>
                      {ymLabel(m.yearMonth)}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-amber-400 font-mono text-sm font-bold">
                      {fmtBRL(Object.values(m.allocations).reduce((s, v) => s + v, 0))}
                    </p>
                    <p className="text-white/25 font-mono text-xs">
                      {m.motoQuitada ? "Virada" : m.faculdadeConcluida ? "Salário Fixo" : "Sobra"}
                    </p>
                  </div>
                </button>
              ))}
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
