import { useRef, useState } from "react";

/**
 * Editorial photograph, placed onto the interface.
 *
 * To use a real photo: drop the file in src/assets and pass it in —
 *   import portrait from "@/assets/portrait.jpg";
 *   <Polaroid src={portrait} alt="Mohit Ramesh" />
 * No other change is needed.
 */
export function Polaroid({
  src,
  alt = "",
  caption = "MR — 2026",
  className,
}: {
  src?: string;
  alt?: string;
  caption?: string;
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [tilt, setTilt] = useState<{ x: number; y: number } | null>(null);

  return (
    <div style={{ perspective: "900px" }}>
      <figure
        ref={ref}
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse") return;
          const r = e.currentTarget.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          setTilt({ x: -py * 2.2, y: px * 2.2 });
        }}
        onPointerLeave={() => setTilt(null)}
        className={`group relative w-[min(78vw,320px)] bg-card p-3 pb-10 shadow-[0_18px_40px_-28px_oklch(0_0_0/0.55)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform sm:w-[350px] ${className ?? ""}`}
        style={{
          transform: tilt
            ? `rotate(-2.1deg) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(6px)`
            : "rotate(-2.1deg)",
        }}
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
          {src ? (
            <img
              src={src}
              alt={alt}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground/70">
                PHOTOGRAPH
              </span>
              <span
                aria-hidden="true"
                className="absolute top-3 left-3 h-3 w-3 border-t border-l border-border"
              />
              <span
                aria-hidden="true"
                className="absolute right-3 bottom-3 h-3 w-3 border-r border-b border-border"
              />
            </div>
          )}
        </div>
        <figcaption className="absolute right-3 bottom-3 left-3 flex items-center justify-between font-mono text-[9px] tracking-[0.28em] text-muted-foreground">
          <span>{caption}</span>
          <span aria-hidden="true" className="h-px w-6 bg-accent/70" />
        </figcaption>
      </figure>
    </div>
  );
}
