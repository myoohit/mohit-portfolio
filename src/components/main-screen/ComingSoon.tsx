import { useReveal } from "./useReveal";

type ComingSoonProps = {
  id: string;
  index: string;
  label: string;
  hint: string;
};

/**
 * Placeholder for sections that are still being designed (Skills,
 * Experience, Projects, Contact). Keeps the navbar functional — clicking
 * a not-yet-built link scrolls here instead of doing nothing — without
 * pretending the section is finished. Swap each one out for the real
 * section as it gets designed.
 */
export function ComingSoon({ id, index, label, hint }: ComingSoonProps) {
  const { ref, shown } = useReveal<HTMLElement>();

  return (
    <section
      id={id}
      ref={ref}
      className="relative flex min-h-[70vh] scroll-mt-24 flex-col items-start justify-center px-[6vw] py-[16vh] md:px-[12vw]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-[8.5vw] hidden h-full w-px hairline md:block"
      />

      <span
        className="mb-6 block font-mono text-[10px] tracking-[0.32em] text-accent transition-opacity duration-700"
        style={{ opacity: shown ? 1 : 0 }}
      >
        {index} / {label}
      </span>

      <h2
        className="font-display text-[clamp(1.6rem,3.6vw,2.5rem)] leading-[1.06] font-medium tracking-[-0.02em] text-foreground transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          opacity: shown ? 1 : 0,
          transform: shown ? "none" : "translate3d(16px, 0, 0)",
          transitionDelay: "220ms",
        }}
      >
        {hint}
      </h2>

      <p
        className="mt-6 max-w-[52ch] text-[1rem] leading-[1.75] font-light text-muted-foreground transition-all duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          opacity: shown ? 1 : 0,
          transform: shown ? "none" : "translate3d(12px, 8px, 0)",
          transitionDelay: "380ms",
        }}
      >
        This section is still being designed — check back soon.
      </p>

      <span
        aria-hidden="true"
        className="mt-10 block h-px w-16 origin-left bg-accent/70 transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          transform: shown ? "scaleX(1)" : "scaleX(0)",
          transitionDelay: "700ms",
        }}
      />
    </section>
  );
}
