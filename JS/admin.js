const mapaColores = {
  blanco: "#f8f9fa",
  naranja: "#fd7e14",
  gris: "#6c757d",
  azul: "#0d6efd",
  verde: "#198754",
  rojo: "#dc3545",
  café: "#795548",
};

const IMAGEN_GENERICA =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23dee2e6'/%3E%3Cpath d='M30 68l14-18 10 12 8-10 14 16H30z' fill='%23adb5bd'/%3E%3Ccircle cx='38' cy='38' r='6' fill='%23adb5bd'/%3E%3C/svg%3E";

const tablaBody = document.getElementById("cuerpo-tabla");

function generarHTMLTooltip(variantesStock) {
  const agrupado = {};

  variantesStock.forEach((v) => {
    if (!agrupado[v.color]) agrupado[v.color] = [];
    agrupado[v.color].push(`${v.talla}: ${v.cantidad}`);
  });

  let html = `<div class='text-start p-1'><strong class='border-bottom d-block mb-1 pb-1'>Stock por Variación:</strong>`;
  for (const [color, detalle] of Object.entries(agrupado)) {
    html += `<div><strong class='text-capitalize'>${color}:</strong> ${detalle.join(" | ")}</div>`;
  }
  html += `</div>`;

  return html;
}

function renderizarTabla(lista) {
  if (!tablaBody) return;
  tablaBody.innerHTML = "";

  lista.forEach((producto, index) => {
    const fila = document.createElement("tr");
    fila.dataset.tallas = (producto.tallas || []).join(",");
    fila.dataset.colores = (producto.colores || []).join(",");

    const coloresProd = producto.colores || [];
    const tallasProd = producto.tallas || [];
    const htmlPuntosColor = coloresProd
      .slice(0, 4)
      .map((color) => {
        const bg = mapaColores[color.toLowerCase()] || "#adb5bd";
        return `<span class="resumen-color-dot" style="background-color: ${bg};" title="${color}"></span>`;
      })
      .join("");
    const htmlExtraColor =
      coloresProd.length > 4
        ? `<span class="resumen-color-extra">+${coloresProd.length - 4}</span>`
        : "";
    const textoResumen = `${tallasProd.length} ${tallasProd.length === 1 ? "talla" : "tallas"} · ${coloresProd.length} ${coloresProd.length === 1 ? "color" : "colores"}`;

    const rutaImg = !producto.imagen
      ? IMAGEN_GENERICA
      : producto.imagen.startsWith("data:")
        ? producto.imagen
        : `../../${producto.imagen}`;

    fila.innerHTML = `
      <th class="text-center align-middle">${index + 1}</th>
      <td class="text-center align-middle">
        <img src="${rutaImg}" alt="${producto.nombre}" class="img-thumbnail" style="width: 50px; height: 50px; object-fit: cover;">
      </td>
      <td class="align-middle fw-semibold">${producto.nombre}</td>
      <td class="align-middle fw-bold" style="color: var(--tomato);">$${producto.precio.toLocaleString("es-CO")}</td>
      <td class="align-middle">
        <span class="badge bg-secondary p-2">${producto.stock}</span>
      </td>
      <td class="align-middle">
        <div class="d-flex flex-column gap-1">
          <div class="d-flex align-items-center gap-1">${htmlPuntosColor}${htmlExtraColor}</div>
          <span class="resumen-conteo">${textoResumen}</span>
        </div>
      </td>
      <td class="align-middle text-center">
        <button type="button" class="btn btn-sm btn-glaucous" onclick="verVariantes(${producto.id})">
          <i class="bi bi-grid"></i>Detalle
        </button>
      </td>
      <td class="align-middle text-center">
        <div class="d-inline-flex gap-1">
          <button type="button" class="btn btn-sm btn-accion-tomato" onclick="editarProducto(${producto.id})" title="Editar">
            <i class="bi bi-pencil"></i>
          </button>
          <button type="button" class="btn btn-sm btn-accion-tomato btn-accion-eliminar" onclick="abrirModalEliminar(${producto.id})" title="Eliminar">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </td>
    `;

    tablaBody.appendChild(fila);
  });
  inicializarTooltips();
  prepararFiltros();
}

function inicializarTooltips() {
  const tooltipTriggerList = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]',
  );
  [...tooltipTriggerList].map(
    (tooltipTriggerEl) =>
      new bootstrap.Tooltip(tooltipTriggerEl, { sanitize: false }),
  );
}

