import { useRef, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { Window } from '../Window';
import { IconBtn, Chevron, Seg, segBtn } from '../ui';
import { desk, type FinderSel } from '../../store/desktop';
import { CO, PROJECTS, TAG, tagColor, type CompanyId, type TagId } from '../../data/projects';
import { TagDot } from '../../components/TagDot';
import { Folder } from '../../components/Folder';
import { cn } from '../../lib/cn';

const ICO = {
  all: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="16" rx="3" /><path d="M3 9h18" /></svg>,
  feat: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" /></svg>,
  co: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>,
};

function filtered(sel: FinderSel, q: string) {
  let l = PROJECTS.map((p, i) => ({ p, i }));
  if (sel === 'feat') l = l.filter(({ p }) => p.feat);
  else if (sel.startsWith('co:')) l = l.filter(({ p }) => p.co === sel.slice(3));
  else if (sel.startsWith('tag:')) l = l.filter(({ p }) => p.tag === sel.slice(4));
  if (q) {
    const k = q.toLowerCase();
    l = l.filter(({ p }) => (p.name + p.one + p.stack.join(' ') + CO[p.co] + p.role).toLowerCase().includes(k));
  }
  return l;
}

const titleOf = (s: FinderSel) =>
  s === 'all' ? '모든 프로젝트' : s === 'feat' ? '대표 프로젝트' : s.startsWith('co:') ? CO[s.slice(3) as CompanyId] : TAG[s.slice(4) as TagId][0];

const sideHead = 'mx-2 mt-2.5 mb-1 text-[11px] font-bold text-ink-3 first:mt-0';

export function FinderWindow() {
  const f = desk.useStore((s) => s.finder);
  const lastPointer = useRef('mouse');
  const list = filtered(f.sel, f.q);

  const pick = (i: number) => {
    if (lastPointer.current === 'touch') return desk.openProject(i);
    desk.setFinder({ picked: i });
  };
  const side = (k: FinderSel, label: string, icon: ReactNode) => (
    <button
      key={k}
      type="button"
      aria-current={f.sel === k}
      onClick={() => desk.setFinder({ sel: k, picked: null })}
      className={cn('flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-[13px] [&>svg]:flex-none [&>svg]:text-accent', f.sel === k ? 'bg-sel' : 'hover:bg-hover')}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
  const itemProps = (i: number) => ({
    'data-pid': i,
    'aria-selected': f.picked === i,
    onPointerDown: (e: PointerEvent) => (lastPointer.current = e.pointerType),
    onClick: () => pick(i),
    onDoubleClick: () => desk.openProject(i),
    onKeyDown: (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        desk.openProject(i);
      }
    },
  });

  return (
    <Window
      id="finder"
      label="프로젝트"
      toolbar={
        <>
          <IconBtn aria-label="뒤로" disabled={f.sel === 'all' && !f.q} onClick={() => desk.setFinder({ sel: 'all', q: '' })}>
            <Chevron dir="left" />
          </IconBtn>
          <span className="truncate text-[13px] font-bold">{titleOf(f.sel)}</span>
          <span className="flex-1" />
          <Seg label="보기 방식">
            <button type="button" className={segBtn} aria-pressed={f.view === 'icon'} aria-label="아이콘 보기" onClick={() => desk.setFinder({ view: 'icon' })}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7.5" height="7.5" rx="1.5" /><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" /><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" /><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" /></svg>
            </button>
            <button type="button" className={segBtn} aria-pressed={f.view === 'list'} aria-label="목록 보기" onClick={() => desk.setFinder({ view: 'list' })}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </Seg>
          <label className="flex h-7 min-w-0 items-center gap-1.5 rounded-[7px] bg-field px-[9px]">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m20 20-4.6-4.6" /></svg>
            <span className="sr-only">프로젝트 검색</span>
            <input type="search" placeholder="검색" autoComplete="off" value={f.q} onChange={(e) => desk.setFinder({ q: e.target.value })} className="w-[150px] min-w-0 bg-transparent text-[13px] outline-none" />
          </label>
        </>
      }
    >
      <nav aria-label="분류" className="flex w-[184px] flex-none flex-col gap-0.5 overflow-auto bg-sidebar px-2 py-2.5 backdrop-blur-[20px]">
        <h4 className={sideHead}>즐겨찾기</h4>
        {side('all', '모든 프로젝트', ICO.all)}
        {side('feat', '대표 프로젝트', ICO.feat)}
        <h4 className={sideHead}>회사</h4>
        {(Object.entries(CO) as [CompanyId, string][]).map(([k, v]) => side(`co:${k}`, v, ICO.co))}
        <h4 className={sideHead}>태그</h4>
        {(Object.entries(TAG) as [TagId, [string, string]][]).map(([k, [l]]) => side(`tag:${k}`, l, <TagDot tag={k} size={10} />))}
      </nav>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-1 flex-col overflow-auto overscroll-contain">
          {!list.length ? (
            <div className="p-10 text-center text-ink-3">‘{f.q}’와 일치하는 항목이 없습니다.</div>
          ) : f.view === 'icon' ? (
            <div role="listbox" aria-label="프로젝트" className="grid flex-1 grid-cols-[repeat(auto-fill,minmax(108px,1fr))] content-start gap-x-1.5 gap-y-3.5 p-4">
              {list.map(({ p, i }) => (
                <button key={p.id} type="button" role="option" {...itemProps(i)} className="group flex flex-col items-center gap-[5px] rounded-lg px-1 py-1.5">
                  <span className="rounded-[7px] p-1 group-aria-selected:bg-hover"><Folder label={p.em} /></span>
                  <span className="flex items-center gap-1 rounded px-[5px] py-px text-center text-xs leading-[1.3] group-aria-selected:bg-accent group-aria-selected:text-white">
                    <TagDot tag={p.tag} size={8} />
                    {p.name}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="[&>th]:sticky [&>th]:top-0 [&>th]:border-b [&>th]:border-sep [&>th]:bg-win [&>th]:px-2.5 [&>th]:py-1.5 [&>th]:text-left [&>th]:text-xs [&>th]:font-medium [&>th]:text-ink-3">
                  <th>이름</th><th>역할</th><th>회사</th><th>기간</th>
                </tr>
              </thead>
              <tbody>
                {list.map(({ p, i }) => (
                  <tr
                    key={p.id}
                    tabIndex={0}
                    {...itemProps(i)}
                    className="even:bg-hover aria-selected:bg-accent aria-selected:text-white [&>td]:px-2.5 [&>td]:py-[5px] [&>td]:whitespace-nowrap"
                  >
                    <td><span className="mr-2 inline-block h-3.5 w-[18px] rounded-[3px] align-[-2px]" style={{ background: tagColor(p.tag) }} />{p.name}</td>
                    <td>{p.role}</td><td>{CO[p.co]}</td><td>{p.year}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="flex h-[26px] flex-none items-center justify-center border-t border-sep text-[11.5px] text-ink-3">{list.length}개 항목 · 더블클릭하거나 Enter로 열기</div>
      </div>
    </Window>
  );
}
