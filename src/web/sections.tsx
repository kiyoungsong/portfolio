import { useRef, useState } from 'react';
import { CO, FEATURED_COPY, PLATFORM, PROJECTS, TAG, tagColor, type CompanyId, type TagId } from '../data/projects';
import { CAREERS, HOW_I_WORK, PROFILE, SKILLS } from '../data/profile';
import { AppIcon } from '../components/AppIcon';
import { Avatar } from '../components/Avatar';
import { PeekingHedgehog } from '../components/HedgehogIcon';
import { TagDot } from '../components/TagDot';
import { ProjectRow } from './ProjectRow';
import { GetPill, PillButton, PillLink, SectionHead, Wrap, chip } from './ui';
import { openDetail } from '../store/app';
import { ArchDiagram } from '../components/ArchDiagram';
import { copyEmail } from '../lib/copyEmail';
import { cn } from '../lib/cn';

const indexed = PROJECTS.map((p, i) => ({ p, i }));
const sectionY = 'pt-16 pb-2';

/** 커리어 흐름 칩 색 (마지막 AI 는 강조색) */
const PATH: [string, string][] = [
  ['PLC', 'bg-p-lemon'],
  ['OPC UA', 'bg-p-peach'],
  ['IoT', 'bg-p-mint'],
  ['Web', 'bg-p-sky'],
  ['App', 'bg-p-pink'],
  ['AI', 'bg-accent text-white'],
];
const CAREER_BG = ['bg-p-lav', 'bg-p-mint', 'bg-p-peach'];
const HOW_BG = ['bg-p-sky', 'bg-p-lemon', 'bg-p-pink', 'bg-p-mint', 'bg-p-lav', 'bg-p-peach'];