document.addEventListener("DOMContentLoaded", () => {
  renderizarTabla(productos);
});

const buscador = document.querySelector("#buscador");
const selectTalla = document.querySelector("#filtroTalla");
const selectColor = document.querySelector("#filtroColor");

const quitarTildes = (str) => {
  // (str) hace referencia a string la palabra que entra
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // normalize("NFD") separa la letra de la tilde ej: entra (café) sale (cafe´) cambia (.replace()) todas las tildes, diéresis o sombreritos ([\u0300-\u036f]) por nada ("")
};

// guardamos en una array un objeto que contiene todos los datos de las filas (columnas) que necesitamos para filtrar
let datosTabla = [];
let fuse = null;

// construye el índice con las filas que YA están pintadas en la tabla
function prepararFiltros() {
  const filas = document.querySelectorAll("#cuerpo-tabla tr");

  datosTabla = Array.from(filas).map((fila, index) => {
    const celdas = fila.querySelectorAll("td");

    // celdas: [0] miniatura, [1] nombre, [2] precio, [3] stock, [4] variantes, [5] acciones
    const arrayTallas = (fila.dataset.tallas || "")
      .split(",")
      .filter(Boolean)
      .map((t) => t.trim().toLowerCase());
    const arrayColores = (fila.dataset.colores || "")
      .split(",")
      .filter(Boolean)
      .map((c) => quitarTildes(c.trim().toLowerCase()));

    return {
      indice: index,
      nombre: quitarTildes(celdas[1].textContent.trim().toLowerCase()),
      tallas: arrayTallas,
      colores: arrayColores,
    };
  });

  fuse =
    typeof Fuse !== "undefined" && datosTabla.length > 0
      ? new Fuse(datosTabla, {
          keys: ["nombre"],
          threshold: 0.3,
          ignoreLocation: true,
        })
      : null;

  filtrarAdmin(); // vuelve a aplicar los filtros que estén activos
}

function filtrarAdmin() {
  if (!buscador || !selectTalla || !selectColor) return;

  const filas = document.querySelectorAll("#cuerpo-tabla tr");

  const texto = quitarTildes(buscador.value.trim().toLowerCase());
  const tallaBuscada = selectTalla.value.toLowerCase();
  const colorBuscado = quitarTildes(selectColor.value.toLowerCase());

  let indicesValidosTexto = [];
  if (texto && fuse) {
    indicesValidosTexto = fuse.search(texto).map((r) => r.item.indice);
  }

  filas.forEach((fila, index) => {
    if (!datosTabla[index]) return;

    const cumpleTexto = texto === "" || indicesValidosTexto.includes(index);
    const cumpleTalla =
      tallaBuscada === "" || datosTabla[index].tallas.includes(tallaBuscada);
    const cumpleColor =
      colorBuscado === "" || datosTabla[index].colores.includes(colorBuscado);

    fila.hidden = !(cumpleTexto && cumpleTalla && cumpleColor);
  });
}

if (buscador) buscador.addEventListener("input", filtrarAdmin);
if (selectTalla) selectTalla.addEventListener("change", filtrarAdmin);
if (selectColor) selectColor.addEventListener("change", filtrarAdmin);

const btnLimpiarFiltros = document.querySelector("#btn-limpiar-filtros");
if (btnLimpiarFiltros) {
  btnLimpiarFiltros.addEventListener("click", () => {
    if (buscador) buscador.value = "";
    if (selectTalla) selectTalla.value = "";
    if (selectColor) selectColor.value = "";
    filtrarAdmin();
  });
}

const tallas = {
  camiseta: ["S", "M", "L", "XL"],
  medias: ["23-26", "27-30", "31-34", "35-37", "38-40", "41-43", "44-46"],
  gorra: ["S", "M", "L"],
};

const categoria = document.querySelector("#categoria");
const talla = document.querySelector("#talla");
const colorContenedor = document.querySelector("#color");

function obtenerTallasSeleccionadas() {
  return Array.from(document.querySelectorAll("#talla .chip-talla.activo")).map(
    (btn) => btn.dataset.talla,
  );
}

function obtenerColoresSeleccionados() {
  return Array.from(
    document.querySelectorAll("#color .color-swatch.activo"),
  ).map((btn) => btn.dataset.color);
}

function limpiarSeleccionColores() {
  document
    .querySelectorAll("#color .color-swatch.activo")
    .forEach((btn) => btn.classList.remove("activo"));
}

