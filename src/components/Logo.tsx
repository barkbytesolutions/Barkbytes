import './Logo.css';

type LogoProps = { href?: string; onClick?: () => void };

export function Logo({ href = '#top', onClick }: LogoProps) {
  return (
    <a className="logo" href={href} onClick={onClick} aria-label="BarkBytes, back to top">
      <svg className="logo__mark" viewBox="0 0 32 32" width="34" height="34" aria-hidden="true" focusable="false">
        <path d="M12 4.5v3M20 4.5v3" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <rect x="4" y="8" width="24" height="19" rx="6.5" fill="none" stroke="currentColor" strokeWidth="2.4" />
        <path
          d="M12.8 13.6 9.8 17.4l3 3.8M19.2 13.6l3 3.8-3 3.8M17.2 12.6l-2.4 9.6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="logo__word">BarkBytes</span>
    </a>
  );
}
