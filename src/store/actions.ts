import { goWeb } from './app';
import { desk, type WinId } from './desktop';

/** 바탕화면 아이콘·메뉴에서 쓰는 열기 규칙: web | company:bv | note:hello | win:contact */
export function runOpen(spec: string, el?: Element | null) {
  if (spec === 'web') {
    void goWeb(el ? el.getBoundingClientRect() : null);
    return;
  }
  const [k, v] = spec.split(':');
  if (k === 'company') desk.openFinder({ sel: `co:${v}`, q: '', picked: null });
  else if (k === 'note') desk.openNote(v);
  else if (k === 'win') desk.openWin(v as WinId);
}
