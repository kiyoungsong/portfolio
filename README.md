# 송기영 포트폴리오 (React)

첫 화면에서 **데스크톱처럼 둘러보기**(macOS 스타일 창 탐색) 또는 **웹페이지로 보기**(스크롤형 사이트)를 고르는 포트폴리오입니다. 휴대폰에서는 웹페이지로 바로 열립니다.

## 스타일 (Tailwind CSS v4)

- 모든 스타일은 컴포넌트의 `className` 유틸리티로 작성돼 있어요. 별도 CSS 파일은 `src/index.css` 하나뿐이에요.
- 색은 CSS 변수 기반 토큰이라 다크 모드가 자동으로 바뀌어요: `bg-win`, `bg-toolbar`, `text-ink-2`, `border-sep`, `bg-accent`, 웹 모드 파스텔 `bg-p-sky` 등.
- 웹 모드는 `theme-bright` 클래스로 항상 밝은 팔레트를 써요.
- 자주 쓰는 조합: `glass`(블러 유리), `sheen`(아이콘·카드 광택), `bleed`(화면 끝까지 늘어나는 배경 띠), `sel-text`, `no-scrollbar`.
- 한 요소에 같은 속성 클래스를 두 번 주지 않도록, 바뀌는 부분(배경·패딩)은 prop 으로 넘기게 해 뒀어요 (`ProjectRow` 의 `pad`, `GetPill` 의 `bg` 등).

## 실행

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # dist/ 에 정적 파일 생성
npm run preview   # 빌드 결과 확인
```

`vite.config.ts` 의 `base: './'` 덕분에 `dist/` 를 GitHub Pages·Netlify·Vercel·S3 어디에 올려도 동작합니다.
특정 화면으로 바로 보내고 싶으면 `#web`, `#desk`, `#project-sm`(프로젝트 id) 해시를 붙이세요.

## 구조

```
src/
  data/          ← 내용은 여기만 고치면 됩니다
    projects.ts    프로젝트 15개 (개요, 한 일, 문제 해결, 기술, 스크린샷 자리)
    profile.ts     이메일·링크, 경력, 일하는 방식, 기술 스택
    notes.tsx      데스크톱 '메모' 앱 글
  store/         의존성 없는 작은 전역 스토어
    app.ts         모드(choose/desk/web), 웹 상세, 검색, 토스트
    desktop.ts     창 위치·크기·z-index, Finder/미리보기 상태
    actions.ts     바탕화면 아이콘·메뉴의 열기 규칙
  web/           웹페이지 모드 (Hero → 경력 → 일하는 방식 → 대표 프로젝트 → 모든 프로젝트 → 연락)
    ProjectDetail.tsx  App Store 상세 페이지 구성의 프로젝트 상세
  desktop/       데스크톱 모드 (메뉴바, 바탕화면 아이콘, 독, 창 관리자)
    Window.tsx     드래그·리사이즈·최소화·확대가 되는 공용 창
    windows/       환영, 메모, Finder, 미리보기, 연락처, 정보, 터미널
  components/    AppIcon, Avatar, Folder, HedgehogIcon, Explainer(Before/After), Spotlight(⌘K), Toast
  index.css      Tailwind 진입점 — 디자인 토큰(@theme), 라이트/다크 변수, 키프레임, 작은 커스텀 유틸리티
```

## 이미지 넣기

- **프로필 캐릭터**: `src/assets/avatar.webp` 를 바꾸면 웹·데스크톱의 모든 프로필 자리(로고, 소개 카드, 환영 창, 연락처, 독)에 한 번에 반영돼요. 투명 배경 정사각형(480px 이상)을 권장해요.
- **프로젝트 스크린샷**: `public/shots/` 에 넣고, `ProjectDetail.tsx` 의 `.as-shot` 배경을 `url(...)` 로 바꾸면 됩니다. `projects.ts` 의 `shots` 배열 이름이 자리표시 문구로 쓰이고 있어요.

## 단축키

- `⌘K` / `Ctrl+K` 검색 · `Esc` 닫기
- 웹 상세에서 `←` `→` 로 이전·다음 프로젝트
- 데스크톱 터미널: `help`, `whoami`, `ls`, `open <이름>`, `skills`, `web`, `clear`
