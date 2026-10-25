import { useEffect, useRef, type ReactNode } from 'react';
import { CO, PLATFORM, PROJECTS, TAG } from '../data/projects';
import { AppIcon } from '../components/AppIcon';
import { Explainer } from '../components/Explainer';
import { ArchDiagram } from '../components/ArchDiagram';
import { ShotStrip } from '../components/Shots';
import { linksOf, NO_LINK } from '../data/links';
import { shotsOf } from '../data/shots';
import { closeDetail, openDetail } from '../store/app';
import { cn } from '../lib/cn';

const wrap = 'mx-auto max-w-[1100px] px-[max(24px,env(safe-area-inset-left,0px))]';
const railBtn = 'grid size-9 cursor-pointer place-items-center rounded-full bg-card text-xl leading-none text-accent shadow-[0_1px_0_var(--line),0_4px_14px_-8px_rgba(0,0,0,.3)] hover:bg-soft';
const backBtn = 'cursor-pointer text-[15px] font-semibold whitespace-nowrap text-accent';
const VER_LINE = ['border-p-sky', 'border-[#ffd9bf]', 'border-[#bfeed3]', 'border-[#dccbff]'];

const H2 = ({ children, sub }: { children: ReactNode; sub?: string }) => (
  <h2 className="mt-9 mb-3.5 flex items-baseline gap-2.5 text-[22px] font-extrabold tracking-[-.02em]">
    {children}
    {sub && <small className="text-[13px] font-semibold text-ink-3">{sub}</small>}
  </h2>
);

