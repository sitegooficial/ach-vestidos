// ============================================
// ACH Vestidos - Script principal
// ============================================

// --- Menú móvil hamburguesa ---
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.menu');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('abierto');
      toggle.textContent = menu.classList.contains('abierto') ? '✕' : '☰';
    });

    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('abierto');
        toggle.textContent = '☰';
      });
    });
  }

  // Inicializa los enlaces de WhatsApp al cargar la página
  aplicarEnlacesWhatsApp();
});


// ============================================================
// 💬 SISTEMA DE MENSAJES DE WHATSAPP
// ------------------------------------------------------------
// Una sola función arma la URL con el mensaje correcto según:
//   - tipo:    "renta" | "compra" | "cita" | "destacado"
//   - vestido: nombre del vestido (no aplica a "cita")
//
// CÓMO AGREGAR UN VESTIDO NUEVO EN EL CATÁLOGO:
// --------------------------------------------
// 1. Copia una tarjeta <article class="vestido-card"> existente
//    en la sección que corresponda (Renta, Venta o Diseño).
// 2. Cambia la imagen, el <h3> (nombre del vestido) y el <p>.
// 3. En el botón <a class="btn btn-whatsapp"> SOLO ajusta:
//       data-wa="renta"        (o "compra" / "cita" / "destacado")
//       data-vestido="Nombre del vestido"
// 4. Listo. No tienes que tocar el mensaje a mano: este script
//    lo construye automáticamente al cargar la página.
//
// Ejemplo:
//   <a class="btn btn-whatsapp"
//      data-wa="renta"
//      data-vestido="Vestido Estrella">Consultar por WhatsApp</a>
// ============================================================

const WA_NUMERO = '5214521979099';

// Plantillas de mensajes (cada una recibe el nombre del vestido)
const WA_PLANTILLAS = {
  renta: (n) =>
    `¡Hola ACH Vestidos! Me interesaría rentar el vestido ${n} que vi en su catálogo. ` +
    `¿Me podrían decir disponibilidad, precio de renta y las fechas que tienen libres? ¡Gracias!`,

  compra: (n) =>
    `¡Hola ACH Vestidos! Me encantó el vestido ${n} y me gustaría comprarlo. ` +
    `¿Me podrían dar el precio, las tallas disponibles y cómo es el proceso de compra? ¡Gracias!`,

  cita: () =>
    `¡Hola ACH Vestidos! Me gustaría agendar una cita para platicar sobre un vestido hecho a medida. ` +
    `¿Qué días y horarios tienen disponibles? ¡Gracias!`,

  destacado: (n) =>
    `¡Hola ACH Vestidos! Vi el vestido ${n} en su página y me encantó. ` +
    `¿Me podrían dar más información sobre disponibilidad y precio? ¡Gracias!`,

  idea: () =>
    `¡Hola ACH Vestidos! Tengo una idea de vestido en mente y me gustaría que lo diseñen a mi medida. ` +
    `¿Podemos platicar?`,

  // --- Plantillas de ACH Makeup ---
  makeupExpress: () =>
    `¡Hola ACH Makeup! Me interesa el servicio de Maquillaje Express ($599) para mi evento. ` +
    `¿Me dan disponibilidad para agendar?`,

  makeupOndas: () =>
    `¡Hola ACH Makeup! Me interesa el servicio de Ondas o Alaciado ($250). ` +
    `¿Me dan disponibilidad para agendar?`,

  makeupCombo: () =>
    `¡Hola ACH Makeup! Me interesa el combo de Maquillaje Express + Ondas o Alaciado ($799). ` +
    `¿Me dan disponibilidad?`,

  makeupGlamour: () =>
    `¡Hola ACH Makeup! Estoy rentando un vestido y me interesa el Paquete Glamour ` +
    `(maquillaje + peinado por $700). ¿Me dan información?`,

  makeupAgenda: () =>
    `¡Hola ACH Makeup! Me gustaría agendar una cita para maquillaje y peinado. ` +
    `¿Qué disponibilidad tienen?`,

  makeupPersonalizado: () =>
    `¡Hola ACH Makeup! Me interesan sus opciones de maquillaje más sociales, de noche o glam. ` +
    `¿Me dan información?`
};

/**
 * Construye la URL de WhatsApp con el mensaje codificado.
 * @param {string} tipo    "renta" | "compra" | "cita" | "destacado"
 * @param {string} vestido Nombre del vestido (vacío para "cita")
 * @returns {string} URL lista para usar en un <a href="...">
 */
function whatsappACH(tipo, vestido = '') {
  const plantilla = WA_PLANTILLAS[tipo];
  if (!plantilla) return `https://wa.me/${WA_NUMERO}`;
  const mensaje = plantilla(vestido);
  return `https://wa.me/${WA_NUMERO}?text=${encodeURIComponent(mensaje)}`;
}

/**
 * Busca todos los <a data-wa="..."> de la página y les coloca
 * el href correcto. Se llama una vez al cargar.
 */
function aplicarEnlacesWhatsApp() {
  document.querySelectorAll('a[data-wa]').forEach(el => {
    const tipo = el.dataset.wa;
    const vestido = el.dataset.vestido || '';
    el.href = whatsappACH(tipo, vestido);
    el.target = '_blank';
    el.rel = 'noopener';
  });
}
