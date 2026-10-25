import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { app, goChoose, goDesk } from '../store/app';
import { prefersReducedMotion } from '../lib/env';
import { ProjectDetail } from './ProjectDetail';
import { CareerSection, ContactSection, FeaturedSection, Hero, HowSection, ProjectsSection } from './sections';

const NAV: [id: string, label: string][] = [
  ['w-career', '경력'],
  ['w-how', '일하는 방식'],
  ['w-featured', '대표 프로젝트'],
  ['w-projects', '모든 프로젝트'],
  ['w-reach', '연락'],
];

export function WebPage({ phone }: { phone: boolean }) {
  const detail = app.useStore((s) => s.detail);
  const root = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState<string | null>(null);

  // 스크롤 위치에 따라 상단 메뉴 강조
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((en) => en.isIntersecting && setCurrent(en.target.id)),
      { root: el, rootMargin: '-35% 0px -60% 0px' },
    );
    NAV.forEach(([id]) => {
      const t = document.getElementById(id);
      if (t) io.observe(t);
    });
    el.querySelector<HTMLElement>('.wlogo')?.focus({ preventScroll: true });
    return () => io.disconnect();
  }, []);

  // 페이지 안 #앵커는 부드럽게 스크롤 (해시 라우팅과 충돌하지 않도록 직접 처리)
  const onClick = (e: MouseEvent) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#w-"]');
    if (!a) return;
    e.preventDefault();
    document.getElementById(a.getAttribute('href')!.slice(1))?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };

  return (
    <div id="web" className="enter" ref={root} onClick={onClick}>
      <header className="wnav">
        <div className="wwrap wnav-in">
          <a className="wlogo" href="#w-top"><span className="av">KS</span>송기영</a>
          <nav className="wlinks" aria-label="섹션">
            {NAV.map(([id, label]) => (
              <a key={id} href={`#${id}`} aria-current={current === id}>{label}</a>
            ))}
          </nav>
          {!phone && (
            <div className="wnav-r">
              <button className="to-desk" type="button" onClick={goChoose}>보는 방식</button>
              <button className="to-desk" type="button" onClick={goDesk}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></svg>
                데스크톱
              </button>
            </div>
          )}
        </div>
      </header>
      <main>
        <Hero />
        <CareerSection />
        <HowSection />
        <FeaturedSection />
        <ProjectsSection />
        <ContactSection />
        <footer className="wfoot">송기영 · Kai Song · 2026 · 직접 기획·디자인·개발했어요</footer>
      </main>
      {detail !== null && <ProjectDetail i={detail} />}
    </div>
  );
}
