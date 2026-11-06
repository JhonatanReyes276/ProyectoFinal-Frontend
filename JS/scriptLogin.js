// exclusico Login

// 1. LÓGICA DE GIRO )
// ==========================================
const movingPage = document.getElementById('movingPage');
const btnGoToRegister = document.getElementById('btnGoToRegister');
const btnGoToLogin = document.getElementById('btnGoToLogin');

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

const forms = document.querySelectorAll('form');

forms.forEach(form => {
    form.addEventListener('submit', (event) => {
        // Evitamos que la página se recargue inmediatamente para poder simular la carga
        event.preventDefault(); 
        
        const submitButton = form.querySelector('button[type="submit"]');
              
        const originalText = submitButton.innerHTML;
        
        // Cambiamos el texto del botón por un Spinner circular de Bootstrap
        submitButton.innerHTML = `
            <div class="spinner-border spinner-border-sm text-light" role="status"></div> 
            Procesando...
        `;
        submitButton.disabled = true; // Desactivamos el botón para evitar múltiples clics

        
        setTimeout(() => {
            alert('¡Acción simulada con éxito! Aquí conectarías con tu Base de Datos.');
            
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            form.reset(); // Limpia los campos del formulario
            
            inputs.forEach(input => input.classList.remove('is-valid'));
        }, 2000);
    });
});