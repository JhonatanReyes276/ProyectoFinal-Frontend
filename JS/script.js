const formulario = document.getElementById("formulario");

function enviar(evento) {
  evento.preventDefault(); // Evita que el formulario se envie por defecto para hacer la validacion

  const esValido = validar(
    validarNombre(),
    validarCorreo(),
    validarTelefono(),
    validarMensaje(),
  );

  if (esValido) {
    formulario.submit();
  }
}

function validar(nombre, correo, telefono, mensaje) {
  if (nombre && correo && telefono && mensaje) {
    return true;
  } else {
    return false;
  }
}

function marcarInvalido(input) {
  input.classList.remove("is-valid");
  input.classList.add("is-invalid");
  return false;
}

function marcarValido(input) {
  input.classList.remove("is-invalid");
  input.classList.add("is-valid");
  return true;
}

function validarTelefono() {
  const input = document.getElementById("telefono");
  const valor = input.value.trim();
  const regex = /^[0-9]+$/; // asegura que desde el inicio "^" sea solo numeros "[0-9]" hasta el final "$"

  if (
    valor === "" ||
    !regex.test(valor) ||
    valor.length < 9 ||
    valor.length > 11
  ) {
    return marcarInvalido(input);
  }
  return marcarValido(input);
}

function validarMensaje() {
  const input = document.getElementById("mensaje");
  const valor = input.value.trim();

  if (valor === "" || valor.length < 50) {
    return marcarInvalido(input);
  }
  return marcarValido(input);
}

function validarCorreo() {
  const input = document.getElementById("email");
  const valor = input.value.trim();
  const regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/; // asegura que desde el inicio "^" haya texto "[a-zA-Z0-9_.+-]" luego "@" luego texto "[a-zA-Z0-9-] luego un punto "\."

  if (valor === "" || !regex.test(valor)) {
    return marcarInvalido(input);
  }
  return marcarValido(input);
}

function validarNombre() {
  const input = document.getElementById("nombre");
  const valor = input.value.trim();
  const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/; // regex se asegura que desde el inicio "^" hasta el final "$" solo haya letras del alfabeto "a-zA-Z", acentos "áéíóúÁÉÍÓÚñÑ", espacios "\s" y letra ñ

  if (valor === "" || !regex.test(valor) || valor.indexOf(" ") === -1) {
    // (valor.indexOf(' ') Ubica donde hay un espacio)  === -1 obliga a que hayan 2 palabras dado que hay 2 espacios
    return marcarInvalido(input);
  }
  return marcarValido(input);
}

if (formulario) {
  formulario.addEventListener("submit", enviar);
}

// Catalogo de productos

