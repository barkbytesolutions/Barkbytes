import type { ReactNode } from 'react';
import './SectionHeader.css';

type SectionHeaderProps = {
  id: string;
  eyebrow: string;
  title: ReactNode;
  /** Supporting copy. Shown beside the title on wide screens when `split`. */
  children?: ReactNode;
  split?: boolean;
};

export function SectionHeader({ id, eyebrow, title, children, split = false }: SectionHeaderProps) {
  return (
    <header className={`section-header${split ? ' section-header--split' : ''}`} data-reveal>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={id} className="section-title">
          {title}
        </h2>
      </div>
      {children && <p className="lead section-header__aside">{children}</p>}
    </header>
  );
}
