# 송기영 포트폴리오 (React)

첫 화면에서 **데스크톱처럼 둘러보기**(macOS 스타일 창 탐색) 또는 **웹페이지로 보기**(스크롤형 사이트)를 고르는 포트폴리오입니다. 휴대폰에서는 웹페이지로 바로 열립니다.

## 실행

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # dist/ 에 정적 파일 생성
npm run preview   # 빌드 결과 확인
```

`vite.config.ts` 의 `base: './'` 덕분에 `dist/` 를 GitHub Pages·Netlify·Vercel·S3 어디에 올려도 동작합니다.
특정 화면으로 바로 보내고 싶으면 `#web`, `#desk`, `#project-0`(프로젝트 인덱스) 해시를 붙이세요.

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
  components/    AppIcon, Explainer(Before/After), Spotlight(⌘K), Toast
  styles/        base(토큰·다크모드) / desktop / web / motion
```

## 이미지 넣기

- **프로필 사진**: `public/profile.jpg` 에 넣고 `web/sections.tsx` 의 `.av` 자리와 `desktop/windows/WelcomeWindow.tsx` 의 `.avatar` 를 `<img>` 로 바꾸세요.
- **프로젝트 스크린샷**: `public/shots/` 에 넣고, `ProjectDetail.tsx` 의 `.as-shot` 배경을 `url(...)` 로 바꾸면 됩니다. `projects.ts` 의 `shots` 배열 이름이 자리표시 문구로 쓰이고 있어요.

## 단축키

- `⌘K` / `Ctrl+K` 검색 · `Esc` 닫기
- 웹 상세에서 `←` `→` 로 이전·다음 프로젝트
- 데스크톱 터미널: `help`, `whoami`, `ls`, `open <이름>`, `skills`, `web`, `clear`
