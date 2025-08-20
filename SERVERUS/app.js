// --- DATOS DE LA APLICACIÓN ---
const db = {
    // La base de datos está vacía, excepto por los usuarios para el login.
    users: [
        { id: 1, username: 'Alvin', password: '12345', role: 'ADMIN' },
        { id: 2, username: 'Supervisor', password: '123', role: 'SUPERVISOR' },
        { id: 3, username: 'Recepcion', password: '123', role: 'RECEPCION' },
    ],
    clients: [],
    packages: [],
    sucursales: []
};

// --- SESIÓN ---
let session = {
    user: null
};

// --- ELEMENTOS DEL DOM ---
const contentEl = document.getElementById('content');
const loginScreen = document.getElementById('login-screen');
const mainApp = document.getElementById('main-app');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');
const sessionUsernameEl = document.getElementById('session-username');
const mainNavEl = document.getElementById('main-nav');

// --- FUNCIONES UTILITARIAS ---
function showAlert(message) {
    const alertBox = document.getElementById('custom-alert');
    const messageEl = document.getElementById('custom-alert-message');
    const closeBtn = document.getElementById('custom-alert-close');
    
    messageEl.textContent = message;
    alertBox.classList.remove('hidden');
    
    closeBtn.onclick = () => {
        alertBox.classList.add('hidden');
    };
}

// --- LÓGICA DE LOGIN Y SESIÓN ---
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    
    const user = db.users.find(u => u.username === username && u.password === password);

    if (user) {
        session.user = user;
        loginScreen.classList.add('hidden');
        mainApp.classList.remove('hidden');
        sessionUsernameEl.textContent = session.user.username;
        buildSidebar();
        
        // Si el hash ya es dashboard, no se dispara 'hashchange', así que lo llamamos manualmente.
        if(window.location.hash === '#/dashboard' || window.location.hash === '') {
            window.location.hash = '#/dashboard';
            router();
        } else {
            window.location.hash = '#/dashboard';
        }
    } else {
        loginError.classList.remove('hidden');
    }
});

logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    session.user = null;
    window.location.hash = '';
    mainApp.classList.add('hidden');
    loginScreen.classList.remove('hidden');
    loginForm.reset();
    loginError.classList.add('hidden');
});


// --- LÓGICA DE FORMULARIOS Y EVENTOS (Listeners) ---
function initializeRecibirPaqueteListeners() {
    const trackingInput = document.getElementById('tracking-main');
    const casilleroInput = document.getElementById('casillero');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');

    trackingInput.addEventListener('blur', () => {
        if (trackingInput.value.trim() !== '') step2.classList.add('visible');
        else {
            step2.classList.remove('visible');
            step3.classList.remove('visible');
        }
    });
    casilleroInput.addEventListener('blur', () => {
        document.getElementById('cliente').value = 'Cliente no encontrado';
        document.getElementById('sucursal').value = '';
        step3.classList.add('visible');
    });
    initializeAllScanners();
}

function initializeAllScanners() {
    document.querySelectorAll('.scan-ocr-btn, #scan-tracking-barcode-btn').forEach(btn => {
        btn.addEventListener('click', () => showAlert('Función de escáner requiere conexión a base de datos.'));
    });
}

function initializeRecibirSucursalListeners() { /* Lógica futura */ }
function initializeCobrarListeners() { /* Lógica futura */ }

function initializeModal(openBtnId, modalId, closeBtnClass) {
    const openBtn = document.getElementById(openBtnId);
    const modal = document.getElementById(modalId);
    const closeBtns = document.querySelectorAll(`.${closeBtnClass}`);
    if (openBtn && modal) {
        openBtn.addEventListener('click', () => modal.classList.remove('hidden'));
        closeBtns.forEach(btn => btn.addEventListener('click', () => modal.classList.add('hidden')));
    }
}

function initializeFilterToggle() {
    const toggleButton = document.getElementById('toggle-filters-btn');
    const filtersDiv = document.getElementById('advanced-filters');
    if (toggleButton && filtersDiv) {
        toggleButton.addEventListener('click', () => filtersDiv.classList.toggle('visible'));
    }
}

