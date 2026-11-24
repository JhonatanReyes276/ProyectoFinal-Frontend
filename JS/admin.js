const mapaColores = {
  blanco: { bg: "#f8f9fa", text: "#212529" },
  naranja: { bg: "#fd7e14", text: "#ffffff" },
  gris: { bg: "#6c757d", text: "#ffffff" },
  azul: { bg: "#0d6efd", text: "#ffffff" },
  verde: { bg: "#198754", text: "#ffffff" },
  rojo: { bg: "#dc3545", text: "#ffffff" },
  café: { bg: "#795548", text: "#ffffff" },
};

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

    const htmlTallas = producto.tallas
      .map((talla) => `<span class="badge bg-secondary me-1">${talla}</span>`)
      .join("");

    const htmlColores = producto.colores
      .map((color) => {
        const colorKey = color.toLowerCase();
        const estilo = mapaColores[colorKey] || {
          bg: "#adb5bd",
          text: "#000000",
        };

        return `<span class="badge me-1 border" style="background-color: ${estilo.bg}; color: ${estilo.text};">${color}</span>`;
      })
      .join("");

    const rutaImg = producto.imagen.startsWith("data:")
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
        <span class="badge bg-secondary p-2" 
              style="cursor: pointer;"
              data-bs-toggle="tooltip" 
              data-bs-html="true" 
              data-bs-title="${generarHTMLTooltip(producto.variantesStock)}">
          ${producto.stock} <i class="bi bi-info-circle ms-1"></i>
        </span>
      </td>
      <td class="align-middle">
        <div class="d-flex flex-wrap gap-1">${htmlTallas}</div>
      </td>
      <td class="align-middle">
        <div class="d-flex flex-wrap gap-1">${htmlColores}</div>
      </td>
      <td class="align-middle text-center">
      <button class="btn btn-sm btn-outline-tomato" onclick="editarProducto(${producto.id})">
        Editar / Actualizar
      </button>
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

    // celdas: [0] miniatura, [1] nombre, [2] precio, [3] stock, [4] tallas, [5] colores
    const arrayTallas = Array.from(celdas[4].querySelectorAll("span")).map(
      (span) => span.textContent.trim().toLowerCase(),
    );
    const arrayColores = Array.from(celdas[5].querySelectorAll("span")).map(
      (span) => quitarTildes(span.textContent.trim().toLowerCase()),
    );

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

const tallas = {
  camiseta: ["S", "M", "L", "XL"],
  medias: ["23-26", "27-30", "31-34", "35-37", "38-40", "41-43", "44-46"],
  gorra: ["S", "M", "L"],
};

const categoria = document.querySelector("#categoria");
const talla = document.querySelector("#talla");

let colorOpciones = null;
let tallaOpciones = null;

if (document.querySelector("#color") && typeof Choices !== "undefined") {
  colorOpciones = new Choices("#color", {
    removeItemButton: true, // Agrega una 'x' para que el usuario pueda borrar su elección
    searchEnabled: false, // Oculta la barra de búsqueda si no la necesitas
    position: "bottom", // fuerza el menú hacia abajo
    noChoicesText: "No hay más opciones", // Reemplaza "No choices to choose from" por la indicacion en español
    itemSelectText: "Presiona para seleccionar", // Reemplaza "Press to select" por la indicacion en español
  });
}

if (document.querySelector("#talla") && typeof Choices !== "undefined") {
  tallaOpciones = new Choices("#talla", {
    removeItemButton: true,
    searchEnabled: false,
    noChoicesText: "No hay más opciones",
    itemSelectText: "Presiona para seleccionar",
  });
}

function mostrarTallas() {
  if (!categoria || !tallaOpciones) return;

  //tallaOpciones.removeActiveItems(); //borra las etiquetas previamente seleccionadas
  //talla.innerHTML = "";
  //tallaOpciones.clearChoices(); //borra la lista de opciones del menu desplegable

  tallaOpciones.clearStore(); // borra la lista y etiquetas al mismo tiempo

  const tipoCategoria = categoria.value;

  let opciones = [];

  if (tipoCategoria == "medias") {
    for (let tallaMedias of tallas.medias) {
      //talla.innerHTML += `<option value="${tallaMedias}">${tallaMedias}</option>`;
      opciones.push({ value: tallaMedias, label: tallaMedias });
    }
  } else if (tipoCategoria == "camiseta") {
    for (let tallaCamiseta of tallas.camiseta) {
      //talla.innerHTML += `<option value="${tallaCamiseta}">${tallaCamiseta}</option>`;
      opciones.push({ value: tallaCamiseta, label: tallaCamiseta });
    }
  } else if (tipoCategoria == "gorra") {
    for (let tallaGorra of tallas.gorra) {
      //talla.innerHTML += `<option value="${tallaGorra}">${tallaGorra}</option>`;
      opciones.push({ value: tallaGorra, label: tallaGorra });
    }
  }
  if (opciones.length > 0) {
    // Si no esta el seleccionar por defecto y el array se lleno con una de las opciones
    tallaOpciones.setChoices(opciones, "value", "label", true);
  }
}

