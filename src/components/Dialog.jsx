import { useEffect, useId, useRef } from 'react';
import { Icon } from './Visuals.jsx';
import useCoachmark from '../hooks/useCoachmark.js';

export default function Dialog({
  title,
  onClose,
  children,
  className = '',
  focusTitle = false,
  returnFocusRef,
  spotlight,
}) {
  const ref = useRef(null);
  const titleRef = useRef(null);
  const cardRef = useRef(null);
  const titleId = useId();
  const maskId = useId().replaceAll(':', '');
  const isCoachmark = spotlight !== undefined;
  const layout = useCoachmark(cardRef, spotlight);
  useEffect(() => {
    const node = ref.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    node.showModal();
    return () => {
      node.close();
      document.body.style.overflow = previousOverflow;
      returnFocusRef?.current?.focus({ preventScroll: true });
    };
  }, [returnFocusRef]);
  useEffect(() => {
    if (focusTitle) {
      titleRef.current?.focus({ preventScroll: true });
      ref.current.scrollTop = 0;
      if (cardRef.current) cardRef.current.scrollTop = 0;
    }
  }, [focusTitle, title]);
  return (
    <dialog
      ref={ref}
      className={`dialog ${className} ${isCoachmark ? 'coachmark-dialog' : ''}`}
      data-targeted={spotlight ? 'true' : undefined}
      data-target={spotlight || undefined}
      aria-labelledby={titleId}
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return;
        const focusable = [
          ...ref.current.querySelectorAll(
            'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]',
          ),
        ].filter((node) => node.getClientRects().length);
        const first = focusable[0];
        const last = focusable.at(-1);
        if (
          event.shiftKey &&
          (document.activeElement === first || document.activeElement === titleRef.current)
        ) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          if (isCoachmark) {
            onClose();
            return;
          }
          const rect = e.currentTarget.getBoundingClientRect();
          if (
            e.clientX < rect.left ||
            e.clientX > rect.right ||
            e.clientY < rect.top ||
            e.clientY > rect.bottom
          )
            onClose();
        }
      }}
    >
      {isCoachmark && (
        <svg className="coachmark-shade" aria-hidden="true" width="100%" height="100%">
          <defs>
            <mask id={maskId}>
              <rect width="100%" height="100%" fill="white" />
              {layout && <rect {...layout.rect} rx="10" fill="black" />}
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="#10291f"
            fillOpacity="0.62"
            mask={`url(#${maskId})`}
          />
          {layout && <rect {...layout.rect} rx="10" fill="none" stroke="#d8edaa" strokeWidth="3" />}
        </svg>
      )}
      <div
        ref={cardRef}
        className={
          isCoachmark ? `coachmark-card ${layout ? 'is-anchored' : 'is-centered'}` : undefined
        }
        style={
          layout
            ? { left: layout.left, top: layout.top, '--coachmark-arrow': `${layout.arrow}px` }
            : undefined
        }
        data-side={layout?.side}
      >
        {layout && (
          <span
            className="coachmark-arrow"
            aria-hidden="true"
            style={{
              left: layout.side === 'right' ? layout.left - 7 : layout.left + layout.arrow - 7,
              top:
                layout.side === 'right'
                  ? layout.top + layout.arrow - 7
                  : layout.side === 'bottom'
                    ? layout.top - 7
                    : layout.top + layout.height - 7,
            }}
          />
        )}
        <div className="dialog-heading">
          <h2 id={titleId} ref={titleRef} tabIndex={focusTitle ? -1 : undefined}>
            {title}
          </h2>
          <button className="icon-button" aria-label="Tutup dialog" onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
