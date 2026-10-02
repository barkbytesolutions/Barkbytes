import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MessengerDemo } from '../components/MessengerDemo';

describe('MessengerDemo', () => {
  afterEach(() => vi.restoreAllMocks());

  it('shows the full conversation immediately for reduced-motion users', () => {
    vi.spyOn(window, 'matchMedia').mockImplementation(
      (query) =>
        ({ matches: query.includes('reduce'), media: query, addEventListener() {}, removeEventListener() {} }) as never,
    );
    render(<MessengerDemo />);
    expect(screen.getByText(/Order confirmed. Salamat po!/).closest('li')).toHaveAttribute('aria-hidden', 'false');
    expect(screen.getByText('New order, saved to Google Sheets')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Replay/ })).not.toBeInTheDocument();
  });

  it('starts with the conversation hidden until it scrolls into view', () => {
    render(<MessengerDemo />);
    const items = screen.getAllByRole('listitem', { hidden: true });
    expect(items).toHaveLength(4);
    items.forEach((li) => expect(li).toHaveAttribute('aria-hidden', 'true'));
  });
});
