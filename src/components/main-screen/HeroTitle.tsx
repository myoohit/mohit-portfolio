import { useEffect, useState } from "react";

const FINAL = "AI ENGINEER";
const FRAMES: string[] = ["AI ENG1N3ER", "AI ENGI#EER", "AI 3NGINEER", FINAL];

/** Very brief, controlled glitch on first reveal — then permanently stable. */
export function HeroTitle() {
  const [text, setText] = useState(FINAL);
  const [burst, setBurst] = useState(false);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    const start = 1450;
    setText(FRAMES[0]!);
    setBurst(true);
    FRAMES.forEach((frame, i) => {
      timers.push(setTimeout(() => setText(frame), start + i * 70));
    });
    timers.push(setTimeout(() => setBurst(false), start + FRAMES.length * 70));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <h1
      className="anim-title font-display text-[clamp(2.6rem,10.5vw,7.5rem)] leading-[0.92] font-medium tracking-[-0.03em] text-foreground"
      style={{ animationDelay: "1400ms" }}
    >
      <span className={burst ? "glitch-burst inline-block" : "inline-block"}>{text}</span>
    </h1>
  );
}
