/**
 * 프로젝트별 공개 링크 — [버튼 이름, 주소]
 * 목록에 없는 프로젝트는 버튼이 비활성화되고 NO_LINK 문구가 붙어요.
 */
export const LINKS: Record<string, [label: string, url: string][]> = {
  "toonflow-plugin": [["Adobe Exchange", "https://exchange.adobe.com/apps/cc/00178e2f/toonflow"]],
  "toonflow-web": [
    ["Toonflow", "https://toonflow.kr/"],
    ["Toonspace", "https://toonspace.kr/"],
  ],
  transpace: [["Transpace", "https://www.transpace.ai/"]],
  samilbio: [
    ["엔필라이", "https://www.npillai.co.kr/"],
    ["Google Play", "https://play.google.com/store/apps/details?id=com.samilbio.npillai&hl=ko"],
    ["App Store", "https://apps.apple.com/kr/app/%EC%97%94%ED%95%84%EB%9D%BC%EC%9D%B4/id6782771503"],
  ],
  ejm: [
    ["Google Play", "https://play.google.com/store/apps/details?id=kr.ejmc.wooriga.work&hl=ko"],
    ["App Store", "https://apps.apple.com/kr/app/%EC%9A%B0%EB%A6%AC%EA%B0%80%EC%9B%8C%ED%81%AC/id6759430339"],
  ],
  ecology: [
    ["Google Play", "https://play.google.com/store/apps/details?id=com.ekonology.ethu&hl=ko"],
    ["App Store", "https://apps.apple.com/kr/app/ethu/id6749837552"],
  ],
  rebrand: [["brainventur.com", "https://brainventur.com/"]],
};

export const NO_LINK = "고객사·사내 전용이거나 종료된 서비스라 공개 링크가 없어요";

export const linksOf = (id: string) => LINKS[id] ?? [];
