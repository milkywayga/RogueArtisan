'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { sitePath } from '@/components/site-path';

const media = {
  ctaVideo: sitePath('/media/VID-20260731-WA0040.mp4'),
  hero: sitePath('/media/Hero 20260907.jpg'),
};

const moss = [
  ['moss-01', 'Card wallet held open in the flower garden — black interior, tan saddle stitch'],
  ['moss-02', 'Olive card holder and raven key fob on weathered cedar'],
  // ... additional entries
] as const;

type LightboxItem = {
  type: 'image' | 'video';
  src: string;
  alt: string;
  galleryIndex?: number;
  galleryTotal?: number;
};

type OpenLightbox = (item: LightboxItem, trigger?: HTMLElement | null) => void;
const LightboxContext = createContext<OpenLightbox>(() => undefined);

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setInView(true),
      { threshold: 0, rootMargin: '0px 0px -10% 0px' },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, inView] as const;
}

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number; }) {
  const [ref, inView] = useReveal();
  return (
    <div ref={ref} className={`reveal ${inView ? 'in' : ''} ${className}`} style={{ transitionDelay: `${inView ? delay : 0}ms` }}>
      {children}
    </div>
  );
}

function MagneticLink({ children, className = '', href }: { children: ReactNode; className?: string; href: string; }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const handleMove = (event: MouseEvent<HTMLAnchorElement>) => {
    const element = ref.current;
    if (element) {
      const bounds = element.getBoundingClientRect();
      element.style.transform = `translate(${(event.clientX - bounds.left - bounds.width / 2) * 0.35}px, ${(event.clientY - bounds.top - bounds.height / 2) * 0.35}px)`;
    }
  };

  const handleLeave = () => ref.current && (ref.current.style.transform = 'translate(0,0)');

  return (
    <a ref={ref} href={href} className={`magnetic ${className}`} onMouseMove={handleMove} onMouseLeave={handleLeave}>
      {children}
    </a>
  );
}

function CustomCursor() {
  // Custom cursor hook implementation remains the same
}

function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const root = document.documentElement;
      const distance = root.scrollHeight - root.clientHeight;
      setProgress(distance > 0 ? (root.scrollTop / distance) * 100 : 0);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return <div className="scroll-progress" style={{ width: `${progress}%` }} aria-hidden="true" />;
}

function Lightbox({ item, onClose, onNavigate, returnFocus }: { item: LightboxItem | null; onClose: () => void; onNavigate: (index: number) => void; returnFocus: HTMLElement | null; }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  // Lightbox implementation remains the same...

  if (!item) return null; 
  // Additional rendering logic...
}

function StickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => {
      const commission = document.getElementById('commission');
      const commissionIsAhead = commission ? commission.getBoundingClientRect().top > window.innerHeight * 0.82 : true;
      setVisible(window.scrollY > window.innerHeight * 0.8 && commissionIsAhead);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return <div className={`sticky-cta ${visible ? 'show' : ''}`}><a href={sitePath('/commission/')} className="btn">Start Your Commission</a></div>;
}

function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 60);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <header className={scrolled ? 'scrolled' : ''}>
      <a className="logo-wrap" href={sitePath('/')} aria-label="Rogue Artisan home">
        <span className="logo-mark" aria-hidden="true" />
        <span className="logo">ROGUE ARTISAN</span>
      </a>
      <nav aria-label="Primary navigation">
        <a href="#work">The Work</a>
        <a href="#care">Care</a>
        <a href={sitePath('/commission/')} className="nav-commission" aria-label="Start Your Commission">
          <span className="nav-commission-long">Start Your Commission</span>
          <span className="nav-commission-short">Commission</span>
        </a>
      </nav>
    </header>
  );
}

// Hero, LazyCtaVideo, CommissionCta, CareGuide, MossGallery implementations remain largely the same...

export function PremiumHome() {
  const [lightboxItem, setLightboxItem] = useState<LightboxItem | null>(null);
  const [returnFocus, setReturnFocus] = useState<HTMLElement | null>(null);
  const openLightbox = useCallback<OpenLightbox>((item, trigger) => {
    setReturnFocus(trigger ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null));
    setLightboxItem(item);
  }, []);

  const closeLightbox = useCallback(() => setLightboxItem(null), []);
  const navigateLightbox = useCallback((nextIndex: number) => {
    const safeIndex = Math.max(0, Math.min(moss.length - 1, nextIndex));
    const [slug, alt] = moss[safeIndex];
    setLightboxItem((current) => current?.galleryIndex === undefined ? current : { type: 'image', src: sitePath(`/media/lrgallery/${slug}.webp`), alt: `${alt} — Rogue Artisan leatherwork`, galleryIndex: safeIndex, galleryTotal: moss.length });
  }, []);

  return (
    <LightboxContext.Provider value={openLightbox}>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <div id="site-content">
        <ScrollProgress />
        <CustomCursor />
        <Header />
        <main id="main-content">
          <Hero />
          <MossGallery />
          <CommissionCta />
          <CareGuide />
        </main>
        <footer>
          <span className="footer-mark" aria-hidden="true" />
          <div>© 2026 Rogue Artisan Leathercraft&nbsp; ·&nbsp; <a className="footer-social" href="https://www.instagram.com/rogue_artisan" target="_blank" rel="me noopener noreferrer">@rogue_artisan</a></div>
          <div className="footer-legal">
            <a href="mailto:rogueartisan@outlook.com">Email</a>
            <a href={sitePath('/commission/')}>Start Your Commission</a>
          </div>
        </footer>
        <StickyCta />
      </div>
      <Lightbox item={lightboxItem} onClose={closeLightbox} onNavigate={navigateLightbox} returnFocus={returnFocus} />
    </LightboxContext.Provider>
  );
}
