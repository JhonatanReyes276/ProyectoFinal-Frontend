document.addEventListener("DOMContentLoaded", function () {

  const STORAGE_KEY = "misProductos_v4";
  const TAMANO_CANVAS = 500;     
  const ANCHO_MIN = 0.05;        
  const ANCHO_MAX = 1.5;        
  const RADIO_ASA = 16;          
  const DISTANCIA_ROTAR = 34;    
  const DISENO_INICIAL = { cx: 0.5, cy: 0.42, ancho: 0.3, rot: 0, espejo: false }; 
  const LADO_BORDADO = 480;      


  const RECARGO_ESTAMPADO = 10000;  
  const RECARGO_BORDADO = 25000;    

  const COLORES = {
    blanco: "#ffffff",
    naranja: "#ff6b4a",
    azul: "#7284a8",
    gris: "#9aa0a6",
    verde: "#198754",
    rojo: "#dc3545",
    café: "#795548"
  };

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
  const desplazarX = document.getElementById("desplazarX");
  const desplazarY = document.getElementById("desplazarY");
  const restablecerDiseno = document.getElementById("restablecerDiseno");
  const voltearDiseno = document.getElementById("voltearDiseno");
  const alternarGuias = document.getElementById("alternarGuias");
  const alternarBordado = document.getElementById("alternarBordado");
  const chipsEstilo = document.querySelectorAll(".chip-estilo");
  const quitarDiseno = document.getElementById("quitarDiseno");
  const totalPedido = document.getElementById("totalLista");
  const cantidadProducto = document.getElementById("inputCantidadPrenda");
  const botonGuardar = document.getElementById("btn-guardar");
  const mensajeEstado = document.getElementById("mensajeEstado");

  // Los deslizadores de desplazar van de 0 a 100.
  [desplazarX, desplazarY].forEach(function (s) {
    if (s) { s.min = 0; s.max = 100; s.step = 1; }
  });

  if (!desplazarX || !desplazarY) {
    console.warn("No se encontro #desplazarX o #desplazarY en el HTML: revisa los id de los deslizadores.");
  }

  let productosGuardados = [];
  let listaGuardada = [];

  try {
    productosGuardados = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    listaGuardada = JSON.parse(localStorage.getItem("miLista")) || [];
  } catch (error) {
    console.error("Error al leer el localStorage:", error);
  }

  // Cada producto trae sus datos y ademas lo que el usuario va personalizando.
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

  let indiceActual = 0; // cual producto del carrusel se esta viendo

  //  FUNCIONES DE AYUDA

  // Quita las tildes de una palabra para armar nombres de clases
  function sinTildes(texto) {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  // Evita que un numero se pase del minimo o del maximo
  function limitar(valor, minimo, maximo) {
    return Math.min(Math.max(valor, minimo), maximo);
  }

  // Distancia entre dos puntos
  function distancia(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  // Gira un punto alrededor del centro
  function girar(px, py, angulo) {
    const c = Math.cos(angulo);
    const s = Math.sin(angulo);
    return { x: px * c - py * s, y: px * s + py * c };
  }

  // Deja el angulo entre -180 y 180 grados
  function normalizar(angulo) {
    return Math.atan2(Math.sin(angulo), Math.cos(angulo));
  }

  // Al girar, el diseno se pega a 0, 45, 90... grados cuando esta muy cerca
  function imantar(angulo) {
    const a = normalizar(angulo);
    const paso = Math.PI / 4;
    const cercano = Math.round(a / paso) * paso;
    return Math.abs(a - cercano) < (3 * Math.PI) / 180 ? cercano : a;
  }

  // Muestra un mensaje debajo del panel (en amarillo si es un error)
  function avisar(texto, esError) {
    mensajeEstado.textContent = texto;
    mensajeEstado.className = "small mt-2 mb-0 " + (esError ? "text-warning" : "text-light");
  }

  // Cuanto mide en la prenda cada punto de la pantalla
  // (sirve porque la prenda se ve mas grande o mas pequena segun la pantalla)
  function escalaPantalla(canvas) {
    const r = canvas.getBoundingClientRect();
    return r.width ? canvas.width / r.width : 1;
  }

  // Donde esta el mouse (o el dedo) dentro de la prenda
  function puntoEvento(canvas, e) {
    const r = canvas.getBoundingClientRect();
    const k = canvas.width / r.width;
    return { x: (e.clientX - r.left) * k, y: (e.clientY - r.top) * k };
  }

  //  PRECIOS

  // Convierte un numero en texto de precio, por ejemplo $35.000
  function formatearPrecio(valor) {
    return "$" + Number(valor).toLocaleString("es-CO");
  }

  // Recargo que se cobra por el diseno de una prenda (0 si no tiene diseno)
  function recargoDiseno(p) {
    if (!p.diseno) return 0;
    return p.diseno.estilo === "bordado" ? RECARGO_BORDADO : RECARGO_ESTAMPADO;
  }

  // Precio de UNA prenda: precio base + recargo del diseno
  function precioUnitario(p) {
    return Number(p.precio) + recargoDiseno(p);
  }

  // ============================================================
  //  EFECTO BORDADO
  //  Toma la imagen del usuario y le da aspecto de hilo:
  //  pocos colores, bordes limpios, puntadas y un poco de relieve.
  //  Se hace una sola vez al subir la imagen, no cada vez que se dibuja.
  // ============================================================
  function crearBordado(img) {
    // Achicamos la imagen si es muy grande, para que sea rapido
    const escala = Math.min(1, LADO_BORDADO / Math.max(img.width, img.height));
    const w = Math.max(1, Math.round(img.width * escala));
    const h = Math.max(1, Math.round(img.height * escala));

    const base = document.createElement("canvas");
    base.width = w;
    base.height = h;
    const c = base.getContext("2d");
    c.drawImage(img, 0, 0, w, h);

    // Reducir los colores (como si fueran hilos) y dejar los bordes bien definidos
    const datos = c.getImageData(0, 0, w, h);
    const px = datos.data;
    const paso = 255 / 3; // 4 tonos por cada color
    for (let i = 0; i < px.length; i += 4) {
      if (px[i + 3] < 128) {
        px[i + 3] = 0;
        continue;
      }
      px[i] = Math.round(px[i] / paso) * paso;
      px[i + 1] = Math.round(px[i + 1] / paso) * paso;
      px[i + 2] = Math.round(px[i + 2] / paso) * paso;
      px[i + 3] = 255;
    }
    c.putImageData(datos, 0, 0);

    // Dibujar las puntadas (rayitas en diagonal, unas oscuras y otras claras).
    // "source-atop" hace que solo se pinten sobre la imagen y no sobre el fondo transparente.
    const separacion = Math.max(3, Math.round(Math.max(w, h) / 70));
    c.globalCompositeOperation = "source-atop";
    c.lineCap = "round";

    c.strokeStyle = "rgba(0, 0, 0, 0.28)";
    c.lineWidth = separacion * 0.4;
    for (let x = -h; x < w + h; x += separacion) {
      c.beginPath();
      c.moveTo(x, 0);
      c.lineTo(x - h, h);
      c.stroke();
    }

    c.strokeStyle = "rgba(255, 255, 255, 0.2)";
    c.lineWidth = separacion * 0.22;
    for (let x = -h + separacion / 2; x < w + h; x += separacion) {
      c.beginPath();
      c.moveTo(x, 0);
      c.lineTo(x - h, h);
      c.stroke();
    }
    c.globalCompositeOperation = "source-over";

    // Una sombra pegada al borde, para que parezca que el hilo esta levantado
    const sombra = document.createElement("canvas");
    sombra.width = w;
    sombra.height = h;
    const s = sombra.getContext("2d");
    s.drawImage(base, 0, 0);
    s.globalCompositeOperation = "source-in";
    s.fillStyle = "rgba(0, 0, 0, 0.35)";
    s.fillRect(0, 0, w, h);

    const resultado = document.createElement("canvas");
    resultado.width = w;
    resultado.height = h;
    const r = resultado.getContext("2d");
    const desfase = Math.max(1, Math.round(Math.max(w, h) / 220));
    r.drawImage(sombra, desfase, desfase);
    r.drawImage(base, 0, 0);

    return resultado;
  }

  //  MEDIDAS Y DIBUJO

  // Donde esta el diseno y cuanto mide, en puntos de la prenda
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

  // Donde quedan los circulos de las esquinas y el circulo de girar
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

  // Dice que se esta tocando: el circulo de girar, una esquina, el diseno o nada
  function zonaEn(p, punto, k) {
    const a = asas(p, k);
    const radio = RADIO_ASA * k;

    if (distancia(punto, a.rotar) <= radio) return "rotar";

    for (let i = 0; i < a.esquinas.length; i++) {
      if (distancia(punto, a.esquinas[i]) <= radio) return "escalar";
    }

    // Miramos si el punto cae dentro del diseno (aunque este girado)
    const local = girar(punto.x - a.m.x, punto.y - a.m.y, -p.diseno.rot);
    if (Math.abs(local.x) <= a.m.ancho / 2 && Math.abs(local.y) <= a.m.alto / 2) {
      return "mover";
    }

    return null;
  }

  // Dibuja el marco punteado con los circulos de las esquinas y el de girar
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

    // Linea que une el borde de arriba con el circulo de girar
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo((a.esquinas[0].x + a.esquinas[1].x) / 2, (a.esquinas[0].y + a.esquinas[1].y) / 2);
    ctx.lineTo(a.rotar.x, a.rotar.y);
    ctx.stroke();

    // Circulos de las esquinas
    ctx.fillStyle = "#ffffff";
    ctx.lineWidth = 2 * k;
    a.esquinas.forEach(function (e) {
      ctx.beginPath();
      ctx.arc(e.x, e.y, 7 * k, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });

    // Circulo naranja de girar
    ctx.fillStyle = "#ff6b4a";
    ctx.strokeStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(a.rotar.x, a.rotar.y, 8 * k, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  // Dibuja la prenda completa. Se hace en una hoja aparte, en 3 pasos:
  //   1. se pone la foto de la prenda
  //   2. se le mezcla el color elegido
  //   3. se recorta con la forma de la prenda (para no pintar el fondo)
  // Despues se pone el diseno encima, solo donde hay prenda.
  function dibujar(p, conGuia) {
    if (!p.canvas || !p.imgBase) return;
    if (conGuia === undefined) conGuia = true;

    const canvas = p.canvas;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // La foto se ajusta para llenar todo el espacio y quedar centrada
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
      const d = p.diseno;

      // Si el estilo es bordado se usa la imagen con efecto de hilo; si no, la original
      const fuente = (d.estilo === "bordado" && d.imgBordado) ? d.imgBordado : d.img;

      c.globalCompositeOperation = "source-atop";
      c.save();
      c.translate(m.x, m.y);
      c.rotate(d.rot);
      if (d.espejo) c.scale(-1, 1);
      c.drawImage(fuente, -m.ancho / 2, -m.alto / 2, m.ancho, m.alto);
      c.restore();
    }

    ctx.drawImage(capa, 0, 0);

    if (conGuia && p.diseno && p.mostrarGuia) {
      dibujarGuia(ctx, p, escalaPantalla(canvas));
    }
  }

  // ============================================================
  //  MOVER CON EL MOUSE O EL DEDO: mover, cambiar tamano, girar y pellizcar
  // ============================================================

  // Cambia la forma del cursor segun lo que haya debajo
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
    const punteros = new Map();   // los dedos que estan tocando la pantalla
    let modo = null;              // que se esta haciendo: "mover", "escalar", "rotar" o "pellizco"
    let inicio = {};              // datos del momento en que empezo el movimiento

    // Cada vez que algo cambia: se redibuja y se actualizan los deslizadores
    function cambio() {
      dibujar(p);
      sincronizarControles(p);
    }

    // Cuando se toca la pantalla o se hace clic
    canvas.addEventListener("pointerdown", function (e) {
      if (!p.diseno) return;

      const punto = puntoEvento(canvas, e);
      const k = escalaPantalla(canvas);
      const d = p.diseno;

      canvas.setPointerCapture(e.pointerId);
      punteros.set(e.pointerId, punto);

      // Con dos dedos: pellizco (cambia el tamano y gira a la vez)
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

        // Si se toca fuera del diseno, el diseno salta hasta ese punto
        if (zona === null) {
          d.cx = limitar(punto.x / canvas.width, 0, 1);
          d.cy = limitar(punto.y / canvas.height, 0, 1);
        }
        inicio = { dx: d.cx * canvas.width - punto.x, dy: d.cy * canvas.height - punto.y };
      }

      canvas.style.cursor = "grabbing";
      cambio();
    });

    // Cuando el mouse o el dedo se mueve
    canvas.addEventListener("pointermove", function (e) {
      const punto = puntoEvento(canvas, e);

      // Si no se esta presionando, solo cambiamos el cursor
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
        // El diseno crece o se achica segun te alejes o te acerques a su centro
        const dist = distancia(punto, { x: d.cx * W, y: d.cy * H });
        d.ancho = limitar(inicio.ancho * (dist / inicio.dist), ANCHO_MIN, ANCHO_MAX);

      } else if (modo === "rotar") {
        // El circulo de girar esta arriba del diseno, por eso se suman 90 grados
        d.rot = imantar(Math.atan2(punto.y - d.cy * H, punto.x - d.cx * W) + Math.PI / 2);
      } else {
        return;
      }

      cambio();
    });

    // Cuando se suelta el mouse o se levanta el dedo
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

    // Rueda del mouse: agranda o achica el diseno
    canvas.addEventListener("wheel", function (e) {
      if (!p.diseno) return;
      e.preventDefault();

      const factor = e.deltaY < 0 ? 1.06 : 1 / 1.06;
      p.diseno.ancho = limitar(p.diseno.ancho * factor, ANCHO_MIN, ANCHO_MAX);
      cambio();
    }, { passive: false });
  }

  // ============================================================
  //  PANEL DERECHO: tallas, colores y controles del diseno
  // ============================================================

  // Dibuja los botones de talla
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

  // Dibuja los circulos de color
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

  // Mueve los deslizadores para que muestren lo mismo que se ve en la prenda
  function sincronizarControles(p) {
    if (productosTaller[indiceActual] !== p || !p.diseno) return;

    tamanoDiseno.value = Math.round(p.diseno.ancho * 100);
    rotacionDiseno.value = Math.round((p.diseno.rot * 180) / Math.PI);
    if (desplazarX) desplazarX.value = Math.round(p.diseno.cx * 100);
    if (desplazarY) desplazarY.value = Math.round(p.diseno.cy * 100);
  }

  // Marca como activo el boton del estilo que se esta usando
  function actualizarBotonBordado(p) {
    const estilo = p.diseno ? p.diseno.estilo : "estampado";

    // Si usas un solo boton de bordado
    if (alternarBordado) {
      const activo = estilo === "bordado";
      alternarBordado.textContent = activo ? "Quitar bordado" : "Bordado";
      alternarBordado.classList.toggle("activo", activo);
    }

    // Si usas los dos botones Estampado y Bordado
    chipsEstilo.forEach(function (chip) {
      chip.classList.toggle("activo", chip.dataset.estilo === estilo);
    });
  }

  // Muestra el precio de la prenda que se esta viendo.
  // Si tiene diseno, muestra el desglose: base + recargo.
  function actualizarPrecioProducto(p) {
    const base = Number(p.precio);
    const recargo = recargoDiseno(p);

    if (recargo === 0) {
      precioProducto.textContent = formatearPrecio(base);
      return;
    }

    const tipo = p.diseno.estilo === "bordado" ? "bordado" : "estampado";
    precioProducto.textContent =
      formatearPrecio(base + recargo) +
      " (" + formatearPrecio(base) + " + " + formatearPrecio(recargo) + " de " + tipo + ")";
  }

  // Cambia el estilo del diseno (estampado o bordado) y vuelve a dibujar
  function cambiarEstilo(estilo) {
    const p = productosTaller[indiceActual];
    if (!p) return;

    if (!p.diseno) {
      avisar("Primero sube un diseño para elegir su estilo.", true);
      return;
    }

    p.diseno.estilo = estilo;
    actualizarBotonBordado(p);
    actualizarPrecioProducto(p); // el recargo cambia segun el estilo
    actualizarTotal();           // y el total de arriba tambien
    dibujar(p);
  }

  // Muestra u oculta los controles del diseno segun haya una imagen subida o no
  function actualizarControlesDiseno(p) {
    controlesDiseno.classList.toggle("d-none", !p.diseno);
    alternarGuias.textContent = p.mostrarGuia ? "Ocultar guías" : "Mostrar guías";
    actualizarBotonBordado(p);
    sincronizarControles(p);
  }

  // Muestra el nombre, precio y opciones del producto que se esta viendo
  function mostrarProducto(p) {
    nombreProducto.textContent = p.nombre;
    actualizarPrecioProducto(p);
    cantidadProducto.value = p.cantidad;
    cantidadProducto.max = p.stock || "";

    archivoLogo.value = ""; // asi se puede volver a elegir el mismo archivo
    mensajeEstado.textContent = "";

    dibujarTallas(p);
    dibujarColores(p);
    actualizarControlesDiseno(p);
  }

  // Suma el precio de todas las prendas (precio base + recargo del diseno) por su cantidad
  function actualizarTotal() {
    const total = productosTaller.reduce(function (acumulado, producto) {
      return acumulado + precioUnitario(producto) * producto.cantidad;
    }, 0);

    totalPedido.textContent = formatearPrecio(total);
  }

  //  CARRUSEL (las flechas para cambiar de prenda)

  function renderizarCarrusel() {
    // Si no hay productos, se muestra el mensaje de lista vacia
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

    // Se crea una pantalla por cada producto
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

      // Se carga la foto de la prenda y, cuando esta lista, se dibuja
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

    // Si hay una sola prenda, se esconden las flechas
    carrusel
      .querySelectorAll(".carousel-control-prev, .carousel-control-next")
      .forEach(function (boton) {
        boton.classList.toggle("d-none", productosTaller.length <= 1);
      });
  }

  // Cuando se cambia de prenda con las flechas, el panel derecho se actualiza
  carrusel.addEventListener("slid.bs.carousel", function (evento) {
    const productoActual = productosTaller[evento.to];

    if (productoActual) {
      indiceActual = evento.to;
      mostrarProducto(productoActual);
      dibujar(productoActual); // se redibuja para que los circulos queden bien ubicados
    }
  });

  //  SUBIR Y AJUSTAR EL DISENO

  // Cuando el usuario elige una imagen
  archivoLogo.addEventListener("change", function () {
    const p = productosTaller[indiceActual];
    const archivo = archivoLogo.files[0];
    if (!p || !archivo) return;

    // Solo se aceptan PNG, JPG y WEBP
    const tiposValidos = ["image/png", "image/jpeg", "image/webp"];
    if (!tiposValidos.includes(archivo.type)) {
      avisar("El diseño debe ser PNG, JPG o WEBP.", true);
      archivoLogo.value = "";
      return;
    }

    // Maximo 2 MB
    if (archivo.size > 2 * 1024 * 1024) {
      avisar("El archivo pesa más de 2 MB. Prueba con uno más liviano.", true);
      archivoLogo.value = "";
      return;
    }

    const lector = new FileReader();
    lector.onload = function () {
      const img = new Image();
      img.onload = function () {
        p.diseno = Object.assign(
          {
            img: img,
            nombre: archivo.name,
            estilo: "estampado",
            imgBordado: crearBordado(img) // la version bordada se prepara una sola vez
          },
          DISENO_INICIAL
        );
        dibujar(p);

        // El total siempre se recalcula, aunque el usuario haya cambiado de prenda
        actualizarTotal();

        // Si el usuario ya cambio de prenda mientras cargaba, no tocamos el panel
        if (productosTaller[indiceActual] === p) {
          actualizarPrecioProducto(p);
          actualizarControlesDiseno(p);
          avisar("", false);
        }
      };
      img.src = lector.result;
    };
    lector.readAsDataURL(archivo);
  });

  // Deslizador de tamano
  tamanoDiseno.addEventListener("input", function () {
    const p = productosTaller[indiceActual];
    if (!p || !p.diseno) return;

    p.diseno.ancho = limitar(Number(tamanoDiseno.value) / 100, ANCHO_MIN, ANCHO_MAX);
    dibujar(p);
  });

  // Deslizador de rotacion
  rotacionDiseno.addEventListener("input", function () {
    const p = productosTaller[indiceActual];
    if (!p || !p.diseno) return;

    p.diseno.rot = (Number(rotacionDiseno.value) * Math.PI) / 180;
    dibujar(p);
  });

  // Deslizadores para mover el diseno
  // (0 % es el borde izquierdo o de arriba, 100 % es el borde derecho o de abajo)
  if (desplazarX) {
    desplazarX.addEventListener("input", function () {
      const p = productosTaller[indiceActual];
      if (!p || !p.diseno) return;

      p.diseno.cx = limitar(Number(desplazarX.value) / 100, 0, 1);
      dibujar(p);
    });
  }

  if (desplazarY) {
    desplazarY.addEventListener("input", function () {
      const p = productosTaller[indiceActual];
      if (!p || !p.diseno) return;

      p.diseno.cy = limitar(Number(desplazarY.value) / 100, 0, 1);
      dibujar(p);
    });
  }

  // Boton restablecer: el diseno vuelve a su posicion y tamano de inicio
  restablecerDiseno.addEventListener("click", function () {
    const p = productosTaller[indiceActual];
    if (!p || !p.diseno) return;

    Object.assign(p.diseno, DISENO_INICIAL); // el estilo no cambia
    dibujar(p);
    sincronizarControles(p);
  });

  // Boton voltear: el diseno se ve como en un espejo
  voltearDiseno.addEventListener("click", function () {
    const p = productosTaller[indiceActual];
    if (!p || !p.diseno) return;

    p.diseno.espejo = !p.diseno.espejo;
    dibujar(p);
  });

  // Boton para mostrar u ocultar el marco punteado y los circulos
  alternarGuias.addEventListener("click", function () {
    const p = productosTaller[indiceActual];
    if (!p) return;

    p.mostrarGuia = !p.mostrarGuia;
    alternarGuias.textContent = p.mostrarGuia ? "Ocultar guías" : "Mostrar guías";
    dibujar(p);
  });

  // Estilo del diseno: si usas un solo boton, alterna entre estampado y bordado...
  if (alternarBordado) {
    alternarBordado.addEventListener("click", function () {
      const p = productosTaller[indiceActual];
      if (!p || !p.diseno) return;

      cambiarEstilo(p.diseno.estilo === "bordado" ? "estampado" : "bordado");
    });
  }

  // o si usas dos botones, cada uno elige su estilo (data-estilo="estampado" o "bordado")
  chipsEstilo.forEach(function (chip) {
    chip.addEventListener("click", function () {
      cambiarEstilo(chip.dataset.estilo);
    });
  });

  // Boton quitar: borra el diseno de la prenda y le quita el recargo
  quitarDiseno.addEventListener("click", function () {
    const p = productosTaller[indiceActual];
    if (!p) return;

    p.diseno = null;
    archivoLogo.value = "";
    actualizarControlesDiseno(p);
    actualizarPrecioProducto(p);
    actualizarTotal();
    dibujar(p);
  });

  //  CANTIDAD

  cantidadProducto.addEventListener("input", function () {
    const p = productosTaller[indiceActual];
    if (!p) return;

    // Minimo 1 y, si hay limite de stock, no pasarse de ese limite
    let valor = parseInt(cantidadProducto.value, 10);
    if (isNaN(valor) || valor < 1) valor = 1;
    if (p.stock && valor > p.stock) valor = p.stock;

    p.cantidad = valor;
    actualizarTotal();
  });


  //  GUARDAR EL PRODUCTO PERSONALIZADO

  // Crea una foto pequena de la prenda para mostrarla despues en el pedido
  function crearMiniatura(canvas) {
    const mini = document.createElement("canvas");
    mini.width = 240;
    mini.height = 240;

    const c = mini.getContext("2d");
    c.fillStyle = "#e8e2d5"; // el formato JPG no tiene transparencia, asi que se pone un fondo
    c.fillRect(0, 0, 240, 240);
    c.drawImage(canvas, 0, 0, 240, 240);

    return mini.toDataURL("image/jpeg", 0.7);
  }

  // Lee los pedidos ya guardados (si hay algun problema, devuelve una lista vacia)
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

    // La foto pequeña se toma sin el marco punteado para que quede limpia
    let vistaPrevia = "";
    try {
      dibujar(p, false);
      vistaPrevia = crearMiniatura(p.canvas);
    } catch (error) {
      // Esto pasa si abres el HTML con doble clic en vez de usar un servidor
      console.warn("No se pudo crear la vista previa:", error);
    } finally {
      dibujar(p, true);
    }

    const pedido = leerPedido();
    const registro = {
      id: p.id,
      nombre: p.nombre,
      precio: precioUnitario(p),      // precio final por unidad (base + diseno)
      precioBase: Number(p.precio),   // precio de la prenda sin diseno
      recargoDiseno: recargoDiseno(p), // lo que se cobra extra por el diseno
      cantidad: p.cantidad,
      talla: p.talla,
      color: p.color,
      diseno: p.diseno ? p.diseno.nombre : null,
      estiloDiseno: p.diseno ? p.diseno.estilo : null, // estampado o bordado
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

    // Si esa prenda ya estaba guardada, se reemplaza por la nueva version
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

  //  ARRANQUE
  renderizarCarrusel();
});