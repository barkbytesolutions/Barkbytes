import type { CSSProperties, JSX } from 'react';
import { projects, type Project } from '../data/content';
import { BookingMockup, BotMockup } from './ProjectMockups';
import { SectionHeader } from './SectionHeader';
import './Work.css';

const visuals: Record<Project['id'], () => JSX.Element> = {
  booking: BookingMockup,
  bot: BotMockup,
};

export function Work() {
  return (
    <section id="work" className="section section--soft work" aria-labelledby="work-title">
      <div className="container">
        <SectionHeader id="work-title" eyebrow="Our work" title="Already built. Already running." />
        <ul role="list" className="work__grid">
          {projects.map((project, i) => (
            <li key={project.id} data-reveal style={{ '--reveal-i': i } as CSSProperties}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const Visual = visuals[project.id];
  const titleId = `project-${project.id}`;
  return (
    <article className="project-card" aria-labelledby={titleId}>
      <figure className={`project-card__visual project-card__visual--${project.id}`}>
        <div role="img" aria-label={project.visualLabel} className="project-card__art">
          <Visual />
        </div>
        <figcaption className="project-card__caption">Illustration · sample data</figcaption>
      </figure>
      <div className="project-card__body">
        <p className="eyebrow project-card__client">{project.client}</p>
        <h3 id={titleId} className="project-card__title">
          {project.title}
        </h3>
        <p className="project-card__desc">{project.description}</p>
        <ul role="list" className="project-card__tags" aria-label="Features">
          {project.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
        <p className="project-card__result">
          <strong>Result:</strong> {project.result}
        </p>
      </div>
    </article>
  );
}
