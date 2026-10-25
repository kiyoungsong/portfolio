import { createStore } from '../lib/createStore';
import { isPhone, prefersReducedMotion, setHash } from '../lib/env';
import { launchFrom } from '../lib/launch';
import { desk } from './desktop';

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

export function openDetail(i: number) {
  app.set({ detail: i });
  setHash(`project-${i}`);
}
export function closeDetail() {
  if (app.get().detail === null) return;
  app.set({ detail: null });
  setHash('web');
}

/** 모드에 맞는 방식으로 프로젝트 열기 (Spotlight 등 공용) */
export function showProject(i: number) {
  if (app.get().mode === 'web') openDetail(i);
  else desk.openProject(i);
}
