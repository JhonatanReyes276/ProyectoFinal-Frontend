const formulario = document.getElementById("formulario");

function enviar(evento) {
  evento.preventDefault(); //Evita que el formulario se envie por defecto para hacer la validacion

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
  const regex = /^[0-9]+$/; //asegura que desde el inicio "^" sea solo numeros "[0-9]" hasta el final "$"

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
  const regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/; //asegura que desde el inicio "^" haya texto "[a-zA-Z0-9_.+-]" luego "@" luego texto "[a-zA-Z0-9-] luego un punto "\."

  if (valor === "" || !regex.test(valor)) {
    return marcarInvalido(input);
  }
  return marcarValido(input);
}

function validarNombre() {
  const input = document.getElementById("nombre");
  const valor = input.value.trim();
  const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/; //regex se asegura que desde el inicio "^" hasta el final "$" solo haya letras del alfabeto "a-zA-Z", acentos "áéíóúÁÉÍÓÚñÑ", espacios "\s" y letra ñ

  if (valor === "" || !regex.test(valor) || valor.indexOf(" ") === -1) {
    // (valor.indexOf(' ') Ubica donde hay un espacio)  === -1 obliga a que hayan 2 palabras dado que hay 2 espacios
    return marcarInvalido(input);
  }
  return marcarValido(input);
}
if (formulario) {
  formulario.addEventListener("submit", enviar);
}

//Catalogo de productos

const productosPorDefecto = [
  {
    id: 1,
    nombre: "Camiseta Clásica",
    precio: 45000,
    imagen: "../../IMG/camisetas.jpg",
    stock: 35,
    tallas: ["S", "M", "L", "XL"],
    colores: ["negro", "blanco", "naranja"],
  },
  {
    id: 2,
    nombre: "Camiseta Oversize",
    precio: 55000,
    imagen: "../../IMG/camisetas.jpg",
    stock: 50,
    tallas: ["M", "L", "XL"],
    colores: ["negro", "gris", "azul", "verde", "rojo"],
  },
  {
    id: 3,
    nombre: "Gorra Snapback",
    precio: 35000,
    imagen: "../../IMG/gorras.jpg",
    stock: 25,
    tallas: ["M", "L"],
    colores: ["negro", "blanco", "naranja", "verde"],
  },
  {
    id: 4,
    nombre: "Gorra Trucker",
    precio: 32000,
    imagen: "../../IMG/gorras.jpg",
    stock: 25,
    tallas: ["S", "M"],
    colores: ["azul", "gris", "rojo"],
  },
  {
    id: 5,
    nombre: "Medias Estampadas",
    precio: 18000,
    imagen: "../../IMG/medias.jpg",
    stock: 30,
    tallas: ["35-37", "38-40", "41-43", "44-46"],
    colores: ["blanco", "negro", "azul"],
  },
  {
    id: 6,
    nombre: "Medias Largas",
    precio: 20000,
    imagen: "../../IMG/medias.jpg",
    stock: 20,
    tallas: ["31-34", "35-37", "38-40", "41-43", "44-46"],
    colores: ["gris", "naranja"],
  },
  {
    id: 7,
    nombre: "Medias infantiles",
    precio: 12000,
    imagen: "../../IMG/medias.jpg",
    stock: 25,
    tallas: ["23-26", "27-30", "31-34"],
    colores: ["blanco", "negro", "azul", "verde", "rojo"],
  },
  {
    id: 8,
    nombre: "Medias tobilleras",
    precio: 12000,
    imagen: "../../IMG/medias.jpg",
    stock: 30,
    tallas: ["35-37", "38-40", "41-43", "44-46"],
    colores: ["blanco", "negro", "azul", "verde", "rojo", "café", "naranja"],
  },
];

const productosGuardados = localStorage.getItem("misProductos"); //busca los productos guardados previamente

let productos = productosGuardados ? JSON.parse(productosGuardados) : productosPorDefecto; //se setea el array de productos dependiendo de si ya habian guardados, de lo contrario se setean los por defecto

if (!productosGuardados) { //si la memoria estaba vacía, guardamos la lista por defecto convirtiendola a texto (JSON) para la proxima visita
  localStorage.setItem("misProductos", JSON.stringify(productos));
}

