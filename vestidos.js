// ============================================================
// 👗 CATÁLOGO DE VESTIDOS - ACH Vestidos
// ------------------------------------------------------------
// CÓMO AGREGAR UN VESTIDO NUEVO:
// 1. Copia el bloque de un vestido de ejemplo (todo lo que va
//    entre llaves { ... }, incluyendo la coma final).
// 2. Pégalo dentro del arreglo VESTIDOS, antes del comentario
//    "AÑADE MÁS VESTIDOS DEBAJO".
// 3. Cambia los campos:
//      - nombre:      Nombre que verá la clienta. Ej: "Magnolia"
//      - tipo:        Por ahora todos los vestidos son "ambos"
//                     (disponibles tanto para renta como para venta).
//      - fotos:       Lista de hasta 4 nombres de archivo dentro
//                     de la carpeta imagenes/. La primera foto
//                     es la que se muestra en la tarjeta.
//      - precioRenta: Texto del precio de renta. Ej: "$800"
//      - precioVenta: Texto del precio de venta. Ej: "$2,500"
//      - descripcion: Texto corto (no se muestra en la tarjeta,
//                     queda guardado para usarlo después).
// 4. Guarda el archivo y recarga la página. Listo.
// ============================================================

const VESTIDOS = [

  // ----- VESTIDO DE EJEMPLO 1 -----
  {
    nombre: "Magnolia",
    tipo: "ambos",
    fotos: ["magnolia-1.jpg", "magnolia-2.jpg", "magnolia-3.jpg", "magnolia-4.jpg"],
    precioRenta: "$800",
    precioVenta: "$2,500",
    descripcion: "Largo, estilo princesa con detalles brillantes. Ideal para XV años."
  },

  // ----- VESTIDO DE EJEMPLO 2 -----
  {
    nombre: "Dalia",
    tipo: "ambos",
    fotos: ["dalia-1.jpg", "dalia-2.jpg", "dalia-3.jpg", "dalia-4.jpg"],
    precioRenta: "$650",
    precioVenta: "$2,100",
    descripcion: "Tono durazno suave con corsé bordado a mano."
  },

  // ----- VESTIDO DE EJEMPLO 3 -----
  {
    nombre: "Camelia",
    tipo: "ambos",
    fotos: ["camelia-1.jpg", "camelia-2.jpg", "camelia-3.jpg", "camelia-4.jpg"],
    precioRenta: "$900",
    precioVenta: "$3,200",
    descripcion: "Color crema con falda vaporosa de tul, perfecto para civiles."
  }

  // ----- AÑADE MÁS VESTIDOS DEBAJO (no olvides la coma del anterior) -----

];


// ============================================================
//  Lo de abajo NO necesitas tocarlo:
//  arma las tarjetas y las pinta dentro de #catalogo-vestidos.
// ============================================================

// Etiqueta visible para cada tipo (badge en la tarjeta)
const TIPO_LABEL = {
  ambos: "Renta y venta",
  renta: "Renta",
  venta: "Venta"
};

// Tipo de mensaje de WhatsApp para cada caso
//   "ambos" usa el mensaje genérico (destacado)
//   "renta" / "venta" usan los específicos
const TIPO_WA = {
  ambos: "destacado",
  renta: "renta",
  venta: "compra"
};

function escaparHTML(txt) {
  return String(txt).replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
}

function urlFoto(nombreArchivo, nombreVestido) {
  if (nombreArchivo) return `imagenes/${nombreArchivo}`;
  return `https://placehold.co/600x800/f4d6d6/c98a8a?text=${encodeURIComponent(nombreVestido)}`;
}

function placeholderFoto(nombreVestido) {
  return `https://placehold.co/600x800/f4d6d6/c98a8a?text=${encodeURIComponent(nombreVestido)}`;
}

function tarjetaVestido(v, idx) {
  const foto = (v.fotos && v.fotos[0]) ? v.fotos[0] : "";
  const nombreSeg = escaparHTML(v.nombre);
  const tipoLabel = TIPO_LABEL[v.tipo] || "";

  return `
    <div class="vestido-card vestido-card-link"
         data-idx="${idx}"
         tabindex="0"
         role="button"
         aria-label="Ver detalles de ${nombreSeg}">
      <span class="vestido-tipo-badge vestido-tipo-${v.tipo}">${tipoLabel}</span>
      <img class="vestido-imagen"
           src="${urlFoto(foto, v.nombre)}"
           onerror="this.onerror=null;this.src='${placeholderFoto(v.nombre)}'"
           alt="Vestido ${nombreSeg}"
           loading="lazy" />
      <div class="vestido-info">
        <h3>${nombreSeg}</h3>
      </div>
    </div>
  `;
}

function renderizarCatalogo() {
  const cont = document.getElementById("catalogo-vestidos");
  if (!cont) return;
  cont.innerHTML = VESTIDOS.map((v, i) => tarjetaVestido(v, i)).join("");

  // Cada tarjeta abre el modal con el vestido correspondiente
  cont.querySelectorAll(".vestido-card-link").forEach(card => {
    card.addEventListener("click", () => {
      const idx = Number(card.dataset.idx);
      abrirModalVestido(VESTIDOS[idx]);
    });
    card.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const idx = Number(card.dataset.idx);
        abrirModalVestido(VESTIDOS[idx]);
      }
    });
  });
}


// ============================================================
// 🪟 MODAL DE DETALLE DEL VESTIDO
// Se inyecta una sola vez al cargar y se reutiliza.
// ============================================================

