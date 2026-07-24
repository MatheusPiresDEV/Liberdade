// Shared UI components

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="h-px flex-1 bg-white/5" />
      <span
        className="text-xs tracking-[0.25em] uppercase text-amber-500/60"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        {children}
      </span>
      <div className="h-px flex-1 bg-white/5" />
    </div>
  );
}

export function Toggle({
  on,
  onChange,
  disabled,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={() => !disabled && onChange(!on)}
      disabled={disabled}
      className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none flex-shrink-0 ${
        on ? "bg-amber-500" : "bg-white/10"
      } ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${
          on ? "translate-x-6" : ""
        }`}
      />
    </button>
  );
}

export function EditableValue({
  value,
  onChange,
  disabled,
  prefix = "R$",
  className = "",
}: {
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
  prefix?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="text-amber-500/70 text-sm font-mono">{prefix}</span>
      <input
        type="number"
        value={value}
        onChange={e => onChange(parseFloat(e.target.value) || 0)}
        disabled={disabled}
        className="bg-transparent text-white font-bold font-mono focus:outline-none disabled:opacity-60 w-full"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      />
    </div>
  );
}

export function StatCard({
  label,
  value,
  sub,
  accent = false,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`bg-[#111417] border rounded-xl p-5 ${
        accent ? "border-amber-500/20" : "border-white/7"
      }`}
    >
      <p className="text-white/40 text-xs font-mono tracking-widest uppercase mb-2">{label}</p>
      <p
        className={`text-2xl font-bold font-mono ${accent ? "text-amber-400" : "text-white"}`}
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        {value}
      </p>
      {sub && <p className="text-white/25 text-xs font-mono mt-1">{sub}</p>}
    </div>
  );
}

export function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full p-6 md:p-10 max-w-5xl mx-auto space-y-10">{children}</div>
  );
}

export function PageTitle({
  children,
  sub,
}: {
  children: React.ReactNode;
  sub?: string;
}) {
  return (
    <div className="mb-8">
      <h2
        className="text-white text-2xl font-bold tracking-wide"
        style={{ fontFamily: "'Exo 2', sans-serif" }}
      >
        {children}
      </h2>
      {sub && <p className="text-white/30 text-sm mt-1 font-mono">{sub}</p>}
    </div>
  );
}
