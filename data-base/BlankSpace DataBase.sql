--
-- PostgreSQL database dump
--

\restrict BzSTSzJ1fBN1WR8F149683Ze3Deo0rCZZXYVsjAxIduOphT25ckHP716nPbqghu

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

-- Started on 2026-11-26 16:20:01

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 232 (class 1259 OID 17138)
-- Name: categoria_disenio; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categoria_disenio (
    id integer NOT NULL,
    nombre character varying(80) NOT NULL
);


ALTER TABLE public.categoria_disenio OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 17137)
-- Name: categoria_disenio_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categoria_disenio_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categoria_disenio_id_seq OWNER TO postgres;

--
-- TOC entry 5153 (class 0 OID 0)
-- Dependencies: 231
-- Name: categoria_disenio_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categoria_disenio_id_seq OWNED BY public.categoria_disenio.id;


--
-- TOC entry 224 (class 1259 OID 17070)
-- Name: categoria_prenda; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categoria_prenda (
    id_categoria_prenda integer NOT NULL,
    nombre character varying(50) NOT NULL
);


ALTER TABLE public.categoria_prenda OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 17069)
-- Name: categoria_prenda_id_categoria_prenda_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categoria_prenda_id_categoria_prenda_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categoria_prenda_id_categoria_prenda_seq OWNER TO postgres;

--
-- TOC entry 5154 (class 0 OID 0)
-- Dependencies: 223
-- Name: categoria_prenda_id_categoria_prenda_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categoria_prenda_id_categoria_prenda_seq OWNED BY public.categoria_prenda.id_categoria_prenda;


--
-- TOC entry 240 (class 1259 OID 17206)
-- Name: colores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.colores (
    id integer NOT NULL,
    nombre_color character varying(50) NOT NULL
);


ALTER TABLE public.colores OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 17205)
-- Name: colores_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.colores_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.colores_id_seq OWNER TO postgres;

--
-- TOC entry 5155 (class 0 OID 0)
-- Dependencies: 239
-- Name: colores_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.colores_id_seq OWNED BY public.colores.id;


--
-- TOC entry 228 (class 1259 OID 17098)
-- Name: detalle_envio; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.detalle_envio (
    id_detalle_envio integer NOT NULL,
    ciudad character varying(100) NOT NULL,
    telefono character varying(20) NOT NULL,
    barrio character varying(100) NOT NULL,
    direccion character varying(200) NOT NULL
);


ALTER TABLE public.detalle_envio OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 17097)
-- Name: detalle_envio_id_detalle_envio_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.detalle_envio_id_detalle_envio_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.detalle_envio_id_detalle_envio_seq OWNER TO postgres;

--
-- TOC entry 5156 (class 0 OID 0)
-- Dependencies: 227
-- Name: detalle_envio_id_detalle_envio_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.detalle_envio_id_detalle_envio_seq OWNED BY public.detalle_envio.id_detalle_envio;


--
-- TOC entry 234 (class 1259 OID 17149)
-- Name: disenio; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.disenio (
    id integer NOT NULL,
    imagen character varying(2048),
    precio_adicional integer,
    categoria_disenio_id integer
);


ALTER TABLE public.disenio OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 17148)
-- Name: disenio_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.disenio_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.disenio_id_seq OWNER TO postgres;

--
-- TOC entry 5157 (class 0 OID 0)
-- Dependencies: 233
-- Name: disenio_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.disenio_id_seq OWNED BY public.disenio.id;


--
-- TOC entry 238 (class 1259 OID 17197)
-- Name: imagenes_productos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.imagenes_productos (
    id integer NOT NULL,
    nombre character varying(150) NOT NULL
);


ALTER TABLE public.imagenes_productos OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 17196)
-- Name: imagenes_productos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.imagenes_productos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.imagenes_productos_id_seq OWNER TO postgres;

--
-- TOC entry 5158 (class 0 OID 0)
-- Dependencies: 237
-- Name: imagenes_productos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.imagenes_productos_id_seq OWNED BY public.imagenes_productos.id;


