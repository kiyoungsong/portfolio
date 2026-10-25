import { useEffect, useRef } from 'react';
import { Window } from '../Window';
import { desk } from '../../store/desktop';
import { NOTES } from '../../data/notes';

export function NotesWindow() {
  const sel = desk.useStore((s) => s.note);
  const body = useRef<HTMLElement>(null);
  const note = NOTES.find((n) => n.id === sel) ?? NOTES[0];
  useEffect(() => { body.current?.scrollTo({ top: 0 }); }, [sel]);
  return (
    <Window id="notes" label="메모"
      toolbar={<><span className="tb-title">메모</span><span className="tb-spacer" /><span className="mono" style={{ fontSize: 11.5, color: 'var(--text3)' }}>{NOTES.length}개의 메모</span></>}>
      <nav className="n-side" aria-label="메모 목록">
        {NOTES.map((n) => (
          <button key={n.id} className="n-item" type="button" aria-current={sel === n.id} onClick={() => desk.set({ note: n.id })}>
            <b>{n.title}</b>
            <span>{n.sub}</span>
          </button>
        ))}
      </nav>
      <article className="n-body scroll sel-text" ref={body}>
        <div className="date">2026년 10월</div>
        {note.body}
      </article>
    </Window>
  );
}
