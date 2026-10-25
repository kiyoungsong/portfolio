import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

/** macOS 세그먼트 컨트롤 — 버튼에 aria-pressed / aria-selected 를 주면 선택 상태가 그려져요 */
export function Seg({ label, role = 'group', children }: { label: string; role?: 'group' | 'tablist'; children: ReactNode }) {
  return (
    <div data-seg role={role} aria-label={label} className="inline-flex gap-0.5 rounded-[7px] bg-field p-0.5">
      {children}
    </div>
  );
}
export const segBtn =
  'rounded-[5px] px-2.5 py-[3px] text-[12.5px] font-medium whitespace-nowrap aria-pressed:bg-win aria-pressed:shadow-[0_1px_2px_rgba(0,0,0,.18),0_0_0_.5px_rgba(0,0,0,.06)] aria-selected:bg-win aria-selected:shadow-[0_1px_2px_rgba(0,0,0,.18),0_0_0_.5px_rgba(0,0,0,.06)]';

/** 타이틀바의 아이콘 버튼 (뒤로, 이전/다음) */
export function IconBtn({ className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" {...rest} className={cn('grid h-[26px] w-7 place-items-center rounded-md text-ink-2 hover:bg-hover disabled:opacity-35', className)} />;
}

/** 파란 기본 버튼 / 회색 보조 버튼 */
export const PushBtn = (p: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button type="button" {...p} className="rounded-md bg-accent px-3 py-[5px] font-semibold text-accent-ink" />
);
export const GrayBtn = (p: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button type="button" {...p} className="rounded-md bg-field px-3 py-[5px] font-semibold hover:bg-hover" />
);

export const Chevron = ({ dir }: { dir: 'left' | 'right' }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
    <path d={dir === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
  </svg>
);

/** 창 안 연락처·정보 카드의 공통 레이아웃 */
export const cardIn = 'sel-text flex flex-1 flex-col items-center gap-3 p-6 text-center';
export const kv = 'mt-1.5 grid w-full grid-cols-[96px_minmax(0,1fr)] gap-x-3 gap-y-1.5 text-left text-[13px] [&_dd]:font-medium [&_dd]:[overflow-wrap:anywhere] [&_dt]:text-right [&_dt]:text-ink-3';