--
-- TOC entry 230 (class 1259 OID 17115)
-- Name: pedido; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pedido (
    id_fecha_creacion integer NOT NULL,
    estado character varying(100) NOT NULL,
    total numeric(10,2) NOT NULL,
    id_usuario integer NOT NULL,
    id_detalle_envio integer NOT NULL,
    CONSTRAINT pedido_total_check CHECK ((total >= (0)::numeric))
);


ALTER TABLE public.pedido OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 17114)
-- Name: pedido_id_fecha_creacion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pedido_id_fecha_creacion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pedido_id_fecha_creacion_seq OWNER TO postgres;

--
-- TOC entry 5159 (class 0 OID 0)
-- Dependencies: 229
-- Name: pedido_id_fecha_creacion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pedido_id_fecha_creacion_seq OWNED BY public.pedido.id_fecha_creacion;


--
-- TOC entry 226 (class 1259 OID 17081)
-- Name: producto; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.producto (
    id_producto integer NOT NULL,
    nombre character varying(120) NOT NULL,
    precio numeric(10,2) NOT NULL,
    id_categoria integer NOT NULL,
    CONSTRAINT producto_precio_check CHECK ((precio >= (0)::numeric))
);


ALTER TABLE public.producto OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 17080)
-- Name: producto_id_producto_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.producto_id_producto_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.producto_id_producto_seq OWNER TO postgres;

--
-- TOC entry 5160 (class 0 OID 0)
-- Dependencies: 225
-- Name: producto_id_producto_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.producto_id_producto_seq OWNED BY public.producto.id_producto;


--
-- TOC entry 242 (class 1259 OID 17220)
-- Name: productos_variantes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.productos_variantes (
    id integer NOT NULL,
    stock integer NOT NULL,
    id_producto integer NOT NULL,
    color_id integer NOT NULL,
    imagene_producto_id integer NOT NULL,
    talla_id integer NOT NULL,
    CONSTRAINT productos_variantes_stock_check CHECK ((stock > 0))
);


ALTER TABLE public.productos_variantes OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 17219)
-- Name: productos_variantes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.productos_variantes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.productos_variantes_id_seq OWNER TO postgres;

--
-- TOC entry 5161 (class 0 OID 0)
-- Dependencies: 241
-- Name: productos_variantes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.productos_variantes_id_seq OWNED BY public.productos_variantes.id;


--
-- TOC entry 220 (class 1259 OID 17044)
-- Name: rol; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rol (
    id_rol integer NOT NULL,
    nombre character varying(50)
);


ALTER TABLE public.rol OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 17043)
-- Name: rol_id_rol_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rol_id_rol_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rol_id_rol_seq OWNER TO postgres;

--
-- TOC entry 5162 (class 0 OID 0)
-- Dependencies: 219
-- Name: rol_id_rol_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rol_id_rol_seq OWNED BY public.rol.id_rol;


--
-- TOC entry 236 (class 1259 OID 17186)
-- Name: tallas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tallas (
    id integer NOT NULL,
    talla character varying(10) NOT NULL
);


ALTER TABLE public.tallas OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 17185)
-- Name: tallas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tallas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tallas_id_seq OWNER TO postgres;

--
-- TOC entry 5163 (class 0 OID 0)
-- Dependencies: 235
-- Name: tallas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tallas_id_seq OWNED BY public.tallas.id;


--
-- TOC entry 222 (class 1259 OID 17052)
-- Name: usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario (
    id_usuario integer NOT NULL,
    nombre_completo character varying(100) NOT NULL,
    correo character varying(150),
    contrasena character varying(80) NOT NULL,
    id_rol integer NOT NULL
);


ALTER TABLE public.usuario OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 17051)
-- Name: usuario_id_usuario_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuario_id_usuario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuario_id_usuario_seq OWNER TO postgres;

--
-- TOC entry 5164 (class 0 OID 0)
-- Dependencies: 221
-- Name: usuario_id_usuario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuario_id_usuario_seq OWNED BY public.usuario.id_usuario;


--
-- TOC entry 4917 (class 2604 OID 17141)
-- Name: categoria_disenio id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categoria_disenio ALTER COLUMN id SET DEFAULT nextval('public.categoria_disenio_id_seq'::regclass);


--
-- TOC entry 4913 (class 2604 OID 17073)
-- Name: categoria_prenda id_categoria_prenda; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categoria_prenda ALTER COLUMN id_categoria_prenda SET DEFAULT nextval('public.categoria_prenda_id_categoria_prenda_seq'::regclass);


