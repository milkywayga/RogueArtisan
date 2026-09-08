'use client';

/* oxlint-disable next/no-html-link-for-pages, next/no-img-element, jsx-a11y/prefer-tag-over-role -- The swipeable carousel needs a composite slider surface that can contain its slides and controls. */

import {
  createContext,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { sitePath } from '@/components/site-path';

const media = {
  ctaVideo: sitePath('/media/VID-20260731-WA0040.mp4'),
  hero: sitePath('/media/20241020_094053.jpg'),
};

const moss = [
  [
    'moss-01',
    'Card wallet held open in the flower garden — black interior, tan saddle stitch',
  ],
  ['moss-02', 'Olive card holder and raven key fob on weathered cedar'],
  ['moss-03', 'Olive notebook cover with a raven-stamped key fob'],
  ['moss-04', 'Orange and sage two-tone card holder in the ivy'],
  ['moss-05', 'Navy bifold open — contrast blue saddle stitch'],
  ['moss-06', 'Blue saddle stitch and the embossed raven, up close'],
  ['moss-07', 'Black bifold on a mossy log'],
  ['moss-08', 'Black card wallet on the moss'],
  ['moss-09', 'Black bifold with a red interior'],
  ['moss-10', 'Card holder open — red and green lined pockets'],
  ['moss-11', 'Red and green card slots laid out flat'],
  ['moss-12', 'Raven mark on a colour-lined card holder, up close'],
  ['moss-13', 'Minimal black wallet on the forest floor'],
  ['moss-14', 'Black bifold in low forest light'],
  ['moss-15', 'Natural veg-tan card holder'],
  ['moss-16', 'Natural tan wallet with the raven mark, up close'],
  ['moss-17', 'A boxed commission — long wallet, card holder and key fob'],
  ['moss-18', 'Moss-green card wallet'],
  ['moss-19', 'Black and green two-tone card holder'],
  ['moss-20', 'Gift set boxed up — green and black, ready to hand off'],
  ['moss-21', 'Oxblood bifold with the gold ROGUE stamp, out in the garden'],
  [
    'moss-22',
    'Inside the oxblood bifold — grey and red card slots, navy stitching',
  ],
  ['moss-23', 'Oxblood bifold held open against the hedge'],
  ['moss-24', 'Gold-stamped corner of the oxblood bifold in hand'],
  ['moss-25', 'Folded oxblood bifold, edge on, out by the hedge'],
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
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: '0px 0px -10% 0px' },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, inView] as const;
}

