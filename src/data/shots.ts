/**
 * 프로젝트 스크린샷 — src/assets/shots/<프로젝트 id>/<파일>.webp
 * 새 이미지는 폴더에 넣고 아래 목록에 [파일 이름, 설명] 을 추가하세요. 첫 번째가 대표 이미지예요.
 */
const files = import.meta.glob<string>("../assets/shots/*/*.webp", {
  eager: true,
  import: "default",
});

const LIST: Record<string, [file: string, label: string][]> = {
  "toonflow-plugin": [
    ["market", "Adobe Exchange 출시 페이지"],
    ["main", "플러그인 메인 패널"],
    ["compare", "원본·번역 비교 패널"],
  ],
  "toonflow-web": [
    ["web-main", "Toonflow 서비스 메인"],
    ["toonspace-editor", "Toonspace 편집기"],
    ["web-payment", "사용자 웹 결제"],
    ["admin-dashboard", "관리자 대시보드"],
  ],
  ecology: [
    ["splash", "스플래시"],
    ["main", "메인 — 구강 건강 점수"],
    ["challenge", "챌린지"],
    ["guide", "제품 사용 가이드"],
  ],
  samilbio: [
    ["main", "앱 메인"],
    ["chat", "AI 상담"],
    ["partner", "약국 파트너 화면"],
  ],
  sm: [
    ["main", "로그인 — 사내 전용 관리 시스템"],
    ["input1", "신규 프로젝트 생성"],
    ["input2", "진단 데이터 목록"],
    ["input3", "데이터 입력"],
    ["result1", "자동 생성된 보고서"],
  ],
  ejm: [
    ["main", "메인"],
    ["call", "수신 전화 시 소유자 정보"],
    ["calendar", "방문 일정·상담 관리"],
  ],
  rebrand: [
    ["home", "새 홈페이지 메인"],
    ["about", "About"],
  ],
  transpace: [
    ["main", "검수자 메인"],
    ["list", "프로젝트 목록"],
    ["editor", "자막 편집기"],
  ],
  innanswer: [
    ["main", "메인"],
    ["page1", "대학별 기출문제"],
    ["page2", "면접 결과"],
  ],
  pc100: [["main", "관리자 대시보드"]],
  gateway: [["main", "게이트웨이 운영 화면"]],
};

export interface Shot {
  src: string;
  label: string;
}

export function shotsOf(id: string): Shot[] {
  return (LIST[id] ?? [])
    .map(([f, label]) => ({
      src: files[`../assets/shots/${id}/${f}.webp`],
      label,
    }))
    .filter((s) => !!s.src);
}