--
-- TOC entry 4921 (class 2604 OID 17209)
-- Name: colores id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.colores ALTER COLUMN id SET DEFAULT nextval('public.colores_id_seq'::regclass);


--
-- TOC entry 4915 (class 2604 OID 17101)
-- Name: detalle_envio id_detalle_envio; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_envio ALTER COLUMN id_detalle_envio SET DEFAULT nextval('public.detalle_envio_id_detalle_envio_seq'::regclass);


--
-- TOC entry 4918 (class 2604 OID 17152)
-- Name: disenio id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.disenio ALTER COLUMN id SET DEFAULT nextval('public.disenio_id_seq'::regclass);


--
-- TOC entry 4920 (class 2604 OID 17200)
-- Name: imagenes_productos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.imagenes_productos ALTER COLUMN id SET DEFAULT nextval('public.imagenes_productos_id_seq'::regclass);


--
-- TOC entry 4916 (class 2604 OID 17118)
-- Name: pedido id_fecha_creacion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedido ALTER COLUMN id_fecha_creacion SET DEFAULT nextval('public.pedido_id_fecha_creacion_seq'::regclass);


--
-- TOC entry 4914 (class 2604 OID 17084)
-- Name: producto id_producto; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto ALTER COLUMN id_producto SET DEFAULT nextval('public.producto_id_producto_seq'::regclass);


--
-- TOC entry 4922 (class 2604 OID 17223)
-- Name: productos_variantes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos_variantes ALTER COLUMN id SET DEFAULT nextval('public.productos_variantes_id_seq'::regclass);


--
-- TOC entry 4911 (class 2604 OID 17047)
-- Name: rol id_rol; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rol ALTER COLUMN id_rol SET DEFAULT nextval('public.rol_id_rol_seq'::regclass);


--
-- TOC entry 4919 (class 2604 OID 17189)
-- Name: tallas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tallas ALTER COLUMN id SET DEFAULT nextval('public.tallas_id_seq'::regclass);


--
-- TOC entry 4912 (class 2604 OID 17055)
-- Name: usuario id_usuario; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario ALTER COLUMN id_usuario SET DEFAULT nextval('public.usuario_id_usuario_seq'::regclass);


--
-- TOC entry 5137 (class 0 OID 17138)
-- Dependencies: 232
-- Data for Name: categoria_disenio; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categoria_disenio (id, nombre) FROM stdin;
1	Estampado
2	Bordado
\.


--
-- TOC entry 5129 (class 0 OID 17070)
-- Dependencies: 224
-- Data for Name: categoria_prenda; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categoria_prenda (id_categoria_prenda, nombre) FROM stdin;
1	camiseta
2	medias
3	gorra
\.


--
-- TOC entry 5145 (class 0 OID 17206)
-- Dependencies: 240
-- Data for Name: colores; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.colores (id, nombre_color) FROM stdin;
1	negro
2	blanco
3	azul
4	verde
5	rojo
6	gris
7	naranja
8	cafe
\.


--
-- TOC entry 5133 (class 0 OID 17098)
-- Dependencies: 228
-- Data for Name: detalle_envio; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.detalle_envio (id_detalle_envio, ciudad, telefono, barrio, direccion) FROM stdin;
1	Bogota.	3204687902	Usaquen	Calle 53 # 7-24, Apto 302
2	Soacha	3128741563	Ciudad Verde	Carrera 38 # 15-40, Conjunto Acanto II, Torre 4 Apto 501
3	Medellin	3111234567	El Poblado	Calle 10 # 43E-25, Int 104
4	Cali	3234567980	Granada	Avenida 9N # 15N-32
5	Barranquilla	3182369412	El Prado	Carrera 54 # 70-112, Casa 2
6	Bucaramanga	3129854120	Cabecera del Llano	Calle 48 # 35A-18, Edificio Mirador Apto 804
\.


