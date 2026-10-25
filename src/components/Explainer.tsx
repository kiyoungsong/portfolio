import { useState } from 'react';
import { Seg, segBtn } from '../desktop/ui';

const APPS = ['web', 'admin', 'toonspace'];

/** Toonspace 모노레포 전환 Before / After 비교 위젯 */
export function Explainer() {
  const [after, setAfter] = useState(false);
  return (
    <div className="overflow-hidden rounded-xl bg-field">
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-sep px-3 py-[9px]">
        <Seg label="구조 비교">
          <button type="button" className={segBtn} aria-pressed={!after} onClick={() => setAfter(false)}>Before</button>
          <button type="button" className={segBtn} aria-pressed={after} onClick={() => setAfter(true)}>After</button>
        </Seg>
        <span className="text-[13px] text-ink-2">
          공통 UI 수정 <b className="text-lg tabular-nums" style={{ color: after ? 'var(--t-iot)' : '#e5484d' }}>{after ? '1회' : '3회'}</b>
        </span>
      </div>
      <div key={String(after)} className="min-h-[150px] animate-pop p-3.5 motion-reduce:animate-none">
        {!after ? (
          <div className="grid grid-cols-3 gap-2">
            {APPS.map((a) => (
              <div key={a} className="flex min-w-0 flex-col gap-1.5 rounded-[10px] border-[1.5px] border-dashed border-sep bg-win p-2.5 text-[13px]">
                <code className="font-mono text-[11px] text-ink-3">repo/{a}</code>
                <b>{a}</b>
                <span className="rounded-md bg-[rgba(255,95,87,.15)] px-[7px] py-[3px] text-[11.5px] text-[#d1372f]">ui 복사본 · 따로 수정</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2.5 rounded-xl border-[1.5px] border-sep bg-win p-3">
            <code className="font-mono text-[11.5px] text-ink-3">toonflow/ · pnpm workspace</code>
            <div className="grid grid-cols-3 gap-2">
              {APPS.map((a) => <div key={a} className="min-w-0 truncate rounded-lg bg-field px-2.5 py-[7px] font-mono text-xs">apps/{a}</div>)}
            </div>
            <div aria-hidden="true" className="mx-[16%] h-3.5 rounded-b-[10px] border-[1.5px] border-t-0 border-sep" />
            <div className="self-center rounded-lg bg-accent px-3.5 py-[7px] text-[13px] font-semibold text-white">packages/ui · 공통 디자인 시스템</div>
          </div>
        )}
      </div>
    </div>
  );
}
