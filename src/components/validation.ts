export type InquiryValues = {
  name: string;
  business: string;
  contact: string;
  interest: string;
  routine: string;
  consent: boolean;
};

export type InquiryErrors = Partial<Record<keyof InquiryValues, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// 09XX XXX XXXX, +63 9XX XXX XXXX, or 639XXXXXXXXX (spaces/dashes allowed)
const PH_MOBILE_RE = /^(?:09\d{9}|\+?639\d{9})$/;

export function isValidContact(value: string) {
  const v = value.trim();
  if (EMAIL_RE.test(v)) return true;
  return PH_MOBILE_RE.test(v.replace(/[\s()-]/g, ''));
}

export function validateInquiry(values: InquiryValues): InquiryErrors {
  const errors: InquiryErrors = {};
  if (values.name.trim().length < 2) errors.name = 'Please enter your name.';
  if (!values.contact.trim()) {
    errors.contact = 'Please enter a mobile number or email so we can reply.';
  } else if (!isValidContact(values.contact)) {
    errors.contact = 'Enter a PH mobile number (e.g., 0917 123 4567) or a valid email.';
  }
  if (values.routine.trim().length < 10) {
    errors.routine = 'Tell us a little about your daily routine (at least 10 characters).';
  }
  if (!values.consent) errors.consent = 'Please agree so we can use these details to reply.';
  return errors;
}
