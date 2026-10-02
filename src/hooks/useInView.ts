import { useEffect, useRef, useState } from 'react';

/** True once the element has entered the viewport (stays true afterwards). */
export function useInView<T extends Element>(threshold = 0.35) {
  const ref = useRef<T>(null);
  // Without IntersectionObserver support, treat the element as visible.
  const [inView, setInView] = useState(() => typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [inView, threshold]);

  return [ref, inView] as const;
}