document.addEventListener("DOMContentLoaded", function () {
  const listaProductos = document.getElementById("listaProductos");

  if (!listaProductos) return;

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

    tarjetasProductos.forEach(function (tarjeta) {
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

function renderizarProductos(lista) {
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

    fila.innerHTML = `
      <th class="text-center align-middle">${index + 1}</th>
      <td class="text-center align-middle">
        <img src="${producto.imagen}" alt="${producto.nombre}" class="img-thumbnail" style="width: 50px; height: 50px; object-fit: cover;">
      </td>
      <td class="align-middle fw-semibold">${producto.nombre}</td>
      <td class="align-middle fw-bold" style="color: var(--tomato);">$${producto.precio.toLocaleString("es-CO")}</td>
      <td class="align-middle fw-semibold">${producto.stock}</td>
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
}

renderizarProductos(productos);

const buscador = document.querySelector("#buscador");
const selectTalla = document.querySelector("#filtroTalla");
const selectColor = document.querySelector("#filtroColor");
const filas = document.querySelectorAll("#miTabla tbody tr");

const quitarTildes = (str) => {
  // (str) hace referencia a string la palabra que entra
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); //normalize("NFD") separa la letra de la tilde ej: entra (café) sale (cafe´) cambia (.replace()) todas las tildes, diéresis o sombreritos ([\u0300-\u036f]) por nada ("")
};

// guardamos en una array un objeto que contiene todos los datos de las filas (columnas) que necesitamos para filtrar
const datosTabla = Array.from(filas).map((fila, index) => {
  const celdas = fila.querySelectorAll("td");

  //traemos las tallas
  const spansTallas = celdas[3].querySelectorAll("span");

  //guardamos en un array las tallas
  const arrayTallas = Array.from(spansTallas).map((span) =>
    span.textContent.trim().toLowerCase(),
  );

  // tomamos los colores
  const spansColores = celdas[4].querySelectorAll("span");
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

// configuracion de Fuse.js // se le pasa el array donde va a operar (datosTabla)
const fuse = new Fuse(datosTabla, {
  keys: ["nombre"], // variables que el fuse va a tener en cuenta (nombre) para hacer la busqueda (podrian haber sido más)
  threshold: 0.3, //nivel de toleracia a errores de ortografia que permite 0 siendo lo menos tolerante y 1 permitiendo cualquier cosa
  ignoreLocation: true, // Permite que encuentre la palabra sin importar si esta escrita al principio, en medio o al final de la celda
});

function filtrarAdmin() {
  const texto = quitarTildes(buscador.value.trim().toLowerCase()); //input del usuario
  const tallaBuscada = selectTalla.value.toLowerCase(); //selected del usuario
  const colorBuscado = quitarTildes(selectColor.value.toLowerCase()); //selected del usuario

  let indicesValidosTexto = [];
  //si el input no esta vacio
  if (texto) {
    const resultados = fuse.search(texto); // trae los resultados que coinciden teniendo en cuenta la flexibilidad que le otorgamos
    indicesValidosTexto = resultados.map((r) => r.item.indice); // extrae el numero de fila de los resultados
  }

  //recorremos TODAS las filas para aplicar el filtro
  filas.forEach((fila, index) => {
    // si el index de la fila que estamos recorriendo coincide con el que obtuvimos de fuse, será true
    const cumpleTexto = texto === "" || indicesValidosTexto.includes(index); // el "" (espacio vacio) es el comodin, incluso si el input esta vacio, o la talla esta vacia pero el color no, se aplica el filtro

    const cumpleTalla =
      tallaBuscada === "" || datosTabla[index].tallas.includes(tallaBuscada); // si la fila que estamos recorriendo en su talla incluye la talla que selecciono el admin, será true

    const cumpleColor =
      colorBuscado === "" || datosTabla[index].colores.includes(colorBuscado); // si la fila que estamos recorriendo en su color incluye el color que selecciono el admin, será true

    fila.hidden = !(cumpleTexto && cumpleTalla && cumpleColor); //escondemos las filas que no cumplan con todas las condiciones al mismo tiempo
  });
}

buscador.addEventListener("input", filtrarAdmin);
selectTalla.addEventListener("change", filtrarAdmin);
selectColor.addEventListener("change", filtrarAdmin);

const tallas = {
  camiseta: ["S", "M", "L", "XL"],
  medias: ["23-26", "27-30", "31-34", "35-37", "38-40", "41-43", "44-46"],
  gorra: ["S", "M", "L"],
};

const categoria = document.querySelector("#categoria");
const talla = document.querySelector("#talla");

const colorOpciones = new Choices('#color', {
  removeItemButton: true, // Agrega una 'x' para que el usuario pueda borrar su elección
  searchEnabled: false,    // Oculta la barra de búsqueda si no la necesitas
  position: 'bottom', // fuerza el menú hacia abajo
  noChoicesText: 'No hay más opciones', // Reemplaza "No choices to choose from" por la indicacion en español
  itemSelectText: 'Presiona para seleccionar' // Reemplaza "Press to select" por la indicacion en español
});

const tallaOpciones = new Choices('#talla', {
  removeItemButton: true,
  searchEnabled: false,
  noChoicesText: 'No hay más opciones',
  itemSelectText: 'Presiona para seleccionar'
});

function mostrarTallas() {

  //tallaOpciones.removeActiveItems(); //borra las etiquetas previamente seleccionadas
  //talla.innerHTML = "";
  //tallaOpciones.clearChoices(); //borra la lista de opciones del menu desplegable

  tallaOpciones.clearStore(); //borra la lista y etiquetas al mismo tiempo
 
  const tipoCategoria = categoria.value;

  let opciones = [];

  if (tipoCategoria == "medias") {
    for (let tallaMedias of tallas.medias) {
      //talla.innerHTML += `<option value="${tallaMedias}">${tallaMedias}</option>`;
      opciones.push({ value: tallaMedias, label: tallaMedias});
    }
  } else if (tipoCategoria == "camiseta") {
    for (let tallaCamiseta of tallas.camiseta) {
      //talla.innerHTML += `<option value="${tallaCamiseta}">${tallaCamiseta}</option>`;
      opciones.push({ value: tallaCamiseta, label: tallaCamiseta});
    }
  } else if(tipoCategoria == "gorra"){
    for (let tallaGorra of tallas.gorra) {
      //talla.innerHTML += `<option value="${tallaGorra}">${tallaGorra}</option>`;
      opciones.push({ value: tallaGorra, label: tallaGorra});
    }
  }
  if(opciones.length > 0){ //Si no esta el seleccionar por defecto y el array se lleno con una de las opciones
    tallaOpciones.setChoices(opciones, "value", "label", true);
  }
}

categoria.addEventListener("change", mostrarTallas); //cuando haya cambios en la categoria, se ejecuta mostrarTallas

const formularioProducto = document.getElementById("formulario-producto");

function añadirProducto(){
  e.preventDefault(); 

  const nombre = document.getElementById("nombre").value.trim();
  const precio = parseFloat(document.getElementById("precio").value);
  const stock = parseInt(document.getElementById("stock").value);
  
  // extraer valores de choices js
  const coloresSeleccionados = colorOpciones.getValue(true);
  const tallasSeleccionadas = tallaOpciones.getValue(true);

  // manejar la imagen | simulacion local
  const inputImagen = document.getElementById("imagen");
  let rutaImagen = "../../IMG/default.jpg"; 
  if (inputImagen.files && inputImagen.files.length > 0) {
    rutaImagen = "../../IMG/" + inputImagen.files[0].name;
  }

  // validar que los campos no esten vacios
  if (!nombre || isNaN(precio) || isNaN(stock) || tallasSeleccionadas.length === 0 || coloresSeleccionados.length === 0) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  // crear ID consecutivo
  const nuevoId = productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1; // nusca el ID más alto y le suma 1, si la lista esta vacia, empieza en 1

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
  localStorage.setItem("misProductos", JSON.stringify(productos));

  // limpiar form y choice js
  formularioProducto.reset();
  colorOpciones.removeActiveItems(); 
  tallaOpciones.clearStore();        
  
  alert("Producto agregado y guardado correctamente");

  // actualizar el "canva" dom
  renderizarProductos(productos); 
}

formularioProducto.addEventListener("submit", añadirProducto);