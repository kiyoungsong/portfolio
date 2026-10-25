import type { AnchorHTMLAttributes, ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

/** 웹 모드 공통 폭 컨테이너 */
export const Wrap = ({ className, children, ...rest }: HTMLAttributes<HTMLElement>) => (
  <section {...rest} className={cn('mx-auto max-w-[1100px] px-[max(24px,env(safe-area-inset-left,0px))]', className)}>
    {children}
  </section>
);

const pill = 'inline-flex items-center gap-1.5 rounded-full px-5 py-[11px] text-[15px] font-bold no-underline transition-transform duration-200 ease-spring hover:-translate-y-0.5 cursor-pointer';
const tone = {
  primary: 'bg-accent text-white',
  ghost: 'bg-soft text-ink',
  glass: 'bg-white/80 text-ink',
};

export function PillLink({ tone: t = 'ghost', className, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { tone?: keyof typeof tone }) {
  return <a {...rest} className={cn(pill, tone[t], className)} />;
}
export function PillButton({ tone: t = 'ghost', className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: keyof typeof tone }) {
  return <button type="button" {...rest} className={cn(pill, tone[t], className)} />;
}

/** 앱스토어의 '받기'·'보기' 알약 버튼 */
export const GetPill = ({ bg = 'bg-field', children }: { bg?: string; children: ReactNode }) => (
  <span aria-hidden="true" className={cn(bg, 'rounded-full px-4 py-[5px] text-[13.5px] font-extrabold whitespace-nowrap text-accent transition-transform duration-200 ease-springy group-hover:scale-106')}>
    {children}
  </span>
);

/** 칩 (분류 필터·회사별 프로젝트 바로가기) */
/** 칩 공통 모양 — 배경색·크기는 쓰는 곳에서 정해요 (같은 속성 클래스를 두 번 주지 않기 위해) */
export const chip = 'inline-flex cursor-pointer items-center gap-[7px] rounded-full font-semibold text-ink aria-pressed:bg-accent aria-pressed:text-white';

export function SectionHead({ eyebrow, title, desc }: { eyebrow: string; title: string; desc?: string }) {
  return (
    <div className="mb-[22px]">
      <div className="text-[13.5px] font-bold text-accent">{eyebrow}</div>
      <h2 className="mt-1 text-[clamp(26px,3.2vw,36px)] leading-[1.15] font-extrabold tracking-[-.03em]">{title}</h2>
      {desc && <p className="mt-1.5 text-ink-2">{desc}</p>}
    </div>
  );
}
