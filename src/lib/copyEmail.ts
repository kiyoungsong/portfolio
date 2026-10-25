import { PROFILE } from '../data/profile';
import { toast } from '../store/app';

/** 클립보드가 막혀 있으면 이메일 텍스트를 선택해 직접 복사하게 해요 */
export function copyEmail(fallbackEl?: HTMLElement | null) {
  const select = () => {
    if (fallbackEl) {
      const r = document.createRange();
      r.selectNodeContents(fallbackEl);
      const s = getSelection();
      s?.removeAllRanges();
      s?.addRange(r);
    }
    toast('이메일을 선택했어요. 복사해 주세요.');
  };
  try {
    navigator.clipboard.writeText(PROFILE.email).then(() => toast('이메일을 복사했어요'), select);
  } catch {
    select();
  }
}
