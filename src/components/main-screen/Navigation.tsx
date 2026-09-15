import { useCallback } from "react";
import { useActiveSection } from "./useActiveSection";

/** Single shared navigation configuration — used by every presentation mode. */
export const SECTIONS = [
  { id: "about", index: "01", label: "ABOUT", hint: "WHO I AM" },
  { id: "skills", index: "02", label: "SKILLS", hint: "WHAT I BUILD WITH" },
  { id: "experience", index: "03", label: "EXPERIENCE", hint: "WHERE I'VE WORKED" },
  { id: "projects", index: "04", label: "PROJECTS", hint: "WHAT I'VE BUILT" },
  { id: "contact", index: "05", label: "CONTACT", hint: "LET'S CONNECT" },
] as const;

export const SECTION_IDS = SECTIONS.map((s) => s.id);

function useGo() {
  return useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ block: "start" });
  }, []);
}

/** MODE 1 — hero composition: vertical rail on the right. */
export function HeroNavigation({ visible }: { visible: boolean }) {
  const active = useActiveSection(SECTION_IDS, "about");
  const go = useGo();

  return (
    <nav
      aria-label="Sections"
      aria-hidden={!visible}
      className="anim-lock fixed top-1/2 right-[4.5vw] z-40 hidden -translate-y-1/2 md:block"
      style={{ animationDelay: "900ms" }}
    >
      <ul
        className="space-y-[11px] transition-all duration-[520ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translate3d(18px, 0, 0)",
          pointerEvents: visible ? "auto" : "none",
        }}
      >
        {SECTIONS.map((item) => {
          const isActive = active === item.id;
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => go(item.id)}
                tabIndex={visible ? 0 : -1}
                aria-current={isActive ? "true" : undefined}
                className={`group flex items-baseline gap-3 py-[3px] font-mono text-[11px] tracking-[0.22em] transition-colors duration-300 ${
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span
                  className={`text-[9px] tabular-nums transition-colors duration-300 ${
                    isActive ? "text-accent" : "text-muted-foreground/60 group-hover:text-accent"
                  }`}
                >
                  {item.index}
                </span>
                <span className="relative">
                  <span>{item.label}</span>
                  <span
                    className={`absolute -bottom-[3px] left-0 h-px w-full origin-left bg-accent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100 ${
                      isActive ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </span>
                <span
                  aria-hidden="true"
                  className="ml-1 hidden translate-x-[-4px] text-[9px] tracking-[0.18em] text-accent opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 lg:inline"
                >
                  {item.hint}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** MODE 2 — interior sections: centered horizontal rail at the top. */
export function InteriorNavigation({ visible }: { visible: boolean }) {
  const active = useActiveSection(SECTION_IDS, "about");
  const go = useGo();

  return (
    <nav
      aria-label="Sections"
      aria-hidden={!visible}
      className="fixed inset-x-0 top-0 z-40 hidden justify-center pt-6 transition-all duration-[520ms] ease-[cubic-bezier(0.16,1,0.3,1)] md:flex"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translate3d(0, -14px, 0)",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <ul className="flex items-baseline gap-[clamp(1.6rem,4vw,3.4rem)] bg-background/80 px-6 py-2 backdrop-blur-[2px]">
        {SECTIONS.map((item) => {
          const isActive = active === item.id;
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => go(item.id)}
                tabIndex={visible ? 0 : -1}
                aria-current={isActive ? "true" : undefined}
                className={`group flex items-baseline gap-2 font-mono text-[10px] tracking-[0.24em] transition-colors duration-300 ${
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span
                  className={`text-[9px] tabular-nums transition-colors duration-300 ${
                    isActive ? "text-accent" : "text-muted-foreground/60 group-hover:text-accent"
                  }`}
                >
                  {item.index}
                </span>
                <span className="relative">
                  <span>{item.label}</span>
                  <span
                    className={`absolute -bottom-[4px] left-0 h-px w-full origin-left bg-accent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100 ${
                      isActive ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Compact mobile rail — always available, same shared data. */
export function MobileNavigation() {
  const active = useActiveSection(SECTION_IDS, "about");
  const go = useGo();

  return (
    <nav
      aria-label="Sections"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/85 backdrop-blur-sm md:hidden"
    >
      <ul className="flex items-stretch justify-between px-[5vw]">
        {SECTIONS.map((item) => {
          const isActive = active === item.id;
          return (
            <li key={item.id} className="flex-1">
              <button
                type="button"
                onClick={() => go(item.id)}
                aria-current={isActive ? "true" : undefined}
                aria-label={item.label}
                className="flex h-12 w-full flex-col items-center justify-center gap-[6px]"
              >
                <span
                  className={`font-mono text-[9px] tabular-nums transition-colors duration-300 ${
                    isActive ? "text-foreground" : "text-muted-foreground/70"
                  }`}
                >
                  {item.index}
                </span>
                <span
                  aria-hidden="true"
                  className={`h-px w-4 transition-all duration-500 ${
                    isActive ? "bg-accent opacity-100" : "bg-border opacity-60"
                  }`}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
