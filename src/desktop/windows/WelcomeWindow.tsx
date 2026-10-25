import { Window } from '../Window';
import { Avatar } from '../../components/Avatar';
import { PeekingHedgehog } from '../../components/HedgehogIcon';
import { desk } from '../../store/desktop';
import { app, goWeb } from '../../store/app';
import { setHash } from '../../lib/env';

const choice =
  'flex cursor-pointer flex-col items-center gap-2.5 rounded-[14px] border-[1.5px] border-sep bg-win px-4 pt-4 pb-[18px] text-center transition-[transform,border-color,box-shadow] duration-250 ease-spring hover:-translate-y-[3px] hover:border-accent hover:shadow-[0_10px_28px_-14px_rgba(0,0,0,.35)] active:scale-[.98] motion-reduce:transition-none';

export function WelcomeWindow() {
  const pickDesk = () => {
    app.set({ mode: 'desk' });
    desk.closeWin('welcome');
    desk.startDesk(true);
    setHash('desk');
  };
  const pickWeb = () => {
    const r = document.querySelector('[data-win="welcome"]')?.getBoundingClientRect();
    desk.closeWin('welcome');
    void goWeb(r);
  };
  return (
    <Window id="welcome" label="환영합니다" thin zoomable={false} resizable={false}
      toolbar={<><span className="mx-auto truncate text-[13px] font-bold">환영합니다</span><span className="w-[52px]" /></>}
      decoration={<PeekingHedgehog className="-top-[26px] right-11 h-[33px] w-[58px]" />}>
      <div className="flex flex-1 flex-col items-center gap-1.5 px-[30px] pt-[26px] pb-7 text-center">
        <Avatar size={76} />
        <h2 className="mt-2 text-[22px] font-bold tracking-[-.01em]">송기영의 포트폴리오에 오신 걸 환영해요</h2>
        <p className="text-[13.5px] text-ink-2">7년차 웹 개발자 · 어떤 방식으로 둘러보시겠어요?</p>
        <div className="mt-[18px] grid w-full grid-cols-2 gap-3.5">
          <button className={choice} type="button" onClick={pickWeb}>
            <svg viewBox="0 0 200 120" aria-hidden="true" className="h-auto w-full max-w-[200px] rounded-lg"><rect width="200" height="120" rx="10" fill="#f2f3f7" /><rect width="200" height="16" fill="#fff" /><rect x="60" y="4" width="80" height="8" rx="4" fill="#e3e4ea" /><rect x="16" y="28" width="96" height="10" rx="3" fill="#1d1d1f" /><rect x="16" y="43" width="72" height="10" rx="3" fill="#1d1d1f" /><rect x="16" y="60" width="86" height="5" rx="2.5" fill="#b4b6c0" /><rect x="16" y="70" width="34" height="11" rx="5.5" fill="#007aff" /><rect x="128" y="26" width="56" height="56" rx="10" fill="#fff" /><rect x="16" y="92" width="52" height="22" rx="5" fill="#7dbcfb" /><rect x="74" y="92" width="52" height="22" rx="5" fill="#ffb366" /><rect x="132" y="92" width="52" height="22" rx="5" fill="#c39bf2" /></svg>
            <span className="rounded-full bg-sel px-2 py-0.5 text-[11px] font-bold text-accent">빠르게 보기</span>
            <b className="text-[15px]">웹페이지로 보기</b>
            <span className="text-[12.5px] leading-normal text-ink-2">스크롤 한 번에<br />경력과 프로젝트를 모두 확인해요</span>
          </button>
          <button className={choice} type="button" onClick={pickDesk}>
            <svg viewBox="0 0 200 120" aria-hidden="true" className="h-auto w-full max-w-[200px] rounded-lg"><rect width="200" height="120" rx="10" fill="#b9c7ff" /><circle cx="30" cy="100" r="50" fill="#f7b2c9" opacity=".8" /><rect width="200" height="9" fill="#fff" opacity=".7" /><rect x="18" y="20" width="80" height="58" rx="5" fill="#fff" /><rect x="18" y="20" width="80" height="11" rx="5" fill="#f1f1f4" /><circle cx="25" cy="25.5" r="2.2" fill="#ff5f57" /><circle cx="32" cy="25.5" r="2.2" fill="#febc2e" /><circle cx="39" cy="25.5" r="2.2" fill="#28c840" /><rect x="82" y="38" width="96" height="60" rx="5" fill="#fff" /><rect x="82" y="38" width="96" height="11" rx="5" fill="#f1f1f4" /><circle cx="89" cy="43.5" r="2.2" fill="#ff5f57" /><circle cx="96" cy="43.5" r="2.2" fill="#febc2e" /><circle cx="103" cy="43.5" r="2.2" fill="#28c840" /><rect x="90" y="56" width="24" height="18" rx="3" fill="#7dbcfb" /><rect x="120" y="56" width="24" height="18" rx="3" fill="#ffb366" /><rect x="150" y="56" width="20" height="18" rx="3" fill="#c39bf2" /><rect x="62" y="104" width="76" height="12" rx="5" fill="#fff" opacity=".65" /></svg>
            <span className="rounded-full bg-sel px-2 py-0.5 text-[11px] font-bold text-accent">탐색하는 재미</span>
            <b className="text-[15px]">데스크톱처럼 둘러보기</b>
            <span className="text-[12.5px] leading-normal text-ink-2">창을 열고, 끌고, 겹치며<br />폴더 속 프로젝트를 찾아보세요</span>
          </button>
        </div>
        <p className="mt-3.5 text-xs text-ink-3">언제든 메뉴바나 독에서 다른 방식으로 바꿀 수 있어요</p>
      </div>
    </Window>
  );
}
