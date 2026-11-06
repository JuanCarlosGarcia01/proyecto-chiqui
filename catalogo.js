(() => {
 'use strict';
 const config = window.SITE_CONFIG || {};
 const company = config.empresa || 'Servicios de ingeniería';
 document.querySelectorAll('[data-company]').forEach(el => { el.textContent = company; });
 document.title = 'Equipos fotovoltaicos | ' + company;
 const whatsapp = /^\d{8,15}$/.test(config.whatsapp || '') ? config.whatsapp : '';
 const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.email || '') ? config.email : '';
 if (whatsapp || email) document.getElementById('solar-channel').textContent = 'Prepará el mensaje y continuá en ' + (whatsapp ? 'WhatsApp' : 'tu aplicación de correo') + ' para enviarlo. El equipo elegido quedará incluido.';
 const cards = [...document.querySelectorAll('.solar-product')];
 const products = new Map(cards.map(card => [card.id, {
  code: card.querySelector('h3').textContent,
  category: card.dataset.category,
  subcategory: card.querySelector('.eyebrow').textContent,
  note: card.querySelector('.product-note')?.textContent || ''
 }]));
 const search = document.getElementById('solar-search');
 const category = document.getElementById('solar-category');
 const result = document.getElementById('solar-results');
 const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
 const haystacks = new Map(cards.map(card => [card.id, normalize(card.textContent)]));
 function filter() {
  const terms = normalize(search.value).split(' ').filter(Boolean);
  let count = 0;
  cards.forEach(card => {
   const match = (!category.value || card.dataset.category === category.value) && terms.every(term => haystacks.get(card.id).includes(term));
   card.hidden = !match;
   if (match) count++;
  });
  result.textContent = count + (count === 1 ? ' resultado' : ' resultados') + ' de ' + cards.length + ' equipos y componentes';
  document.getElementById('solar-empty').hidden = count > 0;
 }
 document.getElementById('solar-filters').hidden = false;
 search.addEventListener('input', filter);
 category.addEventListener('change', filter);
 document.getElementById('solar-reset').addEventListener('click', () => { search.value = ''; category.value = ''; filter(); search.focus(); });
 const form = document.getElementById('solar-form');
 const equipment = document.getElementById('solar-equipment');
 const draft = document.getElementById('solar-draft');
 const status = document.getElementById('solar-status');
 const send = document.getElementById('solar-send');
 function invalidate() { draft.hidden = true; send.hidden = true; send.removeAttribute('href'); status.textContent = ''; }
 form.addEventListener('input', invalidate);
 form.addEventListener('change', invalidate);
 document.querySelectorAll('[data-product]').forEach(link => link.addEventListener('click', () => {
  equipment.value = link.dataset.product;
  invalidate();
 }));
 form.addEventListener('submit', event => {
  event.preventDefault();
  const product = products.get(equipment.value);
  const name = document.getElementById('solar-name').value.trim();
  const quantity = Number(document.getElementById('solar-quantity').value);
  if (!product || !name || !Number.isInteger(quantity) || quantity < 1 || quantity > 9999) {
   status.textContent = 'Elegí un equipo, completá tu nombre y una cantidad entera entre 1 y 9999.'; return;
  }
  const location = document.getElementById('solar-location').value.trim();
  const question = document.getElementById('solar-message').value.trim();
  const lines = ['Hola, quiero consultar por un equipo del catálogo fotovoltaico.', '',
   'Código / modelo: ' + product.code,
   'Categoría: ' + product.category + ' · ' + product.subcategory,
   'Cantidad: ' + quantity, 'Nombre: ' + name];
  if (location) lines.push('Localidad: ' + location);
  if (question) lines.push('', 'Consulta: ' + question);
  else lines.push('', 'Quisiera conocer disponibilidad y recibir asesoramiento sobre este equipo.');
  if (product.note) lines.push('', 'Dato técnico a confirmar: ' + product.note);
  const text = lines.join('\n');
  document.getElementById('solar-output').value = text;
  draft.hidden = false;
  send.hidden = !(whatsapp || email);
  if (whatsapp) {
   send.href = 'https://wa.me/' + whatsapp + '?text=' + encodeURIComponent(text);
   send.textContent = 'Abrir WhatsApp'; send.target = '_blank'; send.rel = 'noopener noreferrer';
  } else if (email) {
   send.href = 'mailto:' + email + '?subject=' + encodeURIComponent('Consulta fotovoltaica: ' + product.code) + '&body=' + encodeURIComponent(text);
   send.textContent = 'Abrir correo';
  }
  status.textContent = 'Mensaje preparado. Todavía no se envió.';
  document.getElementById('solar-output').focus();
 });
 document.getElementById('solar-copy').addEventListener('click', async () => {
  const output = document.getElementById('solar-output');
  try { await navigator.clipboard.writeText(output.value); status.textContent = 'Mensaje copiado.'; }
  catch { output.focus(); output.select(); status.textContent = 'Texto seleccionado. Usá la opción Copiar de tu dispositivo.'; }
 });
})();
