import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ArrowRight, TrendingUp, Calendar, Flag } from "lucide-react";
import { useApp } from "../context";
import { PageWrapper, StatCard } from "../components";
import {
  calcAge, fmtBRL, fmtDateLong, greeting, tod, WALLPAPERS,
  getCumulativeBalances, totalFromBalances, GOALS_DEF, MILESTONES_DEF,
  currentYM, ymLabel, getNextObjective,
} from "../data";

export default function Home() {
  const { data } = useApp();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const h = now.getHours();
  const wallpaper = WALLPAPERS[tod(h)];
  const balances = getCumulativeBalances(data.months);
  const total = totalFromBalances(balances);
  const confirmedMonths = data.months.filter(m => m.confirmed).length;
  const completedMilestones = data.milestones.filter(Boolean).length;

  const nextMilestone = MILESTONES_DEF.find((_, i) => !data.milestones[i]);
  const timeStr = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  const secStr = String(now.getSeconds()).padStart(2, "0");

  // top 3 goals by progress
  const topGoals = GOALS_DEF.map(g => {
    const target = data.goalTargets[g.id as keyof typeof data.goalTargets] ?? g.defaultTarget;
    const balance = balances[g.key as keyof typeof balances];
    return { ...g, target, balance, pct: Math.min(100, (balance / target) * 100) };
  }).sort((a, b) => b.pct - a.pct).slice(0, 3);

  return (
    <div>
      {/* Hero banner */}
      <div className="relative h-52 md:h-64 overflow-hidden">
        <div
          className="absolute inset-0 bg-stone-950 bg-cover bg-center"
          style={{ backgroundImage: `url(${wallpaper})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-[#0b0c0e]" />
        <div className="relative h-full flex flex-col justify-end px-6 md:px-10 pb-6 gap-1">
          <div className="flex items-end gap-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            <span className="text-white font-bold text-4xl md:text-6xl tracking-tighter leading-none">
              {timeStr}
            </span>
            <span className="text-white/40 text-xl md:text-3xl mb-0.5">{secStr}</span>
          </div>
          <p className="text-white/70 text-xs md:text-sm capitalize font-light">{fmtDateLong(now)}</p>
          <p
            className="text-white/80 text-sm md:text-lg font-medium mt-1"
            style={{ fontFamily: "'Exo 2', sans-serif" }}
          >
            {greeting(h)}
          </p>
        </div>
      </div>

      <PageWrapper>
        {/* Mantra */}
        <p className="text-white/20 text-xs italic text-center -mt-4 mb-2">
          "No one told you when to run, you missed the starting gun.{" "}
          <span className="text-amber-500/50 not-italic">MY RUN STARTED NOW.</span>"
        </p>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Patrimônio Total" value={fmtBRL(total)} accent />
          <StatCard label="Meses na Jornada" value={`${confirmedMonths}`} sub="meses confirmados" />
          <StatCard label="Marcos Concluídos" value={`${completedMilestones} / ${MILESTONES_DEF.length}`} sub={`${((completedMilestones / MILESTONES_DEF.length) * 100).toFixed(0)}% da jornada`} />
          <StatCard label="Mês Atual" value={ymLabel(currentYM())} sub={`${calcAge()} anos`} />
        </div>

        {/* Next objective phrase — dynamic, milestone-aware */}
        <div className="bg-gradient-to-r from-amber-500/8 via-amber-500/5 to-transparent border border-amber-500/15 rounded-xl px-5 py-4 flex items-center gap-4">
          <TrendingUp className="w-5 h-5 text-amber-500 shrink-0" />
          <p
            className="text-amber-200/80 text-sm md:text-base leading-snug"
            style={{ fontFamily: "'Exo 2', sans-serif" }}
          >
            {getNextObjective(data.milestones)}
          </p>
        </div>

        {/* Progress on top goals */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white/60 text-xs font-mono tracking-widest uppercase">
              Progresso das Metas
            </h3>
            <Link to="/metas" className="flex items-center gap-1 text-amber-500/60 hover:text-amber-400 text-xs font-mono transition-colors">
              Ver todas <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {topGoals.map(g => (
              <div key={g.id} className="bg-[#111417] border border-white/7 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span>{g.icon}</span>
                    <span className="text-white/80 text-sm font-medium" style={{ fontFamily: "'Exo 2', sans-serif" }}>
                      {g.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-amber-500 font-mono text-sm font-bold">{g.pct.toFixed(1)}%</span>
                    <p className="text-white/25 font-mono text-xs">{fmtBRL(g.balance)} / {fmtBRL(g.target)}</p>
                  </div>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-700"
                    style={{ width: `${g.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next milestone + quick nav */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nextMilestone && (
            <div className="bg-[#111417] border border-amber-500/15 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Flag className="w-4 h-4 text-amber-500" />
                <span className="text-amber-500/70 text-xs font-mono tracking-widest uppercase">Próximo Marco</span>
              </div>
              <p className="text-white/80 text-sm" style={{ fontFamily: "'Exo 2', sans-serif" }}>
                {nextMilestone.icon} {nextMilestone.label}
              </p>
              <Link to="/marcos" className="flex items-center gap-1 text-amber-500/50 hover:text-amber-400 text-xs font-mono mt-3 transition-colors">
                Ver todos os marcos <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}

          <div className="bg-[#111417] border border-white/7 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-white/40" />
              <span className="text-white/40 text-xs font-mono tracking-widest uppercase">Lançar Mês</span>
            </div>
            <p className="text-white/60 text-sm mb-3">
              {confirmedMonths === 0
                ? "Comece registrando seu primeiro aporte."
                : `${confirmedMonths} ${confirmedMonths === 1 ? "mês registrado" : "meses registrados"} na jornada.`}
            </p>
            <Link to="/mes"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs px-4 py-2 rounded-lg transition-colors tracking-wider"
              style={{ fontFamily: "'Exo 2', sans-serif" }}>
              IR PARA MÊS A MÊS <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Allocation summary */}
        {total > 0 && (
          <div>
            <h3 className="text-white/40 text-xs font-mono tracking-widest uppercase mb-4">
              Saldo por Caixinha
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {(Object.entries(balances) as [string, number][]).filter(([, v]) => v > 0).map(([key, val]) => (
                <div key={key} className="bg-[#111417] border border-white/5 rounded-xl p-4">
                  <p className="text-white/35 text-xs font-mono mb-1">{key.toUpperCase()}</p>
                  <p className="text-white font-bold font-mono text-lg"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {fmtBRL(val)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </PageWrapper>
    </div>
  );
}