function mostrarPreviewImagen(src) {
  const preview = document.getElementById("preview-imagen");
  const placeholder = document.getElementById("dropzone-placeholder");
  if (!preview || !placeholder) return;

  if (src) {
    preview.src = src;
    preview.classList.remove("d-none");
    placeholder.classList.add("d-none");
  } else {
    preview.removeAttribute("src");
    preview.classList.add("d-none");
    placeholder.classList.remove("d-none");
  }
}

function mostrarTallas(tallasSeleccionar = null) {
  if (!categoria || !talla) return;

  const tallasPrevias = Array.isArray(tallasSeleccionar)
    ? tallasSeleccionar
    : obtenerTallasSeleccionadas();

  const opcionesBase = tallas[categoria.value] || [];
  const opciones = Array.isArray(tallasSeleccionar)
    ? [...new Set([...opcionesBase, ...tallasSeleccionar])]
    : opcionesBase;

  if (opciones.length === 0) {
    talla.innerHTML =
      '<span class="small text-secondary">Selecciona un tipo de prenda para ver las tallas.</span>';
    actualizarInputsDeStock();
    return;
  }

  talla.innerHTML = opciones
    .map(
      (valor) =>
        `<button type="button" class="chip-talla${tallasPrevias.includes(valor) ? " activo" : ""}" data-talla="${valor}">${valor}</button>`,
    )
    .join("");

  actualizarInputsDeStock();
}

if (categoria) {
  categoria.addEventListener("change", () => mostrarTallas());
}

if (talla) {
  talla.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip-talla");
    if (!chip) return;
    chip.classList.toggle("activo");
    actualizarInputsDeStock();
  });
}

if (colorContenedor) {
  colorContenedor.addEventListener("click", (e) => {
    const swatch = e.target.closest(".color-swatch");
    if (!swatch) return;
    swatch.classList.toggle("activo");
    actualizarInputsDeStock();
  });
}

const inputImagenEl = document.getElementById("imagen");
const dropzoneImagenEl = document.getElementById("dropzone-imagen");

if (inputImagenEl) {
  inputImagenEl.addEventListener("change", async () => {
    if (inputImagenEl.files && inputImagenEl.files.length > 0) {
      const base64 = await convertirImagenABase64(inputImagenEl.files[0]);
      mostrarPreviewImagen(base64);
    }
  });
}

if (dropzoneImagenEl && inputImagenEl) {
  dropzoneImagenEl.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzoneImagenEl.classList.add("dragover");
  });

  dropzoneImagenEl.addEventListener("dragleave", () => {
    dropzoneImagenEl.classList.remove("dragover");
  });

  dropzoneImagenEl.addEventListener("drop", async (e) => {
    e.preventDefault();
    dropzoneImagenEl.classList.remove("dragover");
    const archivo = e.dataTransfer?.files?.[0];
    if (!archivo || !archivo.type.startsWith("image/")) return;

    const dt = new DataTransfer();
    dt.items.add(archivo);
    inputImagenEl.files = dt.files;

    const base64 = await convertirImagenABase64(archivo);
    mostrarPreviewImagen(base64);
  });
}

const convertirImagenABase64 = (archivo) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(archivo); // Convierte la imagen a URL Base64
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const formularioProducto = document.getElementById("formulario-producto");

