import { useId, useMemo, useState } from 'react';
import { ARCH, type ArchKey, type ArchNode, type Diagram, type IconKey } from '../data/architectures';
import { Seg, segBtn } from '../desktop/ui';
import { cn } from '../lib/cn';

/** 24px 그리드 선 아이콘 (Phosphor 느낌) */
const ICON: Record<IconKey, string> = {
  ble: 'M7 7l10 10-5 4V3l5 4L7 17',
  plc: 'M4 21V5l6 3V5l6 3V5l4 2v14zM8 13h2m4 0h2M8 17h2m4 0h2',
  bolt: 'M13 2 4 14h7l-1 8 9-12h-7z',
  router: 'M3 14h18v6H3zM7 17h.01M11 17h.01M12 14V9m-4.5-1.5a6.4 6.4 0 0 1 9 0M5 5a10 10 0 0 1 14 0',
  server: 'M4 4h16v7H4zM4 13h16v7H4zM8 7.5h.01M8 16.5h.01M12 7.5h5M12 16.5h5',
  db: 'M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zm0 0v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3',
  globe: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z',
  chip: 'M7 7h10v10H7zM10 3v4m4-4v4m-4 10v4m4-4v4M3 10h4m-4 4h4m10-4h4m-4 4h4',
  antenna: 'M12 10v11M9 21h6M8.5 6.5a5 5 0 0 1 7 0M5.6 3.6a9 9 0 0 1 12.8 0M12 10h.01',
  signal: 'M5 19a2 2 0 1 0 0-.01M5 12a7 7 0 0 1 7 7M5 5a14 14 0 0 1 14 14',
  git: 'M6 3v12m0 0a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm12-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 0a9 9 0 0 1-9 9',
  gear: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM12 2v3m0 14v3M4.2 4.2l2.1 2.1m11.4 11.4 2.1 2.1M2 12h3m14 0h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1',
  box: 'M3 7.5 12 3l9 4.5v9L12 21l-9-4.5zM3 7.5l9 4.5 9-4.5M12 12v9',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
  chart: 'M3 3v18h18M7 15l4-4 3 3 5-6',
  thread: 'M4 6h16M4 12h16M4 18h10',
  sensor: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v3m0 14v3M2 12h3m14 0h3',
  code: 'M8 7l-5 5 5 5m8-10 5 5-5 5M14 4l-4 16',
};

function NodeBox({ n, on, dim, onPick }: { n: ArchNode; on: boolean; dim: boolean; onPick: () => void }) {
  const tall = n.h >= 70;
  const iconSize = tall ? 26 : 18;
  // 아이콘 + 라벨 + 보조 라벨을 세로(큰 블록) 또는 가로(작은 블록)로 배치
  const cx = n.x + n.w / 2;
  const cy = n.y + n.h / 2;
  const lines = n.sub ? 2 : 1;
  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={n.label + (n.sub ? ` ${n.sub}` : '')}
      onClick={onPick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onPick())}
      className={cn('cursor-pointer outline-none transition-opacity duration-200', dim && 'opacity-35')}
    >
      <rect
        x={n.x} y={n.y} width={n.w} height={n.h} rx={14}
        className={cn('transition-[stroke,fill] duration-200', on ? 'fill-sel stroke-accent' : n.key ? 'fill-card stroke-accent/60' : 'fill-card stroke-line')}
        strokeWidth={on ? 2 : 1.5}
      />
      {tall ? (
        <>
          {n.icon && (
            <svg x={cx - iconSize / 2} y={cy - (lines === 2 ? 36 : 26)} width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={n.key || on ? 'text-accent' : 'text-ink-2'}>
              <path d={ICON[n.icon]} />
            </svg>
          )}
          <text x={cx} y={cy + (n.icon ? (lines === 2 ? 10 : 18) : 5)} textAnchor="middle" className="fill-ink text-[15px] font-bold">{n.label}</text>
          {n.sub && <text x={cx} y={cy + (n.icon ? 29 : 24)} textAnchor="middle" className="fill-ink-3 text-[12px]">{n.sub}</text>}
        </>
      ) : (
        <>
          {n.icon && (
            <svg x={n.x + 12} y={cy - iconSize / 2} width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={n.key || on ? 'text-accent' : 'text-ink-2'}>
              <path d={ICON[n.icon]} />
            </svg>
          )}
          <text x={n.icon ? n.x + 38 : cx} y={cy + (n.sub ? -2 : 5)} textAnchor={n.icon ? 'start' : 'middle'} className="fill-ink text-[13.5px] font-bold">{n.label}</text>
          {n.sub && <text x={n.icon ? n.x + 38 : cx} y={cy + 14} textAnchor={n.icon ? 'start' : 'middle'} className="fill-ink-3 text-[11px]">{n.sub}</text>}
        </>
      )}
    </g>
  );
}