--
-- TOC entry 5139 (class 0 OID 17149)
-- Dependencies: 234
-- Data for Name: disenio; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.disenio (id, imagen, precio_adicional, categoria_disenio_id) FROM stdin;
1	https://ejemplo.com/disenos/logo-frontal.png	10000	1
2	https://ejemplo.com/disenos/escudo-pecho.png	25000	2
3	https://ejemplo.com/disenos/ilustracion-espalda.png	10000	1
\.


--
-- TOC entry 5143 (class 0 OID 17197)
-- Dependencies: 238
-- Data for Name: imagenes_productos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.imagenes_productos (id, nombre) FROM stdin;
1	https://jhonatanreyes276.github.io/ProyectoFinal-Frontend/IMG/camisaOver.jpg
2	https://jhonatanreyes276.github.io/ProyectoFinal-Frontend/IMG/camisa1.jpg
3	https://jhonatanreyes276.github.io/ProyectoFinal-Frontend/IMG/gorraSnap.jpg
4	https://jhonatanreyes276.github.io/ProyectoFinal-Frontend/IMG/gorraTh.jpg
5	https://jhonatanreyes276.github.io/ProyectoFinal-Frontend/IMG/mediasNor.jpg
6	https://jhonatanreyes276.github.io/ProyectoFinal-Frontend/IMG/mediasLar.jpg
7	https://jhonatanreyes276.github.io/ProyectoFinal-Frontend/IMG/mediasIn.jpg
8	chttps://jhonatanreyes276.github.io/ProyectoFinal-Frontend/IMG/mediastob.jpgafe
\.


--
-- TOC entry 5135 (class 0 OID 17115)
-- Dependencies: 230
-- Data for Name: pedido; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pedido (id_fecha_creacion, estado, total, id_usuario, id_detalle_envio) FROM stdin;
1	Pendiente	85000.00	1	1
2	Confirmado	142500.50	2	2
3	En preparación	64000.00	3	3
4	Enviado	210000.00	1	4
\.


--
-- TOC entry 5131 (class 0 OID 17081)
-- Dependencies: 226
-- Data for Name: producto; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.producto (id_producto, nombre, precio, id_categoria) FROM stdin;
1	Camiseta Clásica	45000.00	1
2	Camiseta Oversize	55000.00	1
3	Gorra Snapback	35000.00	3
4	Gorra Trucker	32000.00	3
5	Medias Estampadas	18000.00	2
6	Medias Largas	20000.00	2
7	Medias infantiles	12000.00	2
8	Medias tobilleras	12000.00	2
\.


--
-- TOC entry 5147 (class 0 OID 17220)
-- Dependencies: 242
-- Data for Name: productos_variantes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.productos_variantes (id, stock, id_producto, color_id, imagene_producto_id, talla_id) FROM stdin;
5	10	2	2	1	3
6	8	4	4	4	6
7	15	8	6	8	4
8	10	1	3	2	5
\.


--
-- TOC entry 5125 (class 0 OID 17044)
-- Dependencies: 220
-- Data for Name: rol; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rol (id_rol, nombre) FROM stdin;
1	Administrador
2	Usuario
\.


--
-- TOC entry 5141 (class 0 OID 17186)
-- Dependencies: 236
-- Data for Name: tallas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tallas (id, talla) FROM stdin;
3	S
4	31-34
5	35-37
6	38-40
7	41-43
8	44-48
\.


--
-- TOC entry 5127 (class 0 OID 17052)
-- Dependencies: 222
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuario (id_usuario, nombre_completo, correo, contrasena, id_rol) FROM stdin;
1	Ana María Gómez	ana@gmail.com	hash_seguro_123	1
2	Carlos Pérez	carlos@gmail.com	hash_seguro_456	2
3	Laura Rodríguez	laura@gmail.com	hash_seguro_789	2
\.


--
-- TOC entry 5165 (class 0 OID 0)
-- Dependencies: 231
-- Name: categoria_disenio_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categoria_disenio_id_seq', 2, true);


--
-- TOC entry 5166 (class 0 OID 0)
-- Dependencies: 223
-- Name: categoria_prenda_id_categoria_prenda_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categoria_prenda_id_categoria_prenda_seq', 3, true);


--
-- TOC entry 5167 (class 0 OID 0)
-- Dependencies: 239
-- Name: colores_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.colores_id_seq', 8, true);


