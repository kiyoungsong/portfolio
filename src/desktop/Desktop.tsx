import { useEffect, useState } from 'react';
import { desk } from '../store/desktop';
import { MenuBar } from './MenuBar';
import { DesktopIcons } from './DesktopIcons';
import { Dock } from './Dock';
import { WelcomeWindow } from './windows/WelcomeWindow';
import { NotesWindow } from './windows/NotesWindow';
import { FinderWindow } from './windows/FinderWindow';
import { ViewerWindow } from './windows/ViewerWindow';
import { AboutWindow, ContactWindow } from './windows/CardWindows';
import { TerminalWindow } from './windows/TerminalWindow';

export function Desktop({ hidden }: { hidden: boolean }) {
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    let t: number | undefined;
    const onResize = () => {
      window.clearTimeout(t);
      t = window.setTimeout(() => desk.clampToViewport(), 120);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div id="desk" aria-hidden={hidden || undefined} onClick={(e) => e.target === e.currentTarget && setSelected(null)}>
      <MenuBar />
      <DesktopIcons selected={selected} onSelect={setSelected} />
      <div id="wins">
        <WelcomeWindow />
        <NotesWindow />
        <FinderWindow />
        <ViewerWindow />
        <ContactWindow />
        <AboutWindow />
        <TerminalWindow />
      </div>
      <Dock />
    </div>
  );
}
