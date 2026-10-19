// Animate the original longitude lines, keeping the outer globe and equator still.
const globeReducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
document.querySelectorAll('[data-name="Orbit backdrop"] img, [data-name="Orbital emblem"] [data-name="Orbital linework"] img').forEach(async image => {
  try {
    const response = await fetch(image.getAttribute('src'));
    if (!response.ok) return;
    const source = new DOMParser().parseFromString(await response.text(), 'image/svg+xml');
    const svg = document.importNode(source.documentElement, true);
    // Scope the exported IDs so desktop and mobile masks cannot collide.
    const prefix = image.closest('main').className + (image.closest('[data-name="Orbital emblem"]') ? '-footer-globe-' : '-hero-globe-');
    svg.querySelectorAll('[id]').forEach(node => {
      const previous = node.id;
      node.id = prefix + previous;
      svg.querySelectorAll('*').forEach(child => {
        for (const attribute of ['mask', 'clip-path']) {
          if (child.getAttribute(attribute) === `url(#${previous})`)
            child.setAttribute(attribute, `url(#${node.id})`);
        }
      });
    });
    svg.setAttribute('aria-hidden', 'true');
    svg.style.cssText = 'position:absolute;inset:0;display:block;width:100%;height:100%;overflow:visible;pointer-events:none';
    const group = svg.querySelector('g');
    const meridians = Array.from(group.children).filter(node => node.tagName === 'path' && node.hasAttribute('mask'));
    const animations = [];
    // The first ellipse is the globe's silhouette. Only its inner meridians turn.
    meridians.slice(1).forEach((line, index) => {
      const maskId = line.getAttribute('mask').slice(5, -1);
      const mask = Array.from(svg.querySelectorAll('mask')).find(node => node.id === maskId);
      const longitude = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      group.insertBefore(longitude, line);
      if (mask) longitude.appendChild(mask);
      longitude.appendChild(line);
      longitude.style.transformBox = 'fill-box';
      longitude.style.transformOrigin = 'center';
      animations.push(longitude.animate([
        {transform:'rotateY(0deg)'}, {transform:'rotateY(360deg)'}
      ], {duration: index ? 24000 : 18000, iterations: Infinity, easing:'linear'}));
    });
    image.replaceWith(svg);
    let visible = false;
    const sync = () => animations.forEach(animation => {
      if (globeReducedMotion.matches) {animation.pause(); animation.currentTime = 0;}
      else if (visible && !document.hidden) animation.play();
      else animation.pause();
    });
    new IntersectionObserver(entries => {visible = entries[0].isIntersecting; sync();}).observe(svg);
    globeReducedMotion.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    sync();
  } catch (error) {
    // Preserve the original illustration if the local SVG cannot be loaded.
    console.warn('Hero motion unavailable', error);
  }
});
