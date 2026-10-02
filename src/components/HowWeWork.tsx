import type { CSSProperties } from 'react';
import { steps } from '../data/content';
import { SectionHeader } from './SectionHeader';
import './HowWeWork.css';

export function HowWeWork() {
  return (
    <section id="how" className="section how" aria-labelledby="how-title">
      <div className="container">
        <SectionHeader id="how-title" eyebrow="How we work" title="Clear steps, fixed prices, no guesswork." />
        <ol role="list" className="steps">
          {steps.map((step, i) => (
            <li key={step.title} className="step" data-reveal style={{ '--reveal-i': i } as CSSProperties}>
              <span className="step__num" aria-hidden="true">
                {i + 1}
              </span>
              <h3 className="step__title">
                <span className="visually-hidden">Step {i + 1}: </span>
                {step.title}
              </h3>
              <p className="step__body">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
