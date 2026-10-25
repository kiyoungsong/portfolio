import { useEffect, useRef, type PointerEvent } from 'react';
import { desk, type WinId } from '../store/desktop';
import { goWeb } from '../store/app';
import { PROFILE } from '../data/profile';
import { prefersReducedMotion } from '../lib/env';

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
  { id: 'about', label: '이 개발자에 관하여', icon: <svg viewBox="0 0 64 64"><rect x="2" y="2" width="60" height="60" rx="14" fill="#7d93ff" /><text x="32" y="41" textAnchor="middle" fontSize="24" fontWeight="800" fill="#fff" fontFamily="-apple-system,sans-serif">KS</text></svg> },
  { href: PROFILE.github, label: 'GitHub ↗', icon: <svg viewBox="0 0 64 64"><rect x="2" y="2" width="60" height="60" rx="14" fill="#1d1d1f" /><path d="M24 40c-6 2-6-3-9-3m18 7v-5c0-1.5-.5-2.5-1.2-3.2 4.3-.5 8.7-2.1 8.7-9.4 0-2-.7-3.8-2-5.2.2-.5.9-2.5-.2-5.2 0 0-1.6-.5-5.3 2a18 18 0 0 0-9.6 0c-3.7-2.5-5.3-2-5.3-2-1.1 2.7-.4 4.7-.2 5.2a7.4 7.4 0 0 0-2 5.2c0 7.3 4.4 8.9 8.7 9.4-.7.7-1.2 1.7-1.2 3.2v5" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg> },
];

function bounce(btn: HTMLElement | null) {
  if (!btn || prefersReducedMotion()) return;
  btn.classList.remove('bounce');
  void btn.offsetWidth;
  btn.classList.add('bounce');
  window.setTimeout(() => btn.classList.remove('bounce'), 1500);
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
        if (seqs.current[k] !== undefined) bounce(nav.current?.querySelector(`.d-item[data-id="${k}"] .d-btn`) ?? null);
        seqs.current[k] = wins[k].openSeq;
      }
    });
  }, [wins]);

  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse' || prefersReducedMotion() || !nav.current) return;
    nav.current.classList.remove('out');
    nav.current.querySelectorAll<HTMLElement>('.d-btn').forEach((b) => {
      const r = b.getBoundingClientRect();
      const d = Math.abs(e.clientX - (r.left + r.width / 2));
      const s = 52 * (1 + 0.7 * Math.max(0, 1 - d / 150));
      b.style.width = b.style.height = s.toFixed(1) + 'px';
    });
  };
  const onLeave = () => {
    nav.current?.classList.add('out');
    nav.current?.querySelectorAll<HTMLElement>('.d-btn').forEach((b) => (b.style.width = b.style.height = ''));
  };

  return (
    <nav className="dock out" aria-label="독" ref={nav} onPointerMove={onMove} onPointerLeave={onLeave}>
      {DOCK.map((d, k) => {
        if ('sep' in d) return <span key={k} className="d-sep" aria-hidden="true" />;
        if ('href' in d)
          return (
            <span key={k} className="d-item">
              <a className="d-btn" href={d.href} target="_blank" rel="noopener" aria-label={d.label}>{d.icon}</a>
              <span className="d-tip" aria-hidden="true">{d.label}</span>
              <span className="d-dot" />
            </span>
          );
        const run = d.id !== 'web' && wins[d.id].open;
        return (
          <span key={d.id} className={`d-item${run ? ' run' : ''}`} data-id={d.id}>
            <button
              className="d-btn"
              type="button"
              aria-label={d.label}
              onClick={(e) => {
                if (d.id === 'web') {
                  bounce(e.currentTarget);
                  void goWeb(e.currentTarget.getBoundingClientRect());
                } else desk.openWin(d.id);
              }}
            >
              {d.icon}
            </button>
            <span className="d-tip" aria-hidden="true">{d.label}</span>
            <span className="d-dot" />
          </span>
        );
      })}
    </nav>
  );
}
