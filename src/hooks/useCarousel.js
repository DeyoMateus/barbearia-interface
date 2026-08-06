import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Hook genérico para carrosséis horizontais com scroll nativo.
 *
 * Retorna:
 * - scrollRef: ref para colocar no container com overflow-x: auto
 * - canScrollLeft / canScrollRight: se existe conteúdo cortado por aquele lado
 * - scroll(direction): rola o container suavemente para "left" ou "right"
 * - refresh(): força a reavaliação (útil após os dados chegarem da API)
 */
export function useCarousel() {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScroll = scrollWidth - clientWidth;

    // Tolerância de 1px para evitar flicker por arredondamento do navegador
    setCanScrollLeft(scrollLeft > 1);
    setCanScrollRight(scrollLeft < maxScroll - 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollState();

    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    // Reage a mudanças de tamanho do próprio container (ex: rotação de tela)
    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(el);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
      resizeObserver.disconnect();
    };
  }, [updateScrollState]);

  const scroll = useCallback((direction) => {
    const el = scrollRef.current;
    if (!el) return;

    const amount = el.clientWidth * 0.8;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }, []);

  return {
    scrollRef,
    canScrollLeft,
    canScrollRight,
    scroll,
    refresh: updateScrollState,
  };
}
