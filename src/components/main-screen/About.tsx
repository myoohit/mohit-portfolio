import { Polaroid } from "./Polaroid";
import { useReveal } from "./useReveal";

const LINES = [
  "I'm the kind of guy who gets a random idea, opens VS Code, and then convinces himself it's going to be a small project.",
  "It usually isn't.",
  "I like binge-watching movies and anime, learning how things work, and building things simply because I wondered if I could.",
  "Somewhere along the way, AI became the rabbit hole I kept falling into. There's always something new to learn, something that breaks for absolutely no reason, and another project waiting to happen.",
  "So I keep learning, building, breaking things, fixing them, and starting the next idea.",
];

export function About() {
  const { ref, shown } = useReveal<HTMLElement>();

  return (
    <section
      id="about"
      ref={ref}
      className="relative scroll-mt-24 px-[6vw] pt-[16vh] pb-[18vh] md:px-[12vw]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-[8.5vw] hidden h-full w-px hairline md:block"
      />

      <span
        className="mb-10 block font-mono text-[10px] tracking-[0.32em] text-accent transition-opacity duration-700"
        style={{ opacity: shown ? 1 : 0 }}
      >
        01 / ABOUT
      </span>

      <div className="relative flex flex-col gap-14 lg:flex-row lg:items-center lg:gap-[6vw]">
        {/* photograph — dropped onto the page, once */}
        <div className={`shrink-0 lg:pt-2 ${shown ? "photo-drop" : "opacity-0"}`}>
          <Polaroid caption="MR — 2026" alt="" />
        </div>

        {/* text */}
        <div className="max-w-[52ch]">
          <h2
            className="font-display text-[clamp(1.6rem,3.6vw,2.5rem)] leading-[1.06] font-medium tracking-[-0.02em] text-foreground transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              opacity: shown ? 1 : 0,
              transform: shown ? "none" : "translate3d(16px, 0, 0)",
              transitionDelay: "220ms",
            }}
          >
            The person
            <br />
            behind the interface
          </h2>

          <div className="mt-8 space-y-5">
            {LINES.map((line, i) => (
              <p
                key={i}
                className="text-[1rem] leading-[1.75] font-light text-muted-foreground transition-all duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
                style={{
                  opacity: shown ? 1 : 0,
                  transform: shown ? "none" : "translate3d(12px, 8px, 0)",
                  transitionDelay: `${380 + i * 130}ms`,
                }}
              >
                {line}
              </p>
            ))}
          </div>

          <span
            aria-hidden="true"
            className="mt-12 block h-px w-16 origin-left bg-accent/70 transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              transform: shown ? "scaleX(1)" : "scaleX(0)",
              transitionDelay: "1000ms",
            }}
          />
        </div>
      </div>
    </section>
  );
}
