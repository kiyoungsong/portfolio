import { useEffect, useRef, type PointerEvent, type ReactNode } from 'react';
import { cn } from '../lib/cn';
import { desk, type WinId } from '../store/desktop';
import { goWeb } from '../store/app';
import { PROFILE } from '../data/profile';
import { prefersReducedMotion } from '../lib/env';
import { avatarSrc } from '../components/Avatar';

type DockItem = { id: WinId | 'web'; label: string; icon: JSX.Element } | { sep: true } | { href: string; label: string; icon: JSX.Element };

const DOCK: DockItem[] = [
  { id: 'finder', label: '프로젝트', icon: <svg viewBox="0 0 64 64"><rect x="2" y="2" width="60" height="60" rx="14" fill="#3d8bfd" /><path d="M14 22a4 4 0 0 1 4-4h9l4 4h15a4 4 0 0 1 4 4v18a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4z" fill="#fff" opacity=".95" /><path d="M14 27h36" stroke="#3d8bfd" strokeWidth="2.5" /></svg> },
  { id: 'notes', label: '메모', icon: <svg viewBox="0 0 64 64"><rect x="2" y="2" width="60" height="60" rx="14" fill="#fff" /><rect x="2" y="2" width="60" height="16" rx="14" fill="#ffcf3d" /><rect x="2" y="12" width="60" height="6" fill="#ffcf3d" /><path d="M12 28h40M12 36h40M12 44h28" stroke="#d6d6dc" strokeWidth="2.5" strokeLinecap="round" /></svg> },
  { id: 'viewer', label: '미리보기', icon: <svg viewBox="0 0 64 64"><rect x="2" y="2" width="60" height="60" rx="14" fill="#8e6cf6" /><rect x="13" y="15" width="38" height="32" rx="5" fill="#fff" /><circle cx="23" cy="25" r="4" fill="#ffcf3d" /><path d="M15 44l11-11 8 8 6-6 9 9z" fill="#5fc28a" /></svg> },
  { id: 'web', label: '웹페이지로 보기', icon: <svg viewBox="0 0 64 64"><rect x="2" y="2" width="60" height="60" rx="14" fill="#fff" /><circle cx="32" cy="32" r="22" fill="#3d8bfd" /><path d="M10 32h44M32 10c8 7 8 37 0 44M32 10c-8 7-8 37 0 44M15 21h34M15 43h34" fill="none" stroke="#fff" strokeWidth="2" /><path d="M38 26l-10 4-4 10 10-4z" fill="#ff5f57" /></svg> },
  { id: 'contact', label: '연락처', icon: <svg viewBox="0 0 64 64"><rect x="2" y="2" width="60" height="60" rx="14" fill="#f2f2f5" /><rect x="11" y="18" width="42" height="28" rx="5" fill="#fff" stroke="#c9c9d0" strokeWidth="2" /><path d="M12 20l20 15 20-15" fill="none" stroke="#3d8bfd" strokeWidth="3" strokeLinejoin="round" /></svg> },
  { id: 'terminal', label: '터미널', icon: <svg viewBox="0 0 64 64"><rect x="2" y="2" width="60" height="60" rx="14" fill="#2b2b2e" /><path d="M15 24l9 7-9 7" fill="none" stroke="#e8e8ea" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M29 40h18" stroke="#e8e8ea" strokeWidth="3.5" strokeLinecap="round" /></svg> },
  { sep: true },
  { id: 'welcome', label: '보는 방식 고르기', icon: <svg viewBox="0 0 64 64"><rect x="2" y="2" width="60" height="60" rx="14" fill="#fff" /><rect x="10" y="16" width="20" height="32" rx="4" fill="#b9c7ff" /><rect x="13" y="20" width="14" height="10" rx="2" fill="#fff" /><rect x="34" y="16" width="20" height="32" rx="4" fill="#3d8bfd" /><rect x="37" y="21" width="14" height="3" rx="1.5" fill="#fff" /><rect x="37" y="27" width="10" height="3" rx="1.5" fill="#fff" /><rect x="37" y="36" width="14" height="8" rx="2" fill="#fff" opacity=".8" /></svg> },
  { id: 'about', label: '이 개발자에 관하여', icon: <svg viewBox="0 0 64 64"><defs><clipPath id="dock-about-clip"><rect x="2" y="2" width="60" height="60" rx="14" /></clipPath></defs><rect x="2" y="2" width="60" height="60" rx="14" fill="#d9e6ff" /><image href={avatarSrc} x="5" y="9" width="54" height="54" clipPath="url(#dock-about-clip)" /></svg> },
  { href: PROFILE.github, label: 'GitHub ↗', icon: <svg viewBox="0 0 64 64"><rect x="2" y="2" width="60" height="60" rx="14" fill="#1d1d1f" /><path transform="translate(14 14) scale(1.5)" fill="#fff" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg> },
  { href: PROFILE.blog, label: 'Velog 블로그 ↗', icon: <svg viewBox="0 0 64 64"><rect x="2" y="2" width="60" height="60" rx="14" fill="#20c997" /><path d="M21.5 23h6l6 18 9-18" fill="none" stroke="#fff" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" /></svg> },
];

function bounce(btn: HTMLElement | null) {
  if (!btn || prefersReducedMotion()) return;
  btn.classList.remove('animate-dock-bounce');
  void btn.offsetWidth;
  btn.classList.add('animate-dock-bounce');
  window.setTimeout(() => btn.classList.remove('animate-dock-bounce'), 1500);
}

/** 마우스 거리에 따라 아이콘이 커지는 독 */
export function Dock() {
  const wins = desk.useStore((s) => s.wins);
  const nav = useRef<HTMLElement>(null);
  const seqs = useRef<Record<string, number>>({});

  // 창이 새로 열리면 해당 아이콘 통통
  useEffect(() => {
    (Object.keys(wins) as WinId[]).forEach((k) => {
      if (wins[k].openSeq !== (seqs.current[k] ?? 0)) {
        if (seqs.current[k] !== undefined) bounce(nav.current?.querySelector(`[data-dock-id="${k}"] button`) ?? null);
        seqs.current[k] = wins[k].openSeq;
      }
    });
  }, [wins]);

  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse' || prefersReducedMotion() || !nav.current) return;
    nav.current.dataset.hover = '';
    nav.current.querySelectorAll<HTMLElement>('[data-dock-btn]').forEach((b) => {
      const r = b.getBoundingClientRect();
      const d = Math.abs(e.clientX - (r.left + r.width / 2));
      const s = 52 * (1 + 0.7 * Math.max(0, 1 - d / 150));
      b.style.width = b.style.height = s.toFixed(1) + 'px';
    });
  };
  const onLeave = () => {
    if (nav.current) delete nav.current.dataset.hover;
    nav.current?.querySelectorAll<HTMLElement>('[data-dock-btn]').forEach((b) => (b.style.width = b.style.height = ''));
  };

  return (
    <nav
      ref={nav}
      aria-label="독"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="group/dock glass absolute bottom-2 left-1/2 z-[8000] flex -translate-x-1/2 items-end gap-1.5 rounded-[20px] border-[.5px] border-dock-line bg-dock px-2 py-1.5 shadow-[0_10px_30px_rgba(0,0,0,.2)]"
    >
      {DOCK.map((d, k) => {
        if ('sep' in d) return <span key={k} aria-hidden="true" className="mx-1 mt-1 mb-2.5 w-px self-stretch bg-sep" />;
        if ('href' in d)
          return (
            <DockItem key={k} label={d.label}>
              <a data-dock-btn href={d.href} target="_blank" rel="noopener" aria-label={d.label} className={dockBtn}>{d.icon}</a>
            </DockItem>
          );
        const run = d.id !== 'web' && wins[d.id].open;
        return (
          <DockItem key={d.id} id={d.id} label={d.label} running={run}>
            <button
              data-dock-btn
              type="button"
              aria-label={d.label}
              className={dockBtn}
              onClick={(e) => {
                if (d.id === 'web') {
                  bounce(e.currentTarget);
                  void goWeb(e.currentTarget.getBoundingClientRect());
                } else desk.openWin(d.id);
              }}
            >
              {d.icon}
            </button>
          </DockItem>
        );
      })}
    </nav>
  );
}

/** 마우스를 올리면 커지는 아이콘 (크기는 onMove 에서 직접 지정) */
const dockBtn =
  'peer block size-[52px] p-0 transition-[width,height] duration-250 ease-out group-data-hover/dock:duration-120 motion-reduce:transition-none [&>svg]:block [&>svg]:size-full [&>svg]:drop-shadow-[0_2px_3px_rgba(0,0,0,.25)]';

function DockItem({ id, label, running, children }: { id?: string; label: string; running?: boolean; children: ReactNode }) {
  return (
    <span data-dock-id={id} className="relative flex flex-col items-center">
      {children}
      <span
        aria-hidden="true"
        className="glass pointer-events-none absolute bottom-[calc(100%+14px)] left-1/2 -translate-x-1/2 rounded-md border-[.5px] border-menu-line bg-menu px-2.5 py-[3px] text-[12.5px] whitespace-nowrap opacity-0 shadow-[0_4px_14px_rgba(0,0,0,.2)] transition-opacity duration-120 peer-hover:opacity-100 peer-focus-visible:opacity-100"
      >
        {label}
      </span>
      <span className={cn('mt-[3px] size-1 rounded-full', running ? 'bg-ink' : 'bg-transparent')} />
    </span>
  );
}