const productosPorDefecto = [
  {
    id: 1,
    nombre: "Camiseta Clásica",
    precio: 45000,
    imagen: "IMG/camisa1.jpg",
    stock: 35,
    tallas: ["S", "M", "L", "XL"],
    colores: ["negro", "blanco", "naranja"],
    variantesStock: [
      { color: "negro", talla: "S", cantidad: 3 },
      { color: "negro", talla: "M", cantidad: 5 },
      { color: "negro", talla: "L", cantidad: 2 },
      { color: "negro", talla: "XL", cantidad: 2 },
      { color: "blanco", talla: "S", cantidad: 4 },
      { color: "blanco", talla: "M", cantidad: 4 },
      { color: "blanco", talla: "L", cantidad: 3 },
      { color: "blanco", talla: "XL", cantidad: 2 },
      { color: "naranja", talla: "S", cantidad: 3 },
      { color: "naranja", talla: "M", cantidad: 3 },
      { color: "naranja", talla: "L", cantidad: 2 },
      { color: "naranja", talla: "XL", cantidad: 2 }
    ],
  },
  {
    id: 2,
    nombre: "Camiseta Oversize",
    precio: 55000,
    imagen: "IMG/camisa1.jpg",
    stock: 50,
    tallas: ["M", "L", "XL"],
    colores: ["negro", "gris", "azul", "verde", "rojo"],
    variantesStock: [
      { color: "negro", talla: "M", cantidad: 4 },
      { color: "negro", talla: "L", cantidad: 4 },
      { color: "negro", talla: "XL", cantidad: 3 },
      { color: "gris", talla: "M", cantidad: 3 },
      { color: "gris", talla: "L", cantidad: 3 },
      { color: "gris", talla: "XL", cantidad: 3 },
      { color: "azul", talla: "M", cantidad: 3 },
      { color: "azul", talla: "L", cantidad: 3 },
      { color: "azul", talla: "XL", cantidad: 3 },
      { color: "verde", talla: "M", cantidad: 3 },
      { color: "verde", talla: "L", cantidad: 3 },
      { color: "verde", talla: "XL", cantidad: 2 },
      { color: "rojo", talla: "M", cantidad: 3 },
      { color: "rojo", talla: "L", cantidad: 4 },
      { color: "rojo", talla: "XL", cantidad: 3 }
    ],
  },
  {
    id: 3,
    nombre: "Gorra Snapback",
    precio: 35000,
    imagen: "IMG/gorras.jpg",
    stock: 25,
    tallas: ["M", "L"],
    colores: ["negro", "blanco", "naranja", "verde"],
    variantesStock: [
      { color: "negro", talla: "M", cantidad: 3 },
      { color: "negro", talla: "L", cantidad: 3 },
      { color: "blanco", talla: "M", cantidad: 3 },
      { color: "blanco", talla: "L", cantidad: 3 },
      { color: "naranja", talla: "M", cantidad: 3 },
      { color: "naranja", talla: "L", cantidad: 3 },
      { color: "verde", talla: "M", cantidad: 4 },
      { color: "verde", talla: "L", cantidad: 3 }
    ],
  },
  {
    id: 4,
    nombre: "Gorra Trucker",
    precio: 32000,
    imagen: "IMG/gorras.jpg",
    stock: 25,
    tallas: ["S", "M"],
    colores: ["azul", "gris", "rojo"],
    variantesStock: [
      { color: "azul", talla: "S", cantidad: 4 },
      { color: "azul", talla: "M", cantidad: 4 },
      { color: "gris", talla: "S", cantidad: 4 },
      { color: "gris", talla: "M", cantidad: 4 },
      { color: "rojo", talla: "S", cantidad: 4 },
      { color: "rojo", talla: "M", cantidad: 5 }
    ],
  },
  {
    id: 5,
    nombre: "Medias Estampadas",
    precio: 18000,
    imagen: "IMG/medias.jpg",
    stock: 30,
    tallas: ["35-37", "38-40", "41-43", "44-46"],
    colores: ["blanco", "negro", "azul"],
    variantesStock: [
      { color: "blanco", talla: "35-37", cantidad: 2 },
      { color: "blanco", talla: "38-40", cantidad: 3 },
      { color: "blanco", talla: "41-43", cantidad: 2 },
      { color: "blanco", talla: "44-46", cantidad: 2 },
      { color: "negro", talla: "35-37", cantidad: 2 },
      { color: "negro", talla: "38-40", cantidad: 3 },
      { color: "negro", talla: "41-43", cantidad: 3 },
      { color: "negro", talla: "44-46", cantidad: 2 },
      { color: "azul", talla: "35-37", cantidad: 2 },
      { color: "azul", talla: "38-40", cantidad: 3 },
      { color: "azul", talla: "41-43", cantidad: 2 },
      { color: "azul", talla: "44-46", cantidad: 2 }
    ],
  },
  {
    id: 6,
    nombre: "Medias Largas",
    precio: 20000,
    imagen: "IMG/medias.jpg",
    stock: 20,
    tallas: ["31-34", "35-37", "38-40", "41-43", "44-46"],
    colores: ["gris", "naranja"],
    variantesStock: [
      { color: "gris", talla: "31-34", cantidad: 1 },
      { color: "gris", talla: "35-37", cantidad: 2 },
      { color: "gris", talla: "38-40", cantidad: 2 },
      { color: "gris", talla: "41-43", cantidad: 2 },
      { color: "gris", talla: "44-46", cantidad: 2 },
      { color: "naranja", talla: "31-34", cantidad: 1 },
      { color: "naranja", talla: "35-37", cantidad: 2 },
      { color: "naranja", talla: "38-40", cantidad: 3 },
      { color: "naranja", talla: "41-43", cantidad: 2 },
      { color: "naranja", talla: "44-46", cantidad: 3 }
    ],
  },
  {
    id: 7,
    nombre: "Medias infantiles",
    precio: 12000,
    imagen: "IMG/medias.jpg",
    stock: 25,
    tallas: ["23-26", "27-30", "31-34"],
    colores: ["blanco", "negro", "azul", "verde", "rojo"],
    variantesStock: [
      { color: "blanco", talla: "23-26", cantidad: 1 },
      { color: "blanco", talla: "27-30", cantidad: 1 },
      { color: "blanco", talla: "31-34", cantidad: 1 },
      { color: "negro", talla: "23-26", cantidad: 1 },
      { color: "negro", talla: "27-30", cantidad: 2 },
      { color: "negro", talla: "31-34", cantidad: 1 },
      { color: "azul", talla: "23-26", cantidad: 2 },
      { color: "azul", talla: "27-30", cantidad: 1 },
      { color: "azul", talla: "31-34", cantidad: 2 },
      { color: "verde", talla: "23-26", cantidad: 1 },
      { color: "verde", talla: "27-30", cantidad: 2 },
      { color: "verde", talla: "31-34", cantidad: 1 },
      { color: "rojo", talla: "23-26", cantidad: 2 },
      { color: "rojo", talla: "27-30", cantidad: 3 },
      { color: "rojo", talla: "31-34", cantidad: 4 }
    ],
  },
  {
    id: 8,
    nombre: "Medias tobilleras",
    precio: 12000,
    imagen: "IMG/medias.jpg",
    stock: 30,
    tallas: ["35-37", "38-40", "41-43", "44-46"],
    colores: ["blanco", "negro", "azul", "verde", "rojo", "café", "naranja"],
    variantesStock: [
      { color: "blanco", talla: "35-37", cantidad: 2 },
      { color: "blanco", talla: "38-40", cantidad: 2 },
      { color: "blanco", talla: "41-43", cantidad: 2 },
      { color: "blanco", talla: "44-46", cantidad: 2 },
      { color: "negro", talla: "35-37", cantidad: 2 },
      { color: "negro", talla: "38-40", cantidad: 2 },
      { color: "negro", talla: "41-43", cantidad: 2 },
      { color: "negro", talla: "44-46", cantidad: 2 },
      { color: "azul", talla: "35-37", cantidad: 2 },
      { color: "azul", talla: "38-40", cantidad: 2 },
      { color: "azul", talla: "41-43", cantidad: 2 },
      { color: "azul", talla: "44-46", cantidad: 2 },
      { color: "verde", talla: "35-37", cantidad: 2 },
      { color: "verde", talla: "38-40", cantidad: 2 },
      { color: "verde", talla: "41-43", cantidad: 2 },
      { color: "verde", talla: "44-46", cantidad: 2 },
      { color: "rojo", talla: "35-37", cantidad: 2 },
      { color: "rojo", talla: "38-40", cantidad: 2 },
      { color: "rojo", talla: "41-43", cantidad: 2 },
      { color: "rojo", talla: "44-46", cantidad: 2 },
      { color: "café", talla: "35-37", cantidad: 1 },
      { color: "café", talla: "38-40", cantidad: 1 },
      { color: "café", talla: "41-43", cantidad: 1 },
      { color: "café", talla: "44-46", cantidad: 1 },
      { color: "naranja", talla: "35-37", cantidad: 1 },
      { color: "naranja", talla: "38-40", cantidad: 1 },
      { color: "naranja", talla: "41-43", cantidad: 1 },
      { color: "naranja", talla: "44-46", cantidad: 1 }
    ],
  },
];

