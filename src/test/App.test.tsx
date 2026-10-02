import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { navItems, services } from '../data/content';

describe('App', () => {
  const fetchSpy = vi.fn();
  const xhrSpy = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchSpy);
    vi.spyOn(XMLHttpRequest.prototype, 'open').mockImplementation(xhrSpy);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    fetchSpy.mockReset();
    xhrSpy.mockReset();
  });

  it('renders a single h1 and every section heading', () => {
    render(<App />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    for (const title of [
      "Six packages. Start small, grow when you're ready.",
      'Already built. Already running.',
      'Clear steps, fixed prices, no guesswork.',
      'Five builders, one team.',
      "What eats up your day? Let's automate it.",
    ]) {
      expect(screen.getByRole('heading', { level: 2, name: title })).toBeInTheDocument();
    }
  });

  it('points every in-page link at an element that exists', () => {
    const { container } = render(<App />);
    const anchors = container.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');
    expect(anchors.length).toBeGreaterThan(navItems.length);
    anchors.forEach((a) => {
      const id = a.getAttribute('href')!.slice(1);
      expect(document.getElementById(id), `#${id}`).not.toBeNull();
    });
  });

  it('has no duplicate element ids', () => {
    const { container } = render(<App />);
    const ids = [...container.querySelectorAll('[id]')].map((el) => el.id);
    expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([]);
  });

  it('opens and closes the mobile menu', async () => {
    const user = userEvent.setup();
    render(<App />);
    const toggle = screen.getByRole('button', { name: 'Open menu' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('navigation', { name: 'Mobile' })).toBeVisible();

    await user.keyboard('{Escape}');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveFocus();
  });

  it('pre-selects the interest when a package CTA is used', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('link', { name: `Ask about ${services[1].title}` }));
    expect(screen.getByLabelText('What are you interested in?')).toHaveValue(services[1].title);

    await user.click(screen.getByRole('link', { name: 'Ask about the bundle' }));
    expect(screen.getByLabelText('What are you interested in?')).toHaveValue('Landing page + Messenger bot bundle');
  });

  it('shows validation errors and focuses the first invalid field', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Book my free consultation' }));

    expect(screen.getByText('Please enter your name.')).toBeInTheDocument();
    expect(screen.getByText(/mobile number or email so we can reply/)).toBeInTheDocument();
    expect(screen.getByText(/at least 10 characters/)).toBeInTheDocument();
    expect(screen.getByText(/Please agree/)).toBeInTheDocument();
    expect(screen.getByLabelText('Your name')).toHaveFocus();
    expect(screen.getByLabelText('Your name')).toHaveAttribute('aria-invalid', 'true');

    // Errors clear live once the field is fixed.
    await user.type(screen.getByLabelText('Your name'), 'Juan');
    expect(screen.queryByText('Please enter your name.')).not.toBeInTheDocument();
  });

  it('simulates a submission without any network request', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByLabelText('Your name'), 'Juan Dela Cruz');
    await user.type(screen.getByLabelText('Mobile number or email'), '0917 123 4567');
    await user.type(screen.getByLabelText('What do you do by hand every day?'), 'I total sales by hand every night.');
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: 'Book my free consultation' }));

    expect(screen.getByRole('button', { name: /Sending/ })).toBeDisabled();
    const success = await screen.findByText('Salamat, Juan!', {}, { timeout: 3000 });
    expect(within(success.parentElement!).getByText(/nothing was actually sent/)).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(xhrSpy).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Send another inquiry' }));
    expect(screen.getByLabelText('Your name')).toHaveValue('');
  });

  it('opens the privacy notice from the consent label', async () => {
    const user = userEvent.setup();
    // jsdom lacks <dialog> methods; emulate the open attribute.
    HTMLDialogElement.prototype.showModal = function () {
      this.setAttribute('open', '');
    };
    HTMLDialogElement.prototype.close = function () {
      this.removeAttribute('open');
    };
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'privacy notice' }));
    await waitFor(() => expect(screen.getByRole('dialog', { name: 'Privacy notice' })).toBeVisible());
    await user.click(screen.getByRole('button', { name: 'Close privacy notice' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
