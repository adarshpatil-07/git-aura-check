import { motion } from "framer-motion";

export function ScannerAnimation() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center gap-8 py-16"
    >
      {/* Scanner container */}
      <div className="relative w-48 h-48 rounded-full glass neon-glow-purple overflow-hidden">
        {/* Scan line */}
        <div className="absolute inset-x-0 h-full scan-line animate-scan" />

        {/* Center pulse */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-16 h-16 rounded-full bg-neon-purple/20 border border-neon-purple/40 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-neon-purple animate-pulse-neon" />
          </div>
        </motion.div>

        {/* Rotating ring */}
        <motion.div
          className="absolute inset-2 rounded-full border border-neon-cyan/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-4 rounded-full border border-neon-purple/20"
          animate={{ rotate: -360 }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Status text */}
      <motion.div
        className="text-center space-y-2"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <p className="font-mono text-sm neon-text-cyan tracking-widest uppercase">
          Scanning Aura
        </p>
        <p className="font-mono text-xs text-muted-foreground">
          Analyzing commit history & social graph...
        </p>
      </motion.div>
    </motion.div>
  );
}
