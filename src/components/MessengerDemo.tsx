import { useEffect, useState } from 'react';
import { demoConversation } from '../data/content';
import { useInView } from '../hooks/useInView';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { Icon } from './Icon';
import './MessengerDemo.css';

/*
 * Frontend-only simulation. Nothing here talks to Messenger, Google Sheets,
 * or Telegram — it's a scripted timeline of UI states.
 */
type Frame = {
  shown: number; // how many messages are visible
  typing?: 'customer' | 'bot';
  quickReply?: boolean; // waiting for the visitor to tap "YES po"
  notify?: 'saving' | 'saved';
  hold: number; // ms before moving to the next frame
};

const timeline: Frame[] = [
  { shown: 0, typing: 'customer', hold: 900 },
  { shown: 1, hold: 450 },
  { shown: 1, typing: 'bot', hold: 1200 },
  { shown: 2, quickReply: true, hold: 2600 },
  { shown: 3, hold: 400 },
  { shown: 3, typing: 'bot', hold: 1200 },
  { shown: 4, hold: 500 },
  { shown: 4, notify: 'saving', hold: 1100 },
  { shown: 4, notify: 'saved', hold: Infinity },
];
const LAST = timeline.length - 1;

export function MessengerDemo() {
  const reducedMotion = usePrefersReducedMotion();
  const [ref, inView] = useInView<HTMLDivElement>();
  const [phase, setPhase] = useState(0);
  const current = reducedMotion ? LAST : phase;
  const frame = timeline[current];
  const running = inView && !reducedMotion && current < LAST;

  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(() => setPhase((p) => Math.min(p + 1, LAST)), frame.hold);
    return () => window.clearTimeout(t);
  }, [running, current, frame.hold]);

  const status = frame.typing === 'bot' ? 'typing…' : 'replies instantly';

  return (
    <div className="demo" ref={ref}>
      <div className="demo__card">
        <div className="demo__head">
          <span className="demo__avatar" aria-hidden="true">
            RS
          </span>
          <div className="demo__who">
            <p className="demo__name">Sample Refilling Station</p>
            <p className="demo__status">Messenger · {status}</p>
          </div>
          <span className="demo__tag">DEMO</span>
        </div>

        <ol className="demo__thread" role="list" aria-label="Sample Messenger conversation (demo)">
          {demoConversation.map((msg, i) => {
            const visible = i < frame.shown;
            const typingHere = !visible && i === frame.shown && frame.typing === msg.from;
            return (
              <li key={i} className={`demo__slot demo__slot--${msg.from}`} aria-hidden={!visible}>
                <p className={`demo__bubble${visible ? ' is-visible' : ''}`}>
                  <span className="visually-hidden">{msg.from === 'bot' ? 'Bot: ' : 'Customer: '}</span>
                  {msg.text}
                </p>
                {typingHere && (
                  <span className="demo__typing" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                )}
              </li>
            );
          })}
        </ol>

        <div className="demo__footer">
          {frame.quickReply ? (
            <button type="button" className="demo__quick" onClick={() => setPhase((p) => p + 1)}>
              Tap to reply “YES po”
            </button>
          ) : current === LAST && !reducedMotion ? (
            <button type="button" className="demo__replay" onClick={() => setPhase(0)}>
              <Icon name="replay" size={16} />
              Replay demo
            </button>
          ) : (
            <span className="demo__hint">Sample data · no real messages sent</span>
          )}
        </div>
      </div>

      <div
        className={`demo__notice${frame.notify ? ' is-visible' : ''}${frame.notify === 'saved' ? ' is-saved' : ''}`}
        role="status"
        aria-hidden={!frame.notify}
      >
        <span className="demo__bell">
          <Icon name={frame.notify === 'saved' ? 'bell' : 'sheet'} size={18} />
        </span>
        <div>
          <p className="demo__notice-title">
            {frame.notify === 'saving' ? 'Saving order to Google Sheets…' : 'New order, saved to Google Sheets'}
          </p>
          <p className="demo__notice-body">3 slim gallons · 14 Rizal St. · sent to your Telegram</p>
        </div>
      </div>
    </div>
  );
}
