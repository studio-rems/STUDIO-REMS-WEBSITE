// Before/after sliders: rAF-batched updates, will-change only while dragging
document.querySelectorAll('[data-compare]').forEach(box => {
  const input = box.querySelector('input[type="range"]');
  let rafId = null;

  const apply = () => {
    box.style.setProperty('--pos', input.value + '%');
    rafId = null;
  };
  const queue = () => {
    if (rafId === null) rafId = requestAnimationFrame(apply);
  };

  const startDrag = () => box.classList.add('is-dragging');
  const endDrag = () => box.classList.remove('is-dragging');

  input.addEventListener('input', queue, { passive: true });
  input.addEventListener('pointerdown', startDrag);
  input.addEventListener('pointerup', endDrag);
  input.addEventListener('pointercancel', endDrag);
  input.addEventListener('blur', endDrag);
  input.addEventListener('keydown', startDrag);
  input.addEventListener('keyup', endDrag);
});

// Lazy-load slider images just before their card enters the viewport,
// instead of decoding all before/after pairs on page load.
// Falls back to a case-swapped extension (.jpg <-> .JPG) if the exact
// path 404s — protects against case-sensitive hosts (e.g. Vercel/Linux)
// disagreeing with a case-insensitive local dev filesystem (Mac/Windows).
function loadLayerImage(layer, path) {
  const tryUrl = url => new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(url);
    img.onerror = reject;
    img.src = url;
  });

  const candidates = [path];
  const extMatch = path.match(/\.(jpe?g|png|webp)$/i);
  if (extMatch) {
    const ext = extMatch[0];
    const swapped = ext === ext.toLowerCase() ? ext.toUpperCase() : ext.toLowerCase();
    candidates.push(path.slice(0, -ext.length) + swapped);
  }

  (async () => {
    for (const url of candidates) {
      try {
        const okUrl = await tryUrl(url);
        layer.style.backgroundImage = `url('${okUrl}')`;
        return;
      } catch (err) { /* try next candidate */ }
    }
    console.warn('Slider image failed to load (checked exact + case-swapped path):', path);
  })();
}

const bgLoadObs = new IntersectionObserver(entries => entries.forEach(entry => {
  if (!entry.isIntersecting) return;
  entry.target.querySelectorAll('[data-bg]').forEach(layer => {
    const url = layer.getAttribute('data-bg');
    if (url) {
      loadLayerImage(layer, url);
      layer.removeAttribute('data-bg');
    }
  });
  bgLoadObs.unobserve(entry.target);
}), { rootMargin: '400px 0px' });
document.querySelectorAll('[data-compare]').forEach(box => bgLoadObs.observe(box));

const obs = new IntersectionObserver(entries => entries.forEach(e => {
  if(e.isIntersecting) { e.target.classList.add('show'); obs.unobserve(e.target); }
}), {threshold:.12});
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

document.getElementById('trialForm').addEventListener('submit', e => {
  e.preventDefault();
  document.getElementById('success').classList.add('show');
});

document.getElementById('menuBtn').addEventListener('click', () => {
  const links = document.querySelector('.nav-links');
  links.style.display = links.style.display === 'flex' ? '' : 'flex';
  if(links.style.display === 'flex') {
    links.style.position='absolute'; links.style.top='70px'; links.style.left='0'; links.style.right='0';
    links.style.padding='18px 24px'; links.style.background='#f6f5f1'; links.style.borderBottom='1px solid #d9dde3';
    links.style.flexDirection='column'; links.style.alignItems='flex-start';
  }
});