function DiagramSvg({ d, pick, setPick, title }: { d: Diagram; pick: string | null; setPick: (id: string | null) => void; title: string }) {
  const uid = useId().replace(/:/g, '');
  const linked = useMemo(() => {
    if (!pick) return null;
    const s = new Set([pick]);
    d.edges.forEach((e) => e.link?.includes(pick) && e.link.forEach((x) => s.add(x)));
    return s;
  }, [pick, d]);
  const edgeOn = (l?: string[]) => !!pick && !!l?.includes(pick);

  return (
    <svg viewBox={`0 0 ${d.w} ${d.h}`} role="img" aria-label={title} className="block h-auto w-full min-w-[620px] select-none" onClick={(e) => e.target === e.currentTarget && setPick(null)}>
      <defs>
        {(['n', 'a'] as const).map((k) => (
          <marker key={k} id={`${uid}-${k}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0L10 5L0 10z" className={k === 'a' ? 'fill-accent' : 'fill-ink-3'} />
          </marker>
        ))}
      </defs>
      {d.groups?.map((g) => (
        <g key={g.label + g.x}>
          <rect x={g.x} y={g.y} width={g.w} height={g.h} rx={18} className="fill-field stroke-line" strokeWidth={1.5} strokeDasharray="5 5" />
          <text x={g.x + 16} y={g.y + 22} className="fill-ink-3 text-[12px] font-bold tracking-[.04em]">{g.label}</text>
        </g>
      ))}
      {d.edges.map((e, k) => {
        const on = edgeOn(e.link);
        const pts = e.pts.map((p) => p.join(',')).join(' ');
        const m = `url(#${uid}-${on ? 'a' : 'n'})`;
        return (
          <g key={k} className={cn('transition-opacity duration-200', pick && !on && 'opacity-25')}>
            <polyline points={pts} fill="none" strokeWidth={on ? 2.2 : 1.6} className={on ? 'stroke-accent' : 'stroke-ink-3'} markerEnd={m} markerStart={e.both ? m : undefined} />
            {/* 데이터가 흐르는 느낌의 점선 */}
            <polyline points={pts} fill="none" strokeWidth={2.4} strokeDasharray="2 12" strokeLinecap="round" className="animate-flow stroke-accent/70 motion-reduce:hidden" />
            {e.label && e.at && (
              <text x={e.at[0]} y={e.at[1]} textAnchor="middle" className={cn('text-[12px] font-semibold', on ? 'fill-accent' : 'fill-ink-2')}>{e.label}</text>
            )}
          </g>
        );
      })}
      {d.nodes.map((n) => (
        <NodeBox key={n.id} n={n} on={pick === n.id} dim={!!linked && !linked.has(n.id)} onPick={() => setPick(pick === n.id ? null : n.id)} />
      ))}
    </svg>
  );
}

/** 인터랙티브 구조도 — 블록을 누르면 연결된 흐름이 강조되고 설명이 나와요 */
export function ArchDiagram({ k }: { k: ArchKey }) {
  const a = ARCH[k];
  const [view, setView] = useState(0);
  const [pick, setPick] = useState<string | null>(null);
  const v = a.views[Math.min(view, a.views.length - 1)];
  const node = pick ? v.d.nodes.find((n) => n.id === pick) : null;

  return (
    <figure className="overflow-hidden rounded-2xl bg-field">
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-line px-4 py-2.5">
        <figcaption className="text-[13px] font-bold">{a.title}</figcaption>
        {a.views.length > 1 && (
          <Seg label="구조 비교">
            {a.views.map((x, i) => (
              <button key={x.label} type="button" className={segBtn} aria-pressed={i === view} onClick={() => { setView(i); setPick(null); }}>
                {x.label}{x.note && <span className="ml-1 text-ink-3">· {x.note}</span>}
              </button>
            ))}
          </Seg>
        )}
      </div>
      <div className="overflow-x-auto px-3 py-4">
        <div key={view} className="animate-pop motion-reduce:animate-none">
          <DiagramSvg d={v.d} pick={pick} setPick={setPick} title={a.title} />
        </div>
      </div>
      <p className="min-h-[46px] border-t border-line px-4 py-3 text-[13px] leading-normal text-ink-2">
        {node ? (
          <><b className="text-ink">{node.label}{node.sub ? ` · ${node.sub}` : ''}</b> — {node.desc ?? '연결된 흐름을 강조했어요.'}</>
        ) : (
          <>{a.caption} <span className="text-ink-3">블록을 눌러 보세요.</span></>
        )}
      </p>
    </figure>
  );
}
