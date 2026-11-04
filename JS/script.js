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

  if (valor === "" || !regex.test(valor) || valor.length < 9 || valor.length > 11) {
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

  if (valor === "" || !regex.test(valor) || valor.indexOf(" ") === -1) { // (valor.indexOf(' ') Ubica donde hay un espacio)  === -1 obliga a que hayan 2 palabras dado que hay 2 espacios
    return marcarInvalido(input);
  }
  return marcarValido(input);
}

formulario.addEventListener("submit", enviar);

const productos = [
  {
    id: 1,
    nombre: "Camiseta Clásica",
    precio: 45000,
    imagen: "IMG/camisetas.jpg",
    tallas: ["S", "M", "L", "XL"],
    colores: ["negro", "blanco", "naranja"]
  },
  {
    id: 2,
    nombre: "Camiseta Oversize",
    precio: 55000,
    imagen: "IMG/camisetas.jpg",
    tallas: ["M", "L", "XL"],
    colores: ["negro", "gris", "azul", "verde", "rojo"]
  },
  {
    id: 3,
    nombre: "Gorra Snapback",
    precio: 35000,
    imagen: "IMG/gorras.jpg",
    tallas: ["M", "L"],
    colores: ["negro", "blanco", "naranja", "verde"]
  },
  {
    id: 4,
    nombre: "Gorra Trucker",
    precio: 32000,
    imagen: "IMG/gorras.jpg",
    tallas: ["S", "M"],
    colores: ["azul", "gris", "rojo"]
  },
  {
    id: 5,
    nombre: "Medias Estampadas",
    precio: 18000,
    imagen: "IMG/medias.jpg",
    tallas: ["35-37", "27-30", "38-40", "41-43", "44-46"],
    colores: ["blanco", "negro", "azul"]
  },
  {
    id: 6,
    nombre: "Medias Largas",
    precio: 20000,
    imagen: "IMG/medias.jpg",
    tallas: ["31-34", "35-37", "27-30", "38-40", "41-43", "44-46"],
    colores: ["gris", "naranja"]
  },
  {
    id: 7,
    nombre: "Medias infantiles",
    precio: 12000,
    imagen: "IMG/medias.jpg",
    tallas: ["23-26", "27-30", "31-34"],
    colores: ["blanco", "negro", "azul", "verde", "rojo"]
  },
  {
    id: 8,
    nombre: "Medias tobilleras",
    precio: 12000,
    imagen: "IMG/medias.jpg",
    tallas: ["35-37", "27-30", "38-40", "41-43", "44-46"],
    colores: ["blanco", "negro", "azul", "verde", "rojo", "café", "naranja"]
  },
];

const tablaBody = document.getElementById('cuerpo-tabla');

function renderizarProductos(lista) {
  tablaBody.innerHTML = '';

  lista.forEach((producto, index) => {
    const fila = document.createElement('tr');

    const htmlTallas = producto.tallas
      .map(talla => `<span class="badge bg-secondary me-1">${talla}</span>`)
      .join('');

    const htmlColores = producto.colores
      .map(color => `<span class="badge bg-light text-dark border me-1">${color}</span>`)
      .join('');

    fila.innerHTML = `
      <th class="text-center align-middle">${index + 1}</th>
      <td class="text-center align-middle">
        <img src="${producto.imagen}" alt="${producto.nombre}" class="img-thumbnail" style="width: 50px; height: 50px; object-fit: cover;">
      </td>
      <td class="align-middle fw-semibold">${producto.nombre}</td>
      <td class="align-middle text-success fw-bold">$${producto.precio.toLocaleString('es-CO')}</td>
      <td class="align-middle">
        <div class="d-flex flex-wrap gap-1">${htmlTallas}</div>
      </td>
      <td class="align-middle">
        <div class="d-flex flex-wrap gap-1">${htmlColores}</div>
      </td>
    `;

    tablaBody.appendChild(fila);
  });
}

renderizarProductos(productos);