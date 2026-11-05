const config = window.SITE_CONFIG || {};
const company = config.empresa || 'Servicios de ingeniería';
document.querySelectorAll('[data-company]').forEach(el => el.textContent = company);
document.title = company + ' | Mediciones e inspecciones';
const whatsapp = /^\d{8,15}$/.test(config.whatsapp || '') ? config.whatsapp : '';
const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.email || '') ? config.email : '';
if (whatsapp || email) document.getElementById('contactNote').textContent = 'Prepará tu consulta y continuá en ' + (whatsapp ? 'WhatsApp' : 'tu aplicación de correo') + ' para enviarla.';
if (config.zona) { const area = document.getElementById('area'); area.textContent = 'Zona de atención: ' + config.zona; area.hidden = false; }
const form = document.getElementById('formContacto');
const service = document.getElementById('servicio');
const draft = document.getElementById('draft');
const status = document.getElementById('status');
function invalidateDraft() { draft.hidden = true; status.textContent = ''; }
form.addEventListener('input', invalidateDraft);
document.querySelectorAll('[data-service]').forEach(link => link.addEventListener('click', () => { service.value = link.dataset.service; invalidateDraft(); }));
form.addEventListener('submit', event => {
 event.preventDefault();
 const name = document.getElementById('nombre').value.trim();
 const message = document.getElementById('mensaje').value.trim();
 if (!name || message.length < 10) { status.textContent = 'Completá tu nombre y al menos 10 caracteres de consulta.'; return; }
 const text = `Hola, quisiera consultar por: ${service.value}.\n\nNombre: ${name}\nCorreo: ${document.getElementById('email').value.trim()}\n\n${message}`;
 document.getElementById('consulta').value = text;
 draft.hidden = false;
 const send = document.getElementById('sendLink');
 send.hidden = !(whatsapp || email);
 if (whatsapp) { send.href = 'https://wa.me/' + whatsapp + '?text=' + encodeURIComponent(text); send.textContent = 'Abrir WhatsApp'; send.target = '_blank'; send.rel = 'noopener noreferrer'; }
 else if (email) { send.href = 'mailto:' + email + '?subject=' + encodeURIComponent('Consulta: ' + service.value) + '&body=' + encodeURIComponent(text); send.textContent = 'Abrir correo'; }
 status.textContent = 'Consulta preparada. Todavía no se envió.';
 document.getElementById('consulta').focus();
});
document.getElementById('copyButton').addEventListener('click', async () => {
 const output = document.getElementById('consulta');
 try { await navigator.clipboard.writeText(output.value); status.textContent = 'Texto copiado. Podés pegarlo donde quieras enviarlo.'; }
 catch { output.focus(); output.select(); status.textContent = 'Seleccionamos el texto. Usá la opción Copiar de tu dispositivo.'; }
});
