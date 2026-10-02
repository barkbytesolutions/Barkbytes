import type { CSSProperties } from 'react';
import { team } from '../data/content';
import { SectionHeader } from './SectionHeader';
import './Team.css';

export function Team() {
  return (
    <section id="team" className="section section--soft" aria-labelledby="team-title">
      <div className="container">
        <SectionHeader id="team-title" eyebrow="The team" title="Five builders, one team.">
          Automation, data, design, testing, and web, all under one roof, so nothing gets lost between freelancers.
        </SectionHeader>
        <ul role="list" className="team__grid">
          {team.map((member, i) => (
            <li key={member.name} className="team-card" data-reveal style={{ '--reveal-i': i } as CSSProperties}>
              {/* Initials avatar until real team photos are supplied. */}
              <span className={`team-card__avatar${i % 2 ? ' team-card__avatar--accent' : ''}`} aria-hidden="true">
                {member.initials}
              </span>
              <h3 className="team-card__name">{member.name}</h3>
              <p className="team-card__role">{member.role}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
