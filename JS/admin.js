const mapaColores = {
  negro: { bg: "#212529", text: "#ffffff" },
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

  variantesStock.forEach(v => {
    if (!agrupado[v.color]) agrupado[v.color] = [];
    agrupado[v.color].push(`${v.talla}: ${v.cantidad}`);
  });

  let html = `<div class='text-start p-1'><strong class='border-bottom d-block mb-1 pb-1'>Stock por Variación:</strong>`;
  for (const [color, detalle] of Object.entries(agrupado)) {
    html += `<div><strong class='text-capitalize'>${color}:</strong> ${detalle.join(' | ')}</div>`;
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
}

function inicializarTooltips() {
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  [...tooltipTriggerList].map(tooltipTriggerEl => 
    new bootstrap.Tooltip(tooltipTriggerEl, { sanitize: false })
  );
}

document.addEventListener('DOMContentLoaded', () => {
  renderizarTabla(productos);
});

const buscador = document.querySelector("#buscador");
const selectTalla = document.querySelector("#filtroTalla");
const selectColor = document.querySelector("#filtroColor");
const filas = document.querySelectorAll("#miTabla tbody tr");

const quitarTildes = (str) => {
  // (str) hace referencia a string la palabra que entra
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // normalize("NFD") separa la letra de la tilde ej: entra (café) sale (cafe´) cambia (.replace()) todas las tildes, diéresis o sombreritos ([\u0300-\u036f]) por nada ("")
};

// guardamos en una array un objeto que contiene todos los datos de las filas (columnas) que necesitamos para filtrar
let datosTabla = [];
if (filas.length > 0) {
  datosTabla = Array.from(filas).map((fila, index) => {
    const celdas = fila.querySelectorAll("td");

    // traemos las tallas
    const spansTallas = celdas[4].querySelectorAll("span");

    // guardamos en un array las tallas
    const arrayTallas = Array.from(spansTallas).map((span) =>
      span.textContent.trim().toLowerCase(),
    );

    // tomamos los colores
    const spansColores = celdas[5].querySelectorAll("span");
    // guardamos los colores en un array
    const arrayColores = Array.from(spansColores).map((span) =>
      quitarTildes(span.textContent.trim().toLowerCase()),
    );

    return {
      indice: index,
      nombre: quitarTildes(celdas[1].textContent.trim().toLowerCase()), // celdas[1] trae la segunda columna de la fila .texcontent trae su contenido .trim() quita espacios .toLowerCase() minusculas
      tallas: arrayTallas,
      colores: arrayColores,
    };
  });
}

// configuracion de Fuse.js // se le pasa el array donde va a operar (datosTabla)
let fuse = null;
if (datosTabla.length > 0 && typeof Fuse !== "undefined") {
  fuse = new Fuse(datosTabla, {
    keys: ["nombre"], // variables que el fuse va a tener en cuenta (nombre) para hacer la busqueda (podrian haber sido más)
    threshold: 0.3, // nivel de toleracia a errores de ortografia que permite 0 siendo lo menos tolerante y 1 permitiendo cualquier cosa
    ignoreLocation: true, // Permite que encuentre la palabra sin importar si esta escrita al principio, en medio o al final de la celda
  });
}

function filtrarAdmin() {
  if (!buscador || !selectTalla || !selectColor || !fuse) return;

  const texto = quitarTildes(buscador.value.trim().toLowerCase()); // input del usuario
  const tallaBuscada = selectTalla.value.toLowerCase(); // selected del usuario
  const colorBuscado = quitarTildes(selectColor.value.toLowerCase()); // selected del usuario

  let indicesValidosTexto = [];
  // si el input no esta vacio
  if (texto) {
    const resultados = fuse.search(texto); // trae los resultados que coinciden teniendo en cuenta la flexibilidad que le otorgamos
    indicesValidosTexto = resultados.map((r) => r.item.indice); // extrae el numero de fila de los resultados
  }

  // recorremos TODAS las filas para aplicar el filtro
  filas.forEach((fila, index) => {
    // si el index de la fila que estamos recorriendo coincide con el que obtuvimos de fuse, será true
    const cumpleTexto = texto === "" || indicesValidosTexto.includes(index); // el "" (espacio vacio) es el comodin, incluso si el input esta vacio, o la talla esta vacia pero el color no, se aplica el filtro

    const cumpleTalla =
      tallaBuscada === "" || datosTabla[index].tallas.includes(tallaBuscada); // si la fila que estamos recorriendo en su talla incluye la talla que selecciono el admin, será true

    const cumpleColor =
      colorBuscado === "" || datosTabla[index].colores.includes(colorBuscado); // si la fila que estamos recorriendo en su color incluye el color que selecciono el admin, será true

    fila.hidden = !(cumpleTexto && cumpleTalla && cumpleColor); // escondemos las filas que no cumplan con todas las condiciones al mismo tiempo
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

if (document.querySelector('#color') && typeof Choices !== "undefined") {
  colorOpciones = new Choices('#color', {
    removeItemButton: true, // Agrega una 'x' para que el usuario pueda borrar su elección
    searchEnabled: false,    // Oculta la barra de búsqueda si no la necesitas
    position: 'bottom', // fuerza el menú hacia abajo
    noChoicesText: 'No hay más opciones', // Reemplaza "No choices to choose from" por la indicacion en español
    itemSelectText: 'Presiona para seleccionar' // Reemplaza "Press to select" por la indicacion en español
  });
}

if (document.querySelector('#talla') && typeof Choices !== "undefined") {
  tallaOpciones = new Choices('#talla', {
    removeItemButton: true,
    searchEnabled: false,
    noChoicesText: 'No hay más opciones',
    itemSelectText: 'Presiona para seleccionar'
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
  if (opciones.length > 0) { // Si no esta el seleccionar por defecto y el array se lleno con una de las opciones
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

async function añadirProducto(e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const precio = parseFloat(document.getElementById("precio").value);

  // extraer valores de choices js
  const coloresSeleccionados = colorOpciones ? colorOpciones.getValue(true) : [];
  const tallasSeleccionadas = tallaOpciones ? tallaOpciones.getValue(true) : [];

  let variantesStockSeleccionadas = [];
  let stockTotalCalculado = 0;
  const inputsVariantes = document.querySelectorAll(".input-stock-variante");

  inputsVariantes.forEach(input => {
    const cantidad = parseInt(input.value) || 0;
    const color = input.getAttribute("data-color");
    const talla = input.getAttribute("data-talla");

    if (cantidad > 0) {
      variantesStockSeleccionadas.push({ color, talla, cantidad: cantidad });
      stockTotalCalculado += cantidad;
    }
  });

  // validar que los campos no esten vacios
  if (!nombre || isNaN(precio) || tallasSeleccionadas.length === 0 || coloresSeleccionados.length === 0) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  if (variantesStockSeleccionadas.length === 0) {
    alert("Debes asignar una cantidad de stock a al menos una variante de color/talla.");
    return;
  }

  const inputImagen = document.getElementById("imagen");
  // Este código genera un icono de imagen genérica gris directamente en el navegador
  let rutaImagen =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400' fill='%23dee2e6'><rect width='400' height='400' fill='%23f8f9fa'/><path d='M100 150l75 100 50-75 75 125H100z'/><circle cx='275' cy='125' r='25'/></svg>"; // Imagen por defecto si no suben nada

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

  // crear ID consecutivo
  const nuevoId = productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1; // busca el ID más alto y le suma 1, si la lista esta vacia, empieza en 1

  // crear objeto
  const nuevoProducto = {
    id: nuevoId,
    nombre: nombre,
    precio: precio,
    imagen: rutaImagen,
    stock: stockTotalCalculado,
    tallas: tallasSeleccionadas,
    colores: coloresSeleccionados,
    variantesStock: variantesStockSeleccionadas
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

  // actualizar el "canva" dom
  renderizarTabla(productos);
}

if (formularioProducto) {
  formularioProducto.addEventListener("submit", añadirProducto);
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
    contenedorVariantes.innerHTML = '<span style="color: #ffffff !important; font-size: 14px;">Selecciona tallas y colores para asignar el stock.</span>';
    return;
  }

  contenedorVariantes.innerHTML = "";

  // generar los inputs por cada combinacion de talla y color
  coloresArray.forEach(color => {
    tallasArray.forEach(talla => {
      contenedorVariantes.innerHTML += `
        <div class="d-flex justify-content-between align-items-center bg-secondary p-2 rounded mb-2">
          <label class="mb-0 text-white" style="color: #ffffff !important;">${color} - Talla ${talla}</label>
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
const selectTallaEl = document.getElementById('talla');
const selectColorEl = document.getElementById('color');

if (selectTallaEl) {
  selectTallaEl.addEventListener('addItem', actualizarInputsDeStock);
  selectTallaEl.addEventListener('removeItem', actualizarInputsDeStock);
}

if (selectColorEl) {
  selectColorEl.addEventListener('addItem', actualizarInputsDeStock);
  selectColorEl.addEventListener('removeItem', actualizarInputsDeStock);
}