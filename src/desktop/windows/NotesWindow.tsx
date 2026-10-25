import { useEffect, useRef } from 'react';
import { Window } from '../Window';
import { desk } from '../../store/desktop';
import { NOTES } from '../../data/notes';
import { cn } from '../../lib/cn';

/** 메모 본문(JSX)의 제목·문단·목록 스타일 */
const prose =
  '[&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:mt-5 [&_h3]:mb-1.5 [&_h3]:text-[15px] [&_h3]:font-bold [&_p]:mb-2.5 [&_p]:max-w-[62ch] [&_ul]:mb-2.5 [&_ul]:list-disc [&_ul]:pl-5';

export function NotesWindow() {
  const sel = desk.useStore((s) => s.note);
  const body = useRef<HTMLElement>(null);
  const note = NOTES.find((n) => n.id === sel) ?? NOTES[0];
  useEffect(() => { body.current?.scrollTo({ top: 0 }); }, [sel]);
  return (
    <Window
      id="notes"
      label="메모"
      toolbar={
        <>
          <span className="truncate text-[13px] font-bold">메모</span>
          <span className="flex-1" />
          <span className="font-mono text-[11.5px] text-ink-3">{NOTES.length}개의 메모</span>
        </>
      }
    >
      <nav aria-label="메모 목록" className="w-[220px] flex-none overflow-auto border-r border-sep bg-win p-2">
        {NOTES.map((n) => (
          <button
            key={n.id}
            type="button"
            aria-current={sel === n.id}
            onClick={() => desk.set({ note: n.id })}
            className={cn('flex w-full flex-col gap-px rounded-[7px] px-2.5 py-2 text-left', sel === n.id && 'bg-note-sel')}
          >
            <b className="text-[13px]">{n.title}</b>
            <span className="truncate text-xs text-ink-3">{n.sub}</span>
          </button>
        ))}
      </nav>
      <article ref={body} className={cn('sel-text min-w-0 flex-1 overflow-auto overscroll-contain bg-note px-8 pt-[26px] pb-10 text-[15px] leading-[1.75]', prose)}>
        <div className="mb-3.5 text-center text-xs text-ink-3">2026년 10월</div>
        {note.body}
      </article>
    </Window>
  );
}
