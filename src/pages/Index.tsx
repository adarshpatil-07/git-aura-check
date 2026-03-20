import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Zap, AlertCircle } from "lucide-react";
import { useGitHubAura } from "@/hooks/useGitHubAura";
import { ScannerAnimation } from "@/components/ScannerAnimation";
import { ProfileCard } from "@/components/ProfileCard";

export default function Index() {
  const [username, setUsername] = useState("");
  const { status, aura, error, scan, reset } = useGitHubAura();

  // URL param support
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const u = params.get("u");
    if (u) {
      setUsername(u);
      scan(u);
    }
  }, [scan]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    scan(username);
  };

  return (
    <div className="min-h-screen flex flex-col items-center relative overflow-hidden">
      {/* Ambient background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-neon-purple/[0.04] blur-[100px]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-neon-cyan/[0.03] blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-lg mx-auto px-5 py-16 flex flex-col items-center">
        {/* Header */}
        <AnimatePresence mode="wait">
          {status === "idle" || status === "error" ? (
            <motion.div
              key="header"
              initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-center mb-10"
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <Zap size={20} className="text-neon-purple" />
                <span className="font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground">
                  GitHub Aura Scanner
                </span>
                <Zap size={20} className="text-neon-cyan" />
              </div>
              <h1
                className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.05]"
                style={{ textWrap: "balance" } as React.CSSProperties}
              >
                Discover your <span className="neon-text-purple">GitHub</span>{" "}
                <span className="neon-text-cyan">Aura</span>
              </h1>
              <p className="mt-4 text-sm text-muted-foreground max-w-sm mx-auto" style={{ textWrap: "pretty" } as React.CSSProperties}>
                Enter a username and we'll analyze their profile to reveal their true developer aura.
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Search bar */}
        <AnimatePresence mode="wait">
          {(status === "idle" || status === "error") && (
            <motion.form
              key="search"
              initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              onSubmit={handleSubmit}
              className="w-full"
            >
              <div className="glass rounded-2xl neon-glow-purple p-1.5 flex items-center gap-2">
                <div className="flex items-center gap-2.5 pl-4 flex-1 min-w-0">
                  <Search size={16} className="text-muted-foreground shrink-0" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter GitHub username..."
                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/50 py-3 font-mono min-w-0"
                  />
                </div>
                <button
                  type="submit"
                  className="shrink-0 px-5 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:brightness-110 transition-all active:scale-[0.96]"
                >
                  Scan
                </button>
              </div>

              {/* Error message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 mt-3 px-2 text-destructive"
                  >
                    <AlertCircle size={14} />
                    <span className="text-xs">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Scanner animation */}
        <AnimatePresence mode="wait">
          {status === "scanning" && (
            <motion.div
              key="scanner"
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <ScannerAnimation />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile card */}
        <AnimatePresence mode="wait">
          {status === "complete" && aura && (
            <motion.div
              key="result"
              className="w-full pt-8"
            >
              <ProfileCard aura={aura} onReset={reset} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
