import { useState, useEffect, useRef, useCallback } from "react";
import { RouterProvider } from "react-router";
import { Eye, EyeOff, ChevronUp, Lock } from "lucide-react";
import { router } from "./routes";
import { AppContext } from "./context";
import {
  ADMIN_PWD, WALLPAPERS, DEFAULT_DATA, tod, greeting, fmtDateLong,
  firestoreRef, setDoc, onSnapshot, loadLS, saveLS, normalizeAppData,
  getRandomQuote, saveProgressCache,
  type AppData,
} from "./data";

// ─── Lock Screen ──────────────────────────────────────────────────────────────
function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const [now, setNow] = useState(new Date());
  // Random quote selected once on mount
  const [quote] = useState(() => getRandomQuote());

  const lockRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef<number | null>(null);
  const isDragging = useRef(false);
  const unlocking = useRef(false);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const triggerUnlock = useCallback(() => {
    if (unlocking.current || !lockRef.current) return;
    unlocking.current = true;
    lockRef.current.style.transition = "transform 0.65s cubic-bezier(0.4,0,0.2,1)";
    lockRef.current.style.transform = "translateY(-100vh)";
    setTimeout(onUnlock, 650);
  }, [onUnlock]);

  useEffect(() => {
    const h = () => triggerUnlock();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [triggerUnlock]);

  const onPointerDown = (e: React.PointerEvent) => {
    dragStartY.current = e.clientY;
    isDragging.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || dragStartY.current == null || !lockRef.current || unlocking.current) return;
    const delta = Math.max(0, dragStartY.current - e.clientY);
    lockRef.current.style.transition = "none";
    lockRef.current.style.transform = `translateY(-${delta}px)`;
  };

  const onPointerUp = () => {
    if (!isDragging.current || !lockRef.current) return;
    isDragging.current = false;
    const match = lockRef.current.style.transform.match(/translateY\(-(\d+(?:\.\d+)?)px\)/);
    const delta = match ? parseFloat(match[1]) : 0;
    if (delta > 80) {
      triggerUnlock();
    } else {
      lockRef.current.style.transition = "transform 0.35s ease";
      lockRef.current.style.transform = "translateY(0)";
    }
    dragStartY.current = null;
  };

  const h = now.getHours();
  const timeStr = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  const secStr = String(now.getSeconds()).padStart(2, "0");

  return (
    <div
      ref={lockRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer select-none"
      onClick={triggerUnlock}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <div
        className="absolute inset-0 bg-stone-950 bg-cover bg-center"
        style={{ backgroundImage: `url(${WALLPAPERS[tod(h)]})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/15 to-black/80" />

      <div className="relative flex flex-col items-center gap-3 px-6 max-w-3xl w-full">
        {/* Clock */}
        <div className="flex items-end gap-2 leading-none text-white"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          <span className="font-bold tracking-tighter drop-shadow-2xl"
            style={{ fontSize: "clamp(5rem,16vw,11rem)" }}>
            {timeStr}
          </span>
          <span className="text-white/40 mb-3" style={{ fontSize: "clamp(1.5rem,3.5vw,2.8rem)" }}>
            {secStr}
          </span>
        </div>

        {/* Date */}
        <p className="text-white/70 capitalize tracking-widest text-sm md:text-base font-light">
          {fmtDateLong(now)}
        </p>

        {/* Time-based greeting */}
        <p className="mt-4 text-white/90 text-lg md:text-xl font-medium text-center leading-snug"
          style={{ fontFamily: "'Exo 2', sans-serif" }}>
          {greeting(h)}
        </p>

        {/* Random quote */}
        <div className="mt-6 text-center max-w-xl border-t border-white/10 pt-6">
          <p className="text-white/65 text-sm md:text-base italic leading-relaxed">
            "{quote.text}"
          </p>
          <p className="text-amber-500/50 text-xs font-mono mt-2 tracking-wide">
            — {quote.author}
          </p>
        </div>
      </div>

      <div className="absolute bottom-8 flex flex-col items-center gap-2 text-white/35">
        <ChevronUp className="w-5 h-5 animate-bounce" />
        <span className="text-xs tracking-[0.2em] uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          Clique ou arraste para cima
        </span>
      </div>
    </div>
  );
}

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: (mode: "admin" | "visitor") => void }) {
  const [pwd, setPwd] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => { const t = setTimeout(() => setVisible(true), 60); return () => clearTimeout(t); }, []);

  const h = new Date().getHours();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd === ADMIN_PWD) onLogin("admin");
    else if (pwd.trim()) setError("Senha incorreta. Acesse como visitante para explorar.");
    else setError("Digite a senha ou acesse como visitante.");
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="absolute inset-0 bg-stone-950 bg-cover bg-center"
        style={{ backgroundImage: `url(${WALLPAPERS[tod(h)]})` }} />
      <div className="absolute inset-0 bg-black/65 backdrop-blur-md" />

      <div
        className="relative z-10 w-full max-w-sm mx-4 transition-all duration-500 ease-out"
        style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)" }}
      >
        <div className="bg-black/50 border border-white/10 rounded-2xl p-8 backdrop-blur-2xl shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto mb-5">
              <Lock className="w-6 h-6 text-amber-400" />
            </div>
            <h1
              className="text-white text-2xl font-bold tracking-widest"
              style={{ fontFamily: "'Exo 2', sans-serif", letterSpacing: "0.15em" }}
            >
              A ROTA DA LIBERDADE
            </h1>
            <p className="text-white/30 text-xs mt-2 tracking-[0.3em] uppercase"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              Sistema de Controle Pessoal
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                value={pwd}
                onChange={e => { setPwd(e.target.value); setError(""); }}
                placeholder="Senha do administrador"
                autoFocus
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-amber-500/50 transition-all pr-12 font-mono text-sm tracking-wider"
              />
              <button type="button" onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors p-1">
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && <p className="text-red-400/80 text-xs text-center font-mono">{error}</p>}

            <button type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 rounded-xl transition-colors tracking-[0.15em] text-sm"
              style={{ fontFamily: "'Exo 2', sans-serif" }}>
              ACESSAR COMO ADMIN
            </button>

            <div className="flex items-center gap-3 py-1">
              <div className="flex-1 h-px bg-white/8" />
              <span className="text-white/25 text-xs font-mono">ou</span>
              <div className="flex-1 h-px bg-white/8" />
            </div>

            <button type="button" onClick={() => onLogin("visitor")}
              className="w-full border border-white/8 hover:border-white/20 text-white/40 hover:text-white/70 py-3 rounded-xl transition-all text-sm tracking-wider"
              style={{ fontFamily: "'Exo 2', sans-serif" }}>
              Acessar como Visitante
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
type Screen = "lock" | "login" | "dashboard";

export default function App() {
  const [screen, setScreen] = useState<Screen>("lock");
  const [mode, setMode] = useState<"admin" | "visitor" | null>(null);
  const [data, setData] = useState<AppData>(() => loadLS());
  const [loginReady, setLoginReady] = useState(false);

  useEffect(() => {
    const saved = loadLS();
    setData(saved);
    saveProgressCache(saved.milestones);
  }, []);

  useEffect(() => {
    if (mode === "admin") {
      const unsub = onSnapshot(
        firestoreRef,
        snap => {
          if (snap.exists()) {
            const remote = normalizeAppData(snap.data() as Partial<AppData>);
            setData(remote);
            saveLS(remote);
            saveProgressCache(remote.milestones);
          }
        },
        error => {
          console.warn("Firebase indisponível, usando armazenamento local.", error);
        }
      );
      return unsub;
    }

    if (mode === "visitor") {
      const saved = loadLS();
      setData(saved);
      saveProgressCache(saved.milestones);
    }
  }, [mode]);

  const saveData = useCallback((newData: AppData) => {
    const normalized = normalizeAppData(newData);
    setData(normalized);
    saveLS(normalized);
    saveProgressCache(normalized.milestones);

    if (mode === "admin") {
      setDoc(firestoreRef, normalized).catch(error => {
        console.warn("Falha ao salvar no Firebase, dados preservados no localStorage.", error);
      });
    }
  }, [mode]);

  const handleUnlock = () => { setLoginReady(true); setScreen("login"); };

  const handleLogin = (m: "admin" | "visitor") => {
    setMode(m);
    setScreen("dashboard");
  };

  const handleLogout = () => {
    setMode(null);
    setData({ ...DEFAULT_DATA, milestones: Array(8).fill(false) });
    setScreen("lock");
  };

  if (screen === "lock") return <LockScreen onUnlock={handleUnlock} />;
  if (screen === "login" && loginReady) return <LoginScreen onLogin={handleLogin} />;

  if (screen === "dashboard" && mode) {
    return (
      <AppContext.Provider value={{
        data,
        mode,
        isAdmin: mode === "admin",
        saveData,
        onLogout: handleLogout,
      }}>
        <RouterProvider router={router} />
      </AppContext.Provider>
    );
  }

  return null;
}
