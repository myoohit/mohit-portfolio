import { useCallback, useEffect, useState } from "react";

/**
 * Minimal, interface-native theme control.
 * Two tiny geometric marks + a sliding indicator, no SaaS-style switch.
 */
export function ThemeControl({ className }: { className?: string }) {
  const [dark, setDark] = useState(true);
  const [shift, setShift] = useState(false);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem("mr-theme") : null;
    const isDark = stored ? stored === "dark" : true;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggle = useCallback(() => {
    setShift(true);
    window.setTimeout(() => setShift(false), 420);
    setDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      window.localStorage.setItem("mr-theme", next ? "dark" : "light");
      return next;
    });
  }, []);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={dark}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className={`group flex items-center gap-[10px] font-mono text-[11px] tracking-[0.3em] text-muted-foreground transition-colors hover:text-foreground ${className ?? ""}`}
    >
      <span
        className={`relative h-[17px] w-[41px] border border-border transition-colors duration-500 group-hover:border-accent/60 ${shift ? "glitch-burst" : ""}`}
      >
        <span
          className="absolute top-[2px] h-[11px] w-[11px] bg-foreground transition-[left,background-color] duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:bg-accent"
          style={{ left: dark ? "2px" : "26px" }}
        />
      </span>
      <span>{dark ? "DARK" : "LIGHT"}</span>
    </button>
  );
}
