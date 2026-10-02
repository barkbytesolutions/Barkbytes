import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { navItems } from '../data/content';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { Icon } from './Icon';
import { Logo } from './Logo';
import './Header.css';

const DESKTOP_QUERY = '(min-width: 900px)';

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useScrollSpy(navItems.map((n) => n.id));
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu on Escape or when the viewport grows to desktop.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const mql = window.matchMedia(DESKTOP_QUERY);
    const onChange = () => mql.matches && setOpen(false);
    document.addEventListener('keydown', onKey);
    mql.addEventListener('change', onChange);
    return () => {
      document.removeEventListener('keydown', onKey);
      mql.removeEventListener('change', onChange);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={`header${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
      <div className="container header__bar">
        <Logo onClick={close} />

        <nav className="header__nav" aria-label="Primary">
          <ul role="list" className="header__links">
            {navItems.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="header__link" aria-current={active === item.id ? 'true' : undefined}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <a href="#contact" className="btn btn--sm header__cta">
            Book a free call
          </a>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className="header__toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          <Icon name={open ? 'close' : 'menu'} size={24} />
        </button>
      </div>

      <div id="mobile-menu" className="mobile-menu" hidden={!open}>
        <nav className="container" aria-label="Mobile">
          <ul role="list" className="mobile-menu__links">
            {navItems.map((item, i) => (
              <li key={item.id} style={{ '--i': i } as CSSProperties}>
                <a
                  href={`#${item.id}`}
                  className="mobile-menu__link"
                  aria-current={active === item.id ? 'true' : undefined}
                  onClick={close}
                >
                  {item.label}
                  <Icon name="arrowRight" size={18} />
                </a>
              </li>
            ))}
          </ul>
          <a href="#contact" className="btn btn--lg mobile-menu__cta" onClick={close}>
            Book a free call
          </a>
        </nav>
      </div>
    </header>
  );
}
