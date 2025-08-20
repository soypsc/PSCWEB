// --- DATOS DE LA APLICACIÓN ---
const db = {
    users: [
        { id: 1, username: 'Alvin', password: '12345', role: 'ADMIN' },
        { id: 2, username: 'Supervisor', password: '123', role: 'SUPERVISOR' },
        { id: 3, username: 'Recepcion', password: '123', role: 'RECEPCION' },
    ]
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
        window.location.hash = '/dashboard';
        router();
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


// --- LÓGICA DE FORMULARIOS Y EVENTOS ---

function initializeRecibirPaqueteListeners() {
    // La lógica de escaneo original se mantiene, pero no encontrará datos.
    // Esto es normal, ya que eliminamos la BD de prueba.
    const trackingInput = document.getElementById('tracking-main');
    const casilleroInput = document.getElementById('casillero');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');

    trackingInput.addEventListener('blur', () => {
        if (trackingInput.value.trim() !== '') {
            step2.classList.add('visible');
        } else {
            step2.classList.remove('visible');
            step3.classList.remove('visible');
        }
    });

    casilleroInput.addEventListener('blur', () => {
        document.getElementById('cliente').value = 'Búsqueda deshabilitada (sin BD)';
        document.getElementById('sucursal').value = '';
        step3.classList.add('visible');
    });
    
    // La función de escáneres se deja para no romper la UI, pero no podrá consultar datos.
    initializeAllScanners();
}

function initializeAllScanners() {
    // Esta función ahora solo previene errores, ya que Tesseract.js
    // y la lógica de búsqueda de datos no funcionarán sin la BD.
    const ocrScannerModal = document.getElementById('ocr-scanner-modal');
    const barcodeScannerModal = document.getElementById('barcode-scanner-modal');

    document.querySelectorAll('.scan-ocr-btn').forEach(btn => {
        btn.addEventListener('click', () => showAlert('Función OCR deshabilitada temporalmente.'));
    });
    document.getElementById('scan-tracking-barcode-btn').addEventListener('click', () => {
        showAlert('Función de escáner deshabilitada temporalmente.');
    });

    // Cierres de modales para que no se queden pegados si se abrieran
    if(document.getElementById('close-ocr-btn')) {
        document.getElementById('close-ocr-btn').addEventListener('click', () => ocrScannerModal.classList.add('hidden'));
    }
    if(document.getElementById('close-barcode-btn')) {
        document.getElementById('close-barcode-btn').addEventListener('click', () => barcodeScannerModal.classList.add('hidden'));
    }
}

// --- PLANTILLAS DE VISTAS (Templates) ---

function renderDashboard() {
    return `
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-bold text-slate-900 flex items-center"><span class="code">[OP-01]</span>Dashboard</h1>
            <div class="flex items-center gap-2">
                <span class="text-sm text-slate-500">Hoy: ${new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric'})}</span>
            </div>
        </div>
        <div class="mb-10">
            <h2 class="text-lg font-semibold text-slate-700 mb-4">Módulos funcionales</h2>
            <p>El inicio de sesión y el sistema de navegación por roles están activos. Las vistas de datos han sido deshabilitadas temporalmente para la optimización del código.</p>
        </div>
    `;
}

function renderRecibirPaquete() {
    // Se mantiene la estructura HTML para que la UI no se rompa.
    return `
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-bold text-slate-900 flex items-center"><span class="code">[OP-03A]</span>Recepción de Paquete</h1>
        </div>
        <div class="bg-white p-8 rounded-lg border border-slate-200 shadow-sm max-w-4xl mx-auto">
            <div>
                <label for="tracking-main" class="block text-lg font-semibold text-slate-700 mb-2">1. Tracking Principal</label>
                <div class="relative flex items-center">
                    <input type="text" id="tracking-main" placeholder="Ingresar o escanear tracking..." class="w-full text-lg pl-4 pr-24 py-3 border-2 border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 transition">
                    <div class="absolute right-2 flex items-center gap-1">
                        <button id="scan-tracking-barcode-btn" class="p-2 text-slate-500 hover:text-indigo-600 rounded-full hover:bg-indigo-100" title="Escanear Código de Barras"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v1m6 11h2m-6.5 6.5l-1.5-1.5M4 12H2m13.5-6.5l-1.5 1.5M12 20v-1m0-10V4m0 18a9 9 0 110-18 9 9 0 010 18z" /></svg></button>
                        <button data-target="tracking-main" class="scan-ocr-btn p-2 text-slate-500 hover:text-indigo-600 rounded-full hover:bg-indigo-100" title="Escanear Etiqueta (OCR)"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg></button>
                    </div>
                </div>
            </div>
            <div id="step2" class="form-section">
                <h2 class="text-lg font-semibold text-slate-700 mb-4">2. Asignar Cliente</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="relative flex items-center">
                        <label for="casillero" class="absolute -top-6 left-0 block text-sm font-medium text-slate-600">Casillero o Nombre</label>
                        <input type="text" id="casillero" placeholder="Buscar por nombre o escanear casillero..." class="w-full p-2 pr-12 border border-slate-300 rounded-md">
                        <button id="scan-casillero-ocr-btn" data-target="casillero" class="scan-ocr-btn absolute right-1 p-2 text-slate-500 hover:text-indigo-600 rounded-full hover:bg-indigo-100" title="Escanear Etiqueta (OCR)"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg></button>
                    </div>
                    <div><label for="cliente" class="block text-sm font-medium text-slate-600 mb-1">Cliente</label><input type="text" id="cliente" disabled class="w-full p-2 border border-slate-300 rounded-md bg-slate-100"></div>
                    <div class="md:col-span-2"><label for="sucursal" class="block text-sm font-medium text-slate-600 mb-1">Sucursal</label><div class="flex items-center gap-2"><span id="sucursal-color-dot" class="h-4 w-4 rounded-full bg-slate-200 transition-colors"></span><input type="text" id="sucursal" disabled class="w-full p-2 border border-slate-300 rounded-md bg-slate-100"></div></div>
                </div>
            </div>
            <div id="step3" class="form-section"><div class="mt-8"><button class="w-full bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all">Registrar Paquete</button></div></div>
        </div>
        <div id="ocr-scanner-modal" class="hidden"></div>
        <div id="barcode-scanner-modal" class="hidden"></div>
    `;
}

// Funciones "Stub" (vacías) para que no se rompa la navegación
function renderRecibirEnSucursal() { return `<h1><span class="code">[OP-04A]</span>Recepción en Sucursal (Deshabilitado)</h1>`; }
function renderClientes() { return `<h1><span class="code">[OP-02]</span>Gestión de Clientes (Deshabilitado)</h1>`; }
function renderPaquetes() { return `<h1><span class="code">[OP-03]</span>Gestión de Paquetes (Deshabilitado)</h1>`; }
function renderSucursales() { return `<h1><span class="code">[OP-04]</span>Gestión de Sucursales (Deshabilitado)</h1>`; }
function renderCobrar() { return `<h1><span class="code">[OP-05]</span>Cobro y Facturación (Deshabilitado)</h1>`; }
function renderUsuarios() { return `<h1><span class="code">[AD-01]</span>Usuarios y Roles (Deshabilitado)</h1>`; }
function renderConfiguracion() { return `<h1><span class="code">[AD-02]</span>Configuración del Sistema (Deshabilitado)</h1>`; }
function renderNotificaciones() { return `<h1><span class="code">[AD-03]</span>Gestión de Notificaciones (Deshabilitado)</h1>`; }
function renderAnaqueles() { return `<h1>Gestión de Anaqueles (Deshabilitado)</h1>`; }


// --- ROUTER Y SIDEBAR (CONFIGURACIÓN) ---
const navLinksConfig = {
    operaciones: [
        { href: '#/dashboard', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />', text: 'Dashboard' },
        { href: '#/recibir-paquete', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />', text: 'Recibir Paquete' },
        { href: '#/recibir-en-sucursal', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />', text: 'Recibir en Sucursal' },
        { href: '#/clientes', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-1a6 6 0 00-5.176-5.97M15 21H9" />', text: 'Clientes' },
        { href: '#/paquetes', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />', text: 'Paquetes' },
        { href: '#/sucursales', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />', text: 'Sucursales' },
        { href: '#/cobrar', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />', text: 'Cobrar y Facturar' },
    ],
    administracion: [
        { href: '#/usuarios', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />', text: 'Usuarios y Roles' },
        { href: '#/configuracion', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />', text: 'Configuración' },
        { href: '#/notificaciones', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />', text: 'Notificaciones' },
    ]
};

const routes = {
    '/dashboard': { title: 'Dashboard', render: renderDashboard, roles: ['ADMIN', 'SUPERVISOR', 'RECEPCION'] },
    '/recibir-paquete': { title: 'Recibir Paquete', render: renderRecibirPaquete, roles: ['ADMIN', 'RECEPCION'] },
    '/recibir-en-sucursal': { title: 'Recibir en Sucursal', render: renderRecibirEnSucursal, roles: ['ADMIN', 'RECEPCION'] },
    '/clientes': { title: 'Clientes', render: renderClientes, roles: ['ADMIN', 'SUPERVISOR'] },
    '/paquetes': { title: 'Paquetes', render: renderPaquetes, roles: ['ADMIN', 'SUPERVISOR', 'RECEPCION'] },
    '/sucursales': { title: 'Sucursales', render: renderSucursales, roles: ['ADMIN'] },
    '/cobrar': { title: 'Cobrar y Facturar', render: renderCobrar, roles: ['ADMIN', 'RECEPCION'] },
    '/usuarios': { title: 'Usuarios', render: renderUsuarios, roles: ['ADMIN'] },
    '/configuracion': { title: 'Configuración', render: renderConfiguracion, roles: ['ADMIN'] },
    '/notificaciones': { title: 'Notificaciones', render: renderNotificaciones, roles: ['ADMIN'] },
};

function buildSidebar() {
    if (!session.user) return;
    let navHTML = '<h2 class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-4">Operaciones</h2>';
    
    navLinksConfig.operaciones.forEach(link => {
        const routeKey = link.href.slice(2);
        const route = routes[`/${routeKey}`];
        if (route && route.roles.includes(session.user.role)) {
            navHTML += `<a href="${link.href}" class="sidebar-link flex items-center gap-3 px-4 py-2 rounded-lg transition-colors hover:bg-slate-100 hover:text-slate-900"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">${link.icon}</svg><span>${link.text}</span></a>`;
        }
    });

    if (session.user.role === 'ADMIN') {
        navHTML += '<h2 class="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-6 mb-2 px-4 pt-4 border-t">Administración</h2>';
        navLinksConfig.administracion.forEach(link => {
            const routeKey = link.href.slice(2);
            const route = routes[`/${routeKey}`];
            if (route && route.roles.includes(session.user.role)) {
                 navHTML += `<a href="${link.href}" class="sidebar-link flex items-center gap-3 px-4 py-2 rounded-lg transition-colors hover:bg-slate-100 hover:text-slate-900"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">${link.icon}</svg><span>${link.text}</span></a>`;
            }
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
    
    const pathParts = window.location.hash.slice(1).split('/');
    const basePath = `/${pathParts[1] || 'dashboard'}`;
    const param = pathParts[2] || null;
    
    const route = routes[basePath];

    if (route && route.roles.includes(session.user.role)) {
        contentEl.innerHTML = (basePath === '/sucursales' && param) ? renderAnaqueles(param) : route.render(param);
        document.title = `SGL - ${route.title}`;
        
        document.querySelectorAll('.sidebar-link').forEach(link => {
            const linkPath = link.getAttribute('href').split('/')[1];
            link.classList.toggle('active', `#/${linkPath}` === basePath);
        });
        
        // Ejecutar listeners solo para la ruta activa para evitar errores
        if (basePath === '/recibir-paquete') initializeRecibirPaqueteListeners();

    } else {
        window.location.hash = '/dashboard';
    }
}

// --- INICIALIZACIÓN ---
window.addEventListener('hashchange', router);
window.addEventListener('load', () => {
    // Si hay un hash en la URL al cargar, el router se encargará.
    // Si no, la pantalla de login se mostrará por defecto.
    if(window.location.hash) {
        router();
    }
});
