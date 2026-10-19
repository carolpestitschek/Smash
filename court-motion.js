// A single ball rallies up and down both halves of the original court.
// Sampled closed-form spring: mass 1, stiffness 100, damping 10.
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const courtMotions = [];
document.querySelectorAll('[data-name="Court illustration"]').forEach(illustration => {
  const court = illustration.querySelector('[data-name="Padel court"]');
  const ball = illustration.querySelector('[data-name="Padel ball"]');
  if (!court || !ball) return;
  const originalStyle = ball.getAttribute('style');
  const nextSibling = ball.nextSibling;
  // Each landing immediately starts the next crossing; no bounce in place.
  const nearLeft = [70, 172];
  const farLeft = [95, 36];
  const nearRight = [210, 172];
  const farRight = [185, 36];
  // Parallel up the left lane, diagonal back, parallel up the right
  // lane, diagonal back to the first position. One landing per crossing.
  const phases = [
    {from: nearLeft, to: farLeft, height: 42, duration: 1500},
    {from: farLeft, to: nearRight, height: 42, duration: 1500},
    {from: nearRight, to: farRight, height: 42, duration: 1500},
    {from: farRight, to: nearLeft, height: 42, duration: 1500},
  ];
  const duration = phases.reduce((sum, phase) => sum + phase.duration, 0);
  const smooth = u => u * u * u * (u * (u * 6 - 15) + 10);
  const frames = [];
  let elapsed = 0;
  phases.forEach((phase, index) => {
    const samples = Math.round(phase.duration * 60 / 1000);
    for (let frame = index ? 1 : 0; frame <= samples; frame++) {
      const u = frame / samples;
      const travel = smooth(u);
      // A single continuous arc per phase, never a secondary oscillation.
      const lift = Math.sin(Math.PI * u) ** 2;
      const x = phase.from[0] + (phase.to[0] - phase.from[0]) * travel;
      const y = phase.from[1] + (phase.to[1] - phase.from[1]) * travel - phase.height * lift;
      const stretch = 0.035 * lift;
      frames.push({offset: (elapsed + phase.duration * u) / duration,
        transform: `translate(${x - 16}px, ${y - 16}px) scale(${1 - stretch}, ${1 + stretch})`});
    }
    elapsed += phase.duration;
  });
  let animation;
  let visible = false;
  function sync() {
    if (reducedMotion.matches) {
      animation?.cancel(); animation = undefined;
      illustration.insertBefore(ball, nextSibling);
      if (originalStyle === null) ball.removeAttribute('style');
      else ball.setAttribute('style', originalStyle);
      return;
    }
    if (!animation) {
      court.appendChild(ball);
      ball.style.left = '0'; ball.style.top = '0';
      ball.style.transformOrigin = 'center'; ball.style.pointerEvents = 'none';
      animation = ball.animate(frames, {duration, iterations: Infinity, easing: 'linear'});
    }
    if (visible && !document.hidden) animation.play(); else animation.pause();
  }
  const observer = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting; sync();
  }, {threshold: 0.1});
  observer.observe(illustration);
  reducedMotion.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  courtMotions.push({sync});
});
