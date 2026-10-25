/**
 * 구조도 데이터 — ArchDiagram 이 그려요.
 * 좌표는 viewBox 기준(px)이고, 노드를 누르면 desc 가 아래에 표시돼요.
 */
export type IconKey =
  | 'ble' | 'plc' | 'bolt' | 'router' | 'server' | 'db' | 'globe' | 'chip'
  | 'antenna' | 'signal' | 'git' | 'gear' | 'box' | 'user' | 'chart' | 'thread' | 'sensor' | 'code';

export interface ArchNode {
  id: string;
  x: number; y: number; w: number; h: number;
  label: string;
  sub?: string;
  icon?: IconKey;
  /** 강조할 핵심 블록 */
  key?: boolean;
  desc?: string;
}
export interface ArchGroup { x: number; y: number; w: number; h: number; label: string }
export interface ArchEdge {
  pts: [number, number][];
  label?: string;
  at?: [number, number];
  /** 양방향 화살표 */
  both?: boolean;
  /** 연결된 노드 id (선택 시 강조용) */
  link?: string[];
}
export interface Diagram {
  w: number; h: number;
  nodes: ArchNode[];
  groups?: ArchGroup[];
  edges: ArchEdge[];
}
export interface Arch {
  title: string;
  caption: string;
  /** 하나면 그대로, 여러 개면 탭(Before/After)으로 보여줘요 */
  views: { label: string; d: Diagram; note?: string }[];
}

export type ArchKey = 'isdc' | 'irms' | 'itms' | 'ironserver' | 'sensor' | 'deploy';

const sensorRows = [20, 75, 130, 185, 240];
const sensorLabels = ['센서 1', '센서 2', '센서 3', '⋮', '센서 10'];

