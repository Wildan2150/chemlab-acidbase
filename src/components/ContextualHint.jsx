import { useId, useLayoutEffect, useRef } from 'react';
import { useContextualHelp } from '../contexts/ContextualHelpContext.jsx';
import { contextualHelp } from '../data/contextualHelp.js';
import { Icon } from './Visuals.jsx';
import useCoachmark from '../hooks/useCoachmark.js';

export default function ContextualHint({ topic, onAction, onReturnFocus }) {
  const { active, dismiss, setEnabled } = useContextualHelp();
  const titleId = useId();
  const hint = contextualHelp[topic];
  const target = active?.entry ? hint.entryTarget || hint.target : hint.target;
  const cardRef = useRef(null);
  const visible = active?.topic === topic;
  useLayoutEffect(() => {
    const card = cardRef.current;
    if (!visible || !target || !card) return;
    card.showPopover();
    return () => card.hidePopover();
  }, [visible, target]);
  const layout = useCoachmark(
    cardRef,
    visible ? target : null,
    active?.entry ? 'if-needed' : !!active?.manual,
  );
  if (!visible) return null;
  function close() {
    dismiss();
    onReturnFocus?.();
  }
  return (
    <aside
      ref={cardRef}
      popover={target ? 'manual' : undefined}
      className={`contextual-hint ${target ? 'contextual-coachmark' : ''}`}
      style={
        target
          ? { left: layout?.left, top: layout?.top, visibility: layout ? 'visible' : 'hidden' }
          : undefined
      }
      data-side={layout?.side}
      aria-labelledby={titleId}
    >
      {target && layout && (
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
      <div className="contextual-hint-heading">
        <p id={titleId} role="status">
          <Icon name="bulb" size={19} />
          <strong>{hint.title}</strong>
        </p>
        <button className="icon-button" aria-label="Tutup saran bantuan" onClick={close}>
          <Icon name="close" size={18} />
        </button>
      </div>
      {!active.manual && <p className="contextual-hint-reason">{hint.reason}</p>}
      <ol>
        {hint.steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <div className="contextual-hint-actions">
        {hint.action && onAction && (
          <button
            className="button outline"
            onClick={() => {
              dismiss();
              onAction();
            }}
          >
            {hint.action}
            <Icon name="arrow" size={15} />
          </button>
        )}
        {!active.manual && (
          <button
            className="contextual-hint-disable"
            onClick={() => {
              setEnabled(false);
              onReturnFocus?.();
            }}
          >
            Nonaktifkan bantuan otomatis
          </button>
        )}
      </div>
    </aside>
  );
}
