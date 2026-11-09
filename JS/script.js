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

const productos = [
  {
    id: 1,
    nombre: "Camiseta Clásica",
    precio: 45000,
    imagen: "../../IMG/camisetas.jpg",
    tallas: ["S", "M", "L", "XL"],
    colores: ["negro", "blanco", "naranja"],
  },
  {
    id: 2,
    nombre: "Camiseta Oversize",
    precio: 55000,
    imagen: "../../IMG/camisetas.jpg",
    tallas: ["M", "L", "XL"],
    colores: ["negro", "gris", "azul", "verde", "rojo"],
  },
  {
    id: 3,
    nombre: "Gorra Snapback",
    precio: 35000,
    imagen: "../../IMG/gorras.jpg",
    tallas: ["M", "L"],
    colores: ["negro", "blanco", "naranja", "verde"],
  },
  {
    id: 4,
    nombre: "Gorra Trucker",
    precio: 32000,
    imagen: "../../IMG/gorras.jpg",
    tallas: ["S", "M"],
    colores: ["azul", "gris", "rojo"],
  },
  {
    id: 5,
    nombre: "Medias Estampadas",
    precio: 18000,
    imagen: "../../IMG/medias.jpg",
    tallas: ["35-37", "27-30", "38-40", "41-43", "44-46"],
    colores: ["blanco", "negro", "azul"],
  },
  {
    id: 6,
    nombre: "Medias Largas",
    precio: 20000,
    imagen: "../../IMG/medias.jpg",
    tallas: ["31-34", "35-37", "27-30", "38-40", "41-43", "44-46"],
    colores: ["gris", "naranja"],
  },
  {
    id: 7,
    nombre: "Medias infantiles",
    precio: 12000,
    imagen: "../../IMG/medias.jpg",
    tallas: ["23-26", "27-30", "31-34"],
    colores: ["blanco", "negro", "azul", "verde", "rojo"],
  },
  {
    id: 8,
    nombre: "Medias tobilleras",
    precio: 12000,
    imagen: "../../IMG/medias.jpg",
    tallas: ["35-37", "27-30", "38-40", "41-43", "44-46"],
    colores: ["blanco", "negro", "azul", "verde", "rojo", "café", "naranja"],
  },
];

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

