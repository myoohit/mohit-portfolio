import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import type React from "react";

/**
 * Watch_Dogs-inspired boot sequence.
 * Single deterministic GSAP master timeline — every timing lives in TIMING
 * or in the timeline positions below, so beats can be retuned in one place.
 */

const TIMING = {
  xPlace: 0.16, // per X mark
  xGap: 0.12,
  rectTravel: 0.55,
  hold: 0.5,
  flick: 0.045, // one on/off/on switch step
};

type Props = { onComplete?: () => void };

/** Applied inline so the very first paint (including SSR HTML) is already hidden. */
const HIDDEN: React.CSSProperties = { visibility: "hidden", opacity: 0 };

const X_MARKS = [
  { x: 118, y: 118, s: 13 },
  { x: 196, y: 180, s: 17 },
  { x: 300, y: 92, s: 11 },
  { x: 300, y: 180, s: 21 },
  { x: 404, y: 244, s: 13 },
  { x: 478, y: 180, s: 15 },
];

const RECTS = [
  { y: 156, w: 186, h: 9 },
  { y: 176, w: 214, h: 9 },
  { y: 196, w: 160, h: 9 },
];

/** ON → OFF → ON, twice, like flicking a physical switch. */
function flick(tl: gsap.core.Timeline, target: gsap.TweenTarget, at?: number | string) {
  const t = TIMING.flick;
  tl.set(target, { autoAlpha: 0 }, at)
    .set(target, { autoAlpha: 1 }, `+=${t}`)
    .set(target, { autoAlpha: 0 }, `+=${t * 0.8}`)
    .set(target, { autoAlpha: 1 }, `+=${t}`);
}

/** Same switch feel, but the element stays gone. */
function flickOut(tl: gsap.core.Timeline, target: gsap.TweenTarget, at?: number | string) {
  const t = TIMING.flick;
  tl.set(target, { autoAlpha: 0 }, at)
    .set(target, { autoAlpha: 1 }, `+=${t}`)
    .set(target, { autoAlpha: 0 }, `+=${t * 0.7}`)
    .set(target, { autoAlpha: 1 }, `+=${t * 0.7}`)
    .set(target, { autoAlpha: 0 }, `+=${t}`);
}

function flickIn(tl: gsap.core.Timeline, target: gsap.TweenTarget, at?: number | string) {
  const t = TIMING.flick;
  tl.set(target, { autoAlpha: 1 }, at)
    .set(target, { autoAlpha: 0 }, `+=${t * 0.7}`)
    .set(target, { autoAlpha: 1 }, `+=${t}`);
}

