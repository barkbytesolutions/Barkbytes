import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Icon } from './Icon';
import './ChatWidget.css';

/*
 * "Ask BarkBytes" chat. Talks to the Cloudflare Worker in /worker, which
 * streams Gemini replies grounded in src/data/content.ts. Renders nothing
 * until VITE_CHAT_ENDPOINT is set (see worker/README.md).
 */
const ENDPOINT: string = import.meta.env.VITE_CHAT_ENDPOINT ?? '';
const MAX_CHARS = 800;
const HINT_DELAY = 1500;

const suggestions = [
  'Can you build a Messenger bot for my shop?',
  'Paano gumagana ang GCash booking?',
  'How does pricing work?',
];

type Turn = { role: 'user' | 'assistant'; content: string; error?: boolean };

const CONTACT_TEXT = 'You can reach the team through the Contact form on this page.';

export function ChatWidget({ endpoint = ENDPOINT }: { endpoint?: string }) {
  const [open, setOpen] = useState(false);
  const [hint, setHint] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const fabRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const hintDismissed = useRef(false);

  useEffect(() => {
    if (!endpoint) return;
    const t = window.setTimeout(() => {
      if (!hintDismissed.current) setHint(true);
    }, HINT_DELAY);
    return () => window.clearTimeout(t);
  }, [endpoint]);

  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [turns, busy]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      window.requestAnimationFrame(() => fabRef.current?.focus());
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  if (!endpoint) return null;

  const dismissHint = () => {
    hintDismissed.current = true;
    setHint(false);
  };

  const show = (next: boolean) => {
    dismissHint();
    setOpen(next);
    // Wait for the panel/FAB to mount before moving focus.
    window.requestAnimationFrame(() => (next ? inputRef.current : fabRef.current)?.focus());
  };

  async function ask(question: string) {
    if (busy || !question) return;
    const history: Turn[] = [...turns.filter((t) => !t.error), { role: 'user', content: question }];
    setTurns(history);
    setBusy(true);

    let reply = '';
    const update = (content: string, error = false) => setTurns([...history, { role: 'assistant', content, error }]);

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history.map(({ role, content }) => ({ role, content })) }),
      });
      if (res.status === 429) throw new Error('rate');
      if (!res.ok || !res.body) throw new Error(`status ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      setStreaming(true);
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        reply += decoder.decode(value, { stream: true });
        update(reply);
      }
      reply += decoder.decode();
      if (!reply.trim()) throw new Error('empty');
      update(reply);
    } catch (err) {
      const rate = err instanceof Error && err.message === 'rate';
      update(
        rate
          ? "You're sending messages quickly. Give it a minute and try again."
          : `Sorry, I couldn't reach the assistant. ${CONTACT_TEXT}`,
        true,
      );
    } finally {
      setBusy(false);
      setStreaming(false);
      inputRef.current?.focus();
    }
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = draft.trim();
    if (!q || busy) return;
    setDraft('');
    void ask(q);
  };

  return (
    <>
      {!open && (
        <button
          ref={fabRef}
          type="button"
          className="chat-fab"
          aria-label="Ask BarkBytes"
          aria-controls="chat-panel"
          aria-expanded={false}
          onClick={() => show(true)}
        >
          <Icon name="message" size={20} />
          <span className="chat-fab__label" aria-hidden="true">
            Ask BarkBytes
          </span>
        </button>
      )}

      {hint && !open && (
        <div className="chat-hint">
          <button type="button" className="chat-hint__text" onClick={() => show(true)}>
            Hi! Ask us what we can build for your business.
          </button>
          <button type="button" className="chat-hint__close" aria-label="Dismiss" onClick={dismissHint}>
            <Icon name="close" size={16} />
          </button>
        </div>
      )}

      {open && (
        <section id="chat-panel" className="chat-panel" role="dialog" aria-modal="false" aria-labelledby="chat-title">
          <div className="chat-panel__head">
            <div>
              <h2 id="chat-title" className="chat-panel__title">
                Ask BarkBytes
              </h2>
              <p className="chat-panel__sub">Answers from this site only</p>
            </div>
            <button type="button" className="chat-panel__close" aria-label="Close chat" onClick={() => show(false)}>
              <Icon name="close" size={18} />
            </button>
          </div>

          <div className="chat-log" ref={logRef} aria-live="polite">
            <p className="chat-msg chat-msg--bot">
              Hi! I can answer questions about BarkBytes&rsquo; services, past work, and how we work.
            </p>
            {turns.length === 0 && (
              <div className="chat-suggest">
                {suggestions.map((s) => (
                  <button key={s} type="button" onClick={() => void ask(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}
            {turns.map((t, i) => (
              <p
                key={i}
                className={`chat-msg chat-msg--${t.role === 'user' ? 'me' : 'bot'}${t.error ? ' chat-msg--err' : ''}`}
              >
                <span className="visually-hidden">{t.role === 'user' ? 'You: ' : 'Assistant: '}</span>
                {linkify(t.content)}
              </p>
            ))}
            {busy && !streaming && (
              <p className="chat-msg chat-msg--bot chat-msg--typing">
                <span className="visually-hidden">Assistant is typing</span>
              </p>
            )}
          </div>

          <form className="chat-form" onSubmit={onSubmit}>
            <input
              ref={inputRef}
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              maxLength={MAX_CHARS}
              autoComplete="off"
              placeholder="Ask about our services…"
              aria-label="Your question"
            />
            <button type="submit" aria-label="Send" disabled={busy}>
              <Icon name="send" size={18} />
            </button>
          </form>
          <p className="chat-note">AI-generated answers. For quotes and bookings, use the Contact form.</p>
        </section>
      )}
    </>
  );
}

const LINK_RE = /(https?:\/\/[^\s)]+[^\s).,;:!?])|([\w.+-]+@[\w-]+\.[\w.-]*\w)/g;

/** Turns URLs and email addresses in plain text into links, without rendering HTML. */
function linkify(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(LINK_RE)) {
    out.push(text.slice(last, m.index));
    out.push(
      m[1] ? (
        <a key={m.index} href={m[1]} target="_blank" rel="noopener noreferrer">
          {m[0]}
        </a>
      ) : (
        <a key={m.index} href={`mailto:${m[2]}`}>
          {m[0]}
        </a>
      ),
    );
    last = m.index + m[0].length;
  }
  out.push(text.slice(last));
  return out;
}
