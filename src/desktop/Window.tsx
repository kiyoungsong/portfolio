import { useLayoutEffect, useRef, type CSSProperties, type PointerEvent, type ReactNode } from 'react';
import { cn } from '../lib/cn';
import { desk, type WinId } from '../store/desktop';
import { prefersReducedMotion } from '../lib/env';

interface Props {
  id: WinId;
  label: string;
  className?: string;
  /** 타이틀바 안에 들어갈 요소 (신호등 버튼 오른쪽) */
  toolbar?: ReactNode;
  thin?: boolean;
  zoomable?: boolean;
  resizable?: boolean;
  children: ReactNode;
  /** 창 밖으로 살짝 걸쳐 그리는 장식 */
  decoration?: ReactNode;
  /** 터미널처럼 어두운 타이틀바 */
  dark?: boolean;
}

const dockCenter = (id: WinId) => {
  const b = document.querySelector(`[data-dock-id="${id}"] button`) ?? document.querySelector('[data-dock-id="finder"] button');
  return b?.getBoundingClientRect() ?? null;
};

/** 신호등 버튼, 드래그, 리사이즈, 최소화(독으로 빨려 들어가는) 애니메이션을 가진 macOS 창 */
export function Window({ id, label, className, toolbar, thin, zoomable = true, resizable = true, children, decoration, dark }: Props) {
  const s = desk.useStore((st) => st.wins[id]);
  const active = desk.useStore((st) => st.active === id);
  const el = useRef<HTMLElement>(null);
  const drag = useRef<{ grip: boolean; sx: number; sy: number; ox: number; oy: number; ow: number; oh: number } | null>(null);
  const prevMin = useRef(s.min);
  const zoomAnim = useRef(false);

  // 열릴 때 팝 애니메이션
  useLayoutEffect(() => {
    if (!s.openSeq || prefersReducedMotion() || !el.current) return;
    el.current.classList.remove('animate-win-open');
    void el.current.offsetWidth;
    el.current.classList.add('animate-win-open');
  }, [s.openSeq]);

  // 독에서 복원될 때 독 위치에서 커지며 나타남
  useLayoutEffect(() => {
    const was = prevMin.current;
    prevMin.current = s.min;
    if (!(was && !s.min) || prefersReducedMotion() || !el.current?.animate) return;
    const d = dockCenter(id);
    if (!d) return;
    const r = el.current.getBoundingClientRect();
    el.current.animate(
      [
        { transform: `translate(${d.left + d.width / 2 - (r.left + r.width / 2)}px,${d.top + d.height / 2 - (r.top + r.height / 2)}px) scale(.08)`, opacity: 0.3 },
        { transform: 'none', opacity: 1 },
      ],
      { duration: 380, easing: 'cubic-bezier(.2,.8,.3,1)' },
    );
  }, [s.min, id]);

  const minimize = () => {
    const e = el.current;
    const d = dockCenter(id);
    if (!e || prefersReducedMotion() || !d || !e.animate) return desk.setMin(id);
    const r = e.getBoundingClientRect();
    e.animate(
      [
        { transform: 'none', opacity: 1 },
        { transform: `translate(${d.left + d.width / 2 - (r.left + r.width / 2)}px,${d.top + d.height / 2 - (r.top + r.height / 2)}px) scale(.08)`, opacity: 0.3 },
      ],
      { duration: 380, easing: 'cubic-bezier(.5,0,.75,0)' },
    ).onfinish = () => desk.setMin(id);
  };

  const zoom = () => {
    if (!zoomable) return;
    zoomAnim.current = !prefersReducedMotion();
    desk.zoom(id);
    window.setTimeout(() => (zoomAnim.current = false), 280);
  };

  const onPointerDown = (e: PointerEvent) => {
    if (!active) desk.focusWin(id);
    if (e.button !== 0) return;
    const t = e.target as HTMLElement;
    const grip = t.closest('[data-grip]');
    const bar = t.closest('[data-drag]');
    if (!grip && (!bar || t.closest('button,input,a,[data-seg],label'))) return;
    const cur = desk.get().wins[id];
    drag.current = { grip: !!grip, sx: e.clientX, sy: e.clientY, ox: cur.x, oy: cur.y, ow: cur.w, oh: cur.h };
    (grip ?? bar)!.setPointerCapture(e.pointerId);
    e.preventDefault();
  };
  const onPointerMove = (e: PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const host = document.getElementById('desk')!;
    const vw = host.clientWidth, vh = host.clientHeight, dx = e.clientX - d.sx, dy = e.clientY - d.sy;
    const cur = desk.get().wins[id];
    if (d.grip) desk.patchWin(id, { w: Math.max(320, d.ow + dx), h: Math.max(220, d.oh + dy) });
    else desk.patchWin(id, { x: Math.min(vw - 80, Math.max(-cur.w + 120, d.ox + dx)), y: Math.min(vh - 60, Math.max(28, d.oy + dy)), max: false });
  };
  const onPointerUp = () => (drag.current = null);

  const style: CSSProperties = {
    left: s.x, top: s.y, width: s.w, height: s.h, zIndex: s.z,
    transition: zoomAnim.current ? 'left .25s ease,top .25s ease,width .25s ease,height .25s ease' : undefined,
  };

  return (
    <section
      ref={el}
      data-win={id}
      data-active={active || undefined}
      aria-label={label}
      hidden={!s.open || s.min}
      style={style}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      className={cn(
        'absolute flex min-h-[200px] min-w-[300px] flex-col rounded-xl bg-win motion-reduce:animate-none',
        active ? 'shadow-win-active' : 'shadow-win',
        decoration ? 'overflow-visible' : 'overflow-hidden',
        className,
      )}
    >
      {decoration}
      <div
        data-drag
        onDoubleClick={(e) => !(e.target as HTMLElement).closest('button,input,[data-seg]') && zoom()}
        className={cn(
          'flex flex-none touch-none items-center gap-3 border-b px-3.5',
          thin ? 'h-[38px]' : 'h-[52px]',
          dark ? 'border-white/8 bg-[#2b2b2e] text-[#d7d7db]' : 'border-sep bg-toolbar',
          !!decoration && 'rounded-t-xl',
        )}
      >
        <div className="group/lights flex flex-none gap-2">
          <Light active={active} tone="c" label={`${label} 닫기`} onClick={() => desk.closeWin(id)}>
            <path d="M1.5 1.5l5 5M6.5 1.5l-5 5" stroke="#4d0000" strokeWidth="1.2" />
          </Light>
          <Light active={active} tone="m" label={`${label} 최소화`} onClick={minimize}>
            <path d="M1 4h6" stroke="#5a3a00" strokeWidth="1.3" />
          </Light>
          <Light active={active} tone="z" label={zoomable ? `${label} 확대` : '확대 안 됨'} disabled={!zoomable} onClick={zoom}>
            <path d="M1.5 6.5V2.5h4zM6.5 1.5v4h-4z" fill="#0a4a00" />
          </Light>
        </div>
        {toolbar}
      </div>
      <div className={cn('flex min-h-0 flex-1 overflow-hidden', !!decoration && 'rounded-b-xl')}>{children}</div>
      {resizable && <span data-grip className="absolute right-0 bottom-0 size-4 cursor-nwse-resize touch-none" />}
    </section>
  );
}

/** 신호등 버튼 — 비활성 창에서는 회색, 마우스를 올리면 색과 기호가 보여요 */
const LIGHT = {
  c: { on: 'bg-[#ff5f57]', off: 'bg-light-off group-hover/lights:bg-[#ff5f57]' },
  m: { on: 'bg-[#febc2e]', off: 'bg-light-off group-hover/lights:bg-[#febc2e]' },
  z: { on: 'bg-[#28c840]', off: 'bg-light-off group-hover/lights:bg-[#28c840]' },
};
function Light({ tone, active, label, disabled, onClick, children }: { tone: keyof typeof LIGHT; active: boolean; label: string; disabled?: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn('grid size-3 place-items-center rounded-full p-0 shadow-[inset_0_0_0_.5px_rgba(0,0,0,.18)]', active ? LIGHT[tone].on : LIGHT[tone].off)}
    >
      <svg viewBox="0 0 8 8" className="size-2 opacity-0 group-focus-within/lights:opacity-65 group-hover/lights:opacity-65">{children}</svg>
    </button>
  );
}