function initializeClientesListeners() {
    initializeFilterToggle();
    initializeModal('add-client-btn', 'add-client-modal', 'close-modal');
}

function initializeUsuariosListeners() {
    initializeModal('add-user-btn', 'add-user-modal', 'close-modal');
}

function initializeSucursalesListeners() {
    initializeModal('add-sucursal-btn', 'add-sucursal-modal', 'close-modal');
}

function initializeNotificacionesListeners() { /* Lógica futura */ }

// --- PLANTILLAS DE VISTAS (Templates) ---

function renderDashboard() {
    return `
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-bold text-slate-900 flex items-center"><span class="code">[OP-01]</span>Dashboard</h1>
            <div class="flex items-center gap-2"><span class="text-sm text-slate-500">Hoy: ${new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric'})}</span></div>
        </div>
        <div class="mb-10">
            <h2 class="text-lg font-semibold text-slate-700 mb-4 flex items-center"><span class="code">[OP-01A]</span>Acceso Rápido</h2>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <button onclick="window.location.hash='#/recibir-paquete'" class="flex items-center justify-center gap-3 bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all transform hover:-translate-y-1"><span>Recibir Paquete</span></button>
                <button onclick="window.location.hash='#/recibir-en-sucursal'" class="flex items-center justify-center gap-3 bg-sky-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-sky-500/20 hover:bg-sky-600 transition-all transform hover:-translate-y-1"><span>Recibir en Sucursal</span></button>
                <button onclick="window.location.hash='#/cobrar'" class="flex items-center justify-center gap-3 bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-indigo-500/20 hover:bg-indigo-600 transition-all transform hover:-translate-y-1"><span>Cobrar y Facturar</span></button>
                <button onclick="window.location.hash='#/clientes'" class="flex items-center justify-center gap-3 bg-white text-slate-700 font-bold py-3 px-4 rounded-lg shadow-sm hover:bg-slate-50 transition-all transform hover:-translate-y-1 border border-slate-200"><span>Buscar Cliente</span></button>
            </div>
        </div>
        <div>
            <h2 class="text-lg font-semibold text-slate-700 mb-4 flex items-center"><span class="code">[OP-01B]</span>Resumen de Actividad del Día</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-white p-6 rounded-lg border border-slate-200"><h3 class="text-slate-500 font-medium">Paquetes Recibidos Hoy</h3><p class="text-4xl font-bold text-emerald-500 mt-2">0</p></div>
                <div class="bg-white p-6 rounded-lg border border-slate-200"><h3 class="text-slate-500 font-medium">Paquetes por Entregar</h3><p class="text-4xl font-bold text-amber-500 mt-2">0</p></div>
                <div class="bg-white p-6 rounded-lg border border-slate-200"><h3 class="text-slate-500 font-medium">Total Cobros del Día</h3><p class="text-4xl font-bold text-slate-800 mt-2">$0.00</p></div>
            </div>
        </div>`;
}

