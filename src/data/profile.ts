import type { CompanyId } from './projects';

export const PROFILE = {
  name: '송기영',
  nameEn: 'Kai Song',
  title: '웹 개발자 · 브레인벤쳐스 파트리더',
  email: 'thdrldud369@gmail.com',
  github: 'https://github.com/kiyoungsong',
  blog: 'https://velog.io/@thdrldud369',
  location: '경기 수원',
};

export interface Career {
  co: CompanyId;
  name: string;
  period: string;
  role: string;
  badge: string;
  points: string[];
}

export const CAREERS: Career[] = [
  {
    co: 'bv',
    name: '브레인벤쳐스',
    period: '2023.07 — 현재',
    role: '프론트엔드 파트리더 · 책임',
    badge: '2026 특진',
    points: [
      '기획자 부재로 자사 솔루션 기획·디자인부터 출시까지 주도',
      'Toonflow 플러그인 Adobe 마켓 출시',
      '고객사 웹·앱 리드, Flutter 앱 출시',
      '전 프로젝트 CI/CD, Vitest, GA·Sentry',
    ],
  },
  {
    co: 'airlix',
    name: '에어릭스',
    period: '2021.06 — 2023.06',
    role: 'Frontend & Backend · 파트 리드',
    badge: '2023 특진 · GS인증 1등급',
    points: ['라즈베리파이 Electron 앱, MQTT 연동', '설비 모니터링·관리자 웹, Node.js 백엔드', 'Smart O&M 전체 리드', 'CI/CD, Jira·Notion 도입'],
  },
  {
    co: 'iron',
    name: '아이언오토메이션',
    period: '2019.12 — 2021.01',
    role: 'Software Engineer',
    badge: '커리어의 시작',
    points: ['C# OPC UA 게이트웨이, PLC 드라이버', '레이저 챔버 제어 일부(Python)', 'ASP.NET 모니터링 웹, 웹으로 전향한 계기'],
  },
];

export const HOW_I_WORK: [title: string, body: string][] = [
  ['반복은 구조로', '저장소 3개를 모노레포로, 공통 UI 수정 3회 → 1회'],
  ['막히면 한 겹 아래로', 'SDK 대신 HWPX 안의 XML을 직접 열어 해결'],
  ['비교하고 고르기', 'Flutter는 코드베이스·UI 일관성·생태계를 비교해 선택'],
  ['남의 파트도 보기', '센서 프로세스 10개 대신 단일 프로세스·스레드 분리 제안'],
  ['품질은 습관으로', 'Vitest 통합 테스트, GA·Sentry, 전 프로젝트 CI/CD'],
  ['공백은 AI와 함께', 'Claude Code·Cursor·MCP로 기획·개발·문서 보완, 팀에 공유'],
];

export const SKILLS: [label: string, value: string][] = [
  ['Front-End', 'React, Next.js, TypeScript, Tailwind, React Query, Zustand'],
  ['Mobile · Plugin', 'Flutter, Electron, Adobe UXP'],
  ['Back-End · DB', 'Node.js, Express, MySQL/MariaDB'],
  ['Infra · Quality', 'AWS, Docker, Nginx, GitHub Actions, Jenkins, Vitest, Sentry'],
  ['IoT · AI', 'MQTT, OPC UA, PLC, Raspberry Pi · Claude Code, Cursor, MCP'],
  ['학력', '대전대학교 컴퓨터공학 · 연구실 학부연구생, 웨어러블 센서 특허 발명자(2018)'],
];
