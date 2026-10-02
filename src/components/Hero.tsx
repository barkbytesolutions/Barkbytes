import { heroPoints } from '../data/content';
import { Icon } from './Icon';
import { MessengerDemo } from './MessengerDemo';
import './Hero.css';

export function Hero() {
  return (
    <section className="hero section--dark" aria-labelledby="hero-title">
      <div className="hero__glow" aria-hidden="true" />
      <div className="container hero__grid">
        <div className="hero__copy">
          <p className="eyebrow eyebrow--accent hero__eyebrow">IT solutions for Philippine small businesses</p>
          <h1 id="hero-title" className="hero__title">
            Automation and custom systems for small businesses.
          </h1>
          <p className="hero__lead">
            Messenger order bots, booking and payments, automated reports, landing pages, and custom apps, built for
            businesses that run on Facebook, GCash, and spreadsheets.
          </p>
          <div className="hero__actions">
            <a href="#contact" className="btn btn--lg">
              Book a free consultation
            </a>
            <a href="#services" className="btn btn--lg btn--ghost-dark">
              See our packages
            </a>
          </div>
          <ul role="list" className="hero__points">
            {heroPoints.map((point) => (
              <li key={point}>
                <Icon name="check" size={18} />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="hero__demo">
          <MessengerDemo />
        </div>
      </div>
    </section>
  );
}
