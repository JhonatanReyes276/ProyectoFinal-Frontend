document.addEventListener("DOMContentLoaded", function () {

  // CLAVE DE LOCALSTORAGE
  const CLAVE_STORAGE_CARRITO = "miPedido";

  // ELEMENTOS DEL DOM SEGÚN TU HTML
  const contenedorListaProductos = document.getElementById("lista-productos-carrito");
  const elementoCarritoVacio = document.getElementById("carrito-vacio");
  const cantidadProductos = document.getElementById("texto-cantidad-productos");
  
  const resumenSubtotal = document.getElementById("resumen-subtotal");
  const resumenEnvio = document.getElementById("resumen-envio");
  const resumenDescuento = document.getElementById("resumen-descuento");
  const resumenTotal = document.getElementById("resumen-total");
  const botonFinalizarPedido = document.getElementById("btn-finalizar-pedido");

  // Lee pedido desde el localStorage
  function obtenerPedidoGuardado() {
    try {
      return JSON.parse(localStorage.getItem(CLAVE_STORAGE_CARRITO)) || [];
    } catch (error) {
      console.error("Error al leer miPedido del localStorage:", error);
      return [];
    }
  }

  // Guarda cambios en el localStorage
  function guardarPedidoActualizado(pedido) {
    try {
      localStorage.setItem(CLAVE_STORAGE_CARRITO, JSON.stringify(pedido));
    } catch (error) {
      console.error("Error al guardar en el localStorage:", error);
    }
  }

  // Actualiza los valores del resumen del pedido
  function actualizarResumenPedido(pedido) {
    const subtotal = pedido.reduce(function (acumulador, item) {
      return acumulador + (Number(item.precio) * Number(item.cantidad));
    }, 0);

    const envio = subtotal > 0 ? 10000 : 0; 
    const descuento = 0; 
    const totalGeneral = subtotal + (subtotal > 0 ? envio : 0) - descuento;

    if (resumenSubtotal) resumenSubtotal.textContent = "$" + subtotal.toLocaleString("es-CO");
    if (resumenEnvio) resumenEnvio.textContent = subtotal > 0 ? "$" + envio.toLocaleString("es-CO") : "$0";
    if (resumenDescuento) resumenDescuento.textContent = "-$" + descuento.toLocaleString("es-CO");
    if (resumenTotal) resumenTotal.textContent = "$" + totalGeneral.toLocaleString("es-CO");

    // Habilita o deshabilita el botón de finalizar pedido
    if (botonFinalizarPedido) {
      if (pedido.length > 0) {
        botonFinalizarPedido.removeAttribute("disabled");
      } else {
        botonFinalizarPedido.setAttribute("disabled", "true");
      }
    }

    // Actualiza contador de articulos
    if (cantidadProductos) {
      const totalUnidades = pedido.reduce((acc, item) => acc + Number(item.cantidad), 0);
      cantidadProductos.textContent = totalUnidades + (totalUnidades === 1 ? " Artículo en tu bolsa" : " Artículos en tu bolsa");
    }
  }

  // Función para eliminar un item del carrito
  window.eliminarItemCarrito = function (index) {
    let pedido = obtenerPedidoGuardado();
    pedido.splice(index, 1);
    guardarPedidoActualizado(pedido);
    renderizarCarrito();
  };

  // Renderiza la interfaz del carrito
  function renderizarCarrito() {
    const pedido = obtenerPedidoGuardado();

    if (!contenedorListaProductos) return;

    if (pedido.length === 0) {
      if (elementoCarritoVacio) elementoCarritoVacio.classList.remove("d-none");
      
      const listaCarrito = document.getElementById("contenedor-cards-dinamicas");
      if (listaCarrito) listaCarrito.remove();

      actualizarResumenPedido(pedido);
      return;
    }

    if (elementoCarritoVacio) elementoCarritoVacio.classList.add("d-none");

    let listaCarrito = document.getElementById("contenedor-cards-dinamicas");
    if (!listaCarrito) {
      listaCarrito = document.createElement("div");
      listaCarrito.id = "contenedor-cards-dinamicas";
      listaCarrito.className = "d-flex flex-column gap-3 mt-3";
      contenedorListaProductos.appendChild(listaCarrito);
    }

    listaCarrito.innerHTML = "";

    pedido.forEach(function (item, index) {
      const articulo = document.createElement("div");
      articulo.className = "card border-0 shadow-sm rounded-3 p-3 bg-white text-dark d-flex flex-row align-items-center justify-content-between gap-3";
      const precioTotalItem = Number(item.precio) * Number(item.cantidad);

      articulo.innerHTML = `
        <div class="d-flex align-items-center gap-3">
          <img src="${item.vistaPrevia || '../IMG/camisetas.jpg'}" alt="${item.nombre}" class="rounded border" style="width: 75px; height: 75px; object-fit: cover;">
          <div>
            <h5 class="mb-1 fw-bold text-dark">${item.nombre}</h5>
            <p class="mb-1 text-muted small">
              Talla: <span class="badge bg-secondary">${item.talla || 'N/A'}</span> | 
              Color: <span class="text-capitalize fw-semibold">${item.color || 'Estándar'}</span> |
              Cantidad: <span class="fw-semibold text-dark">${item.cantidad}</span>
              ${item.diseno ? `<br>Diseño: <span class="text-info">${item.diseno}</span>` : ''}
            </p>
            <span class="fw-bold text-tomato">$${precioTotalItem.toLocaleString("es-CO")}</span>
          </div>
        </div>

        <div class="d-flex align-items-center">
          <button class="btn btn-outline-danger btn-sm rounded-circle d-flex align-items-center justify-content-center" 
                  style="width: 35px; height: 35px;" 
                  onclick="eliminarItemCarrito(${index})" title="Eliminar producto">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      `;

      listaCarrito.appendChild(articulo);
    });

    actualizarResumenPedido(pedido);
  }

  renderizarCarrito();
});