async function guardarProducto(e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const precio = parseFloat(document.getElementById("precio").value);

  const coloresSeleccionados = obtenerColoresSeleccionados();
  const tallasSeleccionadas = obtenerTallasSeleccionadas();

  //inicializar el array de variantes que guardara un objeto para las diferentes variantes ej: {color: azul talla: XL cantidad: 20}
  let variantesStockSeleccionadas = [];
  //stock total es la suma de stock para X producto ejemplo: camiseta oversize: cantidad 30 {color:azul talla: M cantidad:10} {color:azul talla: XL cantidad:10} {color:rojo talla: S cantidad:10}
  let stockTotalCalculado = 0;
  const inputsVariantes = document.querySelectorAll(".input-stock-variante");

  inputsVariantes.forEach((input) => {
    const cantidad = parseInt(input.value) || 0;
    const color = input.getAttribute("data-color");
    const talla = input.getAttribute("data-talla");

    if (cantidad > 0) {
      variantesStockSeleccionadas.push({ color, talla, cantidad: cantidad });
      stockTotalCalculado += cantidad;
    }
  });

  // validar que los campos no esten vacios
  if (
    !nombre ||
    isNaN(precio) ||
    tallasSeleccionadas.length === 0 ||
    coloresSeleccionados.length === 0
  ) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  if (variantesStockSeleccionadas.length === 0) {
    alert(
      "Debes asignar una cantidad de stock a al menos una variante de color/talla.",
    );
    return;
  }

  const inputImagen = document.getElementById("imagen");
  let rutaImagen = null;
  // Este código genera un icono de imagen genérica gris directamente en el navegador

  if (inputImagen.files && inputImagen.files.length > 0) {
    try {
      // Esperamos a que la imagen se convierta a texto Base64
      rutaImagen = await convertirImagenABase64(inputImagen.files[0]);
    } catch (error) {
      console.error("Error al procesar la imagen: ", error);
      alert("Hubo un problema al cargar la imagen.");
      return;
    }
  }

  if (productoIdEnEdicion !== null) {
    //UPDATE
    const index = productos.findIndex((p) => p.id === productoIdEnEdicion);

    if (index !== -1) {
      // Actualizamos los datos del producto
      productos[index].nombre = nombre;
      if (categoria && tallas[categoria.value]) {
        productos[index].categoria = categoria.value;
      }
      productos[index].precio = precio;
      productos[index].stock = stockTotalCalculado;
      productos[index].tallas = tallasSeleccionadas;
      productos[index].colores = coloresSeleccionados;
      productos[index].variantesStock = variantesStockSeleccionadas;

      // Solo actualizamos la imagen si el usuario seleccionó una nueva
      if (rutaImagen) {
        productos[index].imagen = rutaImagen;
      } else if (!productos[index].imagen) {
        productos[index].imagen = IMAGEN_GENERICA;
      }
    }

    localStorage.setItem("misProductos_v4", JSON.stringify(productos));

    //limpiar el form despues de actualizar para poder crear si se desea
    productoIdEnEdicion = null;
    const btnSubmit = document.querySelector(
      "#formulario-producto input[type='submit']",
    );
    if (btnSubmit) btnSubmit.value = "Guardar producto";

    formularioProducto.reset();
    limpiarSeleccionColores();
    mostrarTallas([]);
    mostrarPreviewImagen(null);
  } else {
    //CREAR

    // crear ID consecutivo
    const nuevoId =
      productos.length > 0 ? Math.max(...productos.map((p) => p.id)) + 1 : 1; // busca el ID más alto y le suma 1, si la lista esta vacia, empieza en 1

    // crear objeto
    const nuevoProducto = {
      id: nuevoId,
      nombre: nombre,
      categoria: categoria.value,
      precio: precio,
      imagen: rutaImagen || IMAGEN_GENERICA,
      stock: stockTotalCalculado,
      tallas: tallasSeleccionadas,
      colores: coloresSeleccionados,
      variantesStock: variantesStockSeleccionadas,
    };

    // agregar al array
    productos.push(nuevoProducto);

    // actualizar el local storage
    localStorage.setItem("misProductos_v4", JSON.stringify(productos));

    formularioProducto.reset();
    limpiarSeleccionColores();
    mostrarTallas([]);
    mostrarPreviewImagen(null);

    alert("Producto agregado y guardado correctamente");
  }

  const modalProductoEl = document.getElementById("modalProducto");
  if (modalProductoEl && typeof bootstrap !== "undefined") {
    bootstrap.Modal.getOrCreateInstance(modalProductoEl).hide();
  }

  // actualizar el "canva" dom
  renderizarTabla(productos);
}

if (formularioProducto) {
  formularioProducto.addEventListener("submit", guardarProducto);
}

const contenedorVariantes = document.getElementById("contenedor-variantes");