if (categoria) {
  categoria.addEventListener("change", mostrarTallas); // cuando haya cambios en la categoria, se ejecuta mostrarTallas
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

  // extraer valores de choices js
  const coloresSeleccionados = colorOpciones
    ? colorOpciones.getValue(true)
    : [];
  const tallasSeleccionadas = tallaOpciones ? tallaOpciones.getValue(true) : [];

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
      productos[index].precio = precio;
      productos[index].stock = stockTotalCalculado;
      productos[index].tallas = tallasSeleccionadas;
      productos[index].colores = coloresSeleccionados;
      productos[index].variantesStock = variantesStockSeleccionadas;

      // Solo actualizamos la imagen si el usuario seleccionó una nueva
      if (rutaImagen) {
        productos[index].imagen = rutaImagen;
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
    if (colorOpciones) colorOpciones.removeActiveItems();
    if (tallaOpciones) tallaOpciones.clearStore();
    actualizarInputsDeStock();

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
      imagen: rutaImagen,
      stock: stockTotalCalculado,
      tallas: tallasSeleccionadas,
      colores: coloresSeleccionados,
      variantesStock: variantesStockSeleccionadas,
    };

    // agregar al array
    productos.push(nuevoProducto);

    // actualizar el local storage
    localStorage.setItem("misProductos_v4", JSON.stringify(productos));

    // limpiar form y choice js
    formularioProducto.reset();
    if (colorOpciones) colorOpciones.removeActiveItems();
    if (tallaOpciones) tallaOpciones.clearStore();

    alert("Producto agregado y guardado correctamente");
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

  // Extracción segura que evita que el código se rompa si Choices.js devuelve undefined o un string
  const obtenerValores = (instancia) => {
    if (!instancia) return [];
    const valor = instancia.getValue(true);
    if (!valor) return [];
    return Array.isArray(valor) ? valor : [valor];
  };

  const coloresArray = obtenerValores(colorOpciones);
  const tallasArray = obtenerValores(tallaOpciones);

  // Si falta alguno, mostrar el mensaje de ayuda con color blanco forzado (!important)
  if (coloresArray.length === 0 || tallasArray.length === 0) {
    contenedorVariantes.innerHTML =
      '<span style="color: #ffffff !important; font-size: 14px;">Selecciona tallas y colores para asignar el stock.</span>';
    return;
  }

  contenedorVariantes.innerHTML = "";

  // generar los inputs por cada combinacion de talla y color
  coloresArray.forEach((color) => {
    tallasArray.forEach((talla) => {
      contenedorVariantes.innerHTML += `
        <div class="d-flex justify-content-between align-items-center bg-secondary p-2 rounded mb-2">
          <label class="mb-0 text-white text-capitalize" style="color: #ffffff !important;">${color} - Talla ${talla}</label>
          <input type="number" min="0" class="form-control form-control-sm input-stock-variante"
                 style="width: 100px;"
                 data-color="${color}"
                 data-talla="${talla}"
                 value="0" required>
        </div>
      `;
    });
  });
}

// choices.js dispara eventos 'addItem' y 'removeItem' cuando el usuario interactúa
const selectTallaEl = document.getElementById("talla");
const selectColorEl = document.getElementById("color");

if (selectTallaEl) {
  selectTallaEl.addEventListener("addItem", actualizarInputsDeStock);
  selectTallaEl.addEventListener("removeItem", actualizarInputsDeStock);
}

if (selectColorEl) {
  selectColorEl.addEventListener("addItem", actualizarInputsDeStock);
  selectColorEl.addEventListener("removeItem", actualizarInputsDeStock);
}

// variable "bandera" para saber si se esta creando o actualizando
let productoIdEnEdicion = null;

const normalizar = (texto) => quitarTildes(String(texto).trim().toLowerCase());

function editarProducto(id) {
  // buscamos el producto en el array
  const producto = productos.find((p) => p.id === id);
  if (!producto) return;

  // bandera: estamos editando
  productoIdEnEdicion = id;

  // datos básicos
  document.getElementById("nombre").value = producto.nombre;
  document.getElementById("precio").value = producto.precio;

  // minúscula para que coincida con el value del select
  const colores = (producto.colores || []).map((c) => c.toLowerCase());

  if (colorOpciones) {
    colorOpciones.removeActiveItems();
    colorOpciones.setChoiceByValue(colores);
  }

  if (tallaOpciones) {
    tallaOpciones.clearStore();
    const opcionesTalla = (producto.tallas || []).map((t) => ({
      value: t,
      label: t,
    }));
    tallaOpciones.setChoices(opcionesTalla, "value", "label", true);
    tallaOpciones.setChoiceByValue(producto.tallas || []);
  }

  // creamos los inputs de stock dinámicamente
  actualizarInputsDeStock();

  // llenamos el stock guardado (sin setTimeout: los inputs ya existen)
  const variantes = producto.variantesStock || [];
  document.querySelectorAll(".input-stock-variante").forEach((input) => {
    const variante = variantes.find(
      (v) =>
        normalizar(v.color) === normalizar(input.dataset.color) &&
        normalizar(v.talla) === normalizar(input.dataset.talla),
    );
    if (variante) input.value = variante.cantidad;
  });

  // el submit es un <input>, así que se cambia su value
  const btnSubmit = document.querySelector(
    "#formulario-producto input[type='submit']",
  );
  if (btnSubmit) btnSubmit.value = "Actualizar Producto";

  // llevamos al usuario al formulario
  document
    .getElementById("formulario-producto")
    .scrollIntoView({ behavior: "smooth" });
}
