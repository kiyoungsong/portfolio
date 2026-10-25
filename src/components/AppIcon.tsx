import type { Project } from '../data/projects';
import { tagColor } from '../data/projects';

/** 앱스토어 스타일 둥근 사각형 아이콘 */
export function AppIcon({ p, size }: { p: Project; size: number }) {
  return (
    <span
      aria-hidden="true"
      className="sheen grid flex-none place-items-center overflow-hidden font-extrabold tracking-[-.03em] text-white shadow-[inset_0_0_0_.5px_rgba(0,0,0,.12),0_1px_2px_rgba(0,0,0,.12)]"
      style={{ width: size, height: size, borderRadius: Math.round(size * 0.23), fontSize: Math.round(size * 0.36), background: tagColor(p.tag) }}
    >
      {p.em}
    </span>
  );
}