export const ARCH: Record<ArchKey, Arch> = {
  isdc: {
    title: 'ISDC 데이터 흐름',
    caption: '현장 센서·PLC·전기실 데이터가 게이트웨이와 IoT 플랫폼을 거쳐 모니터링 웹까지 오는 구조예요.',
    views: [{
      label: '구조',
      d: {
        w: 1000, h: 330,
        groups: [
          { x: 420, y: 20, w: 180, h: 290, label: 'IoT 플랫폼' },
          { x: 690, y: 20, w: 290, h: 160, label: 'ISDC' },
          { x: 690, y: 205, w: 290, h: 105, label: 'DB' },
        ],
        nodes: [
          { id: 'ble', x: 30, y: 25, w: 100, h: 60, label: 'BLE', icon: 'ble', desc: '집진기 주변 블루투스 센서' },
          { id: 'plc', x: 30, y: 105, w: 100, h: 60, label: 'PLC', icon: 'plc', desc: '집진 설비를 제어하는 PLC — 읽기와 제어가 양방향이에요' },
          { id: 'power', x: 30, y: 235, w: 100, h: 60, label: '전기실', icon: 'bolt', desc: '전력량 데이터' },
          { id: 'gw1', x: 190, y: 30, w: 160, h: 130, label: 'Gateway', sub: 'Main', icon: 'router', desc: '센서·PLC 데이터를 모아 IoT 플랫폼으로 올리는 메인 게이트웨이' },
          { id: 'gw2', x: 190, y: 185, w: 160, h: 125, label: 'Gateway', sub: 'CT', icon: 'router', desc: '전기실 전류(CT) 데이터를 받는 게이트웨이' },
          { id: 'mobius', x: 445, y: 50, w: 130, h: 100, label: 'Mobius', sub: 'oneM2M', icon: 'server', key: true, desc: '게이트웨이 데이터를 받아 서비스로 전달하는 IoT 플랫폼' },
          { id: 'mdb', x: 445, y: 190, w: 130, h: 95, label: 'MySQL', icon: 'db' },
          { id: 'was', x: 708, y: 55, w: 108, h: 105, label: 'WAS', sub: 'Node.js', icon: 'server', key: true, desc: '데이터 수집단·모니터링 API — 제가 기능을 추가하고 유지보수한 영역' },
          { id: 'web', x: 856, y: 55, w: 108, h: 105, label: 'WEB', sub: 'jQuery', icon: 'globe', key: true, desc: '건전성 모니터링, 계열별 그래프, 전력량 표시 화면' },
          { id: 'db', x: 770, y: 230, w: 130, h: 70, label: 'MySQL', icon: 'db', desc: '이전 DB에서 신규 DB로 데이터를 옮기는 마이그레이션을 진행했어요' },
        ],
        edges: [
          { pts: [[130, 55], [190, 55]], link: ['ble', 'gw1'] },
          { pts: [[130, 135], [190, 135]], both: true, link: ['plc', 'gw1'] },
          { pts: [[130, 265], [190, 265]], link: ['power', 'gw2'] },
          { pts: [[350, 95], [420, 95]], both: true, label: 'REST', at: [385, 84], link: ['gw1', 'mobius'] },
          { pts: [[350, 247], [420, 247]], both: true, label: 'REST', at: [385, 236], link: ['gw2', 'mobius'] },
          { pts: [[510, 150], [510, 190]], both: true, link: ['mobius', 'mdb'] },
          { pts: [[600, 80], [690, 80]], label: 'MQTT', at: [645, 69], link: ['mobius', 'was'] },
          { pts: [[690, 135], [600, 135]], label: 'HTTP', at: [645, 124], link: ['was', 'mobius'] },
          { pts: [[816, 107], [856, 107]], both: true, link: ['was', 'web'] },
          { pts: [[835, 180], [835, 205]], both: true, link: ['was', 'db'] },
        ],
      },
    }],
  },

  irms: {
    title: 'IRMS · IFAMS 구조',
    caption: '블루투스 온습도 센서와 냉난방기 제어기(ACU)가 MQTT로 서버와 연결돼요.',
    views: [{
      label: '구조',
      d: {
        w: 900, h: 300,
        groups: [
          { x: 560, y: 20, w: 320, h: 140, label: 'SERVER' },
          { x: 560, y: 185, w: 320, h: 100, label: 'DB' },
        ],
        nodes: [
          { id: 'ble', x: 30, y: 45, w: 100, h: 60, label: 'BLE', sub: '온습도', icon: 'ble' },
          { id: 'hub', x: 180, y: 30, w: 150, h: 100, label: 'HUB', icon: 'router' },
          { id: 'acu', x: 30, y: 190, w: 100, h: 60, label: 'ACU', icon: 'chip', desc: '냉난방기·냉각기 제어기 — 피크 제어 명령을 받아요' },
          { id: 'gw', x: 180, y: 170, w: 150, h: 100, label: 'Gateway', icon: 'router' },
          { id: 'was', x: 590, y: 52, w: 115, h: 95, label: 'WAS', icon: 'server', key: true, desc: '우선순위별 피크 제어 로직' },
          { id: 'web', x: 740, y: 52, w: 115, h: 95, label: 'WEB', icon: 'globe', key: true, desc: '전력량 표시와 그래프 조회 화면' },
          { id: 'db', x: 655, y: 210, w: 130, h: 65, label: 'MySQL', icon: 'db' },
        ],
        edges: [
          { pts: [[130, 75], [180, 75]], link: ['ble', 'hub'] },
          { pts: [[130, 220], [180, 220]], both: true, link: ['acu', 'gw'] },
          { pts: [[330, 80], [560, 80]], both: true, label: 'MQTT', at: [445, 69], link: ['hub', 'was'] },
          { pts: [[440, 80], [440, 220], [330, 220]], link: ['gw', 'was'] },
          { pts: [[720, 160], [720, 185]], both: true, link: ['was', 'db'] },
        ],
      },
    }],
  },

  itms: {
    title: 'ITMS 구조',
    caption: 'LoRa 전류 센서 데이터가 AP와 수신기를 거쳐 저장되고, 웹에서 상태와 알림으로 보여요.',
    views: [{
      label: '구조',
      d: {
        w: 1000, h: 280,
        groups: [
          { x: 790, y: 15, w: 195, h: 125, label: 'SERVER' },
          { x: 790, y: 165, w: 195, h: 100, label: 'DB' },
        ],
        nodes: [
          { id: 'lora', x: 20, y: 100, w: 100, h: 60, label: 'LoRa', sub: '전류 센서', icon: 'antenna' },
          { id: 'ap', x: 165, y: 80, w: 140, h: 100, label: 'LoRa AP', icon: 'router' },
          { id: 'rx', x: 380, y: 80, w: 140, h: 100, label: 'Receiver', icon: 'signal' },
          { id: 'mongo', x: 590, y: 80, w: 140, h: 100, label: 'MongoDB', icon: 'db' },
          { id: 'was', x: 805, y: 45, w: 80, h: 85, label: 'WAS', icon: 'server', key: true },
          { id: 'web', x: 895, y: 45, w: 80, h: 85, label: 'WEB', icon: 'globe', key: true, desc: '상태 표시 UI 개선과 주의 상태 알림' },
          { id: 'db', x: 830, y: 190, w: 115, h: 65, label: 'MySQL', icon: 'db' },
        ],
        edges: [
          { pts: [[120, 130], [165, 130]], link: ['lora', 'ap'] },
          { pts: [[305, 130], [380, 130]], both: true, label: 'MQTT', at: [342, 119], link: ['ap', 'rx'] },
          { pts: [[520, 130], [590, 130]], both: true, link: ['rx', 'mongo'] },
          { pts: [[730, 130], [760, 130], [760, 215], [790, 215]], both: true, link: ['mongo', 'db'] },
          { pts: [[887, 140], [887, 165]], both: true, link: ['was', 'db'] },
        ],
      },
    }],
  },

  ironserver: {
    title: 'IronServer 구조',
    caption: '제조사마다 다른 PLC 프로토콜을 드라이버 계층이 흡수하고, OPC UA 하나로 위에 올려요.',
    views: [{
      label: '구조',
      d: {
        w: 1000, h: 330,
        groups: [{ x: 250, y: 20, w: 230, h: 292, label: '드라이버 계층' }],
        nodes: [
          ...[['LS', 'FEnet'], ['Yaskawa', 'Memobus'], ['Omron', 'FINS'], ['Mitsubishi', 'MC'], ['Bluetooth', 'CISS']].map(([a, b], k) => ({
            id: `p${k}`, x: 20, y: 22 + k * 60, w: 175, h: 46, label: a, sub: b, icon: (k === 4 ? 'ble' : 'plc') as IconKey,
          })),
          { id: 'drv', x: 275, y: 105, w: 180, h: 120, label: 'IronPython 드라이버', sub: '빌드 없이 확장', icon: 'code', key: true, desc: '제가 개발을 총괄한 영역 — 프로토콜마다 드라이버를 붙이고, 빌드 없이 스크립트로 확장할 수 있게 했어요' },
          { id: 'ua', x: 560, y: 110, w: 170, h: 110, label: 'OPC UA Server', sub: '.NET · C#', icon: 'server', desc: '드라이버가 읽은 값을 표준 OPC UA 노드로 노출' },
          { id: 'web', x: 810, y: 55, w: 170, h: 95, label: 'IronWeb', sub: 'Blazor 대시보드', icon: 'chart', desc: '실시간 표·그래프 대시보드 — 아키텍처부터 직접 설계' },
          { id: 'cli', x: 810, y: 180, w: 170, h: 95, label: 'OPC UA 클라이언트', sub: '장비 제어 SW', icon: 'gear' },
        ],
        edges: [
          ...[0, 1, 2, 3, 4].map((k) => ({ pts: [[195, 45 + k * 60], [250, 45 + k * 60]] as [number, number][], link: [`p${k}`, 'drv'] })),
          { pts: [[480, 165], [560, 165]], link: ['drv', 'ua'] },
          { pts: [[730, 150], [770, 150], [770, 102], [810, 102]], link: ['ua', 'web'] },
          { pts: [[730, 180], [770, 180], [770, 227], [810, 227]], link: ['ua', 'cli'] },
        ],
      },
    }],
  },

  sensor: {
    title: '먼지 센서 수집 구조 제안',
    caption: '센서마다 프로세스를 띄우던 구조를, 프로세스 하나 안에서 수신·송신 스레드로 나누는 구조로 제안했어요.',
    views: [
      {
        label: 'Before',
        note: '프로세스 10개',
        d: {
          w: 900, h: 290,
          nodes: [
            ...sensorLabels.map((l, k) => ({ id: `s${k}`, x: 30, y: sensorRows[k], w: 120, h: 40, label: l, icon: (l === '⋮' ? undefined : 'sensor') as IconKey | undefined })),
            ...sensorLabels.map((l, k) => ({ id: `p${k}`, x: 290, y: sensorRows[k], w: 160, h: 40, label: l === '⋮' ? '⋮' : `프로세스 ${l.replace('센서 ', '')}`, icon: (l === '⋮' ? undefined : 'thread') as IconKey | undefined })),
            { id: 'srv', x: 650, y: 105, w: 200, h: 80, label: '수집 서버', icon: 'server' },
          ],
          edges: [
            ...sensorRows.map((y, k) => ({ pts: [[150, y + 20], [290, y + 20]] as [number, number][], link: [`s${k}`, `p${k}`] })),
            ...sensorRows.map((y, k) => ({ pts: [[450, y + 20], [550, y + 20], [550, 145], [650, 145]] as [number, number][], link: [`p${k}`, 'srv'] })),
          ],
        },
      },
      {
        label: 'After',
        note: '프로세스 1개',
        d: {
          w: 900, h: 290,
          groups: [{ x: 250, y: 15, w: 320, h: 265, label: '프로세스 1개' }],
          nodes: [
            ...sensorLabels.map((l, k) => ({ id: `s${k}`, x: 30, y: sensorRows[k], w: 120, h: 40, label: l, icon: (l === '⋮' ? undefined : 'sensor') as IconKey | undefined })),
            { id: 'rx', x: 280, y: 55, w: 260, h: 75, label: '수신 스레드', sub: '센서 10개를 함께 받음', icon: 'thread', key: true },
            { id: 'tx', x: 280, y: 180, w: 260, h: 75, label: '송신 스레드', sub: '서버로 전송', icon: 'thread', key: true },
            { id: 'srv', x: 670, y: 105, w: 200, h: 80, label: '수집 서버', icon: 'server' },
          ],
          edges: [
            ...sensorRows.map((y, k) => ({ pts: [[150, y + 20], [210, y + 20], [210, 92], [280, 92]] as [number, number][], link: [`s${k}`, 'rx'] })),
            { pts: [[410, 130], [410, 180]], link: ['rx', 'tx'] },
            { pts: [[540, 217], [605, 217], [605, 145], [670, 145]], link: ['tx', 'srv'] },
          ],
        },
      },
    ],
  },

  deploy: {
    title: '공통 배포 구조',
    caption: '웹 서비스는 대부분 같은 흐름으로 배포·운영해요. PR이 합쳐지면 GitHub Actions가 빌드·테스트 후 이미지를 만들어 서버에 올려요.',
    views: [{
      label: '구조',
      d: {
        w: 1000, h: 285,
        groups: [{ x: 600, y: 20, w: 255, h: 190, label: 'AWS' }],
        nodes: [
          { id: 'git', x: 20, y: 70, w: 140, h: 90, label: 'GitHub', sub: 'PR · 코드 리뷰', icon: 'git' },
          { id: 'ci', x: 205, y: 70, w: 165, h: 90, label: 'GitHub Actions', sub: '빌드 · 테스트', icon: 'gear', key: true, desc: '모든 프로젝트에 CI/CD를 붙여, 머지되면 자동으로 빌드·테스트·배포돼요' },
          { id: 'img', x: 415, y: 70, w: 140, h: 90, label: 'Docker', sub: '이미지', icon: 'box' },
          { id: 'app', x: 620, y: 60, w: 105, h: 110, label: 'App', sub: 'Next.js · React', icon: 'code' },
          { id: 'nginx', x: 740, y: 60, w: 100, h: 110, label: 'Nginx', icon: 'server' },
          { id: 'user', x: 885, y: 75, w: 100, h: 80, label: '사용자', icon: 'user' },
          { id: 'mon', x: 885, y: 205, w: 100, h: 70, label: 'Sentry · GA', icon: 'chart', desc: '에러 추적과 사용자 행동 분석' },
        ],
        edges: [
          { pts: [[160, 115], [205, 115]], link: ['git', 'ci'] },
          { pts: [[370, 115], [415, 115]], link: ['ci', 'img'] },
          { pts: [[555, 115], [620, 115]], label: '배포', at: [585, 104], link: ['img', 'app'] },
          { pts: [[740, 115], [725, 115]], link: ['nginx', 'app'] },
          { pts: [[885, 115], [840, 115]], link: ['user', 'nginx'] },
          { pts: [[672, 170], [672, 240], [885, 240]], link: ['app', 'mon'] },
        ],
      },
    }],
  },
};
