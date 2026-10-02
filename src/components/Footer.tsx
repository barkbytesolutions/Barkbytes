import { site } from '../data/content';
import { Logo } from './Logo';
import './Footer.css';

type FooterProps = { onOpenPrivacy: () => void };

export function Footer({ onOpenPrivacy }: FooterProps) {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <Logo />
          <p className="footer__copy">
            © {site.year} {site.legalName} · {site.location}
          </p>
        </div>
        <nav aria-label="Footer">
          <ul role="list" className="footer__links">
            <li>
              <button type="button" className="footer__link" onClick={onOpenPrivacy}>
                Privacy notice
              </button>
            </li>
            <li>
              <a className="footer__link" href="#services">
                Services
              </a>
            </li>
            <li>
              <a className="footer__link" href="#top">
                Back to top
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
