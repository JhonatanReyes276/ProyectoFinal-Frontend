// exclusico Login

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

if(registroForm){
    registroForm.addEventListener('submit', (e) =>{
        e.preventDefault();

        const inputs = registroForm.querySelectorAll('input');
        const nombre =inputs[0].value.trim();
        const correo = inputs[1].value.trim();
        const contraseña = inputs[2].value.trim();

        const nuevoUsuario= {
            nombre: nombre,
            correo: correo,
            password: contraseña
        };

        let usuariosGuardados = JSON.parse(localStorage.getItem('usuarioProyecto')) || [];

        const existe = usuarioGuardados.some(user => user.correo === correo);
        if (existe){
            alert ('Este correo ya existe, intenta iniciar sesion');
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