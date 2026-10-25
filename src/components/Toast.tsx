import { app } from '../store/app';

export function Toast() {
  const msg = app.useStore((s) => s.toast);
  return <div id="toastHost">{msg && <div className="toast" role="status">{msg}</div>}</div>;
}