export default function SystemLoader({ onComplete }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);
  const [narrow, setNarrow] = useState(false);

  /* Crop the viewBox tighter on small screens so the geometry fills the width. */
  useLayoutEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const sync = () => setNarrow(mql.matches);
    sync();
    mql.addEventListener("change", sync);
    return () => mql.removeEventListener("change", sync);
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      const stage = q("[data-stage]");
      const xs = q("[data-x]");
      const rects = q("[data-rect]");
      const diamond = q("[data-diamond]");
      const coreX = q("[data-core-x]");
      const beatA = q("[data-beat-a]");
      const beatB = q("[data-beat-b]");
      const sys = q("[data-sys]");
      const sysBar = q("[data-sys-bar]");
      const loadingText = q("[data-loading-text]");

      gsap.set([xs, rects, diamond, coreX, beatA, beatB, sys], { autoAlpha: 0 });
      gsap.set(rects, { x: -520 });
      gsap.set(coreX, { scale: 0.72, transformOrigin: "300px 180px" });
      gsap.set(sysBar, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(loadingText, { autoAlpha: 0 });

      const master = gsap.timeline({
        defaults: { ease: "none" },
        onComplete: () => setDone(true),
      });

      master.to(loadingText, { autoAlpha: 1, duration: 0.3 }, 0.2);

      /* PHASE 1 — X marks inserted piece by piece */
      X_MARKS.forEach((_, i) => {
        const at = 0.35 + i * (TIMING.xPlace + TIMING.xGap);
        flickIn(master, xs[i]!, at);
      });
      const afterX = 0.35 + X_MARKS.length * (TIMING.xPlace + TIMING.xGap);

      /* PHASE 2 — rectangles enter from the left, mechanically */
      master.set(rects, { autoAlpha: 1 }, afterX);
      RECTS.forEach((_, i) => {
        master.to(
          rects[i]!,
          { x: 0, duration: TIMING.rectTravel, ease: "steps(9)" },
          afterX + i * 0.09,
        );
      });

      /* PHASE 3 — X at the midpoint cuts out as a rectangle crosses it */
      flickOut(master, xs[1]!, afterX + 0.34);
      flickOut(master, xs[3]!, afterX + 0.48);

      /* PHASE 4 — thin diamond revealed behind the rectangles */
      master.set(diamond, { autoAlpha: 1 }, afterX + TIMING.rectTravel + 0.12);
      master.fromTo(
        diamond,
        { strokeDasharray: 640, strokeDashoffset: 640 },
        { strokeDashoffset: 0, duration: 0.5, ease: "power2.inOut" },
        afterX + TIMING.rectTravel + 0.12,
      );

      /* PHASE 5 — signal displacement: shift right, snap back */
      const p5 = afterX + TIMING.rectTravel + 0.75;
      master
        .set(rects, { x: 26 }, p5)
        .set(rects, { x: 0 }, p5 + 0.06)
        .set(rects, { x: 14 }, p5 + 0.11)
        .set(rects, { x: 0 }, p5 + 0.15);

      /* PHASE 6 — X reconstructs at the core and grows slightly */
      const p6 = p5 + 0.3;
      flickIn(master, coreX, p6);
      master.to(coreX, { scale: 1, duration: 0.6, ease: "power3.out" }, p6 + 0.05);

      /* PHASE 7 — front rectangle glitches out */
      flickOut(master, rects[1]!, p6 + 0.6);

      /* PHASE 8 — geometry breaks and reconstructs around the X */
      const p8 = p6 + 0.9;
      flickOut(master, diamond, p8);
      flickOut(master, [rects[0]!, rects[2]!], p8 + 0.12);
      flickOut(master, xs[0]!, p8 + 0.05);
      flickOut(master, [xs[2]!, xs[4]!, xs[5]!], p8 + 0.18);
      flick(master, coreX, p8 + 0.3);
      master.to({}, { duration: TIMING.hold }, p8 + 0.5);
      flickOut(master, coreX, p8 + 0.95);

      /* PHASE 9 — short geometric beats */
      const p9 = p8 + 1.15;
      flickIn(master, beatA, p9);
      master.to({}, { duration: TIMING.hold + 0.2 }, p9);
      master.set(beatA, { x: 18 }, p9 + 0.85).set(beatA, { x: 0 }, p9 + 0.9);
      flickOut(master, beatA, p9 + 0.98);

      const p9b = p9 + 1.2;
      flickIn(master, beatB, p9b);
      master.to({}, { duration: TIMING.hold }, p9b);
      master.set(beatB, { x: -16 }, p9b + 0.7).set(beatB, { x: 0 }, p9b + 0.75);
      flickOut(master, beatB, p9b + 0.85);

      /* SYSTEM LOADING */
      const pSys = p9b + 1.05;
      flickIn(master, sys, pSys);
      master.to(sysBar, { scaleX: 1, duration: 1.5, ease: "steps(12)" }, pSys + 0.35);
      master
        .set(sys, { x: 20 }, pSys + 1.95)
        .set(sys, { x: 0 }, pSys + 2.0)
        .set(sys, { x: 9 }, pSys + 2.05)
        .set(sys, { x: 0 }, pSys + 2.1);
      flick(master, sys, pSys + 2.2);
      master.to({}, { duration: 0.45 });

      /* Bottom progress line — spans the whole sequence exactly */
      const total = master.duration();
      const prog = gsap.timeline();
      prog.fromTo(bar.current, { scaleX: 0 }, { scaleX: 1, duration: total, ease: "power1.inOut" });
      master.add(prog, 0);

      /* Exit */
      master.to([stage, loadingText], { autoAlpha: 0, duration: 0.35 }, total - 0.2);
    }, root);

    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    if (!done) return;
    const t = window.setTimeout(() => onComplete?.(), 450);
    return () => window.clearTimeout(t);
  }, [done, onComplete]);

  return (
    <div
      ref={root}
      className={`fixed inset-0 z-50 flex flex-col bg-void transition-opacity duration-500 ${
        done ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      aria-hidden="true"
    >
      {/* CENTRAL GEOMETRY */}
      <div className="flex flex-1 items-center justify-center px-4 sm:px-6">
        <svg
          data-stage
          viewBox={narrow ? "88 62 424 236" : "0 0 600 360"}
          className="w-full max-w-[min(94vw,760px)] sm:max-w-[min(78vw,760px)]"
          fill="none"
          stroke="var(--geo)"
          shapeRendering="geometricPrecision"
        >
          {/* diamond behind rectangles */}
          <rect
            data-diamond
            style={HIDDEN}
            x="228"
            y="108"
            width="144"
            height="144"
            strokeWidth="1"
            transform="rotate(45 300 180)"
          />

          {X_MARKS.map((m, i) => (
            <g data-x key={i} strokeWidth="1.5" style={HIDDEN}>
              <line x1={m.x - m.s} y1={m.y - m.s} x2={m.x + m.s} y2={m.y + m.s} />
              <line x1={m.x - m.s} y1={m.y + m.s} x2={m.x + m.s} y2={m.y - m.s} />
            </g>
          ))}

          {RECTS.map((r, i) => (
            <rect
              data-rect
              key={i}
              style={HIDDEN}
              x={300 - r.w / 2}
              y={r.y}
              width={r.w}
              height={r.h}
              fill="var(--geo)"
              stroke="none"
            />
          ))}

          <g data-core-x strokeWidth="2" style={HIDDEN}>
            <line x1="262" y1="142" x2="338" y2="218" />
            <line x1="262" y1="218" x2="338" y2="142" />
          </g>

          {/* beat A — triangle + circle */}
          <g data-beat-a strokeWidth="1.5" style={HIDDEN}>
            <path d="M300 118 L358 222 L242 222 Z" />
            <circle cx="300" cy="196" r="34" />
            <line x1="180" y1="180" x2="216" y2="180" />
            <line x1="384" y1="180" x2="420" y2="180" />
          </g>

          {/* beat B — diamond + bars + circle */}
          <g data-beat-b strokeWidth="1.5" style={HIDDEN}>
            <rect x="258" y="138" width="84" height="84" transform="rotate(45 300 180)" />
            <circle cx="300" cy="180" r="8" fill="var(--geo)" stroke="none" />
            <rect x="196" y="176" width="52" height="7" fill="var(--geo)" stroke="none" />
            <rect x="352" y="176" width="52" height="7" fill="var(--geo)" stroke="none" />
          </g>

          {/* system loading */}
          <g data-sys style={HIDDEN}>
            <rect x="298" y="112" width="4" height="1.5" fill="var(--geo)" stroke="none" />
            <rect x="288" y="128" width="24" height="1.5" fill="var(--geo)" stroke="none" />
            <text
              x="300"
              y="176"
              textAnchor="middle"
              className="font-mono"
              fill="var(--geo)"
              stroke="none"
              fontSize="19"
              letterSpacing="4"
            >
              SYSTEM LOADING
            </text>
            <rect x="288" y="196" width="24" height="1.5" fill="var(--geo)" stroke="none" />
            <rect
              data-sys-bar
              x="196"
              y="216"
              width="208"
              height="3"
              fill="var(--geo)"
              stroke="none"
            />
          </g>
        </svg>
      </div>

      {/* LOADING TEXT + FAR-BELOW PROGRESS LINE */}
      <div className="flex flex-col items-center gap-[10vh] pb-[7vh] sm:gap-[14vh]">
        <span
          data-loading-text
          style={HIDDEN}
          className="font-mono text-[9px] tracking-[0.3em] text-muted-foreground sm:text-[10px] sm:tracking-[0.35em]"
        >
          Loading...
        </span>
        <div className="h-px w-[min(78vw,520px)] bg-progress-track sm:w-[min(62vw,520px)]">
          <div
            ref={bar}
            className="h-px w-full origin-left bg-progress-fill"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </div>
  );
}