const STORAGE_KEY = "misProductos_v4";

const productosGuardados = localStorage.getItem(STORAGE_KEY); // busca los productos guardados previamente

let productos = productosGuardados ? JSON.parse(productosGuardados) : productosPorDefecto; // se setea el array de productos dependiendo de si ya habian guardados, de lo contrario se setean los por defecto

if (!productosGuardados) {
  // si la memoria estaba vacía, guardamos la lista por defecto convirtiendola a texto (JSON) para la proxima visita
  localStorage.setItem(STORAGE_KEY, JSON.stringify(productos));
}

document.addEventListener("DOMContentLoaded", function () {
  const listaProductos = document.getElementById("listaProductos");

  if (!listaProductos) return;

  renderizarCatalogo(productos);

  let tallaActiva = "todas";
  let colorActivo = "todos";

  const tarjetasProductos = document.querySelectorAll(".producto");
  const contador = document.getElementById("contador");
  const sinResultados = document.getElementById("sinResultados");
  const botonLimpiar = document.getElementById("limpiarFiltros");
  const botonesTalla = document.querySelectorAll(".chip-talla");
  const botonesColor = document.querySelectorAll(".chip-color");

  function actualizarContador(visibles) {
    if (contador) {
      contador.textContent =
        visibles === 1 ? "1 producto" : visibles + " productos";
    }

    if (sinResultados) {
      sinResultados.classList.toggle("d-none", visibles !== 0);
    }
  }

  // Filtrar
  function filtrarProductos() {
    let visibles = 0;
    const tarjetasActualizadas = document.querySelectorAll(".producto");

    tarjetasActualizadas.forEach(function (tarjeta) {
      const idTarjeta = Number(tarjeta.dataset.id);
      const productoData = productos.find(function (p) {
        return p.id === idTarjeta;
      });

      if (!productoData) return;

      const cumpleTalla =
        tallaActiva === "todas" || productoData.tallas.includes(tallaActiva);

      const cumpleColor =
        colorActivo === "todos" || productoData.colores.includes(colorActivo);

      const columnaPadre = tarjeta.closest(".col-6, .col-md-4, .col-lg-3");

      if (cumpleTalla && cumpleColor) {
        if (columnaPadre) columnaPadre.classList.remove("d-none");
        visibles++;
      } else {
        if (columnaPadre) columnaPadre.classList.add("d-none");
      }
    });

    actualizarContador(visibles);
  }

  function marcarActivo(botones, botonPulsado) {
    botones.forEach(function (boton) {
      boton.classList.remove("activo");
    });
    botonPulsado.classList.add("activo");
  }

  // Eventos
  botonesTalla.forEach(function (boton) {
    boton.addEventListener("click", function () {
      tallaActiva = boton.dataset.talla;
      marcarActivo(botonesTalla, boton);
      filtrarProductos();
    });
  });

  botonesColor.forEach(function (boton) {
    boton.addEventListener("click", function () {
      colorActivo = boton.dataset.color;
      marcarActivo(botonesColor, boton);
      filtrarProductos();
    });
  });

  if (botonLimpiar) {
    botonLimpiar.addEventListener("click", function () {
      tallaActiva = "todas";
      colorActivo = "todos";
      marcarActivo(botonesTalla, botonesTalla[0]);
      marcarActivo(botonesColor, botonesColor[0]);
      filtrarProductos();
    });
  }

  filtrarProductos();
});

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


