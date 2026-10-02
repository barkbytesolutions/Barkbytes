import { useState, type CSSProperties } from 'react';
import { site } from '../data/content';
import { ContactForm } from './ContactForm';
import { Icon } from './Icon';
import './Contact.css';

type ContactProps = {
  interest: string;
  onInterestChange: (interest: string) => void;
  onOpenPrivacy: () => void;
};

export function Contact({ interest, onInterestChange, onOpenPrivacy }: ContactProps) {
  const [messengerNote, setMessengerNote] = useState(false);

  return (
    <section id="contact" className="section section--dark contact" aria-labelledby="contact-title">
      <div className="container contact__grid">
        <div className="contact__copy" data-reveal>
          <p className="eyebrow eyebrow--accent">Let's talk</p>
          <h2 id="contact-title" className="contact__title">
            What eats up your day? Let's automate it.
          </h2>
          <p className="contact__lead">
            Book a free consultation. Tell us how your business runs, and we'll show you what's worth automating first.
          </p>

          <ul role="list" className="contact__list">
            <li>
              {site.messengerUrl ? (
                <a
                  className="contact__item contact__item--link"
                  href={site.messengerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon name="message" />
                  Message us on Messenger
                </a>
              ) : (
                <button
                  type="button"
                  className="contact__item contact__item--link"
                  onClick={() => setMessengerNote(true)}
                  aria-describedby={messengerNote ? 'messenger-note' : undefined}
                >
                  <Icon name="message" />
                  Message us on Messenger
                </button>
              )}
              <p id="messenger-note" className="contact__note" role="status">
                {messengerNote ? 'Our Messenger link is coming soon. For now, use the form and we’ll reply.' : ''}
              </p>
            </li>
            <li className="contact__item">
              <Icon name="mail" />
              <span className="contact__strong">{site.email}</span>
            </li>
            <li className="contact__item">
              <Icon name="pin" />
              {site.location}
            </li>
          </ul>
        </div>

        <div data-reveal style={{ '--reveal-i': 1 } as CSSProperties}>
          <ContactForm interest={interest} onInterestChange={onInterestChange} onOpenPrivacy={onOpenPrivacy} />
        </div>
      </div>
    </section>
  );
}
