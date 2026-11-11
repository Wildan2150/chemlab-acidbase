import { useLayoutEffect, useState } from 'react';

// Recalculate against the live element, including sidebar scroll and text zoom.
export default function useCoachmark(cardRef, selector, scrollTarget = true) {
  const [layout, setLayout] = useState(null);
  useLayoutEffect(() => {
    if (!selector) {
      if (cardRef.current) cardRef.current.style.maxHeight = '';
      setLayout(null);
      return;
    }
    const target = document.querySelector(selector);
    const card = cardRef.current;
    if (!target || !card) {
      setLayout(null);
      return;
    }
    const initialRect = target.getBoundingClientRect();
    if (
      scrollTarget &&
      (scrollTarget !== 'if-needed' || initialRect.top < 0 || initialRect.bottom > innerHeight)
    )
      target.scrollIntoView({
        block: scrollTarget === 'if-needed' ? 'nearest' : innerWidth <= 780 ? 'start' : 'nearest',
        behavior: 'instant',
      });
    const update = () => {
      const rect = target.getBoundingClientRect();
      if (!rect.width || !rect.height || rect.bottom < 0 || rect.top > innerHeight) {
        setLayout(null);
        return;
      }
      const gap = 18;
      const margin = 16;
      const width = card.offsetWidth;
      const right = innerWidth - rect.right >= width + gap + margin;
      const available = Math.max(innerHeight - rect.bottom - gap - margin, rect.top - gap - margin);
      card.style.maxHeight = `${right ? innerHeight - 32 : Math.max(180, available)}px`;
      const height = card.offsetHeight;
      const below = innerHeight - rect.bottom >= height + gap + margin;
      const above = rect.top >= height + gap + margin;
      const side = right ? 'right' : below ? 'bottom' : above ? 'top' : 'bottom';
      const left = right
        ? rect.right + gap
        : Math.min(
            Math.max(margin, rect.left + rect.width / 2 - width / 2),
            innerWidth - width - margin,
          );
      const top = Math.min(
        Math.max(
          margin,
          right ? rect.top - 12 : side === 'top' ? rect.top - height - gap : rect.bottom + gap,
        ),
        innerHeight - height - margin,
      );
      const arrow = right
        ? Math.max(24, Math.min(height - 24, rect.top + rect.height / 2 - top))
        : Math.max(24, Math.min(width - 24, rect.left + rect.width / 2 - left));
      setLayout({
        left,
        top,
        side,
        arrow,
        height,
        rect: {
          x: rect.left - 5,
          y: rect.top - 5,
          width: rect.width + 10,
          height: rect.height + 10,
        },
      });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(card);
    observer.observe(target);
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [selector, cardRef, scrollTarget]);
  return layout;
}
