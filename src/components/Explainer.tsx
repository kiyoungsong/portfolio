import { useState } from 'react';

const APPS = ['web', 'admin', 'toonspace'];

/** Toonspace 모노레포 전환 Before / After 비교 위젯 */
export function Explainer() {
  const [after, setAfter] = useState(false);
  return (
    <div className="exp">
      <div className="exp-bar">
        <div className="seg" role="group" aria-label="구조 비교">
          <button type="button" aria-pressed={!after} onClick={() => setAfter(false)}>Before</button>
          <button type="button" aria-pressed={after} onClick={() => setAfter(true)}>After</button>
        </div>
        <span className="exp-count">
          공통 UI 수정 <b style={{ color: after ? 'var(--t-iot)' : '#e5484d' }}>{after ? '1회' : '3회'}</b>
        </span>
      </div>
      <div className="exp-body pop" key={String(after)}>
        {!after ? (
          <div className="repos">
            {APPS.map((a) => (
              <div className="repo" key={a}>
                <code>repo/{a}</code>
                <b>{a}</b>
                <span className="badge-x">ui 복사본 · 따로 수정</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="ws">
            <code className="mono" style={{ fontSize: 11.5, color: 'var(--text3)' }}>toonflow/ · pnpm workspace</code>
            <div className="ws-apps">{APPS.map((a) => <div key={a}>apps/{a}</div>)}</div>
            <div className="ws-link" aria-hidden="true" />
            <div className="ws-ui">packages/ui · 공통 디자인 시스템</div>
          </div>
        )}
      </div>
    </div>
  );
}
