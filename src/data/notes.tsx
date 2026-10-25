import type { ReactNode } from 'react';

export interface Note {
  id: string;
  title: string;
  sub: string;
  body: ReactNode;
}

export const NOTES: Note[] = [
  {
    id: 'hello',
    title: '안녕하세요',
    sub: '7년차 웹 개발자 송기영',
    body: (
      <>
        <h2>안녕하세요, 송기영입니다.</h2>
        <p className="hand">공장 설비를 움직이는 코드에서 시작해, 지금은 기획부터 출시까지 맡는 웹 개발자가 됐어요.</p>
        <p>
          반도체·디스플레이 장비 제어와 OPC UA 게이트웨이, 스마트팩토리 IoT 디바이스와 설비 모니터링 서비스를 거치며{' '}
          <b>제조 현장의 데이터를 웹으로 연결하는 일</b>을 해왔습니다. 현재는 브레인벤쳐스에서 프론트엔드 파트리더로 AI 기반 서비스를
          기획·디자인·개발·출시까지 이끌고 있습니다.
        </p>
        <p>전담 기획자가 없는 환경에서는 직접 기획과 화면설계, UI 디자인을 맡아 자사 솔루션을 출시했고, IT를 잘 모르는 고객사와 소통하며 프로젝트를 리드해 왔습니다.</p>
        <p>반복되는 작업은 구조와 자동화로 줄이는 걸 좋아합니다. 하드웨어부터 화면까지 전 구간을 경험한 게 제 가장 큰 무기입니다.</p>
        <p className="muted">창은 끌어서 옮기고, 독에서 다시 열 수 있어요. ⌘K로 검색도 됩니다.</p>
      </>
    ),
  },
  {
    id: 'work',
    title: '일하는 방식',
    sub: '의사결정 · 문제 해결 · 개발 문화',
    body: (
      <>
        <h2>일하는 방식</h2>
        <h3>기술적 의사결정</h3>
        <ul>
          <li><b>pnpm 모노레포 전환</b> — 공통 디자인 시스템 분리로 UI 수정 3회 → 1회</li>
          <li><b>Flutter 도입</b> — 단일 코드베이스, 플랫폼 간 UI 일관성, 생태계 성숙도를 비교해 선택</li>
          <li><b>센서 수집 구조 제안</b> — 센서별 프로세스 10개 대신 단일 프로세스·스레드 분리</li>
        </ul>
        <h3>문제 해결과 성능</h3>
        <ul>
          <li>SDK 미지원 요구사항을 HWPX XML 직접 처리로 해결해 납품</li>
          <li>iOS 수신 화면 제약을 고려한 플랫폼별 발신자 표출 설계</li>
          <li>UXP 플러그인 깜빡임·UI 동기화 개선, Transpace LCP 개선</li>
          <li>ISDC 데이터 수집 리팩토링과 MySQL 쿼리 개선</li>
        </ul>
        <h3>개발 문화</h3>
        <ul>
          <li>Vitest 유닛·사용자 시나리오 통합 테스트</li>
          <li>GA·Sentry 자발적 도입</li>
          <li>전 프로젝트 CI/CD, AWS·Docker·Nginx·PM2 운영</li>
          <li>FE 스터디·기술 블로그 1년 운영 → AI 활용 공유로 전환</li>
        </ul>
      </>
    ),
  },
  {
    id: 'ai',
    title: 'AI 활용',
    sub: 'Claude Code · Cursor · MCP',
    body: (
      <>
        <h2>AI 활용</h2>
        <p>기획자가 없는 환경의 공백을 AI로 보완해 기획·개발·문서 전 과정을 수행하고, AI 기능을 제품으로 만들고 있습니다.</p>
        <ul>
          <li>Claude Code·Cursor로 코드 분석, 리팩토링, 디버깅</li>
          <li>MCP로 로컬 프로젝트를 연결해 파일 관리와 업무 자동화</li>
          <li>정부지원사업 제안서, FP 산정, 정책·계약 문서 초안 작성</li>
          <li>AI 번역·식자 자동화, STT 파이프라인 등 AI 기능 제품 통합</li>
        </ul>
      </>
    ),
  },
  {
    id: 'edu',
    title: '학력 · 활동',
    sub: '대전대학교 컴퓨터공학',
    body: (
      <>
        <h2>학력 · 활동</h2>
        <h3>대전대학교 컴퓨터공학</h3>
        <ul>
          <li>김홍준 교수 연구실 학부연구생</li>
          <li>TurtleBot 자율주행 테스트, Random Forest 센서 시계열 분석</li>
          <li>웨어러블 센서 서비스 특허 발명자 등재 (2018)</li>
        </ul>
        <h3>수상 · 활동</h3>
        <ul>
          <li>Open Source Project 대회 우수상 (2019)</li>
          <li>한이음 ICT 멘토링 (2019)</li>
          <li>SW 동아리 재능기부 챌린지 (2017)</li>
          <li>K-해커톤 대학생 앱개발 장려상 (2016)</li>
        </ul>
      </>
    ),
  },
];
