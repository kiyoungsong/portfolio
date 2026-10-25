import { useEffect, useRef, useState } from 'react';
import { desk, WIN_IDS, WIN_NAMES } from '../store/desktop';
import { app, goWeb } from '../store/app';
import { runOpen } from '../store/actions';

type Item = [label: string, run: () => void, kbd?: string] | '-';

function menus(key: string): Item[] {
  const w = desk.get().wins;
  switch (key) {
    case 'logo':
      return [['이 개발자에 관하여', () => desk.openWin('about')], ['웹페이지로 보기', () => goWeb(null)], '-', ['처음 화면으로', () => { desk.closeAll(); desk.openWin('welcome'); }]];
    case 'app':
      return [['모든 프로젝트 보기', () => desk.openFinder({ sel: 'all' })], ['대표 프로젝트', () => desk.openFinder({ sel: 'feat' })]];
    case 'file':
      return [['새 Finder 윈도우', () => desk.openWin('finder')], ['찾기…', () => app.set({ spotOpen: true }), '⌘K'], '-', ['윈도우 닫기', () => { const a = desk.get().active; if (a) desk.closeWin(a); }]];
    case 'view':
      return [['아이콘으로 보기', () => desk.openFinder({ view: 'icon' })], ['목록으로 보기', () => desk.openFinder({ view: 'list' })], '-', ['웹페이지로 보기', () => goWeb(null)], ['모든 창 정리', () => desk.layout()]];
    case 'go':
      return [['브레인벤쳐스', () => runOpen('company:bv')], ['에어릭스', () => runOpen('company:airlix')], ['아이언오토메이션', () => runOpen('company:iron')], '-', ['자기소개', () => desk.openNote('hello')], ['일하는 방식', () => desk.openNote('work')], ['AI 활용', () => desk.openNote('ai')]];
    case 'window':
      return WIN_IDS.filter((k) => k !== 'welcome').map((k) => [WIN_NAMES[k] + (w[k].open ? (w[k].min ? ' (최소화됨)' : ' ✓') : ''), () => desk.openWin(k)] as Item);
    default:
      return [['단축키 · ⌘K 검색, Esc 닫기', () => app.set({ spotOpen: true })], ['터미널에서 help 입력해 보기', () => desk.openWin('terminal')]];
  }
}

const TOP: [key: string, label: string][] = [['file', '파일'], ['view', '보기'], ['go', '이동'], ['window', '윈도우'], ['help', '도움말']];

function Clock() {
  const fmt = () => {
    const d = new Date(), h = d.getHours();
    return `${d.getMonth() + 1}월 ${d.getDate()}일 (${'일월화수목금토'[d.getDay()]}) ${h < 12 ? '오전' : '오후'} ${h % 12 || 12}:${String(d.getMinutes()).padStart(2, '0')}`;
  };
  const [t, setT] = useState(fmt);
  useEffect(() => {
    const id = window.setInterval(() => setT(fmt()), 15000);
    return () => window.clearInterval(id);
  }, []);
  return <span className="mb-item">{t}</span>;
}

export function MenuBar() {
  const open = desk.useStore((s) => s.menu);
  const active = desk.useStore((s) => s.active);
  const [left, setLeft] = useState(0);
  const menuEl = useRef<HTMLDivElement>(null);
  const viaKeyboard = useRef(false);

  const show = (key: string, btn: HTMLElement) => {
    viaKeyboard.current = btn.matches(':focus-visible');
    setLeft(Math.max(6, btn.getBoundingClientRect().left));
    desk.set({ menu: key });
  };
  useEffect(() => {
    if (open && viaKeyboard.current) menuEl.current?.querySelector('button')?.focus();
  }, [open]);
  useEffect(() => {
    const off = (e: PointerEvent) => {
      if (desk.get().menu && !(e.target as HTMLElement).closest('.menu,[data-menu]')) desk.closeMenu();
    };
    document.addEventListener('pointerdown', off);
    return () => document.removeEventListener('pointerdown', off);
  }, []);

  const btn = (key: string, label: string, extra: object = {}) => (
    <button
      key={key}
      className={`mb-item${key === 'app' ? ' mb-app' : ''}`}
      type="button"
      data-menu={key}
      aria-haspopup="true"
      aria-expanded={open === key}
      onClick={(e) => (open === key ? desk.closeMenu() : show(key, e.currentTarget))}
      onPointerOver={(e) => open && open !== key && show(key, e.currentTarget)}
      {...extra}
    >
      {label}
    </button>
  );
  const items = open ? menus(open) : [];

  return (
    <>
      <header className="menubar">
        <nav className="mb-left" aria-label="메뉴 막대">
          {btn('logo', '◆', { 'aria-label': 'kaiOS 메뉴', style: { fontSize: 15 } })}
          {btn('app', active ? WIN_NAMES[active] : 'Finder')}
          {TOP.map(([k, l]) => btn(k, l))}
        </nav>
        <div className="mb-right">
          <span className="mb-item" aria-hidden="true"><svg className="mb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="7" width="17" height="10" rx="3" /><rect x="4.5" y="9.5" width="12" height="5" rx="1.5" fill="currentColor" stroke="none" /><path d="M21 11v2" /></svg></span>
          <span className="mb-item" aria-hidden="true"><svg className="mb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M2.5 9a14 14 0 0 1 19 0" /><path d="M5.5 12.5a9.5 9.5 0 0 1 13 0" /><path d="M8.7 15.8a5 5 0 0 1 6.6 0" /><circle cx="12" cy="19" r="1" fill="currentColor" /></svg></span>
          <button className="mb-item" type="button" aria-label="검색 (⌘K)" onClick={() => app.set({ spotOpen: true })}>
            <svg className="mb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m20 20-4.6-4.6" /></svg>
          </button>
          <Clock />
        </div>
      </header>
      {open && (
        <div
          className="menu"
          role="menu"
          ref={menuEl}
          style={{ left }}
          onKeyDown={(e) => {
            const bs = [...(menuEl.current?.querySelectorAll('button') ?? [])];
            const i = bs.indexOf(document.activeElement as HTMLButtonElement);
            if (e.key === 'ArrowDown') { e.preventDefault(); bs[(i + 1) % bs.length]?.focus(); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); bs[(i - 1 + bs.length) % bs.length]?.focus(); }
          }}
        >
          {items.map((it, i) =>
            it === '-' ? <hr key={i} /> : (
              <button key={i} type="button" role="menuitem" onClick={() => { desk.closeMenu(); it[1](); }}>
                <span>{it[0]}</span><span className="kbd">{it[2] ?? ''}</span>
              </button>
            ),
          )}
        </div>
      )}
    </>
  );
}