--
-- TOC entry 5168 (class 0 OID 0)
-- Dependencies: 227
-- Name: detalle_envio_id_detalle_envio_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.detalle_envio_id_detalle_envio_seq', 6, true);


--
-- TOC entry 5169 (class 0 OID 0)
-- Dependencies: 233
-- Name: disenio_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.disenio_id_seq', 3, true);


--
-- TOC entry 5170 (class 0 OID 0)
-- Dependencies: 237
-- Name: imagenes_productos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.imagenes_productos_id_seq', 8, true);


--
-- TOC entry 5171 (class 0 OID 0)
-- Dependencies: 229
-- Name: pedido_id_fecha_creacion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pedido_id_fecha_creacion_seq', 4, true);


--
-- TOC entry 5172 (class 0 OID 0)
-- Dependencies: 225
-- Name: producto_id_producto_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.producto_id_producto_seq', 8, true);


--
-- TOC entry 5173 (class 0 OID 0)
-- Dependencies: 241
-- Name: productos_variantes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.productos_variantes_id_seq', 8, true);


--
-- TOC entry 5174 (class 0 OID 0)
-- Dependencies: 219
-- Name: rol_id_rol_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rol_id_rol_seq', 2, true);


--
-- TOC entry 5175 (class 0 OID 0)
-- Dependencies: 235
-- Name: tallas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tallas_id_seq', 8, true);


--
-- TOC entry 5176 (class 0 OID 0)
-- Dependencies: 221
-- Name: usuario_id_usuario_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuario_id_usuario_seq', 3, true);


--
-- TOC entry 4943 (class 2606 OID 17147)
-- Name: categoria_disenio categoria_disenio_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categoria_disenio
    ADD CONSTRAINT categoria_disenio_nombre_key UNIQUE (nombre);


--
-- TOC entry 4945 (class 2606 OID 17145)
-- Name: categoria_disenio categoria_disenio_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categoria_disenio
    ADD CONSTRAINT categoria_disenio_pkey PRIMARY KEY (id);


--
-- TOC entry 4933 (class 2606 OID 17079)
-- Name: categoria_prenda categoria_prenda_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categoria_prenda
    ADD CONSTRAINT categoria_prenda_nombre_key UNIQUE (nombre);


--
-- TOC entry 4935 (class 2606 OID 17077)
-- Name: categoria_prenda categoria_prenda_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categoria_prenda
    ADD CONSTRAINT categoria_prenda_pkey PRIMARY KEY (id_categoria_prenda);


--
-- TOC entry 4955 (class 2606 OID 17215)
-- Name: colores colores_nombre_color_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.colores
    ADD CONSTRAINT colores_nombre_color_key UNIQUE (nombre_color);


--
-- TOC entry 4957 (class 2606 OID 17213)
-- Name: colores colores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.colores
    ADD CONSTRAINT colores_pkey PRIMARY KEY (id);


--
-- TOC entry 4939 (class 2606 OID 17108)
-- Name: detalle_envio detalle_envio_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_envio
    ADD CONSTRAINT detalle_envio_pkey PRIMARY KEY (id_detalle_envio);


--
-- TOC entry 4947 (class 2606 OID 17157)
-- Name: disenio disenio_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.disenio
    ADD CONSTRAINT disenio_pkey PRIMARY KEY (id);


--
-- TOC entry 4953 (class 2606 OID 17204)
-- Name: imagenes_productos imagenes_productos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.imagenes_productos
    ADD CONSTRAINT imagenes_productos_pkey PRIMARY KEY (id);


--
-- TOC entry 4941 (class 2606 OID 17126)
-- Name: pedido pedido_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedido
    ADD CONSTRAINT pedido_pkey PRIMARY KEY (id_fecha_creacion);


--
-- TOC entry 4937 (class 2606 OID 17091)
-- Name: producto producto_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto
    ADD CONSTRAINT producto_pkey PRIMARY KEY (id_producto);


--
-- TOC entry 4959 (class 2606 OID 17236)
-- Name: productos_variantes productos_variantes_color_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos_variantes
    ADD CONSTRAINT productos_variantes_color_id_key UNIQUE (color_id);


--
-- TOC entry 4961 (class 2606 OID 17234)
-- Name: productos_variantes productos_variantes_id_producto_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos_variantes
    ADD CONSTRAINT productos_variantes_id_producto_key UNIQUE (id_producto);


