
document.addEventListener("DOMContentLoaded", function () {
  const listaProductos = document.getElementById("listaProductos");

  // Si no estamos en la página del catálogo, no ejecutamos esto
  if (!listaProductos) return;

  // IMPORTANTE: Asegúrate de que la función renderizarCatalogo() 
  // (la que crea el HTML de las tarjetas) también esté en este archivo.
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