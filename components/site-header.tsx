/* oxlint-disable next/no-html-link-for-pages */

import { sitePath } from '@/components/site-path';

export function SiteHeader({ solid = false }: { solid?: boolean }) {
  return (
    <header className={solid ? 'scrolled' : ''}>
      <a href={sitePath('/')} className="logo-wrap" aria-label="Rogue Artisan home">
        <span className="logo-mark" aria-hidden="true" />
        <span className="logo">ROGUE ARTISAN</span>
      </a>

      <nav aria-label="Primary navigation">
        <a href={sitePath('/#work')}>The Work</a>
        <a href={sitePath('/#care')}>Care</a>
        <a
          href={sitePath('/commission/')}
          className="nav-commission"
          aria-label="Start Your Commission"
        >
          <span className="nav-commission-long">Start Your Commission</span>
          <span className="nav-commission-short">Commission</span>
        </a>
      </nav>
    </header>
  );
}
