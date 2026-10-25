import { app } from '../store/app';

export function Toast() {
  const msg = app.useStore((s) => s.toast);
  if (!msg) return null;
  return (
    <div role="status" className="fixed top-11 left-1/2 z-[9950] -translate-x-1/2 rounded-[10px] border-[.5px] border-menu-line bg-menu px-3.5 py-2 text-[13px] font-semibold shadow-[0_10px_30px_rgba(0,0,0,.25)]">
      {msg}
    </div>
  );
}
