import { useEffect, useRef, useState } from "react";
import { About } from "./About";
import { ComingSoon } from "./ComingSoon";
import { HeroTitle } from "./HeroTitle";
import { HeroNavigation, InteriorNavigation, MobileNavigation } from "./Navigation";
import { ThemeControl } from "./ThemeControl";

const DISCIPLINES = ["AI", "SOFTWARE", "BACKEND", "CREATIVITY"] as const;

/** Quiet alignment system — hairlines and a few intersection marks. */
function Alignment() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="anim-line-x absolute top-[86px] left-0 h-px w-full hairline"
        style={{ animationDelay: "200ms" }}
      />
      <div
        className="anim-line-y absolute top-0 left-[8.5vw] hidden h-full w-px hairline md:block"
        style={{ animationDelay: "260ms" }}
      />
      <div
        className="anim-line-y absolute top-0 right-[8.5vw] hidden h-full w-px hairline lg:block"
        style={{ animationDelay: "380ms" }}
      />
      <div
        className="anim-lock absolute top-[86px] left-[8.5vw] hidden h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2 bg-accent/70 md:block"
        style={{ animationDelay: "700ms" }}
      />
    </div>
  );
}

export function MainScreen() {
  const heroRef = useRef<HTMLElement | null>(null);
  const [inHero, setInHero] = useState(true);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInHero((entry?.intersectionRatio ?? 0) > 0.4),
      { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative w-full overflow-x-hidden bg-background">
      {/* one navigation system, two presentation modes */}
      <HeroNavigation visible={inHero} />
      <InteriorNavigation visible={!inHero} />
      <MobileNavigation />

      <main ref={heroRef} className="relative min-h-screen px-[6vw] py-8 md:px-[12vw]">
        <Alignment />

        <header className="relative flex items-center justify-between">
          <span
            className="main-screen__identity-label anim-lock text-[14px] font-semibold tracking-[0.32em] text-muted-foreground"
            style={{ animationDelay: "560ms" }}
          >
            MOHIT
          </span>
          <div className="anim-lock" style={{ animationDelay: "620ms" }}>
            <ThemeControl />
          </div>
        </header>

        <section className="hero-recompose relative flex min-h-[calc(100vh-8rem)] flex-col justify-center">
          <div className="max-w-3xl">
            <HeroTitle />

            <ul
              className="anim-lock mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[10px] tracking-[0.28em] text-muted-foreground"
              style={{ animationDelay: "1900ms" }}
            >
              {DISCIPLINES.map((d, i) => (
                <li key={d} className="flex items-center gap-5">
                  <span>{d}</span>
                  {i < DISCIPLINES.length - 1 && (
                    <span aria-hidden="true" className="h-px w-6 bg-border" />
                  )}
                </li>
              ))}
            </ul>

            <p
              className="anim-lock mt-12 max-w-sm border-l border-border pl-5 text-[0.95rem] leading-relaxed font-light text-muted-foreground"
              style={{ animationDelay: "2100ms" }}
            >
              I like bringing the things I imagine to life through code.
            </p>
          </div>
        </section>
      </main>

      <About />
      <ComingSoon id="skills" index="02" label="SKILLS" hint="What I build with" />
      <ComingSoon id="experience" index="03" label="EXPERIENCE" hint="Where I've worked" />
      <ComingSoon id="projects" index="04" label="PROJECTS" hint="What I've built" />
      <ComingSoon id="contact" index="05" label="CONTACT" hint="Let's connect" />
    </div>
  );
}
