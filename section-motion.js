// Reveal each section once; leave its children and existing animations intact.
const revealReducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const revealAnimations = new Set();
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    revealObserver.unobserve(entry.target);
    if (revealReducedMotion.matches) return;
    const animation = entry.target.animate([
      {opacity: 0, transform: 'translateY(18px)'},
      {opacity: 1, transform: 'translateY(0)'}
    ], {duration: 500, easing: 'cubic-bezier(0.23, 1, 0.32, 1)'});
    revealAnimations.add(animation);
    animation.onfinish = () => revealAnimations.delete(animation);
  });
}, {threshold: 0, rootMargin: '0px 0px -24px 0px'});

document.querySelectorAll('main > div > [data-name]').forEach(section => {
  const name = section.getAttribute('data-name');
  if (name === 'Navigation' || name === 'Hero') return;
  // Already visible sections stay still on initial load or anchor navigation.
  const bounds = section.getBoundingClientRect();
  if (bounds.height && bounds.top < innerHeight && bounds.bottom > 0) return;
  revealObserver.observe(section);
});
revealReducedMotion.addEventListener('change', () => {
  if (revealReducedMotion.matches) {
    revealAnimations.forEach(animation => animation.cancel());
    revealAnimations.clear();
  }
});
