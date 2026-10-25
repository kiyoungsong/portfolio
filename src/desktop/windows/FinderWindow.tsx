import { useRef, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { Window } from '../Window';
import { desk, type FinderSel } from '../../store/desktop';
import { CO, PROJECTS, TAG, tagColor, type CompanyId, type TagId } from '../../data/projects';
import { TagDot } from '../../components/TagDot';

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

export function FinderWindow() {
  const f = desk.useStore((s) => s.finder);
  const lastPointer = useRef('mouse');
  const list = filtered(f.sel, f.q);

  const pick = (i: number) => {
    if (lastPointer.current === 'touch') return desk.openProject(i);
    desk.setFinder({ picked: i });
  };
  const side = (k: FinderSel, label: string, icon: ReactNode) => (
    <button key={k} className="side-i" type="button" aria-current={f.sel === k} onClick={() => desk.setFinder({ sel: k, picked: null })}>
      {icon}<span>{label}</span>
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
    <Window id="finder" label="프로젝트"
      toolbar={
        <>
          <button className="ibtn" type="button" aria-label="뒤로" disabled={f.sel === 'all' && !f.q} onClick={() => desk.setFinder({ sel: 'all', q: '' })}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><path d="M15 5l-7 7 7 7" /></svg>
          </button>
          <span className="tb-title">{titleOf(f.sel)}</span>
          <span className="tb-spacer" />
          <div className="seg" role="group" aria-label="보기 방식">
            <button type="button" aria-pressed={f.view === 'icon'} aria-label="아이콘 보기" onClick={() => desk.setFinder({ view: 'icon' })}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7.5" height="7.5" rx="1.5" /><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" /><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" /><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" /></svg>
            </button>
            <button type="button" aria-pressed={f.view === 'list'} aria-label="목록 보기" onClick={() => desk.setFinder({ view: 'list' })}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>
          <label className="search">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m20 20-4.6-4.6" /></svg>
            <span className="sr">프로젝트 검색</span>
            <input type="search" placeholder="검색" autoComplete="off" value={f.q} onChange={(e) => desk.setFinder({ q: e.target.value })} />
          </label>
        </>
      }>
      <nav className="f-side" aria-label="분류">
        <h4>즐겨찾기</h4>
        {side('all', '모든 프로젝트', ICO.all)}
        {side('feat', '대표 프로젝트', ICO.feat)}
        <h4>회사</h4>
        {(Object.entries(CO) as [CompanyId, string][]).map(([k, v]) => side(`co:${k}`, v, ICO.co))}
        <h4>태그</h4>
        {(Object.entries(TAG) as [TagId, [string, string]][]).map(([k, [l]]) => side(`tag:${k}`, l, <TagDot tag={k} size={10} />))}
      </nav>
      <div className="f-main">
        <div className="scroll" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {!list.length ? (
            <div className="empty">‘{f.q}’와 일치하는 항목이 없습니다.</div>
          ) : f.view === 'icon' ? (
            <div className="f-grid" role="listbox" aria-label="프로젝트">
              {list.map(({ p, i }) => (
                <button key={p.id} className="ficon" type="button" role="option" {...itemProps(i)}>
                  <span className="ico-wrap"><span className="folder"><span className="em">{p.em}</span></span></span>
                  <span className="nm"><TagDot tag={p.tag} size={8} />{p.name}</span>
                </button>
              ))}
            </div>
          ) : (
            <table className="ftable">
              <thead><tr><th>이름</th><th>역할</th><th>회사</th><th>기간</th></tr></thead>
              <tbody>
                {list.map(({ p, i }) => (
                  <tr key={p.id} tabIndex={0} {...itemProps(i)}>
                    <td><span className="mini" style={{ background: tagColor(p.tag) }} />{p.name}</td>
                    <td>{p.role}</td><td>{CO[p.co]}</td><td>{p.year}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="fstatus">{list.length}개 항목 · 더블클릭하거나 Enter로 열기</div>
      </div>
    </Window>
  );
}
