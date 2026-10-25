import { useRef } from 'react';
import { Window } from '../Window';
import { PROFILE } from '../../data/profile';
import { copyEmail } from '../../lib/copyEmail';
import { runOpen } from '../../store/actions';

export function ContactWindow() {
  const mail = useRef<HTMLElement>(null);
  return (
    <Window id="contact" label="연락처" thin resizable={false} toolbar={<span className="tb-title">연락처</span>}>
      <div className="card-in sel-text">
        <div className="avatar" aria-hidden="true">기영</div>
        <h2>{PROFILE.name} <span style={{ fontWeight: 400, color: 'var(--text3)', fontSize: 15 }}>{PROFILE.nameEn}</span></h2>
        <p className="sub">{PROFILE.title}</p>
        <dl className="kv">
          <dt>이메일</dt><dd ref={mail}>{PROFILE.email}</dd>
          <dt>GitHub</dt><dd><a href={PROFILE.github} target="_blank" rel="noopener">github.com/kiyoungsong</a></dd>
          <dt>블로그</dt><dd><a href={PROFILE.blog} target="_blank" rel="noopener">velog.io/@thdrldud369</a></dd>
          <dt>지역</dt><dd>{PROFILE.location}</dd>
        </dl>
        <div className="row-btns"><button className="pbtn" type="button" onClick={() => copyEmail(mail.current)}>이메일 복사</button></div>
      </div>
    </Window>
  );
}

export function AboutWindow() {
  return (
    <Window id="about" label="이 개발자에 관하여" thin zoomable={false} resizable={false}>
      <div className="card-in sel-text">
        <div className="avatar" aria-hidden="true" style={{ width: 110, height: 110, fontSize: 40 }}>KS</div>
        <h2 style={{ fontSize: 26 }}>{PROFILE.name}</h2>
        <p className="sub">Web Developer · 2026</p>
        <dl className="kv">
          <dt>칩</dt><dd>Frontend 코어 + Full-stack 확장 중</dd>
          <dt>경력</dt><dd>7년차 (2019.12 – 현재)</dd>
          <dt>메모리</dt><dd>PLC · IoT · Web · App · AI</dd>
          <dt>시동 디스크</dt><dd>브레인벤쳐스 · 책임</dd>
          <dt>업데이트</dt><dd>2023 · 2026 특진 설치 완료</dd>
        </dl>
        <div className="row-btns">
          <button className="gbtn" type="button" onClick={() => runOpen('note:hello')}>더 많은 정보…</button>
          <button className="gbtn" type="button" onClick={(e) => runOpen('web', e.currentTarget.closest('.win'))}>웹페이지로 보기</button>
        </div>
      </div>
    </Window>
  );
}