function actualizarInputsDeStock() {
  const contenedorVariantes = document.getElementById("contenedor-variantes");

  if (!contenedorVariantes) {
    console.error("Error: No se encontró el #contenedor-variantes en el HTML.");
    return;
  }

  const coloresArray = obtenerColoresSeleccionados();
  const tallasArray = obtenerTallasSeleccionadas();

  // Si falta alguno, mostrar el mensaje de ayuda con color blanco forzado (!important)
  if (coloresArray.length === 0 || tallasArray.length === 0) {
    contenedorVariantes.innerHTML =
      '<span style="color: #ffffff !important; font-size: 14px;">Selecciona tallas y colores para asignar el stock.</span>';
    return;
  }

  const valoresPrevios = {};
  contenedorVariantes
    .querySelectorAll(".input-stock-variante")
    .forEach((input) => {
      const clave = `${normalizar(input.dataset.color)}__${normalizar(input.dataset.talla)}`;
      valoresPrevios[clave] = input.value;
    });

  contenedorVariantes.innerHTML = "";

  let htmlVariantes = "";

  // generar los inputs por cada combinacion de talla y color
  coloresArray.forEach((color) => {
    tallasArray.forEach((talla) => {
      const clave = `${normalizar(color)}__${normalizar(talla)}`;
      const valorActual =
        valoresPrevios[clave] !== undefined ? valoresPrevios[clave] : "0";
      htmlVariantes += `
        <div class="d-flex justify-content-between align-items-center bg-secondary p-2 rounded mb-2">
          <label class="mb-0 text-white text-capitalize" style="color: #ffffff !important;">${color} - Talla ${talla}</label>
          <input type="number" min="0" class="form-control form-control-sm input-stock-variante"
                 style="width: 100px;"
                 data-color="${color}"
                 data-talla="${talla}"
                 value="${valorActual}" required>
        </div>
      `;
    });
  });

  contenedorVariantes.innerHTML = htmlVariantes;
}

// variable "bandera" para saber si se esta creando o actualizando
let productoIdEnEdicion = null;

const normalizar = (texto) => quitarTildes(String(texto).trim().toLowerCase());

function obtenerCategoriaProducto(producto) {
  if (producto.categoria && tallas[producto.categoria]) {
    return producto.categoria;
  }
  const nombreNorm = normalizar(producto.nombre || "");
  if (nombreNorm.includes("camiseta") || nombreNorm.includes("camisa")) {
    return "camiseta";
  }
  if (nombreNorm.includes("gorra")) {
    return "gorra";
  }
  if (nombreNorm.includes("media")) {
    return "medias";
  }
  const tallasProducto = producto.tallas || [];
  if (tallasProducto.some((t) => tallas.medias.includes(t))) {
    return "medias";
  }
  if (tallasProducto.some((t) => tallas.camiseta.includes(t))) {
    return "camiseta";
  }
  return "";
}

function editarProducto(id) {
  // buscamos el producto en el array
  const producto = productos.find((p) => p.id === id);
  if (!producto) return;

  // bandera: estamos editando
  productoIdEnEdicion = id;

  if (contenedorVariantes) {
    contenedorVariantes.innerHTML = "";
  }

  // datos básicos
  document.getElementById("nombre").value = producto.nombre;
  document.getElementById("precio").value = producto.precio;

  const categoriaProducto = obtenerCategoriaProducto(producto);
  if (categoria) {
    if (categoriaProducto && tallas[categoriaProducto]) {
      categoria.value = categoriaProducto;
    } else {
      categoria.selectedIndex = 0;
    }
  }

  // minúscula para que coincida con el value del select
  const colores = (producto.colores || []).map((c) => c.toLowerCase());

  limpiarSeleccionColores();
  document.querySelectorAll("#color .color-swatch").forEach((btn) => {
    if (colores.includes(btn.dataset.color.toLowerCase())) {
      btn.classList.add("activo");
    }
  });

  mostrarTallas(producto.tallas || []);

  // llenamos el stock guardado (sin setTimeout: los inputs ya existen)
  const variantes = producto.variantesStock || [];
  document.querySelectorAll(".input-stock-variante").forEach((input) => {
    const variante = variantes.find(
      (v) =>
        normalizar(v.color) === normalizar(input.dataset.color) &&
        normalizar(v.talla) === normalizar(input.dataset.talla),
    );
    input.value = variante ? variante.cantidad : 0;
  });

  const rutaImg = !producto.imagen
    ? null
    : producto.imagen.startsWith("data:")
      ? producto.imagen
      : `../../${producto.imagen}`;
  mostrarPreviewImagen(rutaImg);

  // el submit es un <input>, así que se cambia su value
  const btnSubmit = document.querySelector(
    "#formulario-producto input[type='submit']",
  );
  if (btnSubmit) btnSubmit.value = "Actualizar Producto";

  const tituloModal = document.getElementById("modalProductoTitulo");
  if (tituloModal) tituloModal.textContent = "Editar producto";

  const modalProductoEl = document.getElementById("modalProducto");
  if (modalProductoEl && typeof bootstrap !== "undefined") {
    bootstrap.Modal.getOrCreateInstance(modalProductoEl).show();
  }
}

