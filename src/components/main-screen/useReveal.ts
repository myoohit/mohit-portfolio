import { useEffect, useRef, useState } from "react";

/** Fires once when the element enters the viewport. */
export function useReveal<T extends HTMLElement>(rootMargin = "-12% 0px -12% 0px") {
  const ref = useRef<T | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [shown, rootMargin]);

  return { ref, shown };
}
