// src/hooks/useCarousel.js
import { useRef, useState, useCallback, useEffect } from "react";

export function useCarousel() {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(true);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const refresh = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(true);
    setCanScrollRight(true);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    refresh();

    const ro = new ResizeObserver(refresh);
    ro.observe(el);
    window.addEventListener("resize", refresh);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", refresh);
    };
  }, [refresh]);

  const scroll = useCallback((direction) => {
    const el = scrollRef.current;
    if (!el) return;

    const firstChild = el.firstElementChild;
    const gapPx = 20; // Deve bater com o gap do seu styled-component
    const step = firstChild
      ? firstChild.getBoundingClientRect().width + gapPx
      : el.clientWidth * 0.8;

    const maxScrollLeft = el.scrollWidth - el.clientWidth;

    if (direction === "right") {
      // Se a posição atual + o próximo passo ultrapassar ou igualar o fim, dá a volta direto
      if (el.scrollLeft + step >= maxScrollLeft - 5) {
        el.scrollTo({ left: 0, behavior: "auto" });
        requestAnimationFrame(() => {
          el.scrollBy({ left: step, behavior: "smooth" });
        });
      } else {
        el.scrollBy({ left: step, behavior: "smooth" });
      }
    } else {
      // Se estiver voltando e o próximo passo for menor que zero, vai direto para o final
      if (el.scrollLeft - step <= 5) {
        el.scrollTo({ left: maxScrollLeft, behavior: "auto" });
        requestAnimationFrame(() => {
          el.scrollBy({ left: -step, behavior: "smooth" });
        });
      } else {
        el.scrollBy({ left: -step, behavior: "smooth" });
      }
    }
  }, []);

  return { scrollRef, canScrollLeft, canScrollRight, scroll, refresh };
}
