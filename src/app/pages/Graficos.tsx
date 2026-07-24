import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";
import { useApp } from "../context";
import { PageWrapper, PageTitle } from "../components";
import {
  fmtBRL, getCumulativeBalances, totalFromBalances, getLineData,
  PIE_COLORS, CAT_LABELS, type AppData,
} from "../data";

function TooltipLine({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a1d22] border border-white/10 rounded-lg p-3 text-xs font-mono shadow-xl">
      <p className="text-white/50 mb-2">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>{p.name}: {fmtBRL(p.value)}</p>
      ))}
    </div>
  );
}

function TooltipPie({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="bg-[#1a1d22] border border-white/10 rounded-lg p-3 text-xs font-mono shadow-xl">
      <p className="text-white/70 mb-1">{item.name}</p>
      <p className="font-bold" style={{ color: item.payload.color }}>{fmtBRL(item.value)}</p>
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="flex items-center justify-center h-48 bg-[#111417] border border-white/7 rounded-xl">
      <p className="text-white/20 text-sm font-mono">Confirme meses para ver os gráficos.</p>
    </div>
  );
}

export default function Graficos() {
  const { data } = useApp();

  const lineData = getLineData(data.months);
  const balances = getCumulativeBalances(data.months);
  const total = totalFromBalances(balances);
  const confirmedCount = data.months.filter(m => m.confirmed).length;

  const pieData = (Object.entries(balances) as [string, number][])
    .filter(([, v]) => v > 0)
    .map(([key, value]) => ({ name: CAT_LABELS[key] ?? key, value, color: PIE_COLORS[key] ?? "#888" }));

  const barData = [...data.months]
    .filter(m => m.confirmed)
    .sort((a, b) => a.yearMonth.localeCompare(b.yearMonth))
    .map(m => ({
      month: m.yearMonth.slice(5, 7) + "/" + m.yearMonth.slice(2, 4),
      fiis: m.allocations.fiis,
      moto: m.allocations.moto,
      reserva: m.allocations.reserva,
      cabana: m.allocations.cabana,
      viagens: m.allocations.viagens,
      lazer: m.allocations.lazer,
    }));

  const hasData = confirmedCount > 0;

  return (
    <PageWrapper>
      <PageTitle sub="Evolução do patrimônio e distribuição dos aportes">Dashboards & Gráficos</PageTitle>

      {/* Summary row */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="bg-[#111417] border border-amber-500/20 rounded-xl p-5">
          <p className="text-white/35 text-xs font-mono uppercase tracking-widest mb-2">Patrimônio Total</p>
          <p className="text-amber-400 text-2xl font-bold font-mono"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}>{fmtBRL(total)}</p>
        </div>
        <div className="bg-[#111417] border border-white/7 rounded-xl p-5">
          <p className="text-white/35 text-xs font-mono uppercase tracking-widest mb-2">Meses Registrados</p>
          <p className="text-white text-2xl font-bold font-mono"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}>{confirmedCount}</p>
        </div>
        <div className="bg-[#111417] border border-white/7 rounded-xl p-5 col-span-2 md:col-span-1">
          <p className="text-white/35 text-xs font-mono uppercase tracking-widest mb-2">Aporte Médio/Mês</p>
          <p className="text-white text-2xl font-bold font-mono"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {confirmedCount > 0 ? fmtBRL(total / confirmedCount) : "R$ 0,00"}
          </p>
        </div>
      </div>

      {/* Line chart — patrimônio evolution */}
      <div className="bg-[#111417] border border-white/7 rounded-2xl p-6">
        <p className="text-white/40 text-xs font-mono tracking-widest uppercase mb-1">Evolução do Patrimônio</p>
        <p className="text-white/60 text-lg font-bold font-mono mb-6"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}>{fmtBRL(total)}</p>
        {hasData ? (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={lineData} margin={{ top: 5, right: 15, left: -15, bottom: 0 }}>
              <XAxis dataKey="month"
                tick={{ fill: "#4b5563", fontSize: 10, fontFamily: "JetBrains Mono" }}
                axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fill: "#4b5563", fontSize: 10, fontFamily: "JetBrains Mono" }}
                axisLine={false} tickLine={false}
                tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<TooltipLine />} />
              <Line type="monotone" dataKey="patrimonio" name="Patrimônio" stroke="#e07b39" strokeWidth={2.5}
                dot={{ fill: "#e07b39", r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="aportado" name="Aportado" stroke="#ffffff20"
                strokeWidth={1.5} dot={false} strokeDasharray="4 3" />
            </LineChart>
          </ResponsiveContainer>
        ) : <EmptyChart />}
      </div>

      {/* Donut + bar side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Donut — distribution */}
        <div className="bg-[#111417] border border-white/7 rounded-2xl p-6">
          <p className="text-white/40 text-xs font-mono tracking-widest uppercase mb-5">
            Aonde Foi o Dinheiro
          </p>
          {hasData && pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                    dataKey="value" paddingAngle={2}>
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} opacity={0.9} />
                    ))}
                  </Pie>
                  <Tooltip content={<TooltipPie />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-4">
                {pieData.map(d => (
                  <div key={d.name} className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-white/45">{d.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-white/25">{total > 0 ? ((d.value / total) * 100).toFixed(1) : 0}%</span>
                      <span className="text-white/65 font-bold">{fmtBRL(d.value)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : <EmptyChart />}
        </div>

        {/* Stacked bar — per month breakdown */}
        <div className="bg-[#111417] border border-white/7 rounded-2xl p-6">
          <p className="text-white/40 text-xs font-mono tracking-widest uppercase mb-5">
            Aportes por Mês (por Caixinha)
          </p>
          {hasData ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month"
                  tick={{ fill: "#4b5563", fontSize: 10, fontFamily: "JetBrains Mono" }}
                  axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fill: "#4b5563", fontSize: 10, fontFamily: "JetBrains Mono" }}
                  axisLine={false} tickLine={false}
                  tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<TooltipLine />} />
                {["fiis","moto","reserva","cabana","viagens","lazer"].map(key => (
                  <Bar key={key} dataKey={key} name={CAT_LABELS[key]}
                    stackId="a" fill={PIE_COLORS[key]} opacity={0.85} radius={key === "lazer" ? [3,3,0,0] : [0,0,0,0]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          ) : <EmptyChart />}
        </div>
      </div>
    </PageWrapper>
  );
}