export function Hero() {
  return (
    <Wrap
      id="w-top"
      className={cn(
        'relative grid items-center gap-12 pt-[72px] pb-10 max-[860px]:pt-12 min-[861px]:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]',
        // 뒤쪽에 은은하게 번지는 파스텔 빛
        "before:pointer-events-none before:absolute before:inset-[-40px_-20vw_0] before:-z-10 before:content-[''] before:bg-[radial-gradient(420px_300px_at_12%_20%,#ffe1ec_0,transparent_70%),radial-gradient(480px_320px_at_85%_30%,#dceaff_0,transparent_70%),radial-gradient(380px_260px_at_60%_95%,#fff1c2_0,transparent_70%)]",
      )}
    >
      <div>
        <span className="inline-block origin-left -rotate-2 font-hand text-[28px] text-accent">안녕하세요!</span>
        <h1 className="mt-2 text-[clamp(36px,5vw,58px)] leading-[1.12] font-extrabold tracking-[-.035em] text-balance">
          공장의 데이터부터 <em className="text-accent not-italic">AI 서비스</em>까지, 기획부터 출시까지 만드는 {PROFILE.name}입니다.
        </h1>
        <p className="mt-[18px] max-w-[34em] text-lg text-ink-2">
          공장 설비를 움직이는 코드에서 시작해, 지금은 기획부터 출시까지 맡는 웹 개발자가 됐어요. 하드웨어부터 화면까지 전 구간을 경험한 게 제
          가장 큰 무기입니다.
        </p>
        <div className="mt-[26px] flex flex-wrap gap-2.5">
          <PillLink tone="primary" href="#w-career">경력 보기</PillLink>
          <PillLink href="#w-featured">프로젝트 보기</PillLink>
          <PillLink href="#w-reach">연락하기</PillLink>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-3xl border border-line bg-card p-6 shadow-[0_24px_50px_-30px_rgba(47,107,255,.45)]">
        <div className="flex items-center gap-3.5">
          <Avatar size={84} />
          <div>
            <b className="block text-lg">{PROFILE.name} · {PROFILE.nameEn}</b>
            <span className="text-[13.5px] text-ink-2">{PROFILE.title}</span>
          </div>
        </div>
        <div className="grid grid-cols-3 border-y border-line py-3 text-center *:border-r *:border-line *:last:border-r-0">
          {[['경력', '7년', '2019 —'], ['프로젝트', String(PROJECTS.length), '웹·앱·플러그인'], ['특진', '2회', '2023 · 2026']].map(([k, v, s]) => (
            <div key={k}>
              <small className="block text-[11px] font-bold text-ink-3">{k}</small>
              <strong className="block text-[22px] tracking-[-.02em] tabular-nums">{v}</strong>
              <span className="text-xs text-ink-3">{s}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5 text-[12.5px]" aria-label="커리어 흐름">
          {PATH.map(([s, bg]) => (
            <span key={s} className={cn('rounded-full px-2.5 py-[3px] text-ink-2', bg)}>{s}</span>
          ))}
        </div>
      </div>
    </Wrap>
  );
}

/** 'YYYY.MM — YYYY.MM | 현재' → '3년 4개월' */
function tenure(period: string) {
  const [a, b] = period.split('—').map((x) => x.trim());
  const [y1, m1] = a.split('.').map(Number);
  const now = new Date();
  const [y2, m2] = b === '현재' ? [now.getFullYear(), now.getMonth() + 1] : b.split('.').map(Number);
  const months = (y2 - y1) * 12 + (m2 - m1) + 1;
  const y = Math.floor(months / 12), m = months % 12;
  return [y && `${y}년`, m && `${m}개월`].filter(Boolean).join(' ');
}

export function CareerSection() {
  return (
    <Wrap id="w-career" className={sectionY}>
      <SectionHead eyebrow="경력" title="설비에서 웹, 그리고 AI까지" />
      <div className="grid gap-4 min-[861px]:grid-cols-3">
        {CAREERS.map((c, k) => {
          const mine = indexed.filter((x) => x.p.co === c.co);
          return (
            <div key={c.co} className={cn('flex flex-col gap-3.5 rounded-[20px] p-[22px] shadow-[0_1px_0_var(--line),0_16px_34px_-28px_rgba(0,0,0,.4)]', CAREER_BG[k])}>
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-[12.5px] font-semibold text-ink-3">
                  <span>{c.period}</span>
                  <span className="rounded-full bg-white/70 px-2 py-0.5">{tenure(c.period)}</span>
                </div>
                <h3 className="mt-1.5 text-xl font-bold tracking-[-.015em]">{c.name}</h3>
                <p className="mt-0.5 text-[13px] leading-snug text-ink-3">{c.about}</p>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="text-sm font-semibold text-ink-2">{c.role}</span>
                  <span className="rounded-full bg-white px-[9px] py-0.5 text-xs font-bold text-accent">{c.badge}</span>
                </div>
              </div>

              <ul className="flex flex-col gap-2 text-[13.5px]">
                {c.points.map(([lead, text]) => (
                  <li key={lead} className="flex items-start gap-2">
                    <span aria-hidden="true" className="mt-[7px] size-1.5 flex-none rounded-full bg-accent" />
                    <span className="leading-snug text-ink-2"><span className="sr-only">{lead}: </span>{text}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-1">
                {c.stack.map((s) => (
                  <span key={s} className="rounded-md bg-black/5 px-1.5 py-0.5 font-mono text-[11px] text-ink-2">{s}</span>
                ))}
              </div>

              <div className="mt-auto border-t border-black/6 pt-3">
                <div className="mb-2 text-[11.5px] font-bold text-ink-3">이 회사에서 만든 것 · {mine.length}개</div>
                <div className="flex flex-wrap gap-1.5">
                  {mine.map(({ p, i }) => (
                    <button
                      key={p.id}
                      type="button"
                      title={p.name}
                      aria-label={`${p.name} 상세 보기`}
                      onClick={() => openDetail(i)}
                      className="group relative cursor-pointer transition-transform duration-200 ease-springy hover:-translate-y-0.5 hover:scale-110"
                    >
                      <AppIcon p={p} size={34} />
                      <span className="pointer-events-none absolute bottom-[calc(100%+6px)] left-1/2 z-10 -translate-x-1/2 rounded-md bg-ink px-2 py-0.5 text-[11.5px] font-semibold whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                        {p.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Wrap>
  );
}

export function HowSection() {
  return (
    <Wrap id="w-how" className={sectionY}>
      <SectionHead eyebrow="일하는 방식" title="시키지 않아도 먼저 해온 것들" desc="맡은 일 밖에서 스스로 시작한 일들이에요." />
      <div className="grid gap-3 min-[600px]:grid-cols-2 min-[1000px]:grid-cols-4">
        {HOW_I_WORK.map(([t, b, w], k) => (
          <div key={t} className={cn('flex flex-col gap-1.5 rounded-2xl px-[18px] py-4 transition-transform duration-250 ease-spring hover:-translate-y-[3px]', HOW_BG[k % HOW_BG.length])}>
            <b className="text-[15px] leading-snug">{t}</b>
            <span className="flex-1 text-sm text-ink-2">{b}</span>
            <span className="mt-1 self-start rounded-full bg-white/70 px-2 py-0.5 text-[11.5px] font-semibold text-ink-3">{w}</span>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <ArchDiagram k="deploy" />
      </div>
      <dl className="mt-[22px] grid gap-x-7 min-[861px]:grid-cols-2">
        {SKILLS.map(([k, v]) => (
          <div key={k} className="grid gap-x-3 border-t border-line py-2.5 text-[14.5px] min-[601px]:grid-cols-[110px_minmax(0,1fr)]">
            <dt className="text-[13px] text-ink-3">{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </Wrap>
  );
}

export function FeaturedSection() {
  return (
    <Wrap id="w-featured" className={sectionY}>
      <SectionHead eyebrow="대표 프로젝트" title="무엇을 만들고, 어떻게 풀었는지" />
      <div className="grid gap-5 min-[861px]:grid-cols-2">
        {indexed.filter(({ p }) => FEATURED_COPY[p.id]).map(({ p, i }) => (
          <button
            key={p.id}
            type="button"
            onClick={() => openDetail(i)}
            style={{ background: tagColor(p.tag) }}
            className="group sheen flex min-h-[340px] cursor-pointer flex-col gap-3 overflow-hidden rounded-[22px] p-6 text-left text-white shadow-[0_18px_40px_-24px_rgba(0,0,0,.5)] transition-transform duration-350 ease-spring hover:-translate-y-1 hover:scale-[1.01]"
          >
            <span className="text-[12.5px] font-extrabold tracking-[.04em] opacity-90">{FEATURED_COPY[p.id][0]}</span>
            <span className="text-[clamp(24px,2.6vw,30px)] leading-[1.2] font-extrabold tracking-[-.02em] whitespace-pre-line">{FEATURED_COPY[p.id][1]}</span>
            <span className="mt-auto flex items-center gap-3 rounded-2xl bg-white/92 px-3.5 py-3 text-[#1d1d1f]">
              <AppIcon p={p} size={48} />
              <span className="min-w-0 flex-1">
                <b className="block text-[15px]">{p.name}</b>
                <small className="text-[12.5px] text-[#6e6e73]">{PLATFORM[p.tag]} · {p.role}</small>
              </span>
              <GetPill>보기</GetPill>
            </span>
          </button>
        ))}
      </div>
    </Wrap>
  );
}

export function ProjectsSection() {
  const [cat, setCat] = useState<'all' | TagId>('all');
  const cats: ['all' | TagId, string][] = [['all', '전체'], ...(Object.entries(TAG) as [TagId, [string, string]][]).map(([k, [n]]) => [k, n] as [TagId, string])];
  return (
    <Wrap id="w-projects" className="bleed mt-14 pt-16 pb-14 [--bleed:var(--p-sky)]">
      <SectionHead eyebrow="모든 프로젝트" title={`${PROJECTS.length}개의 작업`} desc="누르면 상세 페이지가 열려요." />
      <div className="mb-2 flex flex-wrap gap-2" role="group" aria-label="분류">
        {cats.map(([k, n]) => (
          <button key={k} type="button" className={cn(chip, 'bg-white px-3.5 py-1.5 text-[13.5px]')} aria-pressed={cat === k} onClick={() => setCat(k)}>
            {k !== 'all' && <TagDot tag={k} />}
            {n}
            <span className="text-xs opacity-55">{k === 'all' ? PROJECTS.length : PROJECTS.filter((p) => p.tag === k).length}</span>
          </button>
        ))}
      </div>
      {(Object.keys(CO) as CompanyId[]).map((co) => {
        const rows = indexed.filter(({ p }) => p.co === co && (cat === 'all' || p.tag === cat));
        if (!rows.length) return null;
        const c = CAREERS.find((x) => x.co === co)!;
        return (
          <div key={co} className="mt-7 first-of-type:mt-4">
            <h3 className="mb-1 flex items-baseline gap-2 text-[17px] font-extrabold">
              {CO[co]}
              <span className="text-[13px] font-semibold text-ink-3">{c.period} · {rows.length}개</span>
            </h3>
            <div className="grid gap-x-8 min-[861px]:grid-cols-2">
              {rows.map(({ p, i }) => (
                <ProjectRow key={p.id} p={p} i={i} className="border-t border-accent/15" getBg="bg-white" />
              ))}
            </div>
          </div>
        );
      })}
    </Wrap>
  );
}

export function ContactSection() {
  const mail = useRef<HTMLDivElement>(null);
  return (
    <Wrap id="w-reach">
      <div className="relative mt-14 mb-[72px] flex flex-wrap items-center justify-between gap-5 rounded-3xl bg-[linear-gradient(120deg,#ffe4ee,#fff1c2_50%,#dceaff)] p-9 max-[860px]:p-6">
        <PeekingHedgehog className="-top-[33px] right-[52px] h-[41px] w-[74px] text-[#1d1d1f]" />
        <div>
          <h2 className="text-[clamp(24px,3vw,32px)] font-bold tracking-[-.025em]">같이 만들 일이 있다면 편하게 연락 주세요.</h2>
          <div ref={mail} className="mt-2 text-[19px] font-bold [overflow-wrap:anywhere] text-accent select-all">{PROFILE.email}</div>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <PillButton tone="primary" onClick={() => copyEmail(mail.current)}>이메일 복사</PillButton>
          <PillLink tone="glass" href={PROFILE.github} target="_blank" rel="noopener">GitHub ↗</PillLink>
          <PillLink tone="glass" href={PROFILE.blog} target="_blank" rel="noopener">Velog ↗</PillLink>
        </div>
      </div>
    </Wrap>
  );
}
