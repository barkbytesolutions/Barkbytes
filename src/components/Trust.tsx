import type { CSSProperties } from 'react';
import { trustPoints } from '../data/content';
import { Icon } from './Icon';
import './Trust.css';

export function Trust() {
  return (
    <section className="trust" aria-labelledby="trust-title">
      <h2 id="trust-title" className="visually-hidden">
        Privacy and ownership
      </h2>
      <div className="container">
        <ul role="list" className="trust__grid">
          {trustPoints.map((point, i) => (
            <li key={point.title} className="trust__card" data-reveal style={{ '--reveal-i': i } as CSSProperties}>
              <span className="trust__icon">
                <Icon name={point.icon} size={24} />
              </span>
              <div>
                <h3 className="trust__title">{point.title}</h3>
                <p className="trust__body">{point.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