--
-- TOC entry 4963 (class 2606 OID 17238)
-- Name: productos_variantes productos_variantes_imagene_producto_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos_variantes
    ADD CONSTRAINT productos_variantes_imagene_producto_id_key UNIQUE (imagene_producto_id);


--
-- TOC entry 4965 (class 2606 OID 17232)
-- Name: productos_variantes productos_variantes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos_variantes
    ADD CONSTRAINT productos_variantes_pkey PRIMARY KEY (id);


--
-- TOC entry 4967 (class 2606 OID 17240)
-- Name: productos_variantes productos_variantes_talla_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos_variantes
    ADD CONSTRAINT productos_variantes_talla_id_key UNIQUE (talla_id);


--
-- TOC entry 4927 (class 2606 OID 17050)
-- Name: rol rol_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rol
    ADD CONSTRAINT rol_pkey PRIMARY KEY (id_rol);


--
-- TOC entry 4949 (class 2606 OID 17193)
-- Name: tallas tallas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tallas
    ADD CONSTRAINT tallas_pkey PRIMARY KEY (id);


--
-- TOC entry 4951 (class 2606 OID 17195)
-- Name: tallas tallas_talla_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tallas
    ADD CONSTRAINT tallas_talla_key UNIQUE (talla);


--
-- TOC entry 4929 (class 2606 OID 17063)
-- Name: usuario usuario_correo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key UNIQUE (correo);


--
-- TOC entry 4931 (class 2606 OID 17061)
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id_usuario);


--
-- TOC entry 4972 (class 2606 OID 17158)
-- Name: disenio disenio_categoria_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.disenio
    ADD CONSTRAINT disenio_categoria_id_fkey FOREIGN KEY (categoria_disenio_id) REFERENCES public.categoria_disenio(id);


--
-- TOC entry 4969 (class 2606 OID 17092)
-- Name: producto fk_producto_categoria; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto
    ADD CONSTRAINT fk_producto_categoria FOREIGN KEY (id_categoria) REFERENCES public.categoria_prenda(id_categoria_prenda) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4970 (class 2606 OID 17132)
-- Name: pedido pedido_id_detalle_envio_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedido
    ADD CONSTRAINT pedido_id_detalle_envio_fkey FOREIGN KEY (id_detalle_envio) REFERENCES public.detalle_envio(id_detalle_envio);


--
-- TOC entry 4971 (class 2606 OID 17127)
-- Name: pedido pedido_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedido
    ADD CONSTRAINT pedido_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario);


--
-- TOC entry 4973 (class 2606 OID 17246)
-- Name: productos_variantes productos_variantes_color_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos_variantes
    ADD CONSTRAINT productos_variantes_color_id_fkey FOREIGN KEY (color_id) REFERENCES public.colores(id);


--
-- TOC entry 4974 (class 2606 OID 17241)
-- Name: productos_variantes productos_variantes_id_producto_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos_variantes
    ADD CONSTRAINT productos_variantes_id_producto_fkey FOREIGN KEY (id_producto) REFERENCES public.producto(id_producto);


--
-- TOC entry 4975 (class 2606 OID 17251)
-- Name: productos_variantes productos_variantes_imagene_producto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos_variantes
    ADD CONSTRAINT productos_variantes_imagene_producto_id_fkey FOREIGN KEY (imagene_producto_id) REFERENCES public.imagenes_productos(id);


--
-- TOC entry 4976 (class 2606 OID 17256)
-- Name: productos_variantes productos_variantes_talla_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos_variantes
    ADD CONSTRAINT productos_variantes_talla_id_fkey FOREIGN KEY (talla_id) REFERENCES public.tallas(id);


--
-- TOC entry 4968 (class 2606 OID 17064)
-- Name: usuario usuario_id_rol_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_id_rol_fkey FOREIGN KEY (id_rol) REFERENCES public.rol(id_rol);


-- Completed on 2026-11-26 16:20:02

--
-- PostgreSQL database dump complete
--

\unrestrict BzSTSzJ1fBN1WR8F149683Ze3Deo0rCZZXYVsjAxIduOphT25ckHP716nPbqghu

