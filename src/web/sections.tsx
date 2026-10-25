import { useRef, useState } from 'react';
import { FEATURED_COPY, PLATFORM, PROJECTS, TAG, tagColor, type TagId } from '../data/projects';
import { CAREERS, HOW_I_WORK, PROFILE, SKILLS } from '../data/profile';
import { AppIcon } from '../components/AppIcon';
import { TagDot } from '../components/TagDot';
import { ProjectRow } from './ProjectRow';
import { openDetail } from '../store/app';
import { copyEmail } from '../lib/copyEmail';

const indexed = PROJECTS.map((p, i) => ({ p, i }));

function SectionHead({ eyebrow, title, desc }: { eyebrow: string; title: string; desc?: string }) {
  return (
    <div className="wsec-h">
      <div>
        <div className="eb">{eyebrow}</div>
        <h2>{title}</h2>
        {desc && <p>{desc}</p>}
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="wwrap w-hero" id="w-top">
      <div>
        <span className="w-hello">안녕하세요!</span>
        <h1>
          공장의 데이터부터 <em>AI 서비스</em>까지, 기획부터 출시까지 만드는 {PROFILE.name}입니다.
        </h1>
        <p className="lead">
          공장 설비를 움직이는 코드에서 시작해, 지금은 기획부터 출시까지 맡는 웹 개발자가 됐어요. 하드웨어부터 화면까지 전 구간을 경험한 게 제
          가장 큰 무기입니다.
        </p>
        <div className="w-cta">
          <a className="wbtn p" href="#w-career">경력 보기</a>
          <a className="wbtn g" href="#w-featured">프로젝트 보기</a>
          <a className="wbtn g" href="#w-reach">연락하기</a>
        </div>
      </div>
      <div className="w-card">
        <div className="top">
          {/* 프로필 사진이 생기면 public/profile.jpg 로 넣고 <img> 로 바꾸세요 */}
          <div className="av" role="img" aria-label="프로필 사진 자리">KS</div>
          <div>
            <b>{PROFILE.name} · {PROFILE.nameEn}</b>
            <span>{PROFILE.title}</span>
          </div>
        </div>
        <div className="w-stats">
          <div><small>경력</small><strong>7년</strong><span>2019 —</span></div>
          <div><small>프로젝트</small><strong>{PROJECTS.length}</strong><span>웹·앱·플러그인</span></div>
          <div><small>특진</small><strong>2회</strong><span>2023 · 2026</span></div>
        </div>
        <div className="w-path" aria-label="커리어 흐름">
          {['PLC', 'OPC UA', 'IoT', 'Web', 'App', 'AI'].map((s) => <span key={s}>{s}</span>)}
        </div>
      </div>
    </section>
  );
}

export function CareerSection() {
  return (
    <section className="wwrap wsec" id="w-career">
      <SectionHead eyebrow="경력" title="설비에서 웹, 그리고 AI까지" />
      <div className="wcareer">
        {CAREERS.map((c) => (
          <div className="wco" key={c.co}>
            <span className="pd">{c.period}</span>
            <h3>{c.name}</h3>
            <p className="rl">{c.role}</p>
            <span className="vb">{c.badge}</span>
            <ul>{c.points.map((x) => <li key={x}>{x}</li>)}</ul>
            <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {indexed.filter((x) => x.p.co === c.co).slice(0, 4).map(({ p, i }) => (
                <button key={p.id} className="cchip" type="button" style={{ fontSize: 12.5, padding: '4px 10px' }} onClick={() => openDetail(i)}>
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function HowSection() {
  return (
    <section className="wwrap wsec" id="w-how">
      <SectionHead eyebrow="일하는 방식" title="반복은 구조로 줄이고, 공백은 직접 메웁니다" />
      <div className="hgrid">
        {HOW_I_WORK.map(([t, b]) => (
          <div className="hcard" key={t}><b>{t}</b><span>{b}</span></div>
        ))}
      </div>
      <dl className="skl">
        {SKILLS.map(([k, v]) => (
          <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
        ))}
      </dl>
    </section>
  );
}

export function FeaturedSection() {
  return (
    <section className="wwrap wsec" id="w-featured">
      <SectionHead eyebrow="대표 프로젝트" title="무엇을 만들고, 어떻게 풀었는지" />
      <div className="today">
        {indexed.filter(({ p }) => FEATURED_COPY[p.id]).map(({ p, i }) => (
          <button key={p.id} className="tcard" type="button" style={{ background: tagColor(p.tag) }} onClick={() => openDetail(i)}>
            <span className="k">{FEATURED_COPY[p.id][0]}</span>
            <span className="h">{FEATURED_COPY[p.id][1]}</span>
            <span className="bar">
              <AppIcon p={p} size={48} />
              <span className="t">
                <b>{p.name}</b>
                <small>{PLATFORM[p.tag]} · {p.role}</small>
              </span>
              <span className="get" aria-hidden="true">보기</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

export function ProjectsSection() {
  const [cat, setCat] = useState<'all' | TagId>('all');
  const cats: ['all' | TagId, string][] = [['all', '전체'], ...(Object.entries(TAG) as [TagId, [string, string]][]).map(([k, [n]]) => [k, n] as [TagId, string])];
  return (
    <section className="wwrap wsec" id="w-projects">
      <SectionHead eyebrow="모든 프로젝트" title={`${PROJECTS.length}개의 작업`} desc="누르면 상세 페이지가 열려요." />
      <div className="chipsbar" role="group" aria-label="분류">
        {cats.map(([k, n]) => (
          <button key={k} className="cchip" type="button" aria-pressed={cat === k} onClick={() => setCat(k)}>
            {k !== 'all' && <TagDot tag={k} />}
            {n}
            <span style={{ opacity: 0.55, fontSize: 12 }}>{k === 'all' ? PROJECTS.length : PROJECTS.filter((p) => p.tag === k).length}</span>
          </button>
        ))}
      </div>
      <div className="alist">
        {indexed.filter(({ p }) => cat === 'all' || p.tag === cat).map(({ p, i }) => <ProjectRow key={p.id} p={p} i={i} />)}
      </div>
    </section>
  );
}

export function ContactSection() {
  const mail = useRef<HTMLDivElement>(null);
  return (
    <section className="wwrap" id="w-reach">
      <div className="wcontact">
        <div>
          <h2>같이 만들 일이 있다면 편하게 연락 주세요.</h2>
          <div className="mail" ref={mail}>{PROFILE.email}</div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <button className="wbtn p" type="button" onClick={() => copyEmail(mail.current)}>이메일 복사</button>
          <a className="wbtn g" href={PROFILE.github} target="_blank" rel="noopener">GitHub ↗</a>
          <a className="wbtn g" href={PROFILE.blog} target="_blank" rel="noopener">Velog ↗</a>
        </div>
      </div>
    </section>
  );
}

