import { useRef } from "react";
import { motion } from "framer-motion";
import { GitFork, Users, Eye, FileCode, Shield, ExternalLink, Share2, Copy } from "lucide-react";
import { toPng } from "html-to-image";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import type { AuraProfile } from "@/lib/github";

interface Props {
  aura: AuraProfile;
  onReset: () => void;
}

function StatItem({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | number }) {
  return (
    <div className="flex items-center gap-2.5 py-2">
      <Icon size={15} className="text-muted-foreground shrink-0" />
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-xs font-mono text-foreground ml-auto">{value}</span>
    </div>
  );
}

export function ProfileCard({ aura, onReset }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { user } = aura;

  const handleShare = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, {
        backgroundColor: "#111115",
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = `${user.login}-aura.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Card saved as image!");
    } catch {
      toast.error("Failed to capture card");
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}?u=${user.login}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md mx-auto"
    >
      <div ref={cardRef} className={`glass-strong rounded-2xl overflow-hidden ${aura.accountAgeYears >= 5 ? 'ring-2 ring-yellow-500/60 shadow-[0_0_20px_rgba(234,179,8,0.15)]' : 'gradient-border'}`}>
        {/* Aura header band */}
        <div className="px-6 pt-6 pb-4 text-center relative">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl mb-2"
          >
            {aura.auraEmoji}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-lg font-bold neon-text-purple tracking-wide"
          >
            {aura.auraType}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="text-xs text-muted-foreground mt-1 italic max-w-xs mx-auto"
          >
            {aura.auraDescription}
          </motion.p>
        </div>

        {/* User info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="px-6 flex items-center gap-4 py-4 border-t border-border/40"
        >
          <img
            src={user.avatar_url}
            alt={user.login}
            className="w-14 h-14 rounded-xl border border-border/60"
          />
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-sm truncate">
              {user.name || user.login}
            </h3>
            <p className="text-xs text-muted-foreground font-mono truncate">@{user.login}</p>
            {user.bio && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{user.bio}</p>
            )}
          </div>
        </motion.div>

        {/* Aura score */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mx-6 rounded-xl bg-background/50 p-4 text-center border border-border/30"
        >
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-mono mb-1">Aura Score</p>
          <p className="text-3xl font-bold neon-text-cyan font-mono">{aura.auraScore}</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="px-6 py-4 space-y-0 divide-y divide-border/30"
        >
          <StatItem icon={GitFork} label="Repositories" value={user.public_repos} />
          <StatItem icon={Users} label="Followers" value={user.followers} />
          <StatItem icon={Eye} label="Following" value={user.following} />
          <StatItem icon={FileCode} label="Public Gists" value={user.public_gists} />
          <StatItem icon={Calendar} label="Account Age" value={`${aura.accountAgeYears}y ${Math.floor((aura.accountAgeDays % 365) / 30)}m`} />
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="px-6 pb-6 flex gap-2"
        >
          <a
            href={user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium bg-secondary hover:bg-secondary/80 transition-colors active:scale-[0.97]"
          >
            <ExternalLink size={13} /> Profile
          </a>
          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium bg-primary/15 text-primary hover:bg-primary/25 transition-colors active:scale-[0.97]"
          >
            <Share2 size={13} /> Save Image
          </button>
          <button
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-medium bg-accent/10 text-accent hover:bg-accent/20 transition-colors active:scale-[0.97]"
          >
            <Copy size={13} />
          </button>
        </motion.div>
      </div>

      {/* Scan another */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={onReset}
        className="mt-6 mx-auto block text-xs text-muted-foreground hover:text-foreground transition-colors font-mono"
      >
        ← scan another
      </motion.button>
    </motion.div>
  );
}
