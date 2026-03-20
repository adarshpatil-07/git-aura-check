import { useState, useCallback } from "react";
import { fetchGitHubUser, computeAura, type AuraProfile } from "@/lib/github";

type Status = "idle" | "scanning" | "complete" | "error";

export function useGitHubAura() {
  const [status, setStatus] = useState<Status>("idle");
  const [aura, setAura] = useState<AuraProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const scan = useCallback(async (username: string) => {
    if (!username.trim()) {
      setError("Enter a username");
      return;
    }

    setStatus("scanning");
    setError(null);
    setAura(null);

    // Artificial delay for scanner effect
    await new Promise((r) => setTimeout(r, 2200));

    try {
      const user = await fetchGitHubUser(username.trim());
      const profile = computeAura(user);
      setAura(profile);
      setStatus("complete");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setStatus("error");
    }
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setAura(null);
    setError(null);
  }, []);

  return { status, aura, error, scan, reset };
}
