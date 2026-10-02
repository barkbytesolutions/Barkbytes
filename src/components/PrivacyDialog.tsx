import { useEffect, useRef } from 'react';
import { site } from '../data/content';
import { Icon } from './Icon';
import './PrivacyDialog.css';

type PrivacyDialogProps = { open: boolean; onClose: () => void };

/**
 * Placeholder privacy notice. Only restates what the reference design says;
 * the full notice must be written (and legally reviewed) before launch.
 */
export function PrivacyDialog({ open, onClose }: PrivacyDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal?.();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="privacy"
      aria-labelledby="privacy-title"
      onClose={onClose}
      onClick={(e) => {
        // Clicking the backdrop (the dialog element itself) closes it.
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="privacy__inner">
        <div className="privacy__head">
          <h2 id="privacy-title" className="privacy__title">
            Privacy notice
          </h2>
          <button type="button" className="privacy__close" onClick={onClose} aria-label="Close privacy notice">
            <Icon name="close" size={22} />
          </button>
        </div>
        <p>We follow Data Privacy Act basics on every build: consent, secure storage, and a clear privacy notice.</p>
        <h3>What this form collects</h3>
        <p>
          Your name, business name, mobile number or email, the service you're interested in, and a description of your
          daily routine. {site.legalName} uses these details only to reply to your inquiry.
        </p>
        <div className="privacy__placeholder">
          [PRIVACY NOTICE — full text, retention period, and data protection contact to be provided]
        </div>
        <button type="button" className="btn btn--dark privacy__done" onClick={onClose}>
          Close
        </button>
      </div>
    </dialog>
  );
}