// ... (El resto de las funciones `render` son iguales a la versión anterior, las incluyo por completitud)
function renderRecibirPaquete() {
    return `
        <div class="flex justify-between items-center mb-8"><h1 class="text-3xl font-bold text-slate-900 flex items-center"><span class="code">[OP-03A]</span>Recepción de Paquete</h1></div>
        <div class="bg-white p-8 rounded-lg border border-slate-200 shadow-sm max-w-4xl mx-auto">
            <div><label for="tracking-main" class="block text-lg font-semibold text-slate-700 mb-2">1. Tracking Principal</label><div class="relative flex items-center"><input type="text" id="tracking-main" placeholder="Ingresar o escanear tracking..." class="w-full text-lg pl-4 pr-24 py-3 border-2 border-slate-300 rounded-lg"><div class="absolute right-2 flex items-center gap-1"><button id="scan-tracking-barcode-btn" class="p-2 text-slate-500 hover:text-indigo-600" title="Escanear Código de Barras">...</button><button data-target="tracking-main" class="scan-ocr-btn p-2 text-slate-500 hover:text-indigo-600" title="Escanear Etiqueta (OCR)">...</button></div></div></div>
            <div id="step2" class="form-section"><h2 class="text-lg font-semibold text-slate-700 mb-4">2. Asignar Cliente</h2><div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="relative flex items-center"><label for="casillero" class="absolute -top-6 left-0 block text-sm font-medium text-slate-600">Casillero o Nombre</label><input type="text" id="casillero" placeholder="Buscar..." class="w-full p-2 pr-12 border border-slate-300 rounded-md"><button id="scan-casillero-ocr-btn" data-target="casillero" class="scan-ocr-btn absolute right-1 p-2 text-slate-500" title="Escanear Etiqueta (OCR)">...</button></div><div><label for="cliente" class="block text-sm font-medium text-slate-600 mb-1">Cliente</label><input type="text" id="cliente" disabled class="w-full p-2 border border-slate-300 rounded-md bg-slate-100"></div><div class="md:col-span-2"><label for="sucursal" class="block text-sm font-medium text-slate-600 mb-1">Sucursal</label><div class="flex items-center gap-2"><span id="sucursal-color-dot" class="h-4 w-4 rounded-full bg-slate-200"></span><input type="text" id="sucursal" disabled class="w-full p-2 border border-slate-300 rounded-md bg-slate-100"></div></div></div></div>
            <div id="step3" class="form-section"><div class="mt-8"><button class="w-full bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg">Registrar Paquete</button></div></div>
        </div>`;
}
function renderRecibirEnSucursal() { return `<h1><span class="code">[OP-04A]</span>Recepción en Sucursal</h1><p>Interfaz para recibir paquetes en sucursal.</p>`; }
function renderClientes() { return `<h1><span class="code">[OP-02]</span>Gestión de Clientes</h1><p>Tabla y formulario para gestionar clientes.</p>`; }
function renderPaquetes() { return `<h1><span class="code">[OP-03]</span>Gestión de Paquetes</h1><p>Tabla para visualizar y gestionar paquetes.</p>`; }
function renderSucursales() { return `<h1><span class="code">[OP-04]</span>Gestión de Sucursales</h1><p>Interfaz para gestionar sucursales.</p>`; }
function renderCobrar() { return `<h1><span class="code">[OP-05]</span>Cobro y Facturación</h1><p>Interfaz para realizar cobros.</p>`; }
function renderUsuarios() {
    return `
        <div class="flex justify-between items-center mb-6"><h1 class="text-3xl font-bold text-slate-900 flex items-center"><span class="code">[AD-01]</span>Usuarios y Roles</h1><button id="add-user-btn" class="flex items-center gap-2 bg-emerald-500 text-white font-semibold py-2 px-4 rounded-md"><span>Crear Usuario</span></button></div>
        <div class="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div class="overflow-x-auto"><table class="w-full text-sm text-left text-slate-500">
                <thead class="text-xs text-slate-700 uppercase bg-slate-100"><tr><th class="px-6 py-3">Nombre</th><th class="px-6 py-3">Rol</th><th class="px-6 py-3">Acciones</th></tr></thead>
                <tbody>${db.users.map(user => `
                    <tr class="bg-white border-b"><td class="px-6 py-4 font-medium text-slate-900">${user.username}</td><td class="px-6 py-4">${user.role}</td><td class="px-6 py-4">...</td></tr>`).join('')}
                </tbody>
            </table></div>
        </div>
        <div id="add-user-modal" class="fixed inset-0 bg-slate-900/50 hidden">...</div>`;
}
function renderConfiguracion() { return `<h1><span class="code">[AD-02]</span>Configuración del Sistema</h1><p>Formularios de configuración.</p>`; }
function renderNotificaciones() { return `<h1><span class="code">[AD-03]</span>Gestión de Notificaciones</h1><p>Editor de plantillas de notificaciones.</p>`; }
function renderAnaqueles() { return `<h1>Gestión de Anaqueles</h1><p>Contenido para gestionar anaqueles.</p>`; }

