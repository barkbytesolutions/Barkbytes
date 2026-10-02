import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { interestOptions } from '../data/content';
import { Icon } from './Icon';
import { validateInquiry, type InquiryErrors, type InquiryValues } from './validation';
import './ContactForm.css';

/** How long the simulated "submission" spins before showing success. */
export const SIMULATED_DELAY_MS = 1200;

type ContactFormProps = {
  interest: string;
  onInterestChange: (interest: string) => void;
  onOpenPrivacy: () => void;
};

type Status = 'idle' | 'submitting' | 'success';

const emptyValues = (interest: string): InquiryValues => ({
  name: '',
  business: '',
  contact: '',
  interest,
  routine: '',
  consent: false,
});

const fieldOrder: (keyof InquiryValues)[] = ['name', 'business', 'contact', 'interest', 'routine', 'consent'];

/*
 * FRONTEND ONLY: this form validates and simulates a submission. It makes no
 * network request. Wire `submitInquiry` to a real endpoint when the backend exists.
 */
async function submitInquiry(values: InquiryValues) {
  void values;
  await new Promise((resolve) => window.setTimeout(resolve, SIMULATED_DELAY_MS));
}

export function ContactForm({ interest, onInterestChange, onOpenPrivacy }: ContactFormProps) {
  const [values, setValues] = useState<InquiryValues>(() => emptyValues(interest));
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  // Keep the select in sync when a service card's "Ask about this" is used.
  // Adjusting state during render avoids an extra effect pass.
  const [syncedInterest, setSyncedInterest] = useState(interest);
  if (interest !== syncedInterest) {
    setSyncedInterest(interest);
    setValues((v) => ({ ...v, interest }));
  }

  useEffect(() => {
    if (status === 'success') successRef.current?.focus();
  }, [status]);

  const update = (next: InquiryValues) => {
    setValues(next);
    if (attempted) setErrors(validateInquiry(next));
  };

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const checked = e.target instanceof HTMLInputElement && e.target.type === 'checkbox' ? e.target.checked : undefined;
    const next = { ...values, [name]: checked ?? value };
    update(next);
    if (name === 'interest') onInterestChange(value);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'submitting') return;
    setAttempted(true);
    const found = validateInquiry(values);
    setErrors(found);
    const firstInvalid = fieldOrder.find((f) => found[f]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }
    setStatus('submitting');
    await submitInquiry(values);
    setStatus('success');
  };

  const reset = () => {
    setValues(emptyValues(values.interest));
    setErrors({});
    setAttempted(false);
    setStatus('idle');
  };

  if (status === 'success') {
    return (
      <div className="inquiry inquiry--success" ref={successRef} tabIndex={-1} role="status" aria-live="polite">
        <span className="inquiry__success-icon">
          <Icon name="check" size={30} />
        </span>
        <h3 className="inquiry__success-title">Salamat, {values.name.trim().split(' ')[0]}!</h3>
        <p className="inquiry__success-body">
          Your consultation request is ready. We'll reach out through <strong>{values.contact.trim()}</strong> to set a
          time.
        </p>
        <p className="inquiry__demo-note">
          Demo mode: this form isn't connected to a server yet, so nothing was actually sent.
        </p>
        <button type="button" className="btn btn--dark" onClick={reset}>
          Send another inquiry
        </button>
      </div>
    );
  }

  const submitting = status === 'submitting';

  return (
    <form ref={formRef} className="inquiry" noValidate onSubmit={onSubmit} aria-labelledby="inquiry-title">
      <h3 id="inquiry-title" className="visually-hidden">
        Free consultation request
      </h3>
      <fieldset className="inquiry__fields" disabled={submitting}>
        <div className="inquiry__row">
          <Field id="inquiry-name" label="Your name" error={errors.name}>
            <input
              id="inquiry-name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Juan Dela Cruz"
              value={values.name}
              onChange={onChange}
              {...errorProps('name', errors)}
            />
          </Field>
          <Field id="inquiry-business" label="Business name" hint="Optional" error={errors.business}>
            <input
              id="inquiry-business"
              name="business"
              type="text"
              autoComplete="organization"
              placeholder="Your business"
              value={values.business}
              onChange={onChange}
            />
          </Field>
        </div>

        <Field id="inquiry-contact" label="Mobile number or email" error={errors.contact}>
          <input
            id="inquiry-contact"
            name="contact"
            type="text"
            inputMode="email"
            autoComplete="email"
            placeholder="09XX XXX XXXX"
            value={values.contact}
            onChange={onChange}
            {...errorProps('contact', errors)}
          />
        </Field>

        <Field id="inquiry-interest" label="What are you interested in?">
          <select id="inquiry-interest" name="interest" value={values.interest} onChange={onChange}>
            {interestOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </Field>

        <Field id="inquiry-routine" label="What do you do by hand every day?" error={errors.routine}>
          <textarea
            id="inquiry-routine"
            name="routine"
            rows={4}
            placeholder="e.g., I copy orders from Messenger into a notebook, then total sales every night."
            value={values.routine}
            onChange={onChange}
            {...errorProps('routine', errors)}
          />
        </Field>

        <div className={`inquiry__consent${errors.consent ? ' has-error' : ''}`}>
          <input
            id="inquiry-consent"
            name="consent"
            type="checkbox"
            checked={values.consent}
            onChange={onChange}
            {...errorProps('consent', errors)}
          />
          <label htmlFor="inquiry-consent">
            I agree that BarkBytes may use these details to reply to my inquiry, as described in the{' '}
            <button type="button" className="inquiry__link" onClick={onOpenPrivacy}>
              privacy notice
            </button>
            .
          </label>
          {errors.consent && (
            <p id="inquiry-consent-error" className="inquiry__error inquiry__error--consent">
              {errors.consent}
            </p>
          )}
        </div>
      </fieldset>

      <button type="submit" className="btn btn--lg btn--dark inquiry__submit" disabled={submitting}>
        {submitting ? (
          <>
            <span className="inquiry__spinner" aria-hidden="true" />
            Sending…
          </>
        ) : (
          'Book my free consultation'
        )}
      </button>
      <p className="visually-hidden" role="status" aria-live="polite">
        {submitting ? 'Sending your request…' : ''}
      </p>
    </form>
  );
}

function errorProps(field: keyof InquiryValues, errors: InquiryErrors) {
  return errors[field] ? { 'aria-invalid': true, 'aria-describedby': `inquiry-${field}-error` } : {};
}

type FieldProps = { id: string; label: string; hint?: string; error?: string; children: ReactNode };

function Field({ id, label, hint, error, children }: FieldProps) {
  return (
    <div className={`inquiry__field${error ? ' has-error' : ''}`}>
      <label htmlFor={id} className="inquiry__label">
        {label}
        {hint && <span className="inquiry__hint"> ({hint})</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="inquiry__error">
          {error}
        </p>
      )}
    </div>
  );
}