function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const [ref, inView] = useReveal();

  return (
    <div
      ref={ref}
      className={`reveal ${inView ? 'in' : ''} ${className}`}
      style={{ transitionDelay: inView ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  );
}

function MagneticLink({
  children,
  className = '',
  href,
}: {
  children: ReactNode;
  className?: string;
  href: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  function handleMove(event: MouseEvent<HTMLAnchorElement>) {
    const element = ref.current;
    if (!element) return;
    const bounds = element.getBoundingClientRect();
    const x = (event.clientX - bounds.left - bounds.width / 2) * 0.35;
    const y = (event.clientY - bounds.top - bounds.height / 2) * 0.35;
    element.style.transform = `translate(${x}px, ${y}px)`;
  }

  function handleLeave() {
    if (ref.current) ref.current.style.transform = 'translate(0,0)';
  }

  return (
    <a
      ref={ref}
      href={href}
      className={`magnetic ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </a>
  );
}

function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!finePointer.matches || reducedMotion.matches) return;

    const dot = dotRef.current!;
    const ring = ringRef.current!;
    if (!dot || !ring) return;

    let ringX = 0;
    let ringY = 0;
    let targetX = 0;
    let targetY = 0;
    let frame = 0;

    function tick() {
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;

      if (Math.abs(targetX - ringX) + Math.abs(targetY - ringY) > 0.2) {
        frame = requestAnimationFrame(tick);
      } else {
        frame = 0;
      }
    }

    function handleMove(event: globalThis.MouseEvent) {
      targetX = event.clientX;
      targetY = event.clientY;
      dot.style.left = `${targetX}px`;
      dot.style.top = `${targetY}px`;
      const target = event.target instanceof Element ? event.target : null;
      const interactive = target?.closest(
        'a,button,.g-item,.widget-opt,.color-swatch,input,textarea,.theme-toggle',
      );
      ring.classList.toggle('hovering', Boolean(interactive));
      if (!frame) frame = requestAnimationFrame(tick);
    }

    window.addEventListener('mousemove', handleMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
      <div className="cursor-ring" ref={ringRef} aria-hidden="true" />
    </>
  );
}

function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    function update() {
      frame = 0;
      const root = document.documentElement;
      const distance = root.scrollHeight - root.clientHeight;
      setProgress(distance > 0 ? (root.scrollTop / distance) * 100 : 0);
    }

    function handleScroll() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      className="scroll-progress"
      style={{ width: `${progress}%` }}
      aria-hidden="true"
    />
  );
}

function Lightbox({
  item,
  onClose,
  onNavigate,
  returnFocus,
}: {
  item: LightboxItem | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
  returnFocus: HTMLElement | null;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const swipeRef = useRef<{
    pointerId: number;
    x: number;
    y: number;
  } | null>(null);
  const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetFrameRef = useRef<number | null>(null);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isSettling, setIsSettling] = useState(false);
  const [disableTrackTransition, setDisableTrackTransition] = useState(false);
  const [slideTarget, setSlideTarget] = useState<'center' | 'previous' | 'next'>(
    'center',
  );
  const isOpen = Boolean(item);

  useEffect(() => {
    if (!isOpen) return;

    const dialog = dialogRef.current;
    if (!dialog) return;
    const bodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (!dialog.open) {
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
    }
    const focusFrame = requestAnimationFrame(() =>
      closeRef.current?.focus({ preventScroll: true }),
    );

    return () => {
      cancelAnimationFrame(focusFrame);
      document.body.style.overflow = bodyOverflow;
      if (dialog.open) dialog.close();
      if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
    };
  }, [isOpen, onClose, returnFocus]);

  useEffect(() => {
    if (item?.galleryIndex === undefined) return;

    [item.galleryIndex - 1, item.galleryIndex + 1].forEach((imageIndex) => {
      const entry = moss[imageIndex];
      if (!entry) return;
      const image = new window.Image();
      image.decoding = 'async';
      image.src = sitePath(`/media/lrgallery/${entry[0]}.webp`);
    });
  }, [item?.galleryIndex]);

  useEffect(
    () => () => {
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
      if (resetFrameRef.current) cancelAnimationFrame(resetFrameRef.current);
    },
    [],
  );

  if (!item) return null;

  const currentIndex = item.galleryIndex;
  const galleryTotal = item.galleryTotal ?? 0;
  const hasGalleryNavigation = currentIndex !== undefined && galleryTotal > 1;

  const lightboxPanels = [-1, 0, 1].map((offset) => {
    if (offset === 0 || currentIndex === undefined) return offset === 0 ? item : null;
    const entry = moss[currentIndex + offset];
    if (!entry) return null;
    return {
      type: 'image' as const,
      src: sitePath(`/media/lrgallery/${entry[0]}.webp`),
      alt: `${entry[1]} — Rogue Artisan leatherwork`,
    };
  });

  function animateNavigate(direction: -1 | 1) {
    if (
      isSettling ||
      !hasGalleryNavigation ||
      currentIndex === undefined
    ) {
      return;
    }

    const nextIndex = currentIndex + direction;
    if (nextIndex < 0 || nextIndex >= galleryTotal) return;

    setIsDragging(false);
    setDragX(0);
    setIsSettling(true);
    setSlideTarget(direction < 0 ? 'previous' : 'next');

    if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
    settleTimerRef.current = setTimeout(() => {
      setDisableTrackTransition(true);
      setSlideTarget('center');
      setIsSettling(false);
      onNavigate(nextIndex);
      resetFrameRef.current = requestAnimationFrame(() => {
        resetFrameRef.current = requestAnimationFrame(() =>
          setDisableTrackTransition(false),
        );
      });
    }, 300);
  }

  function handleDialogKey(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
      return;
    }

    if (!hasGalleryNavigation || currentIndex === undefined) return;

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      animateNavigate(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      animateNavigate(1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      onNavigate(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      onNavigate(galleryTotal - 1);
    }
  }

  function handleViewerPointerDown(event: PointerEvent<HTMLDialogElement>) {
    if (!event.isPrimary || isSettling) return;
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest('button') || !target?.closest('.lightbox-media')) return;
    swipeRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    };
    setSlideTarget('center');
    setDragX(0);
    setIsDragging(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }

  function handleViewerPointerMove(event: PointerEvent<HTMLDialogElement>) {
    const start = swipeRef.current;
    if (!start || start.pointerId !== event.pointerId || !isDragging) return;

    let distance = event.clientX - start.x;
    const verticalDistance = event.clientY - start.y;
    if (Math.abs(verticalDistance) > Math.abs(distance) * 1.2) return;

    if (
      currentIndex === undefined ||
      (currentIndex === 0 && distance > 0) ||
      (currentIndex === galleryTotal - 1 && distance < 0)
    ) {
      distance *= 0.22;
    }

    setDragX(distance);
  }

  function handleViewerPointerUp(event: PointerEvent<HTMLDialogElement>) {
    const start = swipeRef.current;
    swipeRef.current = null;
    setIsDragging(false);
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (!start || !hasGalleryNavigation || currentIndex === undefined) {
      setDragX(0);
      return;
    }

    const xDistance = event.clientX - start.x;
    const yDistance = event.clientY - start.y;
    const threshold = Math.min(96, window.innerWidth * 0.18);
    if (
      Math.abs(xDistance) < threshold ||
      Math.abs(xDistance) < Math.abs(yDistance)
    ) {
      setDragX(0);
      return;
    }

    setDragX(0);
    animateNavigate(xDistance < 0 ? 1 : -1);
  }

  function handleViewerPointerCancel(event: PointerEvent<HTMLDialogElement>) {
    swipeRef.current = null;
    setIsDragging(false);
    setDragX(0);
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  return (
    // The native modal surface owns backdrop dismissal plus keyboard and swipe gallery controls.
    // oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <dialog
      ref={dialogRef}
      className="lightbox"
      aria-modal="true"
      aria-label={item.alt || 'Image preview'}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        const target = event.target instanceof Element ? event.target : null;
        if (!target?.closest('img, video, button')) onClose();
      }}
      onKeyDown={handleDialogKey}
      onPointerDown={handleViewerPointerDown}
      onPointerMove={handleViewerPointerMove}
      onPointerUp={handleViewerPointerUp}
      onPointerCancel={handleViewerPointerCancel}
    >
      <button
        ref={closeRef}
        type="button"
        className="lightbox-close"
        aria-label="Close"
        onClick={onClose}
      >
        ×
      </button>
      <div className="lightbox-frame">
        {hasGalleryNavigation && currentIndex !== undefined ? (
          <button
            type="button"
            className="lightbox-nav prev"
            aria-label="Previous enlarged photo"
            disabled={currentIndex === 0}
            onClick={() => animateNavigate(-1)}
          >
            ‹
          </button>
        ) : null}
        <figure className="lightbox-figure">
          <div className="lightbox-media">
            <div
              className={`lightbox-track lightbox-track-${slideTarget}${
                isDragging ? ' dragging' : ''
              }${isSettling ? ' settling' : ''}${
                disableTrackTransition ? ' no-transition' : ''
              }`}
              style={{ '--lightbox-drag': `${dragX}px` } as CSSProperties}
            >
              {lightboxPanels.map((panel, panelIndex) => (
                <div
                  className={`lightbox-panel${panelIndex === 1 ? ' current' : ''}`}
                  key={`${currentIndex ?? 'single'}-${panelIndex}`}
                  aria-hidden={panelIndex === 1 ? undefined : 'true'}
                >
                  {panel?.type === 'video' ? (
                    <video src={panel.src} controls autoPlay muted loop playsInline />
                  ) : panel ? (
                    <img src={panel.src} alt={panelIndex === 1 ? panel.alt || '' : ''} draggable={false} />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </figure>
        {hasGalleryNavigation && currentIndex !== undefined ? (
          <button
            type="button"
            className="lightbox-nav next"
            aria-label="Next enlarged photo"
            disabled={currentIndex === galleryTotal - 1}
            onClick={() => animateNavigate(1)}
          >
            ›
          </button>
        ) : null}
      </div>
    </dialog>
  );
}

function StickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;

    function update() {
      frame = 0;
      const commission = document.getElementById('commission');
      const commissionIsAhead = commission
        ? commission.getBoundingClientRect().top > window.innerHeight * 0.82
        : true;
      setVisible(
        window.scrollY > window.innerHeight * 0.8 && commissionIsAhead,
      );
    }

    function handleScroll() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className={`sticky-cta ${visible ? 'show' : ''}`}>
      <a href={sitePath('/commission/')} className="btn">
        Start Your Commission
      </a>
    </div>
  );
}

function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function update() {
      setScrolled(window.scrollY > 60);
    }
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

function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  function handleMove(event: MouseEvent<HTMLElement>) {
    const hero = heroRef.current;
    const glow = glowRef.current;
    if (!hero || !glow) return;
    const bounds = hero.getBoundingClientRect();
    glow.style.left = `${event.clientX - bounds.left}px`;
    glow.style.top = `${event.clientY - bounds.top}px`;
    glow.style.opacity = '1';
  }

  function handleLeave() {
    if (glowRef.current) glowRef.current.style.opacity = '0';
  }

  return (
    <section
      className="hero"
      ref={heroRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <img
        className="hero-poster"
        src={media.hero}
        srcSet={`${sitePath('/media/20241020_094053.jpg')} 420w, ${media.hero} 602w`}
        sizes="100vw"
        alt="Rogue Artisan oxblood leather wallet and hand tools on a workbench"
        width={602}
        height={1200}
        fetchPriority="high"
      />
      <h1>
        ROGUE ARTISAN
        <em>Custom Leather · Vancouver</em>
      </h1>
      <p>Bespoke leather goods, designed with you and made in Vancouver.</p>
      <div className="hero-glow" ref={glowRef} aria-hidden="true" />
    </section>
  );
}

function LazyCtaVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches) {
      video.pause();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void video.play().catch(() => undefined);
        else video.pause();
      },
      { rootMargin: '250px' },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={media.ctaVideo}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}

function CommissionCta() {
  return (
    <section id="commission" className="cta">
      <LazyCtaVideo />
      <Reveal>
        <p className="cta-kicker">Two ways to commission</p>
        <h2>Bring the idea—or give me the reins.</h2>
        <p>
          Choose the details with me, or name the piece and let me set the
          leather, colour, thread, and finish.
        </p>
        <div className="cta-paths">
          <article className="cta-path">
            <span>01</span>
            <h3>Your Commission</h3>
            <p>You bring the direction. I help shape every detail.</p>
            <MagneticLink
              href={sitePath('/commission/?type=guided')}
              className="btn btn-with-price"
            >
              <span>Start Your Commission</span>
              <small>From $100</small>
            </MagneticLink>
          </article>
          <article className="cta-path cta-path-maker">
            <span>02</span>
            <h3>Maker&apos;s Choice</h3>
            <p>
              Choose what it needs to do. I choose how it comes to life.
            </p>
            <MagneticLink
              href={sitePath('/commission/?type=makers-choice')}
              className="btn-outline"
            >
              Give Me the Reins
            </MagneticLink>
          </article>
        </div>
      </Reveal>
    </section>
  );
}

function CareGuide() {
  const tips = [
    [
      'Keep it dry',
      'Full-grain leather can handle a light rain, but let it air dry away from direct heat if it gets soaked — no radiators, no blow dryers.',
    ],
    [
      'Condition it occasionally',
      'A leather conditioner or neatsfoot oil every few months keeps it supple. Less is more — a thin coat, buffed in.',
    ],
    [
      'Let it patina',
      "Darkening and scuffs aren't damage, they're the leather recording your life. It's supposed to look better in a year, not the same.",
    ],
  ];

  return (
    <section id="care">
      <Reveal>
        <h2 className="section-title">Taking Care of It</h2>
        <p className="section-sub">
          Real leather ages instead of wearing out — if you treat it right.
        </p>
      </Reveal>
      <div className="grid3">
        {tips.map(([title, description]) => (
          <Reveal key={title}>
            <div className="card">
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function MossGallery() {
  const count = moss.length;
  const [index, setIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const openLightbox = useContext(LightboxContext);
  const stageRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    x: number;
    y: number;
    pointerId: number;
    axis: 'pending' | 'horizontal' | 'vertical';
    moved: boolean;
  } | null>(null);
  const suppressClickRef = useRef(false);

  const openCurrent = useCallback(() => {
    const [slug, alt] = moss[index];
    const trigger = stageRef.current;
    trigger?.focus({ preventScroll: true });
    openLightbox(
      {
        type: 'image',
        src: sitePath(`/media/lrgallery/${slug}.webp`),
        alt: `${alt} — Rogue Artisan leatherwork`,
        galleryIndex: index,
        galleryTotal: count,
      },
      trigger,
    );
  }, [count, index, openLightbox]);

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (
      !event.isPrimary ||
      (event.pointerType === 'mouse' && event.button !== 0)
    ) {
      return;
    }

    dragRef.current = {
      x: event.clientX,
      y: event.clientY,
      pointerId: event.pointerId,
      axis: 'pending',
      moved: false,
    };
    suppressClickRef.current = false;
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || event.pointerId !== drag.pointerId) return;

    const xDistance = event.clientX - drag.x;
    const yDistance = event.clientY - drag.y;
    const absX = Math.abs(xDistance);
    const absY = Math.abs(yDistance);

    if (drag.axis === 'pending') {
      if (absX < 6 && absY < 6) return;

      if (absY > absX * 1.15) {
        drag.axis = 'vertical';
        return;
      }

      if (absX <= absY * 1.15) return;
      drag.axis = 'horizontal';
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        // The browser may have already handed a vertical gesture to scrolling.
      }
    }

    if (drag.axis !== 'horizontal') return;
    event.preventDefault();
    drag.moved = absX > 6;
    setDragOffset(xDistance);
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || event.pointerId !== drag.pointerId) return;
    dragRef.current = null;

    if (drag.axis !== 'horizontal') {
      if (dragOffset) setDragOffset(0);
      return;
    }

    const distance = event.clientX - drag.x;
    const width = stageRef.current?.offsetWidth ?? 600;
    suppressClickRef.current = drag.moved;
    if (distance < -width * 0.1) {
      setIndex((current) => Math.min(count - 1, current + 1));
    } else if (distance > width * 0.1) {
      setIndex((current) => Math.max(0, current - 1));
    }
    setDragOffset(0);
    try {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    } catch {
      // The browser may release capture before pointerup is delivered.
    }
    window.setTimeout(() => {
      suppressClickRef.current = false;
    }, 0);
  }

  function handleKey(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      setIndex((current) => Math.min(count - 1, current + 1));
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      setIndex((current) => Math.max(0, current - 1));
    } else if (event.key === 'Home') {
      event.preventDefault();
      setIndex(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      setIndex(count - 1);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openCurrent();
    }
  }

  return (
    <section className="moss-sec" id="work">
      <Reveal>
        <h2 className="section-title">Out of the Shop, Into the Woods</h2>
        <p className="section-sub">
          Finished commissions. Swipe through.
        </p>
      </Reveal>
      <div
        className={`moss-stage${dragOffset ? ' dragging' : ''}`}
        ref={stageRef}
        tabIndex={0}
        role="slider"
        aria-label="Finished piece photos"
        aria-valuemin={1}
        aria-valuemax={count}
        aria-valuenow={index + 1}
        aria-valuetext={`Photo ${index + 1} of ${count}: ${moss[index][1]}`}
        aria-describedby="gallery-instructions"
        onKeyDown={handleKey}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {moss.map(([slug, alt], imageIndex) => {
          const offset = imageIndex - index;
          const distance = Math.abs(offset);
          const imageAlt = `${alt} — Rogue Artisan leatherwork`;
          return (
            <button
              type="button"
              className={`moss-slide${offset === 0 ? ' on' : ''}`}
              key={slug}
              tabIndex={-1}
              aria-hidden={distance > 0}
              aria-label={offset === 0 ? `Enlarge ${alt}` : `Show ${alt}`}
              style={{
                transform: `translateX(calc(-50% + ${offset * 74}% + ${dragOffset}px)) scale(${offset === 0 ? 1 : 0.8}) rotateY(${offset < 0 ? 9 : offset > 0 ? -9 : 0}deg)`,
                opacity: distance > 2 ? 0 : offset === 0 ? 1 : 0.5,
                zIndex: 20 - distance,
                pointerEvents: distance > 1 ? 'none' : 'auto',
                willChange: distance < 3 ? 'transform, opacity' : 'auto',
              }}
              onClick={() => {
                if (suppressClickRef.current) return;
                if (offset === 0) openCurrent();
                else setIndex(imageIndex);
              }}
            >
              {distance < 3 ? (
                <img
                  src={sitePath(`/media/lrgallery/${slug}-420.webp`)}
                  srcSet={`${sitePath(`/media/lrgallery/${slug}-420.webp`)} 420w, ${sitePath(`/media/lrgallery/${slug}-s.webp`)} 720w`}
                  sizes="(max-width: 640px) 78vw, 500px"
                  alt={imageAlt}
                  width={720}
                  height={720}
                  loading={distance < 2 ? 'eager' : 'lazy'}
                  fetchPriority={offset === 0 ? 'high' : 'auto'}
                  decoding="async"
                  draggable={false}
                />
              ) : null}
            </button>
          );
        })}
        <button
          type="button"
          className="moss-nav prev"
          aria-label="Previous photo"
          onClick={() => setIndex((current) => Math.max(0, current - 1))}
          disabled={index === 0}
        >
          ‹
        </button>
        <button
          type="button"
          className="moss-nav next"
          aria-label="Next photo"
          onClick={() =>
            setIndex((current) => Math.min(count - 1, current + 1))
          }
          disabled={index === count - 1}
        >
          ›
        </button>
      </div>
      <p id="gallery-instructions" className="sr-only">
        Use the left and right arrow keys to browse. Press Enter to enlarge the
        current photo.
      </p>
      <div className="moss-prog" aria-hidden="true">
        <span
          style={
            {
              '--gallery-progress': `${((index + 1) / count) * 100}%`,
            } as CSSProperties
          }
        />
      </div>
      <div className="moss-meta">
        <div className="moss-dots" aria-label="Choose a gallery photo">
          {moss.map(([slug], dotIndex) => (
            <button
              type="button"
              key={slug}
              className={`dot${dotIndex === index ? ' on' : ''}`}
              aria-label={`Go to photo ${dotIndex + 1}`}
              aria-current={dotIndex === index ? 'true' : undefined}
              onClick={() => setIndex(dotIndex)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function PremiumHome() {
  const [lightboxItem, setLightboxItem] = useState<LightboxItem | null>(null);
  const [returnFocus, setReturnFocus] = useState<HTMLElement | null>(null);

  const openLightbox = useCallback<OpenLightbox>((item, trigger) => {
    setReturnFocus(
      trigger ??
        (document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null),
    );
    setLightboxItem(item);
  }, []);

  const closeLightbox = useCallback(() => setLightboxItem(null), []);

  const navigateLightbox = useCallback((nextIndex: number) => {
    const safeIndex = Math.max(0, Math.min(moss.length - 1, nextIndex));
    const [slug, alt] = moss[safeIndex];
    setLightboxItem((current) =>
      current?.galleryIndex === undefined
        ? current
        : {
            type: 'image',
            src: sitePath(`/media/lrgallery/${slug}.webp`),
            alt: `${alt} — Rogue Artisan leatherwork`,
            galleryIndex: safeIndex,
            galleryTotal: moss.length,
          },
    );
  }, []);

  return (
    <LightboxContext.Provider value={openLightbox}>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
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
          <div>
            © 2026 Rogue Artisan Leathercraft&nbsp; ·&nbsp;{' '}
            <a
              className="footer-social"
              href="https://www.instagram.com/rogue_artisan"
              target="_blank"
              rel="me noopener noreferrer"
            >
              @rogue_artisan
            </a>
          </div>
          <div className="footer-legal">
            <a href="mailto:rogueartisan@outlook.com">Email</a>
            <a href={sitePath('/commission/')}>Start Your Commission</a>
          </div>
        </footer>
        <StickyCta />
      </div>
      <Lightbox
        item={lightboxItem}
        onClose={closeLightbox}
        onNavigate={navigateLightbox}
        returnFocus={returnFocus}
      />
    </LightboxContext.Provider>
  );
}
