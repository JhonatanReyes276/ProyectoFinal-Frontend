// exclusivo Login

// 1. LÓGICA DE GIRO 
// ==========================================
const movingPage = document.getElementById('movingPage');
const btnGoToRegister = document.getElementById('btnGoToRegister');
const btnGoToLogin = document.getElementById('btnGoToLogin');
let usuarioProyecto = [];

if (btnGoToRegister && movingPage) {
    btnGoToRegister.addEventListener('click', () => {
        movingPage.classList.add('flipped');
    });
}

if (btnGoToLogin && movingPage) {
    btnGoToLogin.addEventListener('click', () => {
        movingPage.classList.remove('flipped');
    });
}

const inputs = document.querySelectorAll('form input');

inputs.forEach(input => {

    input.addEventListener('input', () => {

        if (input.checkValidity()) {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid'); // Pone el borde verde de Bootstrap
        } else {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid'); // Pone el borde rojo de Bootstrap
        }
    });
});

// registro de usuario localstoarge
//------------------------------------

const registroForm = document.getElementById('registroForm');

if (registroForm) {
    registroForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const inputs = registroForm.querySelectorAll('input');
        const nombre = inputs[0].value.trim();
        const correo = inputs[1].value.trim();
        const contraseña = inputs[2].value.trim();

        const nuevoUsuario = {
            nombre: nombre,
            correo: correo,
            password: contraseña
        };

        let usuariosGuardados = JSON.parse(localStorage.getItem('usuarioProyecto')) || [];

        const existe = usuarioGuardados.some(user => user.correo === correo);
        if (existe) {
            alert('Este correo ya existe, intenta iniciar sesion');
            return;
        }
        usuariosGuardados.push(nuevoUsuario);
        localStorage.setItem('usuariosProyecto', JSON.stringify(usuariosGuardados));

        alert(` ¡Cuenta creada con éxito, ${nombre}! Ahora puedes iniciar sesión.`);
        registroForm.reset(); // Limpiamos los campos
        movingPage.classList.remove('flipped');
    });
}

//inicio de sesion (leer y validar)
//---------------------------------

const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const inputs = loginForm.querySelectorAll('input');
        const correoIngresado = inputs[0].value.trim();
        const passwordIngresada = inputs[1].value.trim();

        const usuariosGuardados = JSON.parse(localStorage.getItem('usuariosProyecto')) || [];


        const usuarioValido = usuariosGuardados.find(
            user => user.correo === correoIngresado && user.password === passwordIngresada
        );

        if (usuarioValido) {
            // aqui Guardamos la sesión activa para que otras páginas del proyecto sepan quién entró
            localStorage.setItem('usuarioActivo', JSON.stringify(usuarioValido));
            alert(` ¡Bienvenido de nuevo, ${usuarioValido.nombre}!`);

        } else {
            alert('❌ Correo o contraseña incorrectos. Verifica tus datos o regístrate.');
        }
    });
}

const forms = document.querySelectorAll('form');

forms.forEach(form => {
    form.addEventListener('submit', (event) => {

        event.preventDefault();

        const submitButton = form.querySelector('button[type="submit"]');

        const originalText = submitButton.innerHTML;

        //  aqui Cambie el texto del botón por un Spinner circular de Bootstrap
        submitButton.innerHTML = `
            <div class="spinner-border spinner-border-sm text-light" role="status"></div> 
            Procesando...
        `;
        submitButton.disabled = true; // Desactivamos el botón para evitar múltiples clics


        setTimeout(() => {
            alert('¡Acción simulada con éxito! Aquí conectarías con tu Base de Datos.');

            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            form.reset();

            inputs.forEach(input => input.classList.remove('is-valid'));
        }, 2000);
    });
});


// Validación de los requisitos de la contraseña en registro

if (registroForm) {

    const contrasena = registroForm.querySelector("#contrasena");
    const requisitos = registroForm.querySelector(".requisitos");
    const botonMostrar = registroForm.querySelector("#mostrarContrasena");

    // Validación de contraseña
    if (contrasena && requisitos) {

        function validarContrasena() {

            let valor = contrasena.value;

            let longitud = valor.length >= 8;
            let mayuscula = /[A-Z]/.test(valor);
            let minuscula = /[a-z]/.test(valor);
            let numero = /[0-9]/.test(valor);
            let especial = /[^A-Za-z0-9]/.test(valor);

            document.getElementById("longitud").classList.toggle("valido", longitud);
            document.getElementById("mayuscula").classList.toggle("valido", mayuscula);
            document.getElementById("minuscula").classList.toggle("valido", minuscula);
            document.getElementById("numero").classList.toggle("valido", numero);
            document.getElementById("especial").classList.toggle("valido", especial);

        }

        contrasena.addEventListener("input", function () {

            if (contrasena.value.length > 0) {
                requisitos.classList.add("mostrar");
            } else {
                requisitos.classList.remove("mostrar");
            }

            validarContrasena();

        });
    }



    // Mostrar y ocultar contraseña registro
    if (contrasena && botonMostrar) {

        const icono = botonMostrar.querySelector("i");

        botonMostrar.addEventListener("click", function () {

            if (contrasena.type === "password") {

                contrasena.type = "text";
                icono.classList.replace("fa-eye", "fa-eye-slash");

            } else {

                contrasena.type = "password";
                icono.classList.replace("fa-eye-slash", "fa-eye");

            }

        });
    }

    //Mostrar y ocultar contraseña login

    const contrasenaLogin = document.getElementById("contrasenaLogin");
    const botonMostrarLogin = document.getElementById("mostrarContrasenaLogin");

    if (contrasenaLogin && botonMostrarLogin) {
        const iconoLogin = botonMostrarLogin.querySelector("i");

        botonMostrarLogin.addEventListener("click", function () {
            if (contrasenaLogin.type === "password") {
                contrasenaLogin.type = "text";
                if (iconoLogin) iconoLogin.classList.replace("fa-eye", "fa-eye-slash");
            } else {
                contrasenaLogin.type = "password";
                if (iconoLogin) iconoLogin.classList.replace("fa-eye-slash", "fa-eye");
            }
        });
    }
}
