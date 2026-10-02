import { describe, expect, it } from 'vitest';
import { isValidContact, validateInquiry } from '../components/validation';

const valid = {
  name: 'Juan Dela Cruz',
  business: '',
  contact: '0917 123 4567',
  interest: 'Not sure yet',
  routine: 'I copy orders into a notebook every night.',
  consent: true,
};

describe('isValidContact', () => {
  it.each(['0917 123 4567', '09171234567', '+63 917 123 4567', '639171234567', 'juan@example.com'])(
    'accepts %s',
    (value) => expect(isValidContact(value)).toBe(true),
  );

  it.each(['12345', '0917 123', 'juan@', 'juan@example', 'hello world'])('rejects %s', (value) =>
    expect(isValidContact(value)).toBe(false),
  );
});

describe('validateInquiry', () => {
  it('passes a complete inquiry (business name is optional)', () => {
    expect(validateInquiry(valid)).toEqual({});
  });

  it('flags every required field', () => {
    const errors = validateInquiry({ ...valid, name: ' ', contact: '', routine: 'short', consent: false });
    expect(Object.keys(errors).sort()).toEqual(['consent', 'contact', 'name', 'routine']);
  });

  it('explains an invalid contact format', () => {
    expect(validateInquiry({ ...valid, contact: '123' }).contact).toMatch(/PH mobile number/);
  });
});
