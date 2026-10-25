/** 데스크톱 → 웹 전환 때 창이 화면 가득 커지는 애니메이션 */
export function launchFrom(r: DOMRect): Promise<void> {
  return new Promise((resolve) => {
    const l = document.createElement('div');
    l.className = 'launch';
    l.innerHTML =
      '<div class="lbar"><span class="lights" style="pointer-events:none"><span class="light c"></span><span class="light m"></span><span class="light z"></span></span><div class="addr">kaisong · portfolio</div></div>';
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
