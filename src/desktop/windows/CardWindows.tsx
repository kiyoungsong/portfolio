import { useRef } from "react";
import { Window } from "../Window";
import { GrayBtn, PushBtn, cardIn, kv } from "../ui";
import { Avatar } from "../../components/Avatar";
import { PROFILE } from "../../data/profile";
import { copyEmail } from "../../lib/copyEmail";
import { runOpen } from "../../store/actions";

const btnRow = "mt-1.5 flex flex-wrap justify-center gap-2";

export function ContactWindow() {
  const mail = useRef<HTMLElement>(null);
  return (
    <Window
      id="contact"
      label="연락처"
      thin
      resizable={false}
      toolbar={<span className="truncate text-[13px] font-bold">연락처</span>}
    >
      <div className={cardIn}>
        <Avatar size={92} />
        <h2 className="text-[22px] font-bold">
          {PROFILE.name}{" "}
          <span className="text-[15px] font-normal text-ink-3">
            {PROFILE.nameEn}
          </span>
        </h2>
        <p className="text-[13px] text-ink-2">{PROFILE.title}</p>
        <dl className={kv}>
          <dt>이메일</dt>
          <dd ref={mail}>{PROFILE.email}</dd>
          <dt>GitHub</dt>
          <dd>
            <a href={PROFILE.github} target="_blank" rel="noopener">
              github.com/kiyoungsong
            </a>
          </dd>
          <dt>블로그</dt>
          <dd>
            <a href={PROFILE.blog} target="_blank" rel="noopener">
              velog.io/@thdrldud369
            </a>
          </dd>
          <dt>지역</dt>
          <dd>{PROFILE.location}</dd>
        </dl>
        <div className={btnRow}>
          <PushBtn onClick={() => copyEmail(mail.current)}>이메일 복사</PushBtn>
        </div>
      </div>
    </Window>
  );
}

export function AboutWindow() {
  return (
    <Window
      id="about"
      label="이 개발자에 관하여"
      thin
      zoomable={false}
      resizable={false}
    >
      <div className={cardIn}>
        <Avatar size={110} />
        <h2 className="text-[26px] font-bold">{PROFILE.name}</h2>
        <p className="text-[13px] text-ink-2">Web Developer</p>
        <dl className={kv}>
          <dt>칩</dt>
          <dd>Frontend 코어 + Full-stack 확장 중</dd>
          <dt>경력</dt>
          <dd>7년차 (2019.12 – 현재)</dd>
          <dt>메모리</dt>
          <dd>PLC · IoT · Web · App · AI</dd>
          <dt>시동 디스크</dt>
          <dd>브레인벤쳐스 · 책임</dd>
          <dt>업데이트</dt>
          <dd>2023 · 2026 특진 설치 완료</dd>
        </dl>
        <div className={btnRow}>
          <GrayBtn onClick={() => runOpen("note:hello")}>더 많은 정보…</GrayBtn>
          <GrayBtn
            onClick={(e) =>
              runOpen("web", e.currentTarget.closest("[data-win]"))
            }
          >
            웹페이지로 보기
          </GrayBtn>
        </div>
      </div>
    </Window>
  );
}
