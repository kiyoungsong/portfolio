import { useEffect, useRef } from 'react';
import { Window } from '../Window';
import { desk } from '../../store/desktop';
import { CO, PROJECTS, TAG, tagColor, type Project } from '../../data/projects';
import { Explainer } from '../../components/Explainer';

const tabsFor = (p: Project) => (p.story ? ['개요', '한 일', '문제 해결', '기술'] : ['개요', '한 일', '기술']);

function Section({ p, tab }: { p: Project; tab: string }) {
  if (tab === '개요')
    return (
      <>
        <section className="v-sec"><h3>개요</h3>{p.over.map((x) => <p key={x}>{x}</p>)}</section>
        <section className="v-sec"><h3>화면</h3><div className="shots">{p.shots.map((s) => <div key={s}>이미지 자리<br />{s}</div>)}</div></section>
      </>
    );
  if (tab === '한 일')
    return <section className="v-sec"><h3>제가 한 일</h3><ul className="v-list">{p.did.map((x) => <li key={x}>{x}</li>)}</ul></section>;
  if (tab === '문제 해결')
    return (
      <>
        <section className="v-sec">
          <h3>문제를 어떻게 풀었나</h3>
          <dl className="story">
            {p.story!.map(([k, v]) => [<dt key={k + 't'}>{k}</dt>, <dd key={k + 'd'}>{v}</dd>])}
            {p.learn && <><dt>배운 점</dt><dd>{p.learn}</dd></>}
          </dl>
        </section>
        {p.explainer && <section className="v-sec"><h3>직접 비교해 보기</h3><Explainer /></section>}
      </>
    );
  return <section className="v-sec"><h3>사용한 기술</h3><div className="chips">{p.stack.map((s) => <span className="chip" key={s}>{s}</span>)}</div></section>;
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

  return (
    <Window id="viewer" label="프로젝트 상세"
      toolbar={
        <>
          <span className="tb-title">{p.name}</span>
          <span className="tb-spacer" />
          <div className="seg" role="tablist" aria-label="상세 항목">
            {tabs.map((x, k) => <button key={x} type="button" role="tab" aria-selected={x === t} onClick={() => setTab(k)}>{x}</button>)}
          </div>
          <button className="ibtn" type="button" aria-label="이전 프로젝트" onClick={() => desk.stepProject(-1)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><path d="M15 5l-7 7 7 7" /></svg>
          </button>
          <button className="ibtn" type="button" aria-label="다음 프로젝트" onClick={() => desk.stepProject(1)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><path d="M9 5l7 7-7 7" /></svg>
          </button>
        </>
      }>
      <div className="v-wrap scroll sel-text" ref={body}>
        <div className="v-in">
          <div className="v-hero" style={{ background: tagColor(p.tag) }}><span>대표 이미지 · {p.shots[0]}</span></div>
          <div className="v-title"><h2>{p.name}</h2><p>{p.one}</p></div>
          <dl className="v-meta">
            <div><dt>기간</dt><dd>{p.year}</dd></div>
            <div><dt>역할</dt><dd>{p.role}</dd></div>
            <div><dt>회사</dt><dd>{CO[p.co]}</dd></div>
            <div><dt>분류</dt><dd>{TAG[p.tag][0]}</dd></div>
          </dl>
          <div className="pop" key={`${i}-${t}`}><Section p={p} tab={t} /></div>
          <nav className="v-next" aria-label="다른 프로젝트">
            <button type="button" onClick={() => desk.openProject(pv)}><small>← 이전</small><b>{PROJECTS[pv].name}</b></button>
            <button type="button" style={{ textAlign: 'right' }} onClick={() => desk.openProject(nx)}><small>다음 →</small><b>{PROJECTS[nx].name}</b></button>
          </nav>
        </div>
      </div>
    </Window>
  );
}
