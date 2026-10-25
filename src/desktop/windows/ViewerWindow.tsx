import { useEffect, useRef, type ReactNode } from 'react';
import { Window } from '../Window';
import { Chevron, IconBtn, Seg, segBtn } from '../ui';
import { desk } from '../../store/desktop';
import { CO, PROJECTS, TAG, tagColor, type Project } from '../../data/projects';
import { Explainer } from '../../components/Explainer';
import { ShotStrip } from '../../components/Shots';
import { shotsOf } from '../../data/shots';
import { linksOf, NO_LINK } from '../../data/links';
import { cn } from '../../lib/cn';
import { ArchDiagram } from '../../components/ArchDiagram';

const tabsFor = (p: Project) => ['개요', ...(p.arch ? ['구조'] : []), ...(p.story ? ['문제 해결'] : []), '기술'];

const Sec = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="flex flex-col gap-2.5 text-[14.5px] leading-[1.7]">
    <h3 className="text-xs font-bold text-ink-3">{title}</h3>
    {children}
  </section>
);

const Did = ({ p }: { p: Project }) => (
  <Sec title="제가 한 일">
    <ul className="flex flex-col overflow-hidden rounded-[10px] bg-field">
      {p.did.map(([title, detail]) => (
        <li key={title} className="flex gap-2.5 border-b border-sep px-3.5 py-2.5 last:border-b-0">
          <span aria-hidden="true" className="mt-[9px] size-1.5 flex-none rounded-full bg-accent" />
          <div className="min-w-0 [overflow-wrap:anywhere]">
            <b className="block text-[14px]">{title}</b>
            <span className="text-[13.5px] text-ink-2">{detail}</span>
          </div>
        </li>
      ))}
    </ul>
  </Sec>
);

function Section({ p, tab }: { p: Project; tab: string }) {
  if (tab === '개요')
    return (
      <>
        <Sec title="개요">{p.over.map((x) => <p key={x} className="max-w-[62ch]">{x}</p>)}</Sec>
        <Did p={p} />
        {shotsOf(p.id).length > 0 && (
          <Sec title="화면">
            <ShotStrip key={p.id} id={p.id} height="h-[200px]" />
          </Sec>
        )}
      </>
    );
  if (tab === '구조' && p.arch) return <Sec title="구조"><ArchDiagram k={p.arch} /></Sec>;
  if (tab === '문제 해결')
    return (
      <>
        <Sec title="문제를 어떻게 풀었나">
          <dl className="grid grid-cols-[86px_minmax(0,1fr)] gap-x-4 gap-y-2 [&_dt]:pt-[3px] [&_dt]:text-[13px] [&_dt]:font-bold [&_dt]:text-accent">
            {p.story!.map(([k, v]) => [<dt key={k + 't'}>{k}</dt>, <dd key={k + 'd'}>{v}</dd>])}
            {p.learn && <><dt>배운 점</dt><dd>{p.learn}</dd></>}
          </dl>
        </Sec>
        {p.explainer && <Sec title="직접 비교해 보기"><Explainer /></Sec>}
      </>
    );
  return (
    <Sec title="사용한 기술">
      <div className="flex flex-wrap gap-1.5">
        {p.stack.map((s) => <span key={s} className="rounded-full bg-field px-[9px] py-[3px] font-mono text-xs">{s}</span>)}
      </div>
    </Sec>
  );
}