function renderizarProductos(lista) {
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
              data-bs-title="${tooltipContent}">
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
  renderizarProductos(productos);
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
  const stock = parseInt(document.getElementById("stock").value);

  // extraer valores de choices js
  const coloresSeleccionados = colorOpciones ? colorOpciones.getValue(true) : [];
  const tallasSeleccionadas = tallaOpciones ? tallaOpciones.getValue(true) : [];

  // validar que los campos no esten vacios
  if (!nombre || isNaN(precio) || isNaN(stock) || tallasSeleccionadas.length === 0 || coloresSeleccionados.length === 0) {
    alert("Por favor, completa todos los campos.");
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
    stock: stock,
    tallas: tallasSeleccionadas,
    colores: coloresSeleccionados,
  };

  // agregar al array
  productos.push(nuevoProducto);

  // actualizar el local storage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(productos));

  // limpiar form y choice js
  formularioProducto.reset();
  if (colorOpciones) colorOpciones.removeActiveItems();
  if (tallaOpciones) tallaOpciones.clearStore();

  alert("Producto agregado y guardado correctamente");

  // actualizar el "canva" dom
  renderizarProductos(productos);
}

if (formularioProducto) {
  formularioProducto.addEventListener("submit", añadirProducto);
}

function renderizarCatalogo(lista) {
  const contenedor = document.getElementById("listaProductos");
  if (!contenedor) return;

  contenedor.innerHTML = ""; // Limpiar el contenedor

  lista.forEach(producto => {
    // Puntitos de color
    const htmlColores = producto.colores.map(color => {
      const clase = color.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      return `<span class="punto color-${clase}" title="${color}"></span>`;
    }).join("");

    const htmlTallas = producto.tallas.map(talla =>
      `<span class="etiqueta-talla">${talla}</span>`
    ).join("");

    const div = document.createElement("div");
    div.className = "col-6 col-md-4 col-lg-3";

    const rutaImg = producto.imagen.startsWith("data:")
      ? producto.imagen
      : `../${producto.imagen}`;

    div.innerHTML = `
      <article class="producto" data-id="${producto.id}">
        <div class="producto-img">
          <img src="${rutaImg}" alt="${producto.nombre}" />
        </div>
        <div class="producto-info">
          <h3 class="producto-nombre">${producto.nombre}</h3>
          <p class="producto-precio">$${producto.precio.toLocaleString("es-CO")}</p>
          <div class="producto-colores">${htmlColores}</div>
          <div class="producto-tallas">${htmlTallas}</div>
          <button type="button" class="btn-agregar" data-id="${producto.id}">
            <i class="bi bi-plus-lg"></i> Agregar a la lista
          </button>
        </div>
      </article>
    `;

    contenedor.appendChild(div);
  });
}


