import { useRef } from 'react';
import { runOpen } from '../store/actions';

const ICONS: [spec: string, label: string, icon: JSX.Element][] = [
  ['web', '웹페이지로 보기', <svg className="globe" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="27" fill="#3d8bfd" /><circle cx="32" cy="32" r="27" fill="none" stroke="#fff" strokeWidth="2.5" opacity=".9" /><path d="M5 32h54M32 5c9 8 9 46 0 54M32 5c-9 8-9 46 0 54M10 18h44M10 46h44" fill="none" stroke="#fff" strokeWidth="2" opacity=".8" /></svg>],
  ['company:bv', '브레인벤쳐스', <span className="folder"><span className="em">BV</span></span>],
  ['company:airlix', '에어릭스', <span className="folder"><span className="em">AX</span></span>],
  ['company:iron', '아이언오토메이션', <span className="folder"><span className="em">IA</span></span>],
  ['note:hello', '자기소개.txt', <span className="doc"><i style={{ top: 14 }} /><i style={{ top: 21 }} /><i style={{ top: 28 }} /><i style={{ top: 35, right: 16 }} /></span>],
  ['win:contact', '연락처.vcf', <span className="vcard">KS</span>],
];

/** 바탕화면 아이콘 — 마우스는 더블클릭, 터치는 한 번 탭으로 열기 */
export function DesktopIcons({ selected, onSelect }: { selected: string | null; onSelect: (s: string | null) => void }) {
  const pointer = useRef('mouse');
  return (
    <div className="dicons" role="group" aria-label="바탕화면">
      {ICONS.map(([spec, label, icon]) => (
        <button
          key={spec}
          className={`dicon${selected === spec ? ' selected' : ''}`}
          type="button"
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
          <span className="ico-wrap">{icon}</span>
          <span className="lbl">{label}</span>
        </button>
      ))}
    </div>
  );
}
