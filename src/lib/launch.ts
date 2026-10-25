/** 데스크톱 → 웹 전환 때 창이 화면 가득 커지는 애니메이션 */
export function launchFrom(r: DOMRect): Promise<void> {
  return new Promise((resolve) => {
    const l = document.createElement('div');
    l.className = 'fixed z-[9990] flex flex-col overflow-hidden rounded-xl bg-[#fffdf8] shadow-win-active';
    const dot = 'size-3 rounded-full';
    l.innerHTML = `<div class="flex h-11 flex-none items-center gap-3 border-b border-sep bg-toolbar px-3.5">
      <span class="pointer-events-none flex gap-2"><span class="${dot} bg-[#ff5f57]"></span><span class="${dot} bg-[#febc2e]"></span><span class="${dot} bg-[#28c840]"></span></span>
      <div class="mx-auto grid h-[26px] max-w-[420px] flex-1 place-items-center rounded-[7px] bg-field text-[12.5px] text-ink-2">kaisong · portfolio</div>
    </div>`;
    Object.assign(l.style, { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' });
    document.body.appendChild(l);
    const done = () => {
      resolve();
      window.setTimeout(() => l.remove(), 60);
    };
    if (!l.animate) return done();
    const a = l.animate(
      [
        { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px', borderRadius: '12px' },
        { left: '0px', top: '0px', width: innerWidth + 'px', height: innerHeight + 'px', borderRadius: '0px' },
      ],
      { duration: 480, easing: 'cubic-bezier(.3,.8,.2,1)', fill: 'forwards' },
    );
    a.onfinish = done;
    a.oncancel = done;
  });
}
