import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { app, goChoose, goDesk } from '../store/app';
import { prefersReducedMotion } from '../lib/env';
import { cn } from '../lib/cn';
import { ProjectDetail } from './ProjectDetail';
import { Avatar } from '../components/Avatar';
import { CareerSection, ContactSection, FeaturedSection, Hero, HowSection, ProjectsSection } from './sections';

const NAV: [id: string, label: string][] = [
  ['w-career', '경력'],
  ['w-how', '일하는 방식'],
  ['w-featured', '대표 프로젝트'],
  ['w-projects', '모든 프로젝트'],
  ['w-reach', '연락'],
];

const navBtn = 'inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-line bg-card px-3 py-1.5 text-[12.5px] font-semibold whitespace-nowrap text-ink hover:border-accent';

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
    <div
      id="web"
      ref={root}
      onClick={onClick}
      className="theme-bright fixed inset-0 z-[9500] animate-fade-in overflow-x-hidden overflow-y-auto scroll-pt-16 bg-page text-base leading-[1.6] text-ink select-text motion-reduce:animate-none"
    >
      <header className="sticky top-0 z-20 border-b border-line bg-[rgba(255,253,248,.82)] pt-[env(safe-area-inset-top,0px)] glass">
        <div className="mx-auto flex h-14 max-w-[1100px] items-center justify-between gap-4 px-[max(24px,env(safe-area-inset-left,0px))]">
          <a href="#w-top" className="flex items-center gap-2.5 text-base font-extrabold whitespace-nowrap text-ink no-underline">
            <Avatar size={30} alt="" />
            송기영
          </a>
          <nav aria-label="섹션" className="no-scrollbar flex gap-0.5 overflow-x-auto text-sm max-[860px]:hidden">
            {NAV.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                aria-current={current === id}
                className={cn('rounded-full px-3 py-1.5 whitespace-nowrap no-underline hover:text-ink', current === id ? 'bg-soft font-semibold text-ink' : 'text-ink-2')}
              >
                {label}
              </a>
            ))}
          </nav>
          {!phone && (
            <div className="flex flex-none gap-1.5 max-[600px]:hidden">
              <button type="button" className={navBtn} onClick={goChoose}>보는 방식</button>
              <button type="button" className={navBtn} onClick={goDesk}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></svg>
                데스크톱
              </button>
            </div>
          )}
        </div>
      </header>
      <main className="relative z-0 overflow-hidden">
        <Hero />
        <CareerSection />
        <HowSection />
        <FeaturedSection />
        <ProjectsSection />
        <ContactSection />
        <footer className="pb-10 text-center text-[12.5px] text-ink-3">송기영 · Kai Song · 2026 · 직접 기획·디자인·개발했어요</footer>
      </main>
      {detail !== null && <ProjectDetail i={detail} />}
    </div>
  );
}