/** 프로젝트 상세 — App Store 상품 페이지 구성 */
export function ProjectDetail({ i }: { i: number }) {
  const p = PROJECTS[i];
  const n = PROJECTS.length;
  const prev = (i - 1 + n) % n;
  const next = (i + 1) % n;
  const links = linksOf(p.id);
  const hasShots = shotsOf(p.id).length > 0;
  const page = useRef<HTMLDivElement>(null);
  const back = useRef<HTMLButtonElement>(null);
  const rail = useRef<HTMLDivElement>(null);

  useEffect(() => {
    page.current?.scrollTo({ top: 0 });
    rail.current?.scrollTo({ left: 0 });
    back.current?.focus({ preventScroll: true });
  }, [i]);

  // 같은 회사·분류를 앞에, 나머지는 뒤에 — 전체 프로젝트를 6개씩 넘겨 봐요
  const rest = PROJECTS.map((x, k) => ({ p: x, i: k })).filter((x) => x.i !== i);
  const near = (x: { p: (typeof PROJECTS)[number] }) => x.p.co === p.co || x.p.tag === p.tag;
  const others = [...rest.filter(near), ...rest.filter((x) => !near(x))];
  const slide = (d: number) => rail.current?.scrollBy({ left: d * rail.current.clientWidth, behavior: 'smooth' });
  const story = p.story ? [...p.story, ...(p.learn ? [['배운 점', p.learn] as [string, string]] : [])] : null;
  const stats: [string, string, string][] = [
    ['역할', p.role.split(' ')[0], p.team],
    ['플랫폼', TAG[p.tag][0].split(' ')[0], PLATFORM[p.tag]],
    ['연도', p.year.slice(0, 4), p.year],
    ['회사', CO[p.co], p.co === 'bv' ? '현재' : '이전 직장'],
  ];
  const info: [string, string][] = [
    ['개발자', '송기영'], ['회사', CO[p.co]], ['카테고리', TAG[p.tag][0]],
    ['역할', p.role], ['기간', p.year], ['기술', p.stack.join(', ')],
  ];

  return (
    <div ref={page} role="dialog" aria-modal="true" aria-labelledby="dTitle" className="fixed inset-0 z-[9600] animate-page-in overflow-y-auto overscroll-contain bg-page motion-reduce:animate-none">
      <div className="sticky top-0 z-[2] border-b border-line bg-[rgba(255,253,248,.85)] pt-[env(safe-area-inset-top,0px)] backdrop-blur-[20px]">
        <div className={cn(wrap, 'flex h-[52px] items-center justify-between gap-3')}>
          <button ref={back} type="button" className={backBtn} onClick={closeDetail}>‹ 포트폴리오</button>
          <span className="truncate text-sm font-bold">{p.name}</span>
          <span className="flex gap-3.5">
            <button type="button" className={backBtn} aria-label="이전 프로젝트" onClick={() => openDetail(prev)}>‹</button>
            <button type="button" className={backBtn} aria-label="다음 프로젝트" onClick={() => openDetail(next)}>›</button>
          </span>
        </div>
      </div>

      <div className={cn(wrap, 'pt-8 pb-[72px]')}>
        <div className="flex flex-wrap items-center gap-6">
          <AppIcon p={p} size={128} />
          <div className="flex min-w-[240px] flex-1 flex-col gap-[3px]">
            <h1 id="dTitle" className="text-[clamp(28px,3.4vw,38px)] leading-[1.15] font-extrabold tracking-[-.025em]">{p.name}</h1>
            <span className="text-base text-ink-2">{p.one}</span>
            <div className="mt-3 flex flex-wrap items-center gap-2.5">
              {links.length ? (
                links.map(([label, url], k) => (
                  <a
                    key={url} href={url} target="_blank" rel="noopener noreferrer"
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full px-[18px] py-[7px] text-[15px] font-extrabold no-underline transition-transform duration-200 ease-springy hover:scale-106',
                      k === 0 ? 'bg-accent text-white' : 'bg-soft text-accent',
                    )}
                  >
                    {label} <span aria-hidden="true">↗</span>
                  </a>
                ))
              ) : (
                <>
                  <button type="button" disabled className="cursor-not-allowed rounded-full bg-soft px-[22px] py-[7px] text-[15px] font-extrabold text-ink-3">링크 없음</button>
                  <span className="text-[12.5px] text-ink-3">{NO_LINK}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-[26px] grid grid-cols-4 rounded-[18px] bg-card py-3.5 shadow-[0_1px_0_var(--line),0_14px_30px_-26px_rgba(0,0,0,.35)]">
          {stats.map(([k, v, s]) => (
            <div key={k} className="flex min-w-0 flex-col gap-0.5 border-r border-line px-2 text-center last:border-r-0">
              <small className="text-[11px] font-bold tracking-[.04em] text-ink-3">{k}</small>
              <b className="truncate text-lg max-[600px]:text-[15px]">{v}</b>
              <span className="truncate text-xs text-ink-3">{s}</span>
            </div>
          ))}
        </div>

        {hasShots && (
          <>
            <H2>미리보기</H2>
            <ShotStrip key={p.id} id={p.id} />
          </>
        )}

        <div className="mt-10 grid gap-9 min-[861px]:grid-cols-2">
          <div className="min-w-0 rounded-[18px] bg-p-mint px-[22px] pt-1 pb-[18px] shadow-[0_1px_0_var(--line)]">
            <H2 sub="제가 한 일">새로운 기능</H2>
            <ul className="flex flex-col gap-3">
              {p.did.map(([title, detail]) => (
                <li key={title} className="flex gap-2.5">
                  <span aria-hidden="true" className="mt-[9px] size-1.5 flex-none rounded-full bg-accent" />
                  <div className="min-w-0 [overflow-wrap:anywhere]">
                    <b className="block text-[15.5px] leading-snug">{title}</b>
                    <span className="mt-0.5 block text-[14.5px] leading-relaxed text-ink-2">{detail}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="min-w-0 rounded-[18px] bg-card px-[22px] pt-1 pb-[18px] shadow-[0_1px_0_var(--line)]">
            <H2>앱 설명</H2>
            {p.over.map((x) => <p key={x} className="mb-2.5 max-w-[64ch] text-[15.5px] leading-[1.7]">{x}</p>)}
          </div>
        </div>

        {p.arch && (
          <>
            <H2 sub="블록을 눌러 흐름을 따라가 보세요">구조</H2>
            <ArchDiagram k={p.arch} />
          </>
        )}

        {story && (
          <>
            <H2 sub="문제를 어떻게 풀었나">버전 기록</H2>
            <div>
              {story.map(([k, v], j) => (
                <div key={k} className={cn('mb-1.5 flex flex-col gap-0.5 border-l-[3px] py-3 pl-3.5', VER_LINE[j % VER_LINE.length])}>
                  <b className="text-sm">{k}</b>
                  <small className="text-xs text-ink-3">버전 {j + 1}.0</small>
                  <span className="text-[15px] leading-[1.6] text-ink-2">{v}</span>
                </div>
              ))}
            </div>
          </>
        )}
        {p.explainer && <div className="mt-4"><Explainer /></div>}

        <H2>정보</H2>
        <div className="grid grid-cols-2 gap-x-7 min-[861px]:grid-cols-3">
          {info.map(([k, v]) => (
            <div key={k} className="flex min-w-0 flex-col gap-0.5 border-t border-line py-3">
              <small className="text-[12.5px] text-ink-3">{k}</small>
              <span className="text-[14.5px]">{v}</span>
            </div>
          ))}
        </div>

        {others.length > 0 && (
          <>
            <div className="flex items-end justify-between gap-3">
              <H2 sub={`${others.length}개`}>이 개발자의 다른 앱</H2>
              <div className="mb-3.5 flex gap-2">
                <button type="button" aria-label="이전 목록" onClick={() => slide(-1)} className={railBtn}><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button>
                <button type="button" aria-label="다음 목록" onClick={() => slide(1)} className={railBtn}><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg></button>
              </div>
            </div>
            <div
              ref={rail}
              className="grid snap-x snap-mandatory auto-cols-[85%] grid-flow-col grid-rows-2 gap-3 overflow-x-auto scroll-smooth pb-3 [scrollbar-width:thin] min-[600px]:auto-cols-[calc((100%-12px)/2)] min-[861px]:auto-cols-[calc((100%-24px)/3)]"
            >
              {others.map(({ p: o, i: k }) => (
                <button
                  key={o.id} type="button" onClick={() => openDetail(k)} aria-label={`${o.name} 상세 보기`}
                  className="group flex min-w-0 cursor-pointer snap-start items-start gap-3 rounded-[14px] bg-card p-3.5 text-left shadow-[0_1px_0_var(--line)] transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <AppIcon p={o} size={48} />
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <b className="text-[15px] leading-snug group-hover:text-accent">{o.name}</b>
                    <span className="line-clamp-2 text-[13px] leading-snug text-ink-2">{o.one}</span>
                    <span className="mt-0.5 text-xs text-ink-3">{PLATFORM[o.tag]} · {o.year}</span>
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        <div className="mt-8 flex justify-between gap-3 border-t border-line pt-3.5">
          <button type="button" className={backBtn} onClick={() => openDetail(prev)}>‹ {PROJECTS[prev].name}</button>
          <button type="button" className={backBtn} onClick={() => openDetail(next)}>{PROJECTS[next].name} ›</button>
        </div>
      </div>
    </div>
  );
}
