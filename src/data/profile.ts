import type { CompanyId } from "./projects";

export const PROFILE = {
  name: "송기영",
  nameEn: "Kai Song",
  title: "웹 개발자",
  email: "thdrldud369@gmail.com",
  github: "https://github.com/kiyoungsong",
  blog: "https://velog.io/@thdrldud369",
  location: "경기 수원",
};

export interface Career {
  co: CompanyId;
  name: string;
  /** 회사 한 줄 소개 */
  about: string;
  period: string;
  role: string;
  badge: string;
  /** [굵은 키워드, 설명] */
  points: [lead: string, text: string][];
  stack: string[];
}

export const CAREERS: Career[] = [
  {
    co: "bv",
    name: "브레인벤쳐스",
    about: "언어를 이해하고 만드는 AI 기술을 개발하는 스타트업",
    period: "2023.07 — 현재",
    role: "프론트엔드 리더 · 책임",
    badge: "2026 특진",
    points: [
      [
        "기획·디자인",
        "기획자 없는 팀에서 서비스 기획·화면설계·UI 디자인까지 직접 맡아 진행",
      ],
      [
        "자사 솔루션",
        "Toonflow 플러그인과 웹 3종을 기획부터 Adobe 마켓 출시까지 리드",
      ],
      [
        "고객사",
        "헬스케어·안전진단·총회 운영 등 웹·앱 프론트엔드 리드, iOS·Android 출시",
      ],
      ["품질", "Sentry·GA·PostHog 도입, Vitest·Storybook 테스트, LCP 최적화"],
      [
        "문화",
        "전 프로젝트 GitHub Actions CI/CD, 사내 기술 블로그·FE 스터디 운영",
      ],
    ],
    stack: [
      "React",
      "Next.js",
      "TypeScript",
      "Flutter",
      "UXP",
      "Tailwind",
      "AWS",
      "Docker",
    ],
  },
  {
    co: "airlix",
    name: "에어릭스",
    about: "포스코 협력사 · 환경설비 스마트팩토리 모니터링·제어",
    period: "2021.06 — 2023.06",
    role: "풀스택 · 대리",
    badge: "2023 특진",
    points: [
      [
        "현장",
        "포스코 제철소 집진기와 공장 전력·냉난방 설비 모니터링·제어 시스템 개발",
      ],
      [
        "디바이스",
        "라즈베리파이 Electron 앱, 게이트웨이·PLC 컨트롤러 화면 (KC·GS 1등급 인증)",
      ],
      ["풀스택", "Node.js 백엔드, MQTT 연동, 신규 DB 마이그레이션"],
      [
        "리드",
        "Smart O&M 리드, 개발–운영 환경과 Jenkins CI/CD 구축, Jira·Notion 도입",
      ],
    ],
    stack: [
      "React",
      "TypeScript",
      "Node.js",
      "Electron",
      "MQTT",
      "MySQL",
      "Jenkins",
    ],
  },
  {
    co: "iron",
    name: "아이언오토메이션",
    about: "PC 기반 반도체 장비 제어 솔루션과 SI",
    period: "2019.12 — 2021.01",
    role: "서버 개발자 · 사원",
    badge: "커리어의 시작",
    points: [
      ["통신", "LS·Yaskawa·Omron·Mitsubishi·블루투스 PLC 통신 드라이버 개발"],
      ["확장", "IronPython으로 빌드 없이 붙이는 드라이버 구조 설계"],
      ["서버", ".NET OPC UA 서버 개발, Windows·Linux 지원"],
      ["장비", "디스플레이 공정 장비 제어 SW 유지보수와 협력사 인터페이스"],
      ["전환", "Blazor 실시간 대시보드를 설계하며 웹으로 전향"],
    ],
    stack: ["C#", ".NET", "OPC UA", "Python", "Blazor"],
  },
];

/** 일하는 방식 — 시키지 않아도 먼저 해온 것들 [제목, 내용, 어디서] */
export const HOW_I_WORK: [title: string, body: string, where: string][] = [
  [
    "기획이 비어 있으면 맡았어요",
    "전담 기획자가 없어, 디자인을 할 줄 아는 제가 기획·화면설계·UI 디자인까지 맡기로 대표님과 합의했어요.",
    "Toonflow · 고객사 프로젝트",
  ],
  [
    "리브랜딩을 먼저 제안했어요",
    "코어밸류와 맞지 않던 로고·홈페이지를 바꾸자고 대표님을 설득하고, 새 홈페이지를 직접 만들었어요.",
    "브레인벤쳐스",
  ],
  [
    "모니터링을 알아서 붙였어요",
    "요청이 없어도 Sentry·GA·PostHog를 도입해 에러와 사용자 행동이 보이게 했어요.",
    "Transpace · Toonflow",
  ],
  [
    "모든 프로젝트에 CI/CD",
    "에어릭스에서 Jenkins로 처음 구축했고, 지금은 모든 프로젝트에 GitHub Actions를 붙여 배포를 자동화해요.",
    "전 프로젝트",
  ],
  [
    "스터디와 블로그를 열었어요",
    "사내 기술 블로그 개설·운영을 리드하고 FE 스터디를 1년 이끌었어요. AI가 빨라지면서 AI 활용 공유로 바꿨어요.",
    "팀 문화",
  ],
  [
    "남의 파트도 들여다봤어요",
    "센서마다 프로세스를 띄우던 수집 구조를, 단일 프로세스·스레드 분리 구조로 바꾸자고 제안했어요.",
    "청정로봇 플랫폼",
  ],
  [
    "대화가 막히면 자리를 만들었어요",
    "주기적인 코드 리뷰·미팅, 2주 1회 고객사 오프라인 미팅과 회의록 공유를 먼저 시작했어요.",
    "Transpace · SM구조안전진단",
  ],
  [
    "협업 도구를 들였어요",
    "Jira·Notion을 도입해 흩어져 있던 업무와 문서를 한곳에 모았어요.",
    "에어릭스",
  ],
];

export const SKILLS: [label: string, value: string][] = [
  ["Front-End", "React, Next.js, TypeScript, Tailwind, React Query, Zustand"],
  ["Mobile · Plugin", "Flutter, Electron, Adobe UXP"],
  ["Back-End · DB", "Node.js, Express, MySQL/MariaDB"],
  [
    "Infra · Quality",
    "AWS, Docker, Nginx, GitHub Actions, Jenkins, Vitest, Storybook, Sentry",
  ],
  ["IoT · AI", "MQTT, OPC UA, PLC, Raspberry Pi · Claude Code, Cursor, MCP"],
  [
    "학력",
    "대전대학교 컴퓨터공학 · 연구실 학부연구생, 웨어러블 센서 특허 발명자(2018)",
  ],
  ["자격", "정보처리기사 (2025) · 운전면허 1종 보통 (2016)"],
];
