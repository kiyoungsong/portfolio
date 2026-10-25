import { useEffect } from 'react';
import { app, closeDetail, goWeb, openDetail } from './store/app';
import { desk } from './store/desktop';
import { PROJECTS } from './data/projects';
import { PHONE_QUERY } from './lib/env';
import { useMediaQuery } from './lib/useMediaQuery';
import { Desktop } from './desktop/Desktop';
import { WebPage } from './web/WebPage';
import { Spotlight } from './components/Spotlight';
import { Toast } from './components/Toast';

export default function App() {
  const mode = app.useStore((s) => s.mode);
  const spotOpen = app.useStore((s) => s.spotOpen);
  const phone = useMediaQuery(PHONE_QUERY);

  // 첫 진입: 휴대폰·#web 은 웹페이지, #desk 는 데스크톱, 그 외는 환영 창
  useEffect(() => {
    desk.layout();
    const hash = location.hash.slice(1);
    if (window.matchMedia(PHONE_QUERY).matches || hash === 'web' || hash.startsWith('project-')) {
      void goWeb(null);
      const m = /^project-(\d+)$/.exec(hash);
      if (m && PROJECTS[+m[1]]) openDetail(+m[1]);
    } else if (hash === 'desk') {
      app.set({ mode: 'desk' });
      desk.startDesk(false);
    } else desk.openWin('welcome');
  }, []);

  // 화면이 휴대폰 폭으로 줄면 웹페이지로
  useEffect(() => {
    if (phone && app.get().mode !== 'web') void goWeb(null);
  }, [phone]);

  // 전역 단축키
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const s = app.get();
      if ((e.metaKey || e.ctrlKey) && e.key?.toLowerCase() === 'k') {
        e.preventDefault();
        desk.closeMenu();
        app.set({ spotOpen: !s.spotOpen });
        return;
      }
      if (e.key === 'Escape') {
        if (s.spotOpen) app.set({ spotOpen: false });
        else if (s.detail !== null) closeDetail();
        else desk.closeMenu();
        return;
      }
      const inInput = (e.target as HTMLElement).closest?.('input');
      if (s.detail !== null && !s.spotOpen && !inInput) {
        const n = PROJECTS.length;
        if (e.key === 'ArrowRight') openDetail((s.detail + 1) % n);
        else if (e.key === 'ArrowLeft') openDetail((s.detail - 1 + n) % n);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <Desktop hidden={mode === 'web'} />
      {mode === 'web' && <WebPage phone={phone} />}
      {spotOpen && <Spotlight phone={phone} />}
      <Toast />
    </>
  );
}
