import { useEffect, useMemo, useRef, useState } from 'react';
import { CO, PROJECTS } from '../data/projects';
import { NOTES } from '../data/notes';
import { app, goChoose, goDesk, goWeb, showProject } from '../store/app';
import { desk } from '../store/desktop';

interface Hit { g: string; label: string; meta: string; run: () => void }

function search(q: string, web: boolean): Hit[] {
  const k = q.toLowerCase();
  const r: Hit[] = [];
  PROJECTS.forEach((p, i) => {
    if (!k || (p.name + p.one + p.stack.join(' ') + CO[p.co]).toLowerCase().includes(k))
      r.push({ g: '프로젝트', label: p.name, meta: `${CO[p.co]} · ${p.year}`, run: () => showProject(i) });
  });
  if (!web)
    NOTES.forEach((n) => {
      if (!k || (n.title + n.sub).toLowerCase().includes(k)) r.push({ g: '메모', label: n.title, meta: n.sub, run: () => desk.openNote(n.id) });
    });
  const shortcuts: [string, () => void][] = web
    ? [['데스크톱으로 보기', goDesk], ['보는 방식 고르기', goChoose]]
    : [['웹페이지로 보기', () => void goWeb(null)], ['연락처', () => desk.openWin('contact')], ['터미널', () => desk.openWin('terminal')]];
  shortcuts.forEach(([l, f]) => (!k || l.includes(q)) && r.push({ g: '바로가기', label: l, meta: '', run: f }));
  return r.slice(0, 12);
}

/** ⌘K / Ctrl+K 검색 */
export function Spotlight({ phone }: { phone: boolean }) {
  const mode = app.useStore((s) => s.mode);
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const items = useMemo(() => search(q.trim(), mode === 'web').filter((h) => !(phone && h.g === '바로가기')), [q, mode, phone]);
  useEffect(() => { input.current?.focus(); }, []);

  const close = () => app.set({ spotOpen: false });
  const run = (h?: Hit) => {
    if (!h) return;
    close();
    h.run();
  };
  let group = '';

  return (
    <div id="spotHost">
      <div className="spot-bg" onPointerDown={close} />
      <div className="spot" role="dialog" aria-label="검색">
        <div className="spot-in">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" style={{ color: 'var(--text3)' }}><circle cx="10.5" cy="10.5" r="6.5" /><path d="m20 20-4.6-4.6" /></svg>
          <label className="sr" htmlFor="spotIn">검색</label>
          <input
            id="spotIn"
            ref={input}
            placeholder="프로젝트, 메모, 기술 검색"
            autoComplete="off"
            value={q}
            onChange={(e) => { setQ(e.target.value); setSel(0); }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(items.length - 1, s + 1)); }
              else if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(0, s - 1)); }
              else if (e.key === 'Enter') run(items[sel]);
            }}
          />
        </div>
        <div className="spot-res" role="listbox">
          {!items.length && <div className="grp">결과 없음</div>}
          {items.map((h, i) => {
            const head = h.g !== group ? <div className="grp">{h.g}</div> : null;
            group = h.g;
            return (
              <div key={h.g + h.label} style={{ display: 'contents' }}>
                {head}
                <button type="button" role="option" aria-selected={i === sel} onClick={() => run(h)}>
                  <span>{h.label}</span><small>{h.meta}</small>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
