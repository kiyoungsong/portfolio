import { createStore } from '../lib/createStore';
import { prefersReducedMotion } from '../lib/env';
import { PROJECTS } from '../data/projects';

export const WIN_IDS = ['welcome', 'notes', 'finder', 'viewer', 'contact', 'about', 'terminal'] as const;
export type WinId = (typeof WIN_IDS)[number];

export const WIN_NAMES: Record<WinId, string> = {
  welcome: '환영합니다',
  finder: 'Finder',
  viewer: '미리보기',
  notes: '메모',
  contact: '연락처',
  about: '이 개발자에 관하여',
  terminal: '터미널',
};

export interface WinState {
  open: boolean;
  min: boolean;
  max: boolean;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  /** 열릴 때마다 증가 — 열림 애니메이션 트리거 */
  openSeq: number;
  prev: { x: number; y: number; w: number; h: number } | null;
}

export type FinderSel = 'all' | 'feat' | `co:${string}` | `tag:${string}`;

const blank = (): WinState => ({ open: false, min: false, max: false, x: 0, y: 0, w: 600, h: 440, z: 0, openSeq: 0, prev: null });

const store = createStore({
  wins: Object.fromEntries(WIN_IDS.map((k) => [k, blank()])) as Record<WinId, WinState>,
  active: null as WinId | null,
  z: 20,
  finder: { sel: 'all' as FinderSel, q: '', view: 'icon' as 'icon' | 'list', picked: null as number | null },
  viewer: { i: 1, tab: 0 },
  note: 'hello',
  menu: null as string | null,
});

const deskSize = () => {
  const el = document.getElementById('desk');
  return { w: el?.clientWidth ?? innerWidth, h: el?.clientHeight ?? innerHeight };
};

function patchWin(id: WinId, p: Partial<WinState>) {
  store.set((s) => ({ wins: { ...s.wins, [id]: { ...s.wins[id], ...p } } }));
}

function topOpen(except?: WinId): WinId | null {
  const w = store.get().wins;
  return (WIN_IDS.filter((k) => k !== except && w[k].open && !w[k].min).sort((a, b) => w[b].z - w[a].z)[0] as WinId) ?? null;
}

function layout() {
  const { w: vw, h: vh } = deskSize();
  const top = 40, bottom = 96, avail = vh - top - bottom;
  const L: Partial<Record<WinId, Partial<WinState>>> = {};
  const ww = Math.min(560, vw - 40), wh = Math.min(520, avail);
  L.welcome = { w: ww, h: wh, x: (vw - ww) / 2, y: Math.max(top, top + (avail - wh) / 2) };
  if (vw >= 1360) {
    L.notes = { x: 24, y: top, w: 380, h: Math.min(520, avail) };
    L.finder = { x: 430, y: top + 14, w: Math.min(660, vw - 860), h: Math.min(470, avail - 30) };
    const vw2 = Math.min(640, vw * 0.42);
    L.viewer = { w: vw2, y: top + 60, h: avail - 60, x: vw - vw2 - 140 };
  } else {
    L.notes = { x: 20, y: top, w: 360, h: Math.min(480, avail) };
    L.finder = { x: Math.max(20, Math.min(260, vw - 640)), y: top + 30, w: Math.min(620, vw - 40), h: Math.min(440, avail - 40) };
    L.viewer = { x: Math.max(20, vw - 640), y: top + 70, w: Math.min(600, vw - 40), h: avail - 70 };
  }
  L.contact = { x: Math.max(40, vw / 2 - 180), y: top + 80, w: 360, h: 440 };
  L.about = { x: Math.max(40, vw / 2 - 190), y: top + 50, w: 380, h: 470 };
  L.terminal = { x: 120, y: Math.max(top, vh - bottom - 320), w: Math.min(620, vw - 80), h: 300 };
  store.set((s) => {
    const wins = { ...s.wins };
    (Object.keys(L) as WinId[]).forEach((k) => (wins[k] = { ...wins[k], ...L[k], max: false, prev: null }));
    return { wins };
  });
}

function clampToViewport() {
  const { w: vw, h: vh } = deskSize();
  store.set((s) => {
    const wins = { ...s.wins };
    WIN_IDS.forEach((k) => {
      const c = { ...wins[k] };
      if (k === 'welcome') c.x = Math.max(0, (vw - c.w) / 2);
      c.x = Math.min(c.x, vw - 120);
      c.y = Math.min(c.y, vh - 120);
      c.w = Math.min(c.w, vw - 16);
      wins[k] = c;
    });
    return { wins };
  });
}

function focusWin(id: WinId | null) {
  if (!id || !store.get().wins[id].open) return;
  const z = store.get().z + 1;
  store.set((s) => ({ z, active: id, wins: { ...s.wins, [id]: { ...s.wins[id], z } } }));
}

function openWin(id: WinId) {
  const s = store.get().wins[id];
  if (s.min) {
    patchWin(id, { min: false });
    focusWin(id);
    return;
  }
  if (!s.open) patchWin(id, { open: true, openSeq: s.openSeq + 1 });
  focusWin(id);
}

function closeWin(id: WinId) {
  patchWin(id, { open: false, min: false });
  const n = topOpen(id);
  if (n) focusWin(n);
  else store.set({ active: null });
}

function setMin(id: WinId) {
  patchWin(id, { min: true });
  const n = topOpen(id);
  if (n) focusWin(n);
  else store.set({ active: null });
}

function zoom(id: WinId) {
  const s = store.get().wins[id];
  const { w: vw, h: vh } = deskSize();
  if (s.max && s.prev) patchWin(id, { ...s.prev, max: false, prev: null });
  else patchWin(id, { prev: { x: s.x, y: s.y, w: s.w, h: s.h }, x: 8, y: 34, w: vw - 16, h: vh - 34 - 92, max: true });
  focusWin(id);
}

function startDesk(stagger = true) {
  (['notes', 'finder', 'viewer'] as const).forEach((id, k) => {
    if (stagger && !prefersReducedMotion()) window.setTimeout(() => openWin(id), k * 140);
    else openWin(id);
  });
}

function openProject(i: number) {
  store.set((s) => ({ viewer: { i, tab: 0 }, finder: { ...s.finder, picked: i } }));
  openWin('viewer');
}

function openNote(id: string) {
  store.set({ note: id });
  openWin('notes');
}

function setFinder(p: Partial<ReturnType<typeof store.get>['finder']>) {
  store.set((s) => ({ finder: { ...s.finder, ...p } }));
}

function openFinder(p: Partial<ReturnType<typeof store.get>['finder']> = {}) {
  setFinder(p);
  openWin('finder');
}

export const desk = {
  ...store,
  patchWin,
  layout,
  clampToViewport,
  focusWin,
  openWin,
  closeWin,
  setMin,
  zoom,
  startDesk,
  openProject,
  openNote,
  setFinder,
  openFinder,
  closeAll: () => WIN_IDS.forEach((k) => store.get().wins[k].open && closeWin(k)),
  closeMenu: () => store.get().menu && store.set({ menu: null }),
  stepProject: (d: number) => openProject((store.get().viewer.i + d + PROJECTS.length) % PROJECTS.length),
};
