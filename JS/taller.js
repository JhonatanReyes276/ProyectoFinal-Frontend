
document.addEventListener("DOMContentLoaded", function () {

  // CONSTANTES
  const STORAGE_KEY = "misProductos_v4"; 
  const TAMANO_CANVAS = 500;
  const ANCHO_MIN = 0.05;        // el diseño puede medir desde 5 %
  const ANCHO_MAX = 1.5;         // hasta 150 % del ancho del lienzo
  const RADIO_ASA = 16;          // zona de toque de cada asa 
  const DISTANCIA_ROTAR = 34;    // separación del asa de giro 
  const DISENO_INICIAL = { cx: 0.5, cy: 0.42, ancho: 0.3, rot: 0, espejo: false };

  const COLORES = {
    negro: "#22252a",
    blanco: "#ffffff",
    naranja: "#ff6b4a",
    azul: "#7284a8",
    gris: "#9aa0a6",
    verde: "#198754",
    rojo: "#dc3545",
    café: "#795548"
  };

  // ELEMENTOS DEL HTML
  
  const contenedorCarrusel = document.getElementById("contenedor-productos");
  const mensajeVacio = document.getElementById("listaVacia");
  const carrusel = document.getElementById("carruselProductos");
  const nombreProducto = document.getElementById("nombre-producto");
  const precioProducto = document.getElementById("precio-producto");
  const opcionesProducto = document.getElementById("opciones-producto");
  const contenedorTallas = document.getElementById("opcionesTallas");
  const contenedorColores = document.getElementById("opcionesColores");
  const archivoLogo = document.getElementById("archivo-logo");
  const controlesDiseno = document.getElementById("controlesDiseno");
  const tamanoDiseno = document.getElementById("tamanoDiseno");
  const rotacionDiseno = document.getElementById("rotacionDiseno");
  const restablecerDiseno = document.getElementById("restablecerDiseno");
  const voltearDiseno = document.getElementById("voltearDiseno");
  const alternarGuias = document.getElementById("alternarGuias");
  const quitarDiseno = document.getElementById("quitarDiseno");
  const totalPedido = document.getElementById("totalLista");
  const cantidadProducto = document.getElementById("inputCantidadPrenda");
  const botonGuardar = document.getElementById("btn-guardar");
  const mensajeEstado = document.getElementById("mensajeEstado");


  let productosGuardados = [];
  let listaGuardada = [];

  try {
    productosGuardados = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    listaGuardada = JSON.parse(localStorage.getItem("miLista")) || [];
  } catch (error) {
    console.error("Error al leer el localStorage:", error);
  }

  // Cada producto lleva ademas de sus datos, su estado de personalizacion.
  // El diseño guarda: img, nombre, cx, cy, ancho,rot y espejo

  const productosTaller = listaGuardada.map(function (item) {
    const producto = productosGuardados.find(function (p) {
      return Number(p.id) === Number(item.id);
    });

    if (!producto) return null;

    return {
      ...producto,
      cantidad: Number(item.cantidad) || 1,
      color: producto.colores && producto.colores.includes("blanco") ? "blanco" : null,
      talla: null,
      diseno: null,
      mostrarGuia: true,
      imgBase: null,
      canvas: null
    };
  }).filter(function (producto) {
    return producto !== null;
  });

  let indiceActual = 0; // que producto del carrusel se está viendo

  // UTILIDADES
  function sinTildes(texto) {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function limitar(valor, minimo, maximo) {
    return Math.min(Math.max(valor, minimo), maximo);
  }

  function distancia(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  // Gira el punto (px, py) alrededor 

  function girar(px, py, angulo) {
    const c = Math.cos(angulo);
    const s = Math.sin(angulo);
    return { x: px * c - py * s, y: px * s + py * c };
  }

  // Deja el angulo entre -180 y 180
  function normalizar(angulo) {
    return Math.atan2(Math.sin(angulo), Math.cos(angulo));
  }

  // Imanta el angulo a multiplos de 45 cuando esta a menos de 3° de uno
  function imantar(angulo) {
    const a = normalizar(angulo);
    const paso = Math.PI / 4;
    const cercano = Math.round(a / paso) * paso;
    return Math.abs(a - cercano) < (3 * Math.PI) / 180 ? cercano : a;
  }

  function avisar(texto, esError) {
    mensajeEstado.textContent = texto;
    mensajeEstado.className = "small mt-2 mb-0 " + (esError ? "text-warning" : "text-light");
  }

  // Cuantos px del lienzo ocupa 1 px de pantalla 
  function escalaPantalla(canvas) {
    const r = canvas.getBoundingClientRect();
    return r.width ? canvas.width / r.width : 1;
  }

  // Posicion del puntero en coordenadas del lienzo 
  function puntoEvento(canvas, e) {
    const r = canvas.getBoundingClientRect();
    const k = canvas.width / r.width;
    return { x: (e.clientX - r.left) * k, y: (e.clientY - r.top) * k };
  }

 
  // GEOMETRIA Y DIBUJO
  // Centro, ancho y alto del diseño en pixeles del lienzo
  function medidas(p) {
    const d = p.diseno;
    const ancho = d.ancho * p.canvas.width;
    return {
      x: d.cx * p.canvas.width,
      y: d.cy * p.canvas.height,
      ancho: ancho,
      alto: ancho * (d.img.height / d.img.width)
    };
  }

  // Posición de las esquinas
  function asas(p, k) {
    const m = medidas(p);
    const d = p.diseno;

    const esquinas = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(function (s) {
      const g = girar((s[0] * m.ancho) / 2, (s[1] * m.alto) / 2, d.rot);
      return { x: m.x + g.x, y: m.y + g.y };
    });

    const g = girar(0, -m.alto / 2 - DISTANCIA_ROTAR * k, d.rot);
    return { m: m, esquinas: esquinas, rotar: { x: m.x + g.x, y: m.y + g.y } };
  }

  function zonaEn(p, punto, k) {
    const a = asas(p, k);
    const radio = RADIO_ASA * k;

    if (distancia(punto, a.rotar) <= radio) return "rotar";

    for (let i = 0; i < a.esquinas.length; i++) {
      if (distancia(punto, a.esquinas[i]) <= radio) return "escalar";
    }

    // pasamos el punto a coordenadas locales del diseño
    const local = girar(punto.x - a.m.x, punto.y - a.m.y, -p.diseno.rot);
    if (Math.abs(local.x) <= a.m.ancho / 2 && Math.abs(local.y) <= a.m.alto / 2) {
      return "mover";
    }

    return null;
  }

  // Marco punteado, en las esquinas y de giro
  function dibujarGuia(ctx, p, k) {
    const a = asas(p, k);

    ctx.save();
    ctx.lineWidth = 1.5 * k;
    ctx.strokeStyle = "#ff6b4a";
    ctx.setLineDash([6 * k, 4 * k]);

    ctx.beginPath();
    a.esquinas.forEach(function (e, i) {
      if (i === 0) ctx.moveTo(e.x, e.y);
      else ctx.lineTo(e.x, e.y);
    });
    ctx.closePath();
    ctx.stroke();

    // Linea que une el borde superior con el de giro
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo((a.esquinas[0].x + a.esquinas[1].x) / 2, (a.esquinas[0].y + a.esquinas[1].y) / 2);
    ctx.lineTo(a.rotar.x, a.rotar.y);
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.lineWidth = 2 * k;
    a.esquinas.forEach(function (e) {
      ctx.beginPath();
      ctx.arc(e.x, e.y, 7 * k, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });

    // Asa de giro 
    ctx.fillStyle = "#ff6b4a";
    ctx.strokeStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(a.rotar.x, a.rotar.y, 8 * k, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  // Se dibuja en una capa temporal en 3 pasos:
  //    la foto de la prenda
  //   se mezcla el color elegido
  //    se recorta con la silueta de la foto
  // Despues,dibuja el diseño solo encima de la prenda

  function dibujar(p, conGuia) {
    if (!p.canvas || !p.imgBase) return;
    if (conGuia === undefined) conGuia = true;

    const canvas = p.canvas;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const zoomExtra = 1; 
    const escala = Math.max(canvas.width / p.imgBase.width, canvas.height / p.imgBase.height) * zoomExtra;
    const w = p.imgBase.width * escala;
    const h = p.imgBase.height * escala;
    const x = (canvas.width - w) / 2;
    const y = (canvas.height - h) / 2;

    const capa = document.createElement("canvas");
    capa.width = canvas.width;
    capa.height = canvas.height;
    const c = capa.getContext("2d");

    c.drawImage(p.imgBase, x, y, w, h);

    c.globalCompositeOperation = "multiply";
    c.fillStyle = COLORES[p.color] || "#ffffff";
    c.fillRect(0, 0, capa.width, capa.height);

    c.globalCompositeOperation = "destination-in";
    c.drawImage(p.imgBase, x, y, w, h);

    if (p.diseno) {
      const m = medidas(p);

      c.globalCompositeOperation = "source-atop";
      c.save();
      c.translate(m.x, m.y);
      c.rotate(p.diseno.rot);
      if (p.diseno.espejo) c.scale(-1, 1);
      c.drawImage(p.diseno.img, -m.ancho / 2, -m.alto / 2, m.ancho, m.alto);
      c.restore();
    }

    ctx.drawImage(capa, 0, 0);

    if (conGuia && p.diseno && p.mostrarGuia) {
      dibujarGuia(ctx, p, escalaPantalla(canvas));
    }
  }

  
  //  GESTOS: mover, escalar, girar y pellizcar
  
  function actualizarCursor(canvas, p, punto) {
    if (!p.diseno || !p.mostrarGuia) {
      canvas.style.cursor = "default";
      return;
    }

    const zona = zonaEn(p, punto, escalaPantalla(canvas));
    canvas.style.cursor =
      zona === "rotar" ? "crosshair" :
      zona === "escalar" ? "nwse-resize" :
      zona === "mover" ? "move" : "pointer";
  }

  function activarGestos(canvas, p) {
    const punteros = new Map();   // los dedos que estan presionando
    let modo = null;              // "mover", "escalar", "rotar" o "pellizco"
    let inicio = {};              // datos del momento en que empezo el gesto

    function cambio() {
      dibujar(p);
      sincronizarControles(p);
    }

    canvas.addEventListener("pointerdown", function (e) {
      if (!p.diseno) return;

      const punto = puntoEvento(canvas, e);
      const k = escalaPantalla(canvas);
      const d = p.diseno;

      canvas.setPointerCapture(e.pointerId);
      punteros.set(e.pointerId, punto);

      // Dos dedos: pellizco (escala y gira a la vez)
      if (punteros.size === 2) {
        const dedos = Array.from(punteros.values());
        modo = "pellizco";
        inicio = {
          dist: Math.max(distancia(dedos[0], dedos[1]), 1),
          angulo: Math.atan2(dedos[1].y - dedos[0].y, dedos[1].x - dedos[0].x),
          ancho: d.ancho,
          rot: d.rot
        };
        return;
      }

      const zona = p.mostrarGuia ? zonaEn(p, punto, k) : (zonaEn(p, punto, k) === "mover" ? "mover" : null);

      if (zona === "rotar") {
        modo = "rotar";
      } else if (zona === "escalar") {
        modo = "escalar";
        const centro = { x: d.cx * canvas.width, y: d.cy * canvas.height };
        inicio = { dist: Math.max(distancia(punto, centro), 1), ancho: d.ancho };
      } else {
        modo = "mover";

        // Si toco fuera del diseño, lo llevamos hasta ese punto
        if (zona === null) {
          d.cx = limitar(punto.x / canvas.width, 0, 1);
          d.cy = limitar(punto.y / canvas.height, 0, 1);
        }
        inicio = { dx: d.cx * canvas.width - punto.x, dy: d.cy * canvas.height - punto.y };
      }

      canvas.style.cursor = "grabbing";
      cambio();
    });

    canvas.addEventListener("pointermove", function (e) {
      const punto = puntoEvento(canvas, e);

      // Sin presionar: solo cambiamos el cursor segun lo que haya debajo
      if (!punteros.has(e.pointerId)) {
        actualizarCursor(canvas, p, punto);
        return;
      }

      punteros.set(e.pointerId, punto);

      const d = p.diseno;
      if (!d) return;

      const W = canvas.width;
      const H = canvas.height;

      if (modo === "pellizco" && punteros.size === 2) {
        const dedos = Array.from(punteros.values());
        const dist = distancia(dedos[0], dedos[1]);
        const angulo = Math.atan2(dedos[1].y - dedos[0].y, dedos[1].x - dedos[0].x);

        d.ancho = limitar(inicio.ancho * (dist / inicio.dist), ANCHO_MIN, ANCHO_MAX);
        d.rot = normalizar(inicio.rot + (angulo - inicio.angulo));

      } else if (modo === "mover") {
        d.cx = limitar((punto.x + inicio.dx) / W, 0, 1);
        d.cy = limitar((punto.y + inicio.dy) / H, 0, 1);
      } else if (modo === "escalar") {

        // El tamaño cambia en la misma proporcion en que te alejas del centro
        const dist = distancia(punto, { x: d.cx * W, y: d.cy * H });
        d.ancho = limitar(inicio.ancho * (dist / inicio.dist), ANCHO_MIN, ANCHO_MAX);
      } else if (modo === "rotar") {

        // El asa esta arriba del diseño, por eso se suma 90 grados
        d.rot = imantar(Math.atan2(punto.y - d.cy * H, punto.x - d.cx * W) + Math.PI / 2);
      } else {
        return;
      }

      cambio();
    });

    function soltar(e) {
      punteros.delete(e.pointerId);

      if (punteros.size < 2 && modo === "pellizco") modo = null;

      if (punteros.size === 0) {
        modo = null;
        actualizarCursor(canvas, p, puntoEvento(canvas, e));
      }
    }
    canvas.addEventListener("pointerup", soltar);
    canvas.addEventListener("pointercancel", soltar);

    // Rueda del mouse: agranda o achica el diseño
    canvas.addEventListener("wheel", function (e) {
      if (!p.diseno) return;
      e.preventDefault();

      const factor = e.deltaY < 0 ? 1.06 : 1 / 1.06;
      p.diseno.ancho = limitar(p.diseno.ancho * factor, ANCHO_MIN, ANCHO_MAX);
      cambio();
    }, { passive: false });
  }

 
  // PANEL DERECHO: tallas, colores y controles del diseño

  function dibujarTallas(p) {
    contenedorTallas.innerHTML = "";

    p.tallas.forEach(function (talla) {
      const boton = document.createElement("button");
      boton.type = "button";
      boton.className = "chip-talla" + (p.talla === talla ? " activo" : "");
      boton.textContent = talla;

      boton.addEventListener("click", function () {
        p.talla = talla;
        dibujarTallas(p);
      });

      contenedorTallas.appendChild(boton);
    });
  }

  function dibujarColores(p) {
    contenedorColores.innerHTML = "";

    p.colores.forEach(function (color) {
      const boton = document.createElement("button");
      boton.type = "button";
      boton.className =
        "circulo color-" + sinTildes(color) + (p.color === color ? " activo" : "");
      boton.title = color;
      boton.setAttribute("aria-label", color);

      boton.addEventListener("click", function () {
        p.color = color;
        dibujar(p);
        dibujarColores(p);
      });

      contenedorColores.appendChild(boton);
    });
  }

  // Los deslizadores reflejan lo que se hace con el mouse 

  function sincronizarControles(p) {
    if (productosTaller[indiceActual] !== p || !p.diseno) return;

    tamanoDiseno.value = Math.round(p.diseno.ancho * 100);
    rotacionDiseno.value = Math.round((p.diseno.rot * 180) / Math.PI);
  }

  function actualizarControlesDiseno(p) {
    controlesDiseno.classList.toggle("d-none", !p.diseno);
    alternarGuias.textContent = p.mostrarGuia ? "Ocultar guías" : "Mostrar guías";
    sincronizarControles(p);
  }

  function mostrarProducto(p) {
    nombreProducto.textContent = p.nombre;
    precioProducto.textContent = "$" + Number(p.precio).toLocaleString("es-CO");
    cantidadProducto.value = p.cantidad;
    cantidadProducto.max = p.stock || "";

    archivoLogo.value = ""; // permite volver a elegir el mismo archivo
    mensajeEstado.textContent = "";

    dibujarTallas(p);
    dibujarColores(p);
    actualizarControlesDiseno(p);
  }

  function actualizarTotal() {
    const total = productosTaller.reduce(function (acumulado, producto) {
      return acumulado + Number(producto.precio) * producto.cantidad;
    }, 0);

    totalPedido.textContent = "$" + total.toLocaleString("es-CO");
  }

  // CARRUSEL
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
      if (index === 0) elemento.classList.add("active");

      const canvas = document.createElement("canvas");
      canvas.width = TAMANO_CANVAS;
      canvas.height = TAMANO_CANVAS;
      canvas.classList.add("canvas-prenda");
      canvas.setAttribute("aria-label", "Vista previa de " + producto.nombre);

      producto.canvas = canvas;
      activarGestos(canvas, producto);

      const imagen = new Image();
      imagen.onload = function () {
        producto.imgBase = imagen;
        dibujar(producto);
      };
      imagen.onerror = function () {
        console.error("No se pudo cargar la imagen:", imagen.src);
      };
      imagen.src = producto.imagen.startsWith("data:")
        ? producto.imagen
        : "../" + producto.imagen;

      const contenedorImagen = document.createElement("div");
      contenedorImagen.classList.add("text-center");
      contenedorImagen.appendChild(canvas);
      elemento.appendChild(contenedorImagen);

      contenedorCarrusel.appendChild(elemento);
    });

    indiceActual = 0;
    mostrarProducto(productosTaller[0]);
    actualizarTotal();

    carrusel
      .querySelectorAll(".carousel-control-prev, .carousel-control-next")
      .forEach(function (boton) {
        boton.classList.toggle("d-none", productosTaller.length <= 1);
      });
  }

  // Al mover el carrusel, el panel derecho muestra el producto de ese slide
  carrusel.addEventListener("slid.bs.carousel", function (evento) {
    const productoActual = productosTaller[evento.to];

    if (productoActual) {
      indiceActual = evento.to;
      mostrarProducto(productoActual);
      dibujar(productoActual); // redibuja para que las asas midan bien en este slide
    }
  });


  //  SUBIR Y AJUSTAR EL DISEÑO
 
  archivoLogo.addEventListener("change", function () {
    const p = productosTaller[indiceActual];
    const archivo = archivoLogo.files[0];
    if (!p || !archivo) return;

    const tiposValidos = ["image/png", "image/jpeg", "image/webp"];
    if (!tiposValidos.includes(archivo.type)) {
      avisar("El diseño debe ser PNG, JPG o WEBP.", true);
      archivoLogo.value = "";
      return;
    }

    if (archivo.size > 2 * 1024 * 1024) {
      avisar("El archivo pesa más de 2 MB. Prueba con uno más liviano.", true);
      archivoLogo.value = "";
      return;
    }

    const lector = new FileReader();
    lector.onload = function () {
      const img = new Image();
      img.onload = function () {
        p.diseno = Object.assign({ img: img, nombre: archivo.name }, DISENO_INICIAL);
        dibujar(p);

        // Si el usuario ya cambio de slide, no tocamos el panel
        if (productosTaller[indiceActual] === p) {
          actualizarControlesDiseno(p);
          avisar("", false);
        }
      };
      img.src = lector.result;
    };
    lector.readAsDataURL(archivo);
  });

  tamanoDiseno.addEventListener("input", function () {
    const p = productosTaller[indiceActual];
    if (!p || !p.diseno) return;

    p.diseno.ancho = limitar(Number(tamanoDiseno.value) / 100, ANCHO_MIN, ANCHO_MAX);
    dibujar(p);
  });

  rotacionDiseno.addEventListener("input", function () {
    const p = productosTaller[indiceActual];
    if (!p || !p.diseno) return;

    p.diseno.rot = (Number(rotacionDiseno.value) * Math.PI) / 180;
    dibujar(p);
  });

  restablecerDiseno.addEventListener("click", function () {
    const p = productosTaller[indiceActual];
    if (!p || !p.diseno) return;

    Object.assign(p.diseno, DISENO_INICIAL);
    dibujar(p);
    sincronizarControles(p);
  });

  voltearDiseno.addEventListener("click", function () {
    const p = productosTaller[indiceActual];
    if (!p || !p.diseno) return;

    p.diseno.espejo = !p.diseno.espejo;
    dibujar(p);
  });

  alternarGuias.addEventListener("click", function () {
    const p = productosTaller[indiceActual];
    if (!p) return;

    p.mostrarGuia = !p.mostrarGuia;
    alternarGuias.textContent = p.mostrarGuia ? "Ocultar guías" : "Mostrar guías";
    dibujar(p);
  });

  quitarDiseno.addEventListener("click", function () {
    const p = productosTaller[indiceActual];
    if (!p) return;

    p.diseno = null;
    archivoLogo.value = "";
    actualizarControlesDiseno(p);
    dibujar(p);
  });

 
  // CANTIDAD

  cantidadProducto.addEventListener("input", function () {
    const p = productosTaller[indiceActual];
    if (!p) return;

    let valor = parseInt(cantidadProducto.value, 10);
    if (isNaN(valor) || valor < 1) valor = 1;
    if (p.stock && valor > p.stock) valor = p.stock;

    p.cantidad = valor;
    actualizarTotal();
  });


  //  GUARDAR EL PRODUCTO PERSONALIZADO
  function crearMiniatura(canvas) {
    const mini = document.createElement("canvas");
    mini.width = 240;
    mini.height = 240;

    const c = mini.getContext("2d");
    c.fillStyle = "#e8e2d5"; // JPEG no admite transparencia, asi que se rellena
    c.fillRect(0, 0, 240, 240);
    c.drawImage(canvas, 0, 0, 240, 240);

    return mini.toDataURL("image/jpeg", 0.7);
  }

  function leerPedido() {
    try {
      return JSON.parse(localStorage.getItem("miPedido")) || [];
    } catch (error) {
      return [];
    }
  }

  botonGuardar.addEventListener("click", function () {
    const p = productosTaller[indiceActual];
    if (!p) return;

    if (!p.talla) {
      avisar("Elige una talla antes de guardar.", true);
      return;
    }

    // La miniatura se toma sin nada para que quede limpia
    let vistaPrevia = "";
    try {
      dibujar(p, false);
      vistaPrevia = crearMiniatura(p.canvas);

    } catch (error) {
      // Pasa si abres el HTML con doble clic 
      console.warn("No se pudo crear la vista previa:", error);
    } finally {
      dibujar(p, true); 
    }

    const pedido = leerPedido();
    const registro = {
      id: p.id,
      nombre: p.nombre,
      precio: p.precio,
      cantidad: p.cantidad,
      talla: p.talla,
      color: p.color,
      diseno: p.diseno ? p.diseno.nombre : null,
      ajustesDiseno: p.diseno
        ? {
            cx: p.diseno.cx,
            cy: p.diseno.cy,
            ancho: p.diseno.ancho,
            rot: p.diseno.rot,
            espejo: p.diseno.espejo
          }
        : null,
      vistaPrevia: vistaPrevia
    };

    // Si ese producto ya estaba guardado, se remplaza
    const posicion = pedido.findIndex(function (item) {
      return item.id === p.id;
    });
    if (posicion === -1) {
      pedido.push(registro);
    } else {
      pedido[posicion] = registro;
    }

    try {
      localStorage.setItem("miPedido", JSON.stringify(pedido));
      avisar("Producto guardado con éxito.", false);
    } catch (error) {
      avisar("No se pudo guardar: el almacenamiento está lleno.", true);
    }
  });

  renderizarCarrusel();
});