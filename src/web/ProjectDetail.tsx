import { useEffect, useRef, useState } from 'react';
import { CO, PLATFORM, PROJECTS, TAG, tagColor } from '../data/projects';
import { AppIcon } from '../components/AppIcon';
import { Explainer } from '../components/Explainer';
import { ProjectRow } from './ProjectRow';
import { closeDetail, openDetail } from '../store/app';

/** 프로젝트 상세 — App Store 상품 페이지 구성 */
export function ProjectDetail({ i }: { i: number }) {
  const p = PROJECTS[i];
  const n = PROJECTS.length;
  const prev = (i - 1 + n) % n;
  const next = (i + 1) % n;
  const [got, setGot] = useState<Record<string, boolean>>({});
  const page = useRef<HTMLDivElement>(null);
  const back = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    page.current?.scrollTo({ top: 0 });
    back.current?.focus({ preventScroll: true });
  }, [i]);

  const others = PROJECTS.map((x, k) => ({ p: x, i: k })).filter((x) => x.i !== i && (x.p.co === p.co || x.p.tag === p.tag)).slice(0, 6);
  const story = p.story ? [...p.story, ...(p.learn ? [['배운 점', p.learn] as [string, string]] : [])] : null;

  return (
    <div className="dpage" role="dialog" aria-modal="true" aria-labelledby="dTitle" ref={page}>
      <div className="dbar">
        <div className="wwrap">
          <button className="back" type="button" ref={back} onClick={closeDetail}>‹ 포트폴리오</button>
          <span className="t">{p.name}</span>
          <span style={{ display: 'flex', gap: 14 }}>
            <button className="back" type="button" aria-label="이전 프로젝트" onClick={() => openDetail(prev)}>‹</button>
            <button className="back" type="button" aria-label="다음 프로젝트" onClick={() => openDetail(next)}>›</button>
          </span>
        </div>
      </div>

      <div className="wwrap dbody">
        <div className="d-head">
          <AppIcon p={p} size={128} />
          <div className="tx">
            <h1 id="dTitle">{p.name}</h1>
            <span className="sub">{p.one}</span>
            <div className="act">
              <button className="get blue" type="button" onClick={() => setGot((g) => ({ ...g, [p.id]: true }))}>
                {got[p.id] ? '열기' : '받기'}
              </button>
              <span className="note">{got[p.id] ? '고마워요! 아래에서 자세히 볼 수 있어요' : '무료 · 송기영'}</span>
            </div>
          </div>
        </div>

        <div className="d-stats">
          <div><small>역할</small><b>{p.role.split(' ')[0]}</b><span>{p.team}</span></div>
          <div><small>플랫폼</small><b>{TAG[p.tag][0].split(' ')[0]}</b><span>{PLATFORM[p.tag]}</span></div>
          <div><small>연도</small><b>{p.year.slice(0, 4)}</b><span>{p.year}</span></div>
          <div><small>회사</small><b>{CO[p.co]}</b><span>{p.co === 'bv' ? '현재' : '이전 직장'}</span></div>
        </div>

        <h2 className="d-h2">미리보기</h2>
        <div className="as-shots">
          {/* 스크린샷이 생기면 public/shots/ 에 넣고 배경 이미지로 바꾸세요 */}
          {p.shots.map((s) => (
            <div className="as-shot" key={s} style={{ background: tagColor(p.tag) }}><span>{s}</span></div>
          ))}
        </div>

        <div className="d-two">
          <div>
            <h2 className="d-h2">새로운 기능 <small>제가 한 일</small></h2>
            <ul className="whatsnew">{p.did.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
          <div className="d-desc">
            <h2 className="d-h2">앱 설명</h2>
            {p.over.map((x) => <p key={x}>{x}</p>)}
          </div>
        </div>

        {story && (
          <>
            <h2 className="d-h2">버전 기록 <small>문제를 어떻게 풀었나</small></h2>
            <div>
              {story.map(([k, v], j) => (
                <div className="ver" key={k}>
                  <b>{k}</b>
                  <small>버전 {j + 1}.0</small>
                  <span>{v}</span>
                </div>
              ))}
            </div>
          </>
        )}
        {p.explainer && <div style={{ marginTop: 16 }}><Explainer /></div>}

        <h2 className="d-h2">정보</h2>
        <div className="info">
          <div><small>개발자</small><span>송기영</span></div>
          <div><small>회사</small><span>{CO[p.co]}</span></div>
          <div><small>카테고리</small><span>{TAG[p.tag][0]}</span></div>
          <div><small>역할</small><span>{p.role}</span></div>
          <div><small>기간</small><span>{p.year}</span></div>
          <div><small>기술</small><span>{p.stack.join(', ')}</span></div>
        </div>

        {others.length > 0 && (
          <>
            <h2 className="d-h2">이 개발자의 다른 앱</h2>
            <div className="more-apps">{others.map(({ p: o, i: k }) => <ProjectRow key={o.id} p={o} i={k} />)}</div>
          </>
        )}

        <div className="dnav">
          <button className="back" type="button" onClick={() => openDetail(prev)}>‹ {PROJECTS[prev].name}</button>
          <button className="back" type="button" onClick={() => openDetail(next)}>{PROJECTS[next].name} ›</button>
        </div>
      </div>
    </div>
  );
}
