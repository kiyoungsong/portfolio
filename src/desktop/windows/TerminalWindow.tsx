import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Window } from '../Window';
import { desk } from '../../store/desktop';
import { goWeb } from '../../store/app';
import { PROJECTS } from '../../data/projects';

const Prompt = () => (<><span className="p">kai@portfolio</span> <span className="b">~</span> %</>);

export function TerminalWindow() {
  const [lines, setLines] = useState<ReactNode[]>([
    'Last login: 오늘 · kaiOS 7.26',
    <span style={{ color: '#8d8d93' }}>help 를 입력하면 쓸 수 있는 명령이 나와요.</span>,
  ]);
  const [value, setValue] = useState('');
  const hist = useRef<string[]>([]);
  const hi = useRef(0);
  const term = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const seq = desk.useStore((s) => s.wins.terminal.openSeq);
  const minimized = desk.useStore((s) => s.wins.terminal.min);

  useEffect(() => {
    if (seq) window.setTimeout(() => input.current?.focus({ preventScroll: true }), 60);
  }, [seq, minimized]);
  useEffect(() => {
    term.current?.scrollTo({ top: term.current.scrollHeight });
  }, [lines]);

  const run = (raw: string) => {
    const line = raw.trim();
    const out: ReactNode[] = [<><Prompt /> {line}</>];
    if (line) {
      const [c, ...a] = line.split(/\s+/);
      const arg = a.join(' ').toLowerCase();
      if (c === 'clear') return setLines([]);
      if (c === 'help') out.push('명령: whoami · ls · open <이름> · skills · web · clear');
      else if (c === 'whoami') out.push(<>송기영 (Kai Song) · 웹 개발자 · 7년차<br />PLC → OPC UA → MQTT → Web → App → AI</>);
      else if (c === 'ls') out.push(<>{PROJECTS.map((p) => <span key={p.id} className="b">{p.id}/&nbsp;&nbsp; </span>)}</>);
      else if (c === 'open') {
        const i = PROJECTS.findIndex((p) => p.id === arg || (!!arg && p.name.toLowerCase().includes(arg)));
        if (i >= 0) {
          desk.openProject(i);
          out.push(`${PROJECTS[i].name} 를 미리보기로 열었습니다.`);
        } else out.push(`찾을 수 없음: ${arg} — ls 로 확인해 보세요.`);
      } else if (c === 'skills')
        out.push(<>frontend&nbsp; React · Next.js · TypeScript<br />app&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Flutter · Electron · Adobe UXP<br />backend&nbsp;&nbsp; Node.js · Express · MySQL<br />ai&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Claude Code · Cursor · MCP</>);
      else if (c === 'web') {
        out.push('웹페이지 모드로 전환합니다…');
        void goWeb(document.querySelector('[data-win="terminal"]')?.getBoundingClientRect());
      } else out.push(`zsh: command not found: ${c} — help 를 입력해 보세요.`);
    }
    setLines((l) => [...l, ...out]);
  };

  return (
    <Window id="terminal" label="터미널" className="term-win" thin
      toolbar={<span className="tb-title" style={{ margin: '0 auto' }}>kai — zsh — 80×24</span>}>
      <div className="term" ref={term} onClick={() => !getSelection()?.toString() && input.current?.focus()}>
        <div>{lines.map((l, k) => <div key={k}>{l}</div>)}</div>
        <div className="term-line">
          <span><Prompt /></span>
          <label className="sr" htmlFor="termIn">명령 입력</label>
          <input
            id="termIn"
            ref={input}
            autoComplete="off"
            spellCheck={false}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                hist.current.push(value);
                hi.current = hist.current.length;
                run(value);
                setValue('');
              } else if (e.key === 'ArrowUp' && hist.current.length) {
                e.preventDefault();
                hi.current = Math.max(0, hi.current - 1);
                setValue(hist.current[hi.current]);
              } else if (e.key === 'ArrowDown' && hist.current.length) {
                hi.current = Math.min(hist.current.length, hi.current + 1);
                setValue(hist.current[hi.current] ?? '');
              }
            }}
          />
        </div>
      </div>
    </Window>
  );
}
