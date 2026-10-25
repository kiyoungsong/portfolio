import { PLATFORM, type Project } from '../data/projects';
import { AppIcon } from '../components/AppIcon';
import { openDetail } from '../store/app';
import { cn } from '../lib/cn';
import { GetPill } from './ui';

/** 앱스토어 목록 한 줄 — 테두리·배경은 놓이는 곳에서 className 으로 정해요 */
export function ProjectRow({ p, i, className, getBg, pad = 'px-1 py-3' }: { p: Project; i: number; className?: string; getBg?: string; pad?: string }) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${p.name} 상세 보기`}
      onClick={() => openDetail(i)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openDetail(i);
        }
      }}
      className={cn('group flex min-w-0 cursor-pointer items-center gap-3.5 rounded-lg', pad, className)}
    >
      <AppIcon p={p} size={56} />
      <span className="flex min-w-0 flex-1 flex-col">
        <b className="truncate text-[15.5px] group-hover:text-accent">{p.name}</b>
        <span className="truncate text-[13px] text-ink-3">{PLATFORM[p.tag]} · {p.role} · {p.year}</span>
      </span>
      <GetPill bg={getBg}>보기</GetPill>
    </div>
  );
}
