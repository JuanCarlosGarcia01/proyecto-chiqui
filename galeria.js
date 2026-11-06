(() => {
 const host = document.querySelector('.hero-photo');
 if (!host) return;
 const photos = [{"src": "img/galeria/termografia-01.jpg", "title": "Termografía infrarroja"}, {"src": "img/galeria/deteccion-01.jpg", "title": "Instrumentos de detección de gases"}, {"src": "img/galeria/ruido-01.jpg", "title": "Medición de ruido"}, {"src": "img/galeria/iluminacion-01.jpg", "title": "Medición de iluminación"}, {"src": "img/galeria/espesores-01.jpg", "title": "Medición de espesores"}, {"src": "img/galeria/puesta-tierra-01.jpg", "title": "Medición de puesta a tierra"}, {"src": "img/galeria/termografia-02.jpg", "title": "Termografía infrarroja"}, {"src": "img/galeria/deteccion-02.jpg", "title": "Instrumentos de detección de gases"}, {"src": "img/galeria/ruido-02.jpg", "title": "Medición de ruido"}, {"src": "img/galeria/espesores-02.jpg", "title": "Medición de espesores"}, {"src": "img/galeria/puesta-tierra-02.jpg", "title": "Medición de puesta a tierra"}, {"src": "img/galeria/termografia-03.jpg", "title": "Termografía infrarroja"}, {"src": "img/galeria/deteccion-03.jpg", "title": "Instrumentos de detección de gases"}, {"src": "img/galeria/espesores-03.jpg", "title": "Medición de espesores"}, {"src": "img/galeria/puesta-tierra-03.jpg", "title": "Medición de puesta a tierra"}, {"src": "img/galeria/termografia-04.jpg", "title": "Termografía infrarroja"}, {"src": "img/galeria/deteccion-04.jpg", "title": "Instrumentos de detección de gases"}, {"src": "img/galeria/espesores-04.jpg", "title": "Medición de espesores"}, {"src": "img/galeria/puesta-tierra-04.jpg", "title": "Medición de puesta a tierra"}, {"src": "img/galeria/termografia-05.jpg", "title": "Termografía infrarroja"}, {"src": "img/galeria/deteccion-05.jpg", "title": "Instrumentos de detección de gases"}, {"src": "img/galeria/espesores-05.jpg", "title": "Medición de espesores"}, {"src": "img/galeria/puesta-tierra-05.jpg", "title": "Medición de puesta a tierra"}, {"src": "img/galeria/termografia-06.jpg", "title": "Termografía infrarroja"}, {"src": "img/galeria/deteccion-06.jpg", "title": "Instrumentos de detección de gases"}, {"src": "img/galeria/espesores-06.jpg", "title": "Medición de espesores"}, {"src": "img/galeria/puesta-tierra-06.jpg", "title": "Medición de puesta a tierra"}, {"src": "img/galeria/termografia-07.jpg", "title": "Termografía infrarroja"}, {"src": "img/galeria/espesores-07.jpg", "title": "Medición de espesores"}, {"src": "img/galeria/termografia-08.jpg", "title": "Termografía infrarroja"}, {"src": "img/galeria/termografia-09.jpg", "title": "Termografía infrarroja"}, {"src": "img/galeria/termografia-10.jpg", "title": "Termografía infrarroja"}];
 const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
 let current = 0, timer, paused = reduced.matches, hovering = false, focused = false, request = 0;
 host.classList.add('gallery');
 host.setAttribute('role', 'region');
 host.setAttribute('aria-roledescription', 'carrusel');
 host.setAttribute('aria-label', 'Galería de instrumentos y trabajos');
 host.innerHTML = `<div class="gallery-stage" id="gallery-stage"><img class="gallery-image active" alt="" width="1280" height="1600"><img class="gallery-image" alt="" width="1280" height="1600" aria-hidden="true"></div><figcaption class="gallery-caption"><p class="gallery-kicker">UNA MIRADA A NUESTROS EQUIPOS</p><p class="gallery-title"></p><div class="gallery-controls"><div><button type="button" class="gallery-prev" aria-label="Foto anterior" aria-controls="gallery-stage">←</button><button type="button" class="gallery-pause" aria-label="Pausar presentación">Ⅱ</button><button type="button" class="gallery-next" aria-label="Foto siguiente" aria-controls="gallery-stage">→</button></div></div></figcaption><span class="gallery-announcement sr-only" aria-live="polite"></span>`;
 const images = [...host.querySelectorAll('.gallery-image')];
 let visible = 0;
 const title = host.querySelector('.gallery-title');
 const stage = host.querySelector('.gallery-stage');
 const pause = host.querySelector('.gallery-pause');
 const announcement = host.querySelector('.gallery-announcement');
 function describe() {
  title.textContent = photos[current].title;
  stage.style.setProperty('--gallery-photo', `url("${photos[current].src}")`);
 }
 function schedule() {
  clearTimeout(timer);
  if (!paused && !hovering && !focused && !document.hidden) timer = setTimeout(() => show(current + 1), 5500);
 }
 function pauseLabel() {
  pause.textContent = paused ? '▶' : 'Ⅱ';
  pause.setAttribute('aria-label', paused ? 'Reproducir presentación' : 'Pausar presentación');
 }
 async function show(index, manual = false) {
  clearTimeout(timer);
  const token = ++request;
  const next = (index + photos.length) % photos.length;
  const image = images[1 - visible];
  const preload = new Image();
  preload.src = photos[next].src;
  try { await preload.decode(); } catch {
   if (token === request) { if (manual) announcement.textContent = 'No se pudo cargar esta foto. Intentá nuevamente.'; schedule(); }
   return;
  }
  if (token !== request) return;
  image.src = photos[next].src;
  image.alt = photos[next].title;
  image.removeAttribute('aria-hidden');
  image.classList.add('active');
  images[visible].classList.remove('active');
  images[visible].setAttribute('aria-hidden', 'true');
  visible = 1 - visible; current = next; describe();
  if (manual) announcement.textContent = photos[current].title;
  schedule();
 }
 images[0].src = photos[0].src; images[0].alt = photos[0].title;
 images[0].fetchPriority = 'high';
 describe(); pauseLabel(); schedule();
 function move(delta) { paused = true; pauseLabel(); show(current + delta, true); }
 host.querySelector('.gallery-prev').addEventListener('click', () => move(-1));
 host.querySelector('.gallery-next').addEventListener('click', () => move(1));
 pause.addEventListener('click', () => { paused = !paused; pauseLabel(); schedule(); });
 host.addEventListener('mouseenter', () => { hovering = true; schedule(); });
 host.addEventListener('mouseleave', () => { hovering = false; schedule(); });
 host.addEventListener('focusin', () => { focused = true; schedule(); });
 host.addEventListener('focusout', event => { if (!host.contains(event.relatedTarget)) { focused = false; schedule(); } });
 host.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1); }
 });
 let start;
 host.addEventListener('touchstart', event => { start = [event.changedTouches[0].clientX, event.changedTouches[0].clientY]; }, { passive: true });
 host.addEventListener('touchend', event => {
  if (!start) return;
  const dx = event.changedTouches[0].clientX - start[0], dy = event.changedTouches[0].clientY - start[1];
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1);
  start = null;
 }, { passive: true });
 document.addEventListener('visibilitychange', schedule);
 reduced.addEventListener('change', event => { if (event.matches) { paused = true; pauseLabel(); schedule(); } });
})();
