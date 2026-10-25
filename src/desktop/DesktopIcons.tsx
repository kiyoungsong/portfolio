import { useRef } from 'react';
import { runOpen } from '../store/actions';
import { avatarSrc } from '../components/Avatar';
import { Folder } from '../components/Folder';
import { cn } from '../lib/cn';

const paper = 'rounded bg-white shadow-[0_1px_3px_rgba(0,0,0,.3)]';

const ICONS: [spec: string, label: string, icon: JSX.Element][] = [
  ['web', '웹페이지로 보기', <svg className="block size-[52px]" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="27" fill="#3d8bfd" /><circle cx="32" cy="32" r="27" fill="none" stroke="#fff" strokeWidth="2.5" opacity=".9" /><path d="M5 32h54M32 5c9 8 9 46 0 54M32 5c-9 8-9 46 0 54M10 18h44M10 46h44" fill="none" stroke="#fff" strokeWidth="2" opacity=".8" /></svg>],
  ['company:bv', '브레인벤쳐스', <Folder label="BV" />],
  ['company:airlix', '에어릭스', <Folder label="AX" />],
  ['company:iron', '아이언오토메이션', <Folder label="IA" />],
  [
    'note:hello',
    '자기소개.txt',
    <span className={cn(paper, "relative block h-[54px] w-11 overflow-hidden after:absolute after:top-0 after:right-0 after:size-3 after:bg-[linear-gradient(225deg,var(--w3)_50%,#e6e6ea_50%)] after:content-['']")}>
      {[14, 21, 28, 35].map((top, k) => (
        <i key={top} className={cn('absolute left-2 h-[3px] rounded-sm bg-[#d4d4da]', k === 3 ? 'right-4' : 'right-2')} style={{ top }} />
      ))}
    </span>,
  ],
  ['win:contact', '연락처.vcf', <span className={cn(paper, 'grid h-10 w-[54px] place-items-center rounded-md')}><img src={avatarSrc} alt="" className="mt-1 h-[34px]" /></span>],
];

/** 바탕화면 아이콘 — 마우스는 더블클릭, 터치는 한 번 탭으로 열기 */
export function DesktopIcons({ selected, onSelect }: { selected: string | null; onSelect: (s: string | null) => void }) {
  const pointer = useRef('mouse');
  return (
    <div role="group" aria-label="바탕화면" className="absolute top-12 right-[max(18px,env(safe-area-inset-right,0px))] z-[1] grid justify-items-center gap-3.5">
      {ICONS.map(([spec, label, icon]) => {
        const on = selected === spec;
        return (
          <button
            key={spec}
            type="button"
            className="flex w-24 flex-col items-center gap-1 rounded-md p-1"
            onPointerDown={(e) => (pointer.current = e.pointerType)}
            onClick={(e) => {
              onSelect(spec);
              if (pointer.current === 'touch') runOpen(spec, e.currentTarget);
            }}
            onDoubleClick={(e) => runOpen(spec, e.currentTarget)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                runOpen(spec, e.currentTarget);
              }
            }}
          >
            <span className={cn('rounded-md', on && 'bg-black/18')}>{icon}</span>
            <span className={cn('rounded px-1.5 py-px text-center text-xs leading-[1.3] font-medium text-white', on ? 'bg-accent' : '[text-shadow:0_1px_3px_rgba(0,0,0,.55)]')}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
