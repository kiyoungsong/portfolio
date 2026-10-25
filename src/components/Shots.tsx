import { useEffect, useRef, useState, type PointerEvent as RPE } from 'react';
import { shotsOf, type Shot } from '../data/shots';
import { HedgehogIcon } from './HedgehogIcon';
import { cn } from '../lib/cn';

/** 스크린샷이 없을 때 보여주는 카드 */
export function NoShot({ className }: { className?: string }) {
  return (
    <div className={cn('grid place-items-center rounded-2xl border border-dashed border-line bg-field px-6 py-10 text-center', className)}>
      <div className="flex flex-col items-center gap-2.5">
        <HedgehogIcon size={44} className="text-ink-3" />
        <b className="text-[15px]">이미지가 없어요, 죄송해요 ㅠㅠ</b>
        <span className="text-[13px] text-ink-3">이 프로젝트는 공개할 수 있는 화면이 남아 있지 않아요.</span>
      </div>
    </div>
  );
}

const Arrow = ({ dir }: { dir: 'left' | 'right' }) => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={dir === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
  </svg>
);

/** 크게 보기 — 버튼이나 ←/→ 로 넘기고 Esc 로 닫아요 */
export function Lightbox({ shots, at, onClose }: { shots: Shot[]; at: number; onClose: () => void }) {
  const [i, setI] = useState(at);
  const n = shots.length;
  const go = (d: number) => setI((v) => (v + d + n) % n);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!['Escape', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;
      e.stopPropagation(); // 상세 페이지의 Esc·화살표 단축키보다 먼저 처리
      if (e.key === 'Escape') onClose();
      else setI((v) => (v + (e.key === 'ArrowRight' ? 1 : -1) + n) % n);
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [n, onClose]);

  const s = shots[i];
  const nav = 'absolute top-1/2 z-[1] grid size-12 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-black/55 text-white ring-1 ring-white/20 backdrop-blur-md transition hover:bg-black/75 max-[600px]:size-10';
  return (
    <div role="dialog" aria-modal="true" aria-label={s.label} onClick={onClose} className="fixed inset-0 z-[9700] flex animate-fade-in flex-col items-center justify-center gap-3 bg-black/85 p-4 motion-reduce:animate-none">
      <img
        key={s.src} src={s.src} alt={s.label}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[82vh] max-w-[min(100%,calc(100vw-140px))] animate-fade-in rounded-lg object-contain shadow-2xl max-[600px]:max-w-full"
      />
      <div className="text-sm text-white/85">{s.label} · {i + 1}/{n}</div>
      {n > 1 && (
        <>
          <button type="button" aria-label="이전 이미지" className={cn(nav, 'left-4 max-[600px]:left-2')} onClick={(e) => { e.stopPropagation(); go(-1); }}><Arrow dir="left" /></button>
          <button type="button" aria-label="다음 이미지" className={cn(nav, 'right-4 max-[600px]:right-2')} onClick={(e) => { e.stopPropagation(); go(1); }}><Arrow dir="right" /></button>
        </>
      )}
      <button type="button" aria-label="닫기" className="absolute top-4 right-4 z-[1] grid size-10 cursor-pointer place-items-center rounded-full bg-black/55 text-white ring-1 ring-white/20 backdrop-blur-md hover:bg-black/75" onClick={(e) => { e.stopPropagation(); onClose(); }}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
      </button>
    </div>
  );
}

/** 가로로 넘기는 스크린샷 줄 (높이 고정, 비율 유지) — 마우스로 끌면 관성으로 부드럽게, 누르면 크게 보기 */
export function ShotStrip({ id, height = 'h-[300px] max-[600px]:h-[220px]' }: { id: string; height?: string }) {
  const shots = shotsOf(id);
  const [open, setOpen] = useState<number | null>(null);
  const row = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean; lastX: number; lastT: number; v: number } | null>(null);
  const raf = useRef(0);
  const suppress = useRef(false);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  if (!shots.length) return <NoShot />;

  // 마우스로 잡아끌기 — 화면 갱신 없이 scrollLeft 만 바꾸고, 놓으면 관성으로 미끄러지듯 멈춰요 (터치는 기본 스크롤)
  const down = (e: RPE) => {
    if (e.pointerType !== 'mouse' || e.button !== 0 || !row.current) return;
    cancelAnimationFrame(raf.current);
    drag.current = { x: e.clientX, left: row.current.scrollLeft, moved: false, lastX: e.clientX, lastT: e.timeStamp, v: 0 };
  };
  const move = (e: RPE) => {
    const d = drag.current;
    const el = row.current;
    if (!d || !el) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) > 4) {
      d.moved = true;
      el.setPointerCapture(e.pointerId);
      el.style.cursor = 'grabbing';
    }
    if (!d.moved) return;
    el.scrollLeft = d.left - dx;
    const dt = e.timeStamp - d.lastT;
    if (dt > 0) d.v = 0.8 * ((e.clientX - d.lastX) / dt) + 0.2 * d.v; // px/ms
    d.lastX = e.clientX;
    d.lastT = e.timeStamp;
  };
  const up = (e: RPE) => {
    const d = drag.current;
    const el = row.current;
    drag.current = null;
    if (!d?.moved || !el) return;
    el.style.cursor = '';
    suppress.current = true;
    setTimeout(() => { suppress.current = false; }, 0);
    // 잠깐 멈췄다 놓으면 관성 없음
    let v = e.timeStamp - d.lastT > 80 ? 0 : -d.v * 16; // px/frame
    const step = () => {
      if (Math.abs(v) < 0.3) return;
      el.scrollLeft += v;
      v *= 0.94;
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  };
  return (
    <>
      <div
        ref={row}
        onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
        onWheel={() => cancelAnimationFrame(raf.current)}
        className="flex cursor-grab gap-3.5 overflow-x-auto pb-2 select-none [scrollbar-width:thin]"
      >
        {shots.map((s, k) => (
          <figure key={s.src} className="flex-none">
            <button
              type="button"
              onClick={() => { if (!suppress.current) setOpen(k); }}
              aria-label={`${s.label} 크게 보기`}
              className={cn('group block cursor-[inherit] overflow-hidden rounded-2xl border border-line bg-white shadow-[0_10px_30px_-22px_rgba(0,0,0,.45)]', height)}
            >
              <img src={s.src} alt={s.label} loading="lazy" draggable={false} className="h-full w-auto max-w-none object-contain transition-transform duration-300 group-hover:scale-[1.02]" />
            </button>
            <figcaption className="mt-1.5 px-1 text-[12.5px] text-ink-3">{s.label}</figcaption>
          </figure>
        ))}
      </div>
      {open !== null && <Lightbox shots={shots} at={open} onClose={() => setOpen(null)} />}
    </>
  );
}
