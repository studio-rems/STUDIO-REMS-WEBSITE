document.querySelectorAll('[data-compare]').forEach(box => {
  const input = box.querySelector('input');
  let rafId = null;
  const apply = () => {
    box.style.setProperty('--pos', input.value + '%');
    rafId = null;
  };
  const queue = () => {
    if (rafId === null) rafId = requestAnimationFrame(apply);
  };
  input.addEventListener('input', queue, { passive: true });
  input.addEventListener('change', queue, { passive: true });
});

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