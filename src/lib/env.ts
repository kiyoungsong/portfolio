export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const PHONE_QUERY = '(max-width: 760px)';
export const isPhone = () => typeof window !== 'undefined' && window.matchMedia(PHONE_QUERY).matches;

export function setHash(h: string) {
  try {
    history.replaceState(null, '', '#' + h);
  } catch {
    /* sandboxed iframe 등에서는 무시 */
  }
}
