import type { CSSProperties } from 'react';
import { bundle, services, type Service } from '../data/content';
import { Icon } from './Icon';
import { SectionHeader } from './SectionHeader';
import './Services.css';

type EnquireProps = { onEnquire: (interest: string) => void };

export function Services({ onEnquire }: EnquireProps) {
  return (
    <section id="services" className="section section--soft" aria-labelledby="services-title">
      <div className="container">
        <SectionHeader
          id="services-title"
          eyebrow="What we build"
          title="Six packages. Start small, grow when you're ready."
          split
        >
          Each one is built from systems we've already shipped, so you get something tested, not an experiment.
        </SectionHeader>

        <ul role="list" className="services__grid">
          {services.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} onEnquire={onEnquire} />
          ))}
        </ul>

        <Bundle onEnquire={onEnquire} />
      </div>
    </section>
  );
}

function ServiceCard({ service, index, onEnquire }: EnquireProps & { service: Service; index: number }) {
  const titleId = `service-${service.id}`;
  return (
    <li className="services__item" data-reveal style={{ '--reveal-i': index % 3 } as CSSProperties}>
      <article className="service-card" aria-labelledby={titleId}>
        <div className="service-card__top">
          <span className="service-card__num">{service.number}</span>
          <span className="service-card__badge">{service.badge}</span>
        </div>
        <h3 id={titleId} className="service-card__title">
          {service.title}
        </h3>
        <p className="service-card__desc">{service.description}</p>
        <p className="service-card__good">
          <strong>Good for:</strong> {service.goodFor}
        </p>
        <div className="service-card__foot">
          <p className="service-card__price">{service.price}</p>
          <a
            href="#contact"
            className="service-card__cta"
            onClick={() => onEnquire(service.title)}
            aria-label={`Ask about ${service.title}`}
          >
            Ask about this
            <Icon name="arrowRight" size={16} />
          </a>
        </div>
      </article>
    </li>
  );
}

function Bundle({ onEnquire }: EnquireProps) {
  return (
    <aside className="bundle" data-reveal aria-labelledby="bundle-title">
      <div className="bundle__copy">
        <p className="eyebrow eyebrow--accent">{bundle.eyebrow}</p>
        <h3 id="bundle-title" className="bundle__title">
          {bundle.title} <span className="bundle__desc">{bundle.description}</span>
        </h3>
      </div>
      <a href="#contact" className="btn btn--lg bundle__cta" onClick={() => onEnquire(bundle.interestLabel)}>
        {bundle.cta}
      </a>
      <div className="bundle__decor" aria-hidden="true">
        <span />
        <span />
      </div>
    </aside>
  );
}
