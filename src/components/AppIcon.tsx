import type { Project } from '../data/projects';
import { tagColor } from '../data/projects';

/** 앱스토어 스타일 둥근 사각형 아이콘 */
export function AppIcon({ p, size }: { p: Project; size: number }) {
  return (
    <span
      className="icon"
      aria-hidden="true"
      style={{ width: size, height: size, borderRadius: Math.round(size * 0.23), fontSize: Math.round(size * 0.36), background: tagColor(p.tag) }}
    >
      <span>{p.em}</span>
    </span>
  );
}
