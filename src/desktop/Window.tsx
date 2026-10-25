import { useLayoutEffect, useRef, type CSSProperties, type PointerEvent, type ReactNode } from 'react';
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
}

const dockCenter = (id: WinId) => {
  const b = document.querySelector(`.d-item[data-id="${id}"] .d-btn`) ?? document.querySelector('.d-item[data-id="finder"] .d-btn');
  return b?.getBoundingClientRect() ?? null;
};

/** 신호등 버튼, 드래그, 리사이즈, 최소화(독으로 빨려 들어가는) 애니메이션을 가진 macOS 창 */
export function Window({ id, label, className = '', toolbar, thin, zoomable = true, resizable = true, children }: Props) {
  const s = desk.useStore((st) => st.wins[id]);
  const active = desk.useStore((st) => st.active === id);
  const el = useRef<HTMLElement>(null);
  const drag = useRef<{ grip: boolean; sx: number; sy: number; ox: number; oy: number; ow: number; oh: number } | null>(null);
  const prevMin = useRef(s.min);
  const zoomAnim = useRef(false);

  // 열릴 때 팝 애니메이션
  useLayoutEffect(() => {
    if (!s.openSeq || prefersReducedMotion() || !el.current) return;
    el.current.classList.remove('anim');
    void el.current.offsetWidth;
    el.current.classList.add('anim');
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
    if (!grip && (!bar || t.closest('button,input,a,.seg,label'))) return;
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
      className={`win ${className}${active ? ' active' : ''}`}
      data-win={id}
      aria-label={label}
      hidden={!s.open || s.min}
      style={style}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <div className={`tb${thin ? ' thin' : ''}`} data-drag onDoubleClick={(e) => !(e.target as HTMLElement).closest('button,input,.seg') && zoom()}>
        <div className="lights">
          <button className="light c" type="button" aria-label={`${label} 닫기`} onClick={() => desk.closeWin(id)}>
            <svg viewBox="0 0 8 8"><path d="M1.5 1.5l5 5M6.5 1.5l-5 5" stroke="#4d0000" strokeWidth="1.2" /></svg>
          </button>
          <button className="light m" type="button" aria-label={`${label} 최소화`} onClick={minimize}>
            <svg viewBox="0 0 8 8"><path d="M1 4h6" stroke="#5a3a00" strokeWidth="1.3" /></svg>
          </button>
          <button className="light z" type="button" aria-label={zoomable ? `${label} 확대` : '확대 안 됨'} disabled={!zoomable} onClick={zoom}>
            <svg viewBox="0 0 8 8"><path d="M1.5 6.5V2.5h4zM6.5 1.5v4h-4z" fill="#0a4a00" /></svg>
          </button>
        </div>
        {toolbar}
      </div>
      <div className="body">{children}</div>
      {resizable && <span className="grip" data-grip />}
    </section>
  );
}
