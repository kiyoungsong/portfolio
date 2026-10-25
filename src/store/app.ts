import { createStore } from '../lib/createStore';
import { isPhone, prefersReducedMotion, setHash } from '../lib/env';
import { launchFrom } from '../lib/launch';
import { desk } from './desktop';
import { PROJECTS } from '../data/projects';

export type Mode = 'choose' | 'desk' | 'web';

export const app = createStore({
  mode: 'choose' as Mode,
  /** 웹 모드에서 열린 프로젝트 상세 (PROJECTS 인덱스) */
  detail: null as number | null,
  spotOpen: false,
  toast: null as string | null,
});

let toastTimer: number | undefined;
export function toast(msg: string) {
  app.set({ toast: msg });
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => app.set({ toast: null }), 1800);
}

export async function goWeb(from?: DOMRect | null) {
  if (app.get().mode === 'web') return;
  desk.closeMenu();
  if (from && !prefersReducedMotion() && !isPhone()) await launchFrom(from);
  app.set({ mode: 'web' });
  setHash('web');
}

export function goDesk() {
  if (isPhone()) return;
  app.set({ mode: 'desk', detail: null });
  const w = desk.get().wins;
  if (!(['notes', 'finder', 'viewer'] as const).some((k) => w[k].open)) desk.startDesk(false);
  setHash('desk');
}

export function goChoose() {
  goDesk();
  desk.openWin('welcome');
}

/*
 * 프로젝트 상세는 브라우저 히스토리에 한 칸 쌓아요.
 * → 브라우저/폰의 뒤로가기를 누르면 사이트를 나가지 않고 상세만 닫혀요.
 * 이전·다음 프로젝트로 넘길 때는 칸을 더 쌓지 않고 바꿔치기만 해요.
 */
let pushedDetail = false;
const detailHash = (i: number) => `#project-${PROJECTS[i].id}`;

export function openDetail(i: number) {
  try {
    if (app.get().detail === null) {
      history.pushState({ detail: i }, '', detailHash(i));
      pushedDetail = true;
    } else {
      history.replaceState({ detail: i }, '', detailHash(i));
    }
  } catch {
    /* sandboxed iframe 등 */
  }
  app.set({ detail: i });
}

export function closeDetail() {
  if (app.get().detail === null) return;
  if (pushedDetail) {
    // 우리가 쌓은 칸을 되돌리면 popstate 에서 닫혀요
    history.back();
    return;
  }
  app.set({ detail: null });
  setHash('web');
}

/** 주소의 #project-<id> 를 PROJECTS 인덱스로 */
export function detailFromHash(hash = location.hash): number | null {
  const m = /^#?project-(.+)$/.exec(hash);
  if (!m) return null;
  const i = PROJECTS.findIndex((p) => p.id === decodeURIComponent(m[1]));
  return i >= 0 ? i : null;
}

/** 뒤로가기·앞으로가기 */
export function onPopState() {
  const i = detailFromHash();
  if (i === null) {
    pushedDetail = false;
    if (app.get().detail !== null) app.set({ detail: null });
  } else {
    if (app.get().mode !== 'web') app.set({ mode: 'web' });
    pushedDetail = true;
    app.set({ detail: i });
  }
}

/** 모드에 맞는 방식으로 프로젝트 열기 (Spotlight 등 공용) */
export function showProject(i: number) {
  if (app.get().mode === 'web') openDetail(i);
  else desk.openProject(i);
}