function abrirModalCrear() {
  productoIdEnEdicion = null;

  if (formularioProducto) formularioProducto.reset();
  if (categoria) categoria.selectedIndex = 0;
  limpiarSeleccionColores();
  if (contenedorVariantes) contenedorVariantes.innerHTML = "";
  mostrarTallas([]);
  mostrarPreviewImagen(null);

  const btnSubmit = document.querySelector(
    "#formulario-producto input[type='submit']",
  );
  if (btnSubmit) btnSubmit.value = "Guardar producto";

  const tituloModal = document.getElementById("modalProductoTitulo");
  if (tituloModal) tituloModal.textContent = "Nuevo producto";

  const modalProductoEl = document.getElementById("modalProducto");
  if (modalProductoEl && typeof bootstrap !== "undefined") {
    bootstrap.Modal.getOrCreateInstance(modalProductoEl).show();
  }
}

function verVariantes(id) {
  const producto = productos.find((p) => p.id === id);
  if (!producto) return;

  const titulo = document.getElementById("modalVariantesTitulo");
  const contenido = document.getElementById("contenido-variantes");
  if (!contenido) return;

  if (titulo) titulo.textContent = `Variantes — ${producto.nombre}`;

  const htmlTallas = (producto.tallas || [])
    .map((t) => `<span class="badge bg-secondary me-1">${t}</span>`)
    .join("");

  const htmlColores = (producto.colores || [])
    .map((c) => {
      const bg = mapaColores[c.toLowerCase()] || "#adb5bd";
      return `<span class="badge bg-dark text-light border border-secondary me-1 mb-1 text-capitalize d-inline-flex align-items-center gap-1">
        <span class="d-inline-block rounded-circle border" style="width: 12px; height: 12px; background-color: ${bg};"></span>
        ${c}
      </span>`;
    })
    .join("");

  const variantes = producto.variantesStock || [];
  let htmlStock = "";
  if (variantes.length > 0) {
    const filas = variantes
      .map(
        (v) => `
          <tr>
            <td class="text-capitalize">${v.color}</td>
            <td>${v.talla}</td>
            <td class="fw-semibold">${v.cantidad}</td>
          </tr>
        `,
      )
      .join("");
    htmlStock = `
      <h6 class="mt-3 mb-2">Stock por variante</h6>
      <table class="table table-dark table-sm table-bordered mb-0">
        <thead>
          <tr>
            <th>Color</th>
            <th>Talla</th>
            <th>Cantidad</th>
          </tr>
        </thead>
        <tbody>${filas}</tbody>
      </table>
    `;
  }

  contenido.innerHTML = `
    <div class="mb-2"><strong>Tallas:</strong> ${htmlTallas || "Sin tallas"}</div>
    <div class="mb-2"><strong>Colores:</strong> ${htmlColores || "Sin colores"}</div>
    ${htmlStock}
  `;

  const modalVariantesEl = document.getElementById("modalVariantes");
  if (modalVariantesEl && typeof bootstrap !== "undefined") {
    bootstrap.Modal.getOrCreateInstance(modalVariantesEl).show();
  }
}

let productoIdAEliminar = null;

function abrirModalEliminar(id) {
  const producto = productos.find((p) => p.id === id);
  if (!producto) return;

  productoIdAEliminar = id;

  const nombreEl = document.getElementById("eliminar-nombre");
  if (nombreEl) nombreEl.textContent = producto.nombre;

  const modalEliminarEl = document.getElementById("modalEliminar");
  if (modalEliminarEl && typeof bootstrap !== "undefined") {
    bootstrap.Modal.getOrCreateInstance(modalEliminarEl).show();
  }
}

function confirmarEliminar() {
  if (productoIdAEliminar === null) return;

  const index = productos.findIndex((p) => p.id === productoIdAEliminar);
  if (index !== -1) {
    productos.splice(index, 1);
    localStorage.setItem("misProductos_v4", JSON.stringify(productos));
    renderizarTabla(productos);
  }

  productoIdAEliminar = null;

  const modalEliminarEl = document.getElementById("modalEliminar");
  if (modalEliminarEl && typeof bootstrap !== "undefined") {
    bootstrap.Modal.getOrCreateInstance(modalEliminarEl).hide();
  }
}
