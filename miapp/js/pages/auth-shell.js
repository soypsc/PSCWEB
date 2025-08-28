// js/pages/auth-shell.js

let supabase;
let navigateTo;

function showAuthPage(pageId) {
    document.getElementById('page-login').classList.remove('active');
    document.getElementById('page-register').classList.remove('active');
    document.getElementById(pageId).classList.add('active');
}

async function handleLogin(e) {
    e.preventDefault();
    const loginError = document.getElementById('login-error');
    loginError.textContent = '';
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        loginError.textContent = 'Email o contraseña incorrectos.';
    } else if (data.user) {
        navigateTo('app-shell', data.user); // Navega al shell principal de la app si el login es exitoso
    }
}

async function handleRegister(e) {
    // La lógica de registro que ya teníamos
    e.preventDefault();
    const registerError = document.getElementById('register-error');
    registerError.textContent = '';
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const whatsapp = document.getElementById('register-whatsapp').value;
    const birthday = document.getElementById('register-birthday').value;
    const address = document.getElementById('register-address').value;
    const sucursal = document.getElementById('register-sucursal').value;
    const password = document.getElementById('register-password').value;
    const passwordConfirm = document.getElementById('register-password-confirm').value;
    const promoCode = document.getElementById('register-promo').value.trim();

    if (password !== passwordConfirm) { registerError.textContent = 'Las contraseñas no coinciden.'; return; }
    if (password.length < 6) { registerError.textContent = 'La contraseña debe tener al menos 6 caracteres.'; return; }

    const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { nombre_completo: name, whatsapp, sucursal_preferida: sucursal, codigo_promo: promoCode, fecha_nac: birthday, direccion: address } }
    });

    if (error) {
        registerError.textContent = 'No se pudo registrar. El email ya podría existir.';
    } else {
        alert('¡Registro exitoso! Revisa tu correo para confirmar tu cuenta.');
        showAuthPage('page-login');
    }
}

async function loadSucursales() {
    const sucursalSelect = document.getElementById('register-sucursal');
    const { data, error } = await supabase.from('sucursales').select('sucursal').order('sucursal');
    if (error) {
        sucursalSelect.innerHTML = '<option value="">No se pudieron cargar</option>';
        return;
    }
    if (data) {
        sucursalSelect.innerHTML = '<option value="">Selecciona una sucursal</option>';
        data.forEach(s => {
            sucursalSelect.innerHTML += `<option value="${s.sucursal}">${s.sucursal}</option>`;
        });
    }
}

export function init(supabaseClient, navigationFunc) {
    supabase = supabaseClient;
    navigateTo = navigationFunc;

    // Selectores de elementos
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegisterLink = document.getElementById('show-register-link');
    const showLoginLink = document.getElementById('show-login-link');
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    const promoRadios = document.querySelectorAll('input[name="hasPromo"]');
    const promoContainer = document.getElementById('promo-code-container');

    // Asignar eventos
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    showRegisterLink.addEventListener('click', (e) => { e.preventDefault(); showAuthPage('page-register'); });
    showLoginLink.addEventListener('click', (e) => { e.preventDefault(); showAuthPage('page-login'); });
    
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', () => {
            const input = button.previousElementSibling;
            const isPwd = input.type === 'password';
            input.type = isPwd ? 'text' : 'password';
            button.innerHTML = isPwd ? '<i data-lucide="eye-off"></i>' : '<i data-lucide="eye"></i>';
            lucide.createIcons();
        });
    });

    promoRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            promoContainer.classList.toggle('hidden', radio.value !== 'yes');
        });
    });

    // Cargar datos iniciales
    loadSucursales();
}
