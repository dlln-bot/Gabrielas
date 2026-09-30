import { motion } from "framer-motion";
import { easeInOut } from "./motion";

export type Phase = "idle" | "cover" | "reveal";

/** Rises over the old page in the destination's colours, then lifts off the new one. */
export function Curtain({ label, bg, fg, phase }: { label: string; bg: string; fg: string; phase: Phase }) {
  if (phase === "idle") return null;
  return (
    <motion.div
      className="curtain"
      style={{ background: bg, color: fg }}
      initial={{ y: "100%" }}
      animate={{ y: phase === "cover" ? "0%" : "-100%" }}
      transition={{ duration: phase === "cover" ? 0.7 : 0.85, ease: easeInOut }}
      aria-hidden
    >
      <motion.span
        className="curtain-label"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: phase === "cover" ? 0 : -60, opacity: phase === "cover" ? 1 : 0 }}
        transition={{ duration: 0.6, ease: easeInOut, delay: phase === "cover" ? 0.25 : 0 }}
      >
        {label}
      </motion.span>
    </motion.div>
  );
}
