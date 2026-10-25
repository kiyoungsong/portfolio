export type CompanyId = 'bv' | 'airlix' | 'iron';
export type TagId = 'web' | 'app' | 'plugin' | 'iot';

export interface Project {
  id: string;
  name: string;
  /** 아이콘에 들어가는 두 글자 */
  em: string;
  co: CompanyId;
  tag: TagId;
  role: string;
  year: string;
  team: string;
  /** 대표 프로젝트 여부 */
  feat?: 1;
  /** Before/After 구조 비교 위젯 노출 */
  explainer?: 1;
  one: string;
  over: string[];
  did: string[];
  story?: [string, string][];
  learn?: string;
  stack: string[];
  /** 스크린샷 자리 이름 — 이미지가 생기면 src 를 추가하세요 */
  shots: string[];
}

export const CO: Record<CompanyId, string> = {bv:'브레인벤쳐스',airlix:'에어릭스',iron:'아이언오토메이션'};
export const TAG: Record<TagId, [label: string, colorVar: string]> = {web:['Web','--t-web'],app:['App','--t-app'],plugin:['Plugin','--t-plugin'],iot:['IoT · 현장','--t-iot']};
export const PROJECTS: Project[] = [
 {id:'toonflow-plugin',name:'Toonflow Plugin',em:'Tf',co:'bv',tag:'plugin',role:'단독',year:'2025 — 현재',team:'FE 1명',feat:1,
  one:'웹툰·만화의 번역과 식자 작업을 포토샵 안에서 자동화하는 AI 플러그인',
  over:['번역가와 식자 작업자가 포토샵을 떠나지 않고 번역 텍스트를 확인·배치할 수 있도록 만든 Adobe UXP 플러그인입니다.','화면설계와 UI 디자인부터 개발, Adobe 마켓플레이스 출시까지 혼자 맡았습니다.'],
  did:['화면설계, UI/UX 디자인, 개발 전 과정 단독 수행','CSS 트랜지션·localStorage가 막힌 UXP 환경에 맞춘 커스텀 컴포넌트 구축','프리셋 생성·수정·삭제와 로컬 파일 저장','UXP 환경의 화면 깜빡임과 UI 동기화 문제 개선','Adobe 마켓플레이스 출시 및 퍼블리셔 등록'],
  story:[['문제','번역 검수 중 원본과 번역 텍스트를 확인하려면 캔버스 위를 계속 오가야 한다는 사용자 피드백이 있었습니다.'],['행동','원본·번역을 나란히 보여주는 패널을 만들고, 행을 더블클릭하면 해당 텍스트 위치로 이동하도록 했습니다.'],['결과','텍스트를 찾아다니는 과정이 줄어 검수 흐름이 짧아졌습니다.']],
  learn:'직접 기획한 제품이라도 실제 작업 흐름은 사용자에게서 배워야 한다는 걸 확인했습니다.',
  stack:['Adobe UXP','React','TypeScript','Zustand'],shots:['플러그인 메인 패널','원본·번역 비교 패널','프리셋 관리']},
 {id:'toonspace',name:'Toonspace',em:'Ts',co:'bv',tag:'web',role:'기획 · FE 리드',year:'2025 — 현재',team:'FE 리드',feat:1,explainer:1,
  one:'플러그인 결제·관리 웹부터 브라우저 편집 플랫폼까지, 웹툰 현지화 제품군 설계',
  over:['회사에 전담 기획자가 없어, 디자인을 할 줄 아는 제가 기획·화면설계·UI 디자인을 맡기로 대표와 합의했습니다.','사용자 웹(결제·라이선스 관리), 관리자 웹, 플러그인 기능을 브라우저로 옮긴 Toonspace까지 설계하고 프론트엔드 개발을 리드했습니다. 현재 웹 서비스 2개를 운영하고 있습니다.'],
  did:['사용자 웹, 관리자 웹, Toonspace 기획·화면설계·UI 디자인','크레딧·환불 등 서비스 운영 정책 설계 참여','pnpm 모노레포 구성과 공통 디자인 시스템 패키지 분리','Vitest 유닛 테스트와 사용자 행동 시나리오 기반 통합 테스트','AWS·Docker·Nginx 배포, CI/CD 구축, GA·Sentry 도입'],
  story:[['문제','같은 디자인 시스템을 쓰는 3개 프로젝트가 저장소별로 나뉘어, 컴포넌트 하나를 고치면 세 곳을 따로 수정해야 했습니다.'],['결정','pnpm 모노레포로 세 프로젝트를 묶고 디자인 시스템을 공통 패키지로 분리했습니다.'],['결과','공통 UI 수정이 3회에서 1회로 줄고, 서비스 간 디자인이 어긋나지 않게 됐습니다.']],
  learn:'개발자가 기획을 맡으면 구현 가능성을 먼저 고려해 재작업을 줄일 수 있습니다.',
  stack:['Next.js','React','TypeScript','Tailwind','pnpm','Vitest','react-konva','AWS','Docker'],shots:['Toonspace 편집 화면','사용자 웹 결제','관리자 대시보드']},
 {id:'sm',name:'SM구조안전진단',em:'SM',co:'bv',tag:'web',role:'FE 리드',year:'2025',team:'FE 리드',feat:1,
  one:'안전진단 데이터를 넣으면 보고서 초안(HWP)을 만들어 주는 자동화 플랫폼',
  over:['수작업으로 작성하던 안전진단 보고서 양식을 데이터 입력만으로 생성하는 고객사 플랫폼입니다.','퍼블리싱부터 프론트엔드 개발을 리드했습니다.'],
  did:['화면 퍼블리싱과 프론트엔드 개발 리드','HWP/HWPX 문서 생성 로직 구현','CI/CD 구축'],
  story:[['문제','일정이 겹쳐 SDK를 미리 검증하지 못했고, 검수 단계에서 사용 중인 SDK가 지원하지 않는 서식 요구가 추가됐습니다.'],['해결','HWPX가 ZIP 안의 XML(section 단위) 구조라는 점을 이용해 XML을 직접 파싱·수정하는 방식으로 전환했습니다.'],['결과','추가 요구사항을 반영해 납품했고, 특정 SDK 기능에 묶이지 않는 구조가 됐습니다.']],
  learn:'이후 외부 라이브러리를 도입하기 전에 지원 범위와 한계를 초기에 먼저 확인합니다.',
  stack:['React','TypeScript','React Query','Tailwind','HWPX/XML'],shots:['데이터 입력','보고서 생성 결과']},
 {id:'samilbio',name:'삼일바이오',em:'S1',co:'bv',tag:'app',role:'FE 리드',year:'2024 — 2025',team:'FE 리드',feat:1,
  one:'개인 건강정보를 연동해 영양제를 추천하는 헬스케어 앱과 관리자·파트너 웹',
  over:['1차로 관리자 웹을, 2차 고도화에서 Flutter 앱과 파트너 웹을 추가했습니다.','기획이 탄탄하지 않아 누락된 부분은 직접 보완 기획해 고객사와 합의하며 진행했습니다.'],
  did:['관리자 화면 설계·디자인·개발','Flutter 기반 iOS/Android 앱 개발 및 스토어 출시','파트너 웹 추가 개발','기획 누락 부분 보완 기획과 고객사 조율'],
  story:[['문제','1인 1계정 보장을 위해 PASS 본인인증이 필수였고, iOS 심사에서 이 방식에 대한 추가 설명을 요청받았습니다.'],['행동','서비스 구조, 건강정보 연동 흐름, 본인인증이 필요한 이유를 정리해 Apple 심사팀에 소명했습니다.'],['결과','iOS·Android 모두 출시했습니다.']],
  learn:'앱 심사는 기술보다 서비스 맥락을 정확히 설명하는 커뮤니케이션이 핵심인 경우가 많습니다.',
  stack:['Flutter','Next.js','React','TypeScript','React Query','Tailwind'],shots:['앱 메인','추천 결과','관리자 웹']},
 {id:'transpace',name:'Transpace',em:'Tp',co:'bv',tag:'web',role:'기획 · FE 리드',year:'2024',team:'FE 리드',
  one:'AI가 번역한 자막을 영상 타임라인에서 바로 확인하고 고치는 편집 플랫폼',
  over:['영상 번역 결과를 사용자가 직접 검수·편집할 수 있는 자사 웹 플랫폼입니다.','서비스 기획과 화면설계부터 프론트엔드 개발을 리드했습니다.'],
  did:['서비스 기획, 화면설계, 일부 디자인','오픈소스 기반 영상 타임라인·자막 편집 기능 구현','LCP 개선 등 초기 로딩 성능 최적화','CI/CD 구축'],
  story:[['문제','영상 타임라인과 자막 편집 UI는 직접 구현하기에 범위가 컸고, 팀 내 소통에서도 어긋남이 있었습니다.'],['행동','검증된 오픈소스를 기반으로 편집 기능을 구현하고, 화면설계서를 기준으로 팀과 합의하며 진행했습니다.'],['결과','영상 번역 결과를 웹에서 바로 편집하는 플랫폼을 완성했습니다.']],
  stack:['Next.js','TypeScript','React Query','Tailwind'],shots:['자막 편집기','영상 타임라인']},
 {id:'ejm',name:'이제이엠컴퍼니',em:'EJ',co:'bv',tag:'app',role:'디자인 · 개발 (협업)',year:'2025',team:'팀원과 협업',
  one:'저장하지 않은 번호로 전화가 와도 조합원 정보를 띄우는 관리자용 앱',
  over:['조합원을 관리하는 관리자 전용 업무 앱입니다.','디자인 시스템 기반 UI를 설계하고 Flutter로 개발해 팀원과 함께 iOS/Android에 출시했습니다.'],
  did:['디자인 시스템 기반 UI 디자인','Flutter 앱 개발','수신 전화 시 발신자 정보 표출 기능','iOS/Android 출시 (팀원과 협업)'],
  story:[['문제','Android는 화면이 꺼진 상태에서도 커스텀 수신 화면을 띄울 수 있지만, iOS는 수신 화면 커스텀을 막고 있었습니다.'],['행동','플랫폼 제약을 분석해 Android와 iOS의 발신자 표출 방식을 따로 설계했습니다.'],['결과','두 플랫폼 모두에서 미저장 번호의 발신자 정보를 확인할 수 있게 출시했습니다.']],
  stack:['Flutter','Dart','Android Native'],shots:['수신 화면','조합원 목록']},
 {id:'brandio',name:'브랜디오',em:'Br',co:'bv',tag:'web',role:'기획 · FE 리드',year:'2025 — 현재',team:'FE 리드',
  one:'AI로 홍보 콘텐츠를 만들고 한곳에서 관리하는 플랫폼',over:['중소기업스마트서비스 사업으로 진행 중인 AI 콘텐츠 제작 플랫폼입니다.','기획과 화면설계부터 프론트엔드 개발을 리드하고 있습니다.'],
  did:['서비스 기획과 화면설계','퍼블리싱, 프론트엔드 개발 리드','정부지원사업 제안서와 FP 산정 작성'],stack:['Next.js','TypeScript','Tailwind'],shots:['메인 화면','콘텐츠 생성']},
 {id:'rebrand',name:'브레인벤쳐스 리브랜딩',em:'RB',co:'bv',tag:'web',role:'제안 · 리드',year:'2024',team:'FE 리드',
  one:'회사 코어밸류에 맞춰 리브랜딩을 직접 제안하고 로고와 홈페이지를 새로 만듦',over:['회사 정체성과 맞지 않던 로고와 홈페이지를 코어밸류에 맞춰 바꾸자고 제안했습니다.','크라우드소싱 공모로 로고 시안을 선정하고, 홈페이지를 직접 디자인·개발했습니다.'],
  did:['리브랜딩 제안','크라우드소싱 공모 진행과 로고 시안 선정','홈페이지 리뉴얼 디자인·퍼블리싱·개발','기술 블로그 구축'],stack:['Next.js','TypeScript','Tailwind'],shots:['새 홈페이지','로고']},
 {id:'ecology',name:'에코놀로지',em:'Ec',co:'bv',tag:'app',role:'기획 · 디자인',year:'2025',team:'디자인 담당',
  one:'모바일로 구강 상태를 분석하는 앱의 서비스 기획과 디자인 리뉴얼',over:['AI 구강 건강 분석 앱의 서비스 흐름을 다시 기획하고 화면 디자인을 리뉴얼했습니다.'],did:['서비스 기획','앱 디자인 리뉴얼'],stack:['Figma'],shots:['리뉴얼 화면']},
 {id:'cksonic',name:'시케이소닉',em:'CK',co:'bv',tag:'web',role:'기획 · FE 리드',year:'2023',team:'FE 리드',
  one:'초음파세척기 서비스 업체의 계약 업무를 웹으로 옮긴 사내 서비스',over:['서비스 기획과 화면설계, 디자인부터 퍼블리싱과 개발까지 맡아 프론트엔드를 리드했습니다.'],did:['서비스 기획·화면설계','디자인, 퍼블리싱, 개발','CI/CD 구축'],stack:['React','TypeScript'],shots:['계약 화면']},
 {id:'innanswer',name:'인앤써',em:'IA',co:'bv',tag:'web',role:'개발',year:'2023',team:'FE 개발',
  one:'수시·대입 면접을 AI로 준비하는 올인원 플랫폼',over:['퍼블리싱과 프론트엔드 개발, CI/CD 적용을 맡았습니다.'],did:['퍼블리싱','프론트엔드 개발','CI/CD 구축'],stack:['React','TypeScript'],shots:['메인 화면']},
 {id:'advance',name:'센서 수집 구조 제안',em:'Se',co:'bv',tag:'iot',role:'구조 제안',year:'2025',team:'타 파트 지원',
  one:'센서 10개에 프로세스 10개를 띄우려던 설계를 하나의 프로세스로 바꾼 제안',over:['어드밴스솔루션 스마트서비스 프로젝트를 지원하며 센서 데이터 수집 구조에 의견을 냈습니다.'],
  did:['센서 데이터 수집·전송 구조 검토','단일 프로세스 내 수신·송신 스레드 분리 구조 제안'],
  story:[['문제','기존 설계는 센서마다 프로세스를 하나씩, 센서 10개에 프로세스 10개를 띄우는 방식이었습니다.'],['결정','프로세스 하나에 수신·송신 스레드를 나누고, 수신 스레드에 센서 10개를 붙여 한 프로세스에서 모두 수집하도록 제안했습니다.'],['결과','관리할 프로세스가 10개에서 1개로 줄고, 센서가 늘어도 프로세스를 추가하지 않아도 됩니다.']],
  stack:['Multi-thread','Sensor I/O'],shots:['구조 다이어그램']},
 {id:'airlix-iot',name:'IoT 디바이스 앱',em:'Pi',co:'airlix',tag:'iot',role:'FE 파트 리드',year:'2022 — 2023',team:'FE 파트 리드',
  one:'설비 현장의 라즈베리파이에서 돌아가는 디바이스 화면과 데이터 연동',over:['포스코 협력사의 환경설비 스마트팩토리 서비스에서, 현장 IoT 디바이스(라즈비안)에서 동작하는 Electron 앱을 만들었습니다.'],
  did:['Electron 기반 라즈비안 디바이스 앱 설계·개발','MQTT 브로커 기반 디바이스–서버 데이터 송수신','IoT 디바이스·신규 게이트웨이·PLC 컨트롤러 프론트엔드 파트 리드'],stack:['Electron','React','MQTT','Raspberry Pi'],shots:['디바이스 화면','현장 설치 사진']},
 {id:'airlix-platform',name:'설비 모니터링 플랫폼',em:'Mo',co:'airlix',tag:'iot',role:'풀스택',year:'2021 — 2023',team:'풀스택',
  one:'환경설비와 필터백 이력을 실시간으로 보는 모니터링·관리 서비스',over:['모니터링 화면과 관리자 웹, Node.js 백엔드까지 풀스택으로 개발했고, Smart O&M 프로젝트는 전체를 리드했습니다.','GS인증 1등급 획득에 기여해 2023년 특진했습니다.'],
  did:['실시간 모니터링·관리자 웹 개발','Node.js·Express 백엔드, DB 마이그레이션, MySQL 쿼리 개선','Nginx·PM2 무중단 배포, Jenkins·SonarQube CI/CD','Jira·Notion 협업툴 도입','Smart O&M 프로젝트 전체 리드'],stack:['React','Node.js','Express','MySQL','AWS','Jenkins'],shots:['모니터링 대시보드','관리자 웹']},
 {id:'opcua',name:'OPC UA 게이트웨이',em:'UA',co:'iron',tag:'iot',role:'개발',year:'2019 — 2021',team:'SW 엔지니어',
  one:'공장 설비 데이터를 수집하는 통신 서버와 PLC 드라이버, 장비 제어 프로그램',over:['반도체·디스플레이 공정 장비 쪽에서 커리어를 시작했습니다.','수집 시스템의 모니터링 웹을 만들며 웹 개발로 방향을 바꿨습니다.'],
  did:['C# OPC UA 게이트웨이 통신 서버 개발, 수집 시스템 개편','PLC 통신 프로토콜 드라이버 개발','디스플레이 공정 레이저 챔버 제어 프로그램 일부 개발(Python), 협력 업체 인터페이스 연동','ASP.NET 기반 수집 시스템 모니터링 웹 개발'],stack:['C#','OPC UA','PLC','Python','ASP.NET'],shots:['수집 시스템 화면']}
];

export const PLATFORM: Record<TagId, string> = { web: '웹', app: 'iOS · Android', plugin: 'Photoshop', iot: '설비 · IoT' };

/** 웹 모드 '대표 프로젝트' 카드 문구 */
export const FEATURED_COPY: Record<string, [kicker: string, headline: string]> = {
  'toonflow-plugin': ['오늘의 앱', '포토샵을 떠나지 않는\n웹툰 번역'],
  toonspace: ['개발자의 결정', '저장소 3개를\n하나로 합친 이유'],
  sm: ['비하인드', 'SDK가 안 될 때\nXML을 열었다'],
  samilbio: ['출시 이야기', '애플 심사팀을\n설득한 방법'],
};

export const tagColor = (t: TagId) => `var(${TAG[t][1]})`;
