const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

document.addEventListener('contextmenu', e => {
  if (e.target.closest('.protect')) e.preventDefault();
});
document.addEventListener('dragstart', e => {
  if (e.target.tagName === 'IMG') e.preventDefault();
});

const track = document.querySelector('.gallery-track');
if (track) {
  const step = () => Math.round(track.clientWidth * 0.8);
  document.querySelector('.g-prev').addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  document.querySelector('.g-next').addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));

  let startX = 0, startLeft = 0, down = false;
  track.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    down = true;
    startX = e.clientX;
    startLeft = track.scrollLeft;
    track.classList.add('dragging');
    track.setPointerCapture(e.pointerId);
  });
  track.addEventListener('pointermove', e => {
    if (down) track.scrollLeft = startLeft - (e.clientX - startX);
  });
  const end = () => { down = false; track.classList.remove('dragging'); };
  track.addEventListener('pointerup', end);
  track.addEventListener('pointercancel', end);
}
