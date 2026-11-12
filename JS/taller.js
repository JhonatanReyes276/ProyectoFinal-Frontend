






document.addEventListener("DOMContentLoaded", function () {

  // ELEMENTOS DEL HTML
  const contenedorCarrusel = document.getElementById("contenedor-productos");
  const mensajeVacio = document.getElementById("listaVacia");
  const carrusel = document.getElementById("carruselProductos");

  const nombreProducto = document.getElementById("nombre-producto");
  const precioProducto = document.getElementById("precio-producto");

  const opcionesProducto = document.getElementById("opciones-producto");

  const totalPedido = document.getElementById("totalLista");
  const cantidadProducto = document.getElementById("inputCantidadPrenda");

  
  // RECUPERAR INFORMACIÓN DEL LOCAL STORAGE
  const productosGuardados = JSON.parse(
    localStorage.getItem("STORAGE_KEY")
  ) || [];

  const listaGuardada = JSON.parse(
    localStorage.getItem("miLista")
  ) || [];

  // Se relacionan los productos con sus datos
  const productosTaller = listaGuardada.map(function (item) {

    const producto = productosGuardados.find(function (p) {
      return Number(p.id) === Number(item.id);
    });

    if (!producto) return null;

    return {
      ...producto,
      cantidad: Number(item.cantidad) || 1
    };

  }).filter(function (producto) {
    return producto !== null;
  });


  // Funcion para mostrar el producto
  function mostrarProducto(producto) {

    nombreProducto.textContent = producto.nombre;

    precioProducto.textContent =
      "$" + Number(producto.precio).toLocaleString("es-CO");

    cantidadProducto.value = producto.cantidad;
  }


  // Función para totalizar el valor a través de reduce
  function actualizarTotal() {

    const total = productosTaller.reduce(function (acumulado, producto) {

      return acumulado + (
        Number(producto.precio) * producto.cantidad
      );

    }, 0);

    totalPedido.textContent =
      "$" + total.toLocaleString("es-CO");
  }


  // Renderización para mostrar los productos en el carrusel de HTML
  function renderizarCarrusel() {

    if (productosTaller.length === 0) {

      mensajeVacio.classList.remove("d-none");
      carrusel.classList.add("d-none");
      opcionesProducto.classList.add("d-none");

      nombreProducto.textContent = "";
      precioProducto.textContent = "";

      actualizarTotal();

      return;
    }

    mensajeVacio.classList.add("d-none");
    carrusel.classList.remove("d-none");
    opcionesProducto.classList.remove("d-none");

    contenedorCarrusel.innerHTML = "";

    productosTaller.forEach(function (producto, index) {

      const elemento = document.createElement("div");
      elemento.classList.add("carousel-item");

      if (index === 0) {
        elemento.classList.add("active");
      }

      const imagen = document.createElement("img");

      imagen.src = producto.imagen.startsWith("data:")
        ? producto.imagen
        : "../" + producto.imagen;

      imagen.alt = producto.nombre;
      imagen.classList.add("img-fluid");

      imagen.style.maxHeight = "350px";
      imagen.style.objectFit = "contain";

      const contenedorImagen = document.createElement("div");
      contenedorImagen.classList.add("text-center");

      contenedorImagen.appendChild(imagen);
      elemento.appendChild(contenedorImagen);

      contenedorCarrusel.appendChild(elemento);

    });

    mostrarProducto(productosTaller[0]);

    actualizarTotal();

    // Si no existen productos se ocultan las flechas del carrusel
    const botonesCarrusel = carrusel.querySelectorAll(
      ".carousel-control-prev, .carousel-control-next"
    );

    botonesCarrusel.forEach(function (boton) {

      boton.classList.toggle(
        "d-none",
        productosTaller.length <= 1
      );

    });

  }


  // Se cambia el producto al mover el carrusel
  carrusel.addEventListener("slid.bs.carousel", function (evento) {

    const productoActual = productosTaller[evento.to];

    if (productoActual) {
      mostrarProducto(productoActual);
    }

  });

  renderizarCarrusel();

});