// --- ROUTER Y SIDEBAR (CONFIGURACIÓN) ---
const navLinksConfig = {
    operaciones: [
        { href: '#/dashboard', text: 'Dashboard' },
        { href: '#/recibir-paquete', text: 'Recibir Paquete' },
        { href: '#/recibir-en-sucursal', text: 'Recibir en Sucursal' },
        { href: '#/clientes', text: 'Clientes' },
        { href: '#/paquetes', text: 'Paquetes' },
        { href: '#/sucursales', text: 'Sucursales' },
        { href: '#/cobrar', text: 'Cobrar y Facturar' },
    ],
    administracion: [
        { href: '#/usuarios', text: 'Usuarios y Roles' },
        { href: '#/configuracion', text: 'Configuración' },
        { href: '#/notificaciones', text: 'Notificaciones' },
    ]
};
const routes = {
    '/dashboard': { render: renderDashboard, roles: ['ADMIN', 'SUPERVISOR', 'RECEPCION'] },
    '/recibir-paquete': { render: renderRecibirPaquete, roles: ['ADMIN', 'RECEPCION'] },
    '/recibir-en-sucursal': { render: renderRecibirEnSucursal, roles: ['ADMIN', 'RECEPCION'] },
    '/clientes': { render: renderClientes, roles: ['ADMIN', 'SUPERVISOR'] },
    '/paquetes': { render: renderPaquetes, roles: ['ADMIN', 'SUPERVISOR', 'RECEPCION'] },
    '/sucursales': { render: renderSucursales, roles: ['ADMIN'] },
    '/cobrar': { render: renderCobrar, roles: ['ADMIN', 'RECEPCION'] },
    '/usuarios': { render: renderUsuarios, roles: ['ADMIN'] },
    '/configuracion': { render: renderConfiguracion, roles: ['ADMIN'] },
    '/notificaciones': { render: renderNotificaciones, roles: ['ADMIN'] },
};

function buildSidebar() {
    if (!session.user) return;
    let navHTML = '<h2 class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-4">Operaciones</h2>';
    navLinksConfig.operaciones.forEach(link => {
        const route = routes[link.href.slice(1)];
        if (route && route.roles.includes(session.user.role)) {
            navHTML += `<a href="${link.href}" class="sidebar-link flex items-center gap-3 px-4 py-2 rounded-lg"><span>${link.text}</span></a>`;
        }
    });
    if (session.user.role === 'ADMIN') {
        navHTML += '<h2 class="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-6 mb-2 px-4 pt-4 border-t">Administración</h2>';
        navLinksConfig.administracion.forEach(link => {
            navHTML += `<a href="${link.href}" class="sidebar-link flex items-center gap-3 px-4 py-2 rounded-lg"><span>${link.text}</span></a>`;
        });
    }
    mainNavEl.innerHTML = navHTML;
}

function router() {
    if (!session.user) {
        mainApp.classList.add('hidden');
        loginScreen.classList.remove('hidden');
        return;
    }
    const path = window.location.hash.slice(1) || '/dashboard';
    const route = routes[path];
    if (route && route.roles.includes(session.user.role)) {
        contentEl.innerHTML = route.render();
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${path}`);
        });
        // Llama a los inicializadores de eventos correspondientes a la ruta
        if (path === '/recibir-paquete') initializeRecibirPaqueteListeners();
        if (path === '/clientes') initializeClientesListeners();
        if (path === '/usuarios') initializeUsuariosListeners();
        if (path === '/sucursales') initializeSucursalesListeners();
        if (path === '/paquetes') initializeFilterToggle();
    } else {
        window.location.hash = '/dashboard';
    }
}

// --- INICIALIZACIÓN ---
window.addEventListener('hashchange', router);
window.addEventListener('load', () => {
    // Al cargar, el router decidirá si muestra el login o una página
    router();
});
