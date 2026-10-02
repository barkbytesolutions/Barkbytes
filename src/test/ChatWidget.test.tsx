import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ChatWidget } from '../components/ChatWidget';

const ENDPOINT = 'https://chat.example/chat';

function streamOf(...chunks: string[]) {
  const enc = new TextEncoder();
  return new ReadableStream<Uint8Array>({
    start(c) {
      chunks.forEach((s) => c.enqueue(enc.encode(s)));
      c.close();
    },
  });
}

describe('ChatWidget', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders nothing until an endpoint is configured', () => {
    const { container } = render(<ChatWidget endpoint="" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('streams a reply and sends the conversation history', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(streamOf('We build Messenger bots. ', 'Email hi@example.com.')));
    const user = userEvent.setup();
    render(<ChatWidget endpoint={ENDPOINT} />);

    await user.click(screen.getByRole('button', { name: 'Ask BarkBytes' }));
    await user.type(screen.getByRole('textbox', { name: 'Your question' }), 'What do you build?{Enter}');

    expect(await screen.findByText(/We build Messenger bots\./)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'hi@example.com' })).toHaveAttribute('href', 'mailto:hi@example.com');

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(ENDPOINT);
    expect(JSON.parse(init!.body as string)).toEqual({
      messages: [{ role: 'user', content: 'What do you build?' }],
    });
  });

  it('shows a friendly error and drops it from the history on failure', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response('busy', { status: 429 }));
    const user = userEvent.setup();
    render(<ChatWidget endpoint={ENDPOINT} />);

    await user.click(screen.getByRole('button', { name: 'Ask BarkBytes' }));
    await user.click(screen.getByRole('button', { name: 'How does pricing work?' }));
    expect(await screen.findByText(/sending messages quickly/)).toBeInTheDocument();

    fetchMock.mockResolvedValueOnce(new Response(streamOf('Fixed prices.')));
    await user.type(screen.getByRole('textbox', { name: 'Your question' }), 'Again?{Enter}');
    await screen.findByText('Fixed prices.');
    const body = JSON.parse(fetchMock.mock.calls[1][1]!.body as string);
    expect(body.messages.map((m: { role: string }) => m.role)).toEqual(['user', 'user']);
  });

  it('adds the /chat path when the endpoint is a bare Worker address', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(streamOf('Hi!')));
    const user = userEvent.setup();
    render(<ChatWidget endpoint="https://chat.example/" />);
    await user.click(screen.getByRole('button', { name: 'Ask BarkBytes' }));
    await user.click(screen.getByRole('button', { name: 'How does pricing work?' }));
    await screen.findByText('Hi!');
    expect(fetchMock.mock.calls[0][0]).toBe('https://chat.example/chat');
  });

  it('shows a typing indicator until the first words arrive', async () => {
    let push!: (s: string) => void;
    let end!: () => void;
    const body = new ReadableStream<Uint8Array>({
      start(c) {
        push = (s) => c.enqueue(new TextEncoder().encode(s));
        end = () => c.close();
      },
    });
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(body));
    const user = userEvent.setup();
    render(<ChatWidget endpoint={ENDPOINT} />);
    await user.click(screen.getByRole('button', { name: 'Ask BarkBytes' }));
    await user.click(screen.getByRole('button', { name: 'How does pricing work?' }));

    expect(await screen.findByText('Assistant is typing…')).toBeInTheDocument();
    expect(screen.getByText('Typing…')).toBeInTheDocument();

    push('Fixed prices.');
    await screen.findByText('Fixed prices.');
    expect(screen.queryByText('Assistant is typing…')).not.toBeInTheDocument();
    end();
    await waitFor(() => expect(screen.getByText('Answers from this site only')).toBeInTheDocument());
  });

  it('closes on Escape and returns focus to the launcher', async () => {
    const user = userEvent.setup();
    render(<ChatWidget endpoint={ENDPOINT} />);
    await user.click(screen.getByRole('button', { name: 'Ask BarkBytes' }));
    expect(screen.getByRole('dialog', { name: 'Ask BarkBytes' })).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole('button', { name: 'Ask BarkBytes' })).toHaveFocus());
  });
});
