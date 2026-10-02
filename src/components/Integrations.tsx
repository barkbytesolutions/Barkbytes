import { integrations } from '../data/content';
import './Integrations.css';

export function Integrations() {
  return (
    <section className="integrations" aria-labelledby="integrations-title">
      <div className="container integrations__inner">
        <h2 id="integrations-title" className="integrations__label">
          Works with what you already use
        </h2>
        <ul role="list" className="integrations__list">
          {integrations.map((name) => (
            <li key={name} className="integrations__item">
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
