import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";

const IDENTITY = "MOHIT RAMESH";
const CIPHER = "7%Q!T_4#X2?K";
const SYMBOLS = "#$%&*+-/<>?@[]{}01";
const TRANSITION_DELAYS = [14_700, 15_430, 14_920, 15_680];

type EntryScreenProps = {
  onEntered?: () => void;
};

function decodedFrame(progress: number, frame: number) {
  return IDENTITY.split("")
    .map((character, index) => {
      if (character === " ") return " ";

      const threshold = 0.18 + index * 0.058;
      if (progress >= threshold) return character;

      const cipherCharacter = CIPHER[index] ?? SYMBOLS[index % SYMBOLS.length];
      if (progress < 0.12) return cipherCharacter;

      const symbolIndex = (frame * 7 + index * 11) % SYMBOLS.length;
      return SYMBOLS[symbolIndex];
    })
    .join("");
}

export function EntryScreen({ onEntered }: EntryScreenProps) {
  const screenRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const instructionRef = useRef<HTMLParagraphElement>(null);
  const loopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stateRef = useRef<"decrypting" | "black" | "cyan" | "transitioning">("decrypting");
  const transitionIndexRef = useRef(0);
  const [exiting, setExiting] = useState(false);

  const scheduleTransition = useCallback(() => {
    const delay = TRANSITION_DELAYS[transitionIndexRef.current % TRANSITION_DELAYS.length];
    transitionIndexRef.current += 1;

    loopTimerRef.current = setTimeout(() => {
      const screen = screenRef.current;
      if (!screen || stateRef.current === "transitioning") return;

      const nextState = stateRef.current === "cyan" ? "black" : "cyan";
      stateRef.current = "transitioning";

      const timeline = gsap.timeline({
        defaults: { ease: "steps(1)" },
        onComplete: () => {
          stateRef.current = nextState;
          screen.dataset["state"] = nextState;
          screen.dataset["glitching"] = "false";
          gsap.set(screen, { x: 0, clipPath: "inset(0 0 0 0)" });
          scheduleTransition();
        },
      });

      screen.dataset["glitching"] = "true";
      timeline
        .set(screen, { x: -7, clipPath: "inset(0 0 63% 0)" })
        .set(screen, { x: 9, clipPath: "inset(38% 0 21% 0)" }, "+=0.045")
        .call(
          () => {
            screen.dataset["state"] = nextState;
          },
          [],
          "+=0.035",
        )
        .set(screen, { x: -3, clipPath: "inset(72% 0 0 0)" }, "+=0.04")
        .call(
          () => {
            screen.dataset["state"] = nextState === "cyan" ? "black" : "cyan";
          },
          [],
          "+=0.035",
        )
        .set(screen, { x: 4, clipPath: "inset(12% 0 44% 0)" }, "+=0.035")
        .call(
          () => {
            screen.dataset["state"] = nextState;
          },
          [],
          "+=0.035",
        )
        .set(screen, { x: 0, clipPath: "inset(0 0 0 0)" }, "+=0.045");
    }, delay);
  }, []);

  useLayoutEffect(() => {
    const name = nameRef.current;
    const instruction = instructionRef.current;
    if (!name || !instruction) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      name.textContent = IDENTITY;
      gsap.set(instruction, { autoAlpha: 1 });
      stateRef.current = "black";
      scheduleTransition();
      return;
    }

    const duration = 2.35;
    const tracker = { progress: 0 };
    let frame = 0;
    const context = gsap.context(() => {
      gsap.to(tracker, {
        progress: 1,
        duration,
        ease: "power2.inOut",
        onUpdate: () => {
          frame += 1;
          name.textContent = decodedFrame(tracker.progress, frame);
        },
        onComplete: () => {
          name.textContent = IDENTITY;
          stateRef.current = "black";
          gsap.to(instruction, { autoAlpha: 1, duration: 0.65, ease: "power2.out" });
          scheduleTransition();
        },
      });
    }, screenRef);

    return () => context.revert();
  }, [scheduleTransition]);

  useEffect(() => {
    return () => {
      if (loopTimerRef.current) clearTimeout(loopTimerRef.current);
    };
  }, []);

  const enter = useCallback(() => {
    const screen = screenRef.current;
    if (!screen || exiting) return;

    setExiting(true);
    stateRef.current = "transitioning";
    if (loopTimerRef.current) clearTimeout(loopTimerRef.current);
    gsap.killTweensOf(screen);
    gsap.to(screen, {
      yPercent: -104,
      duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0.01 : 1.05,
      ease: "power4.inOut",
      onComplete: () => onEntered?.(),
    });
  }, [exiting, onEntered]);

  useEffect(() => {
    const handleKeyDown = () => enter();
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enter]);

  return (
    <div
      ref={screenRef}
      className="entry-screen"
      data-state="black"
      data-glitching="false"
      onPointerDown={enter}
      role="button"
      tabIndex={0}
      aria-label="Enter Mohit Ramesh's portfolio"
    >
      <div className="entry-screen__noise" aria-hidden="true" />
      <div className="entry-screen__tear entry-screen__tear--upper" aria-hidden="true" />
      <div className="entry-screen__tear entry-screen__tear--lower" aria-hidden="true" />
      <main className="entry-screen__content">
        <div className="entry-screen__identity" data-text={IDENTITY}>
          <h1 ref={nameRef} className="entry-screen__name">
            {CIPHER}
          </h1>
        </div>
        <p ref={instructionRef} className="entry-screen__instruction">
          CLICK ANYWHERE TO ENTER
        </p>
      </main>
    </div>
  );
}