// LISTA DE SELECCION 
document.addEventListener("DOMContentLoaded", function () {
  const contenedorProductos = document.getElementById("listaProductos");
  if (!contenedorProductos) return;

  const badgeLista = document.getElementById("badgeLista");
  const itemsLista = document.getElementById("itemsLista");
  const listaVacia = document.getElementById("listaVacia");
  const totalLista = document.getElementById("totalLista");
  const botonVaciar = document.getElementById("vaciarLista");
  const botonIrTaller3D = document.getElementById("btnIrTaller3D");

  function leerLista() {
    try {
      return JSON.parse(localStorage.getItem("miLista")) || [];
    } catch (error) {
      return [];
    }
  }

  function guardarLista() {
    localStorage.setItem("miLista", JSON.stringify(lista));
  }

  let lista = leerLista();

  function buscarProducto(id) {
    return productos.find(function (p) {
      return p.id === id;
    });
  }

  function alternarProducto(id) {

    const posicion = lista.findIndex(function (item) {
      return item.id === id;
    });
    if (posicion === -1) {
      const producto = buscarProducto(id);
      if (!producto || producto.stock < 1) return;
      lista.push({ id: id, cantidad: 1 });
    } else {
      lista.splice(posicion, 1);
    }
    actualizar();
  }

  function cambiarCantidad(id, cambio) {

    const item = lista.find(function (i) {
      return i.id === id;
    });
    const producto = buscarProducto(id);
    if (!item || !producto) return;
    const nueva = item.cantidad + cambio;
    if (nueva < 1 || nueva > producto.stock) return;
    item.cantidad = nueva;
    actualizar();
  }

  function quitarDeLista(id) {
    lista = lista.filter(function (item) {
      return item.id !== id;
    });
    actualizar();
  }

  function dibujarLista() {

    if (!itemsLista || !totalLista || !badgeLista || !listaVacia || !botonVaciar) return;

    let html = "";
    let total = 0;
    let unidades = 0;

    lista.forEach(function (item) {

      const p = buscarProducto(item.id);
      if (!p) return;
      const subtotal = p.precio * item.cantidad;
      total += subtotal;
      unidades += item.cantidad;

      html += `
        <li class="item-lista">
          <img src="../${p.imagen}" alt="${p.nombre}" />
          <div class="item-datos">
            <p class="item-nombre">${p.nombre}</p>
            <p class="item-precio">$${subtotal.toLocaleString("es-CO")}</p>
            <div class="item-cantidad">
              <button type="button" class="btn-cantidad" data-accion="restar" data-id="${p.id}"
                aria-label="Quitar una unidad" ${item.cantidad <= 1 ? "disabled" : ""}>−</button>
              <span>${item.cantidad}</span>
              <button type="button" class="btn-cantidad" data-accion="sumar" data-id="${p.id}"
                aria-label="Agregar una unidad" ${item.cantidad >= p.stock ? "disabled" : ""}>+</button>
            </div>
          </div>
          <button type="button" class="btn-quitar" data-accion="quitar" data-id="${p.id}"
            aria-label="Quitar ${p.nombre} de la lista"><i class="bi bi-trash"></i></button>
        </li>
      `;
    });

    itemsLista.innerHTML = html;
    totalLista.textContent = "$" + total.toLocaleString("es-CO");
    badgeLista.textContent = unidades;
    badgeLista.classList.toggle("d-none", unidades === 0);
    listaVacia.classList.toggle("d-none", unidades !== 0);
    botonVaciar.disabled = unidades === 0;
  }

  function actualizarBotones() {

    document.querySelectorAll(".btn-agregar").forEach(function (boton) {
      const id = Number(boton.dataset.id);
      const enLista = lista.some(function (item) {
        return item.id === id;
      });
      boton.classList.toggle("en-lista", enLista);
      boton.innerHTML = enLista

        ? '<i class="bi bi-x-lg"></i> Quitar de la lista'
        : '<i class="bi bi-plus-lg"></i> Agregar a la lista';
    });
  }

  function actualizar() {
    guardarLista();
    dibujarLista();
    actualizarBotones();
  }

  contenedorProductos.addEventListener("click", function (e) {

    const boton = e.target.closest(".btn-agregar");
    if (!boton) return;
    alternarProducto(Number(boton.dataset.id));
  });

  if (itemsLista) {

    itemsLista.addEventListener("click", function (e) {
      const boton = e.target.closest("button[data-accion]");
      if (!boton) return;
      const id = Number(boton.dataset.id);
      const accion = boton.dataset.accion;
      if (accion === "sumar") cambiarCantidad(id, 1);
      if (accion === "restar") cambiarCantidad(id, -1);
      if (accion === "quitar") quitarDeLista(id);
    });
  }

  if (botonVaciar) {
    botonVaciar.addEventListener("click", function () {

      lista = [];
      actualizar();
    });
  }
  if (botonIrTaller3D) {
    botonIrTaller3D.addEventListener("click", function () {
      if (lista.length === 0) {
        alert("Tu lista está vacía.");
        return;
      }
      window.location.href = "./taller.html";
    });
  }

  actualizar();
});