// ------------------------------------------------------------
// 💬 Función única que arma la URL de WhatsApp para los botones
//    de acción del modal.
//    accion: "renta" | "venta"
//    nombre: nombre del vestido (se inserta en el mensaje)
// ------------------------------------------------------------
const WA_NUMERO_MODAL = "5214521979099";

function urlWhatsAppAccion(accion, nombre) {
  const plantillas = {
    renta: `¡Hola ACH Vestidos! Me interesa rentar el vestido ${nombre}.\n` +
           `¿Me dan disponibilidad, precio y fechas? ¡Gracias!`,
    venta: `¡Hola ACH Vestidos! Me gustaría comprar el vestido ${nombre}.\n` +
           `¿Me dan tallas y proceso de compra? ¡Gracias!`
  };
  const mensaje = plantillas[accion] || "";
  return `https://wa.me/${WA_NUMERO_MODAL}?text=${encodeURIComponent(mensaje)}`;
}

function crearModal() {
  if (document.getElementById("modal-vestido")) return;

  const modal = document.createElement("div");
  modal.id = "modal-vestido";
  modal.className = "modal-overlay";
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML = `
    <div class="modal-contenido" role="dialog" aria-modal="true" aria-labelledby="modal-titulo">
      <button class="modal-cerrar" type="button" aria-label="Cerrar">✕</button>

      <div class="modal-galeria">
        <img class="modal-foto-principal" alt="" />
        <div class="modal-miniaturas"></div>
      </div>

      <div class="modal-info">
        <span class="vestido-tipo-badge modal-badge"></span>
        <h2 id="modal-titulo"></h2>
        <p class="modal-descripcion"></p>
        <div class="modal-precios"></div>
        <div class="modal-acciones"></div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // Cerrar con X
  modal.querySelector(".modal-cerrar").addEventListener("click", cerrarModalVestido);

  // Cerrar al hacer clic en el fondo (fuera del contenido)
  modal.addEventListener("click", e => {
    if (e.target === modal) cerrarModalVestido();
  });

  // Cerrar con Escape
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && modal.classList.contains("abierto")) {
      cerrarModalVestido();
    }
  });
}

function abrirModalVestido(v) {
  crearModal();
  const modal = document.getElementById("modal-vestido");

  // Galería: foto principal + miniaturas
  const fotos = (v.fotos && v.fotos.length) ? v.fotos : [""];
  const principal = modal.querySelector(".modal-foto-principal");
  principal.src = urlFoto(fotos[0], v.nombre);
  principal.onerror = function() { this.onerror = null; this.src = placeholderFoto(v.nombre); };
  principal.alt = `Vestido ${v.nombre}`;

  const minisCont = modal.querySelector(".modal-miniaturas");
  minisCont.innerHTML = fotos.map((f, i) => `
    <button type="button"
            class="modal-miniatura${i === 0 ? " activa" : ""}"
            data-src="${urlFoto(f, v.nombre)}"
            aria-label="Foto ${i + 1}">
      <img src="${urlFoto(f, v.nombre)}"
           onerror="this.onerror=null;this.src='${placeholderFoto(v.nombre)}'"
           alt="" />
    </button>
  `).join("");

  minisCont.querySelectorAll(".modal-miniatura").forEach(btn => {
    btn.addEventListener("click", () => {
      principal.src = btn.dataset.src;
      minisCont.querySelectorAll(".modal-miniatura").forEach(b => b.classList.remove("activa"));
      btn.classList.add("activa");
    });
  });

  // Badge de tipo
  const badge = modal.querySelector(".modal-badge");
  badge.textContent = TIPO_LABEL[v.tipo] || "";
  badge.className = `vestido-tipo-badge modal-badge vestido-tipo-${v.tipo}`;

  // Texto
  modal.querySelector("#modal-titulo").textContent = v.nombre;
  modal.querySelector(".modal-descripcion").textContent = v.descripcion || "";

  // Precios (solo los que aplican)
  const precios = [];
  if (v.precioRenta) precios.push(`<div class="modal-precio"><span class="modal-precio-label">Renta</span><span class="modal-precio-valor">${escaparHTML(v.precioRenta)}</span></div>`);
  if (v.precioVenta) precios.push(`<div class="modal-precio"><span class="modal-precio-label">Venta</span><span class="modal-precio-valor">${escaparHTML(v.precioVenta)}</span></div>`);
  modal.querySelector(".modal-precios").innerHTML = precios.join("");

  // Botones de acción (renta / venta) según el tipo del vestido
  const acciones = [];
  if (v.tipo === "ambos" || v.tipo === "renta") {
    acciones.push(
      `<a class="btn btn-whatsapp"
          href="${urlWhatsAppAccion("renta", v.nombre)}"
          target="_blank" rel="noopener">
         Rentar este vestido
       </a>`
    );
  }
  if (v.tipo === "ambos" || v.tipo === "venta") {
    acciones.push(
      `<a class="btn btn-whatsapp"
          href="${urlWhatsAppAccion("venta", v.nombre)}"
          target="_blank" rel="noopener">
         Comprar este vestido
       </a>`
    );
  }
  modal.querySelector(".modal-acciones").innerHTML = acciones.join("");

  // Mostrar
  modal.classList.add("abierto");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-abierto");
}

function cerrarModalVestido() {
  const modal = document.getElementById("modal-vestido");
  if (!modal) return;
  modal.classList.remove("abierto");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-abierto");
}

document.addEventListener("DOMContentLoaded", renderizarCatalogo);
