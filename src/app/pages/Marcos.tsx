import { useApp } from "../context";
import { PageWrapper, PageTitle } from "../components";
import { MILESTONES_DEF } from "../data";

export default function Marcos() {
  const { data, saveData } = useApp();

  const done = data.milestones.filter(Boolean).length;
  const total = MILESTONES_DEF.length;
  const pct = (done / total) * 100;

  const toggle = (i: number) => {
    const milestones = [...data.milestones];
    milestones[i] = !milestones[i];
    saveData({ ...data, milestones });
  };

  return (
    <PageWrapper>
      <PageTitle sub="Checkpoints da jornada — qualquer um pode marcar">Marcos de Vida</PageTitle>

      {/* Progress summary */}
      <div className="bg-[#111417] border border-white/7 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-white font-bold text-3xl font-mono"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {done} <span className="text-white/25 font-normal">/ {total}</span>
            </p>
            <p className="text-white/35 text-xs font-mono mt-1">marcos concluídos</p>
          </div>
          <div className="text-right">
            <p className="text-amber-500 text-3xl font-bold font-mono"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {pct.toFixed(0)}%
            </p>
            <p className="text-white/25 text-xs font-mono">da jornada</p>
          </div>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-2.5">
        {MILESTONES_DEF.map((ms, i) => {
          const checked = data.milestones[i] ?? false;
          return (
            <button
              key={i}
              onClick={() => toggle(i)}
              className={`w-full flex items-center gap-4 p-5 rounded-2xl border transition-all duration-200 text-left group ${
                checked
                  ? "bg-amber-500/8 border-amber-500/20 hover:bg-amber-500/12"
                  : "bg-[#111417] border-white/7 hover:border-white/18"
              }`}
            >
              {/* Checkbox */}
              <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                checked ? "bg-amber-500 border-amber-500" : "border-white/20 group-hover:border-white/45"
              }`}>
                {checked && (
                  <svg className="w-3.5 h-3.5 text-black" viewBox="0 0 12 9" fill="none">
                    <path d="M1 4.5L4.5 8L11 1" stroke="currentColor" strokeWidth="2.2"
                      strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>

              <span className="text-2xl">{ms.icon}</span>

              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold transition-colors ${
                  checked ? "text-amber-400/80 line-through decoration-amber-500/40" : "text-white/85 group-hover:text-white"
                }`} style={{ fontFamily: "'Exo 2', sans-serif" }}>
                  {ms.label}
                </p>
              </div>

              {checked && (
                <div className="flex-shrink-0 text-green-400/60 text-xs font-mono">CONCLUÍDO</div>
              )}
            </button>
          );
        })}
      </div>
    </PageWrapper>
  );
}