export function ViewerWindow() {
  const { i, tab } = desk.useStore((s) => s.viewer);
  const body = useRef<HTMLDivElement>(null);
  const p = PROJECTS[i];
  const tabs = tabsFor(p);
  const t = tabs[tab] ?? tabs[0];
  const n = PROJECTS.length;
  const pv = (i - 1 + n) % n, nx = (i + 1) % n;
  useEffect(() => { body.current?.scrollTo({ top: 0 }); }, [i]);
  const setTab = (k: number) => desk.set({ viewer: { i, tab: k } });
  const cover = shotsOf(p.id)[0];
  const links = linksOf(p.id);
  const meta: [string, string][] = [['기간', p.year], ['역할', p.role], ['회사', CO[p.co]], ['분류', TAG[p.tag][0]]];

  return (
    <Window
      id="viewer"
      label="프로젝트 상세"
      toolbar={
        <>
          <span className="truncate text-[13px] font-bold">{p.name}</span>
          <span className="flex-1" />
          <Seg label="상세 항목" role="tablist">
            {tabs.map((x, k) => (
              <button key={x} type="button" role="tab" className={segBtn} aria-selected={x === t} onClick={() => setTab(k)}>{x}</button>
            ))}
          </Seg>
          <IconBtn aria-label="이전 프로젝트" onClick={() => desk.stepProject(-1)}><Chevron dir="left" /></IconBtn>
          <IconBtn aria-label="다음 프로젝트" onClick={() => desk.stepProject(1)}><Chevron dir="right" /></IconBtn>
        </>
      }
    >
      <div ref={body} className="sel-text min-w-0 flex-1 overflow-auto overscroll-contain">
        <div className="mx-auto flex max-w-[760px] flex-col gap-[22px] px-8 pt-7 pb-10">
          {cover ? (
            <div className="relative grid aspect-[16/8] place-items-center overflow-hidden rounded-xl" style={{ background: tagColor(p.tag) }}>
              <img src={cover.src} alt={cover.label} className="relative max-h-[88%] max-w-[92%] rounded-lg object-contain shadow-[0_18px_40px_-18px_rgba(0,0,0,.55)]" />
            </div>
          ) : (
            <div style={{ background: tagColor(p.tag) }} className="sheen grid aspect-[16/8] place-items-center overflow-hidden rounded-xl text-[13px] font-semibold text-white">
              <span className="rounded-md bg-black/22 px-2.5 py-[5px]">이미지가 없어요, 죄송해요 ㅠㅠ</span>
            </div>
          )}
          <div>
            <h2 className="text-[28px] leading-[1.2] font-bold tracking-[-.02em]">{p.name}</h2>
            <p className="mt-1.5 text-[15px] text-ink-2">{p.one}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {links.length ? (
                links.map(([label, url], k) => (
                  <a
                    key={url} href={url} target="_blank" rel="noopener noreferrer"
                    className={cn('inline-flex items-center gap-1 rounded-md px-3 py-[5px] text-[13px] font-semibold no-underline', k === 0 ? 'bg-accent text-white hover:brightness-110' : 'bg-field text-ink hover:bg-hover')}
                  >
                    {label} <span aria-hidden="true">↗</span>
                  </a>
                ))
              ) : (
                <>
                  <button type="button" disabled className="cursor-not-allowed rounded-md bg-field px-3 py-[5px] text-[13px] font-semibold text-ink-3">링크 없음</button>
                  <span className="text-xs text-ink-3">{NO_LINK}</span>
                </>
              )}
            </div>
          </div>
          <dl className="grid grid-cols-4 gap-px overflow-hidden rounded-[10px] bg-sep">
            {meta.map(([k, v]) => (
              <div key={k} className="bg-win px-3 py-2.5">
                <dt className="text-[11px] text-ink-3">{k}</dt>
                <dd className="mt-0.5 text-[13px] font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
          <div key={`${i}-${t}`} className="flex animate-pop flex-col gap-[22px] motion-reduce:animate-none"><Section p={p} tab={t} /></div>
          <nav aria-label="다른 프로젝트" className="flex justify-between gap-2.5 border-t border-sep pt-4 [&>button]:max-w-[48%] [&>button]:rounded-lg [&>button]:px-2 [&>button]:py-1.5 [&>button:hover]:bg-hover">
            <button type="button" className="text-left" onClick={() => desk.openProject(pv)}>
              <small className="block text-[11.5px] text-ink-3">← 이전</small><b>{PROJECTS[pv].name}</b>
            </button>
            <button type="button" className="text-right" onClick={() => desk.openProject(nx)}>
              <small className="block text-[11.5px] text-ink-3">다음 →</small><b>{PROJECTS[nx].name}</b>
            </button>
          </nav>
        </div>
      </div>
    </Window>
  );
}
