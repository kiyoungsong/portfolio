import { PLATFORM, type Project } from '../data/projects';
import { AppIcon } from '../components/AppIcon';
import { openDetail } from '../store/app';

export function ProjectRow({ p, i }: { p: Project; i: number }) {
  return (
    <div
      className="arow"
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
    >
      <AppIcon p={p} size={56} />
      <span className="nm">
        <b>{p.name}</b>
        <span>{PLATFORM[p.tag]} · {p.role} · {p.year}</span>
      </span>
      <span className="get" aria-hidden="true">보기</span>
    </div>
  );
}
