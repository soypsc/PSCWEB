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
        window.location.hash = '/dashboard';
        router(); // <-- ESTA ES LA LÍNEA CORREGIDA
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
        document.getElementById('cliente').value = 'Cliente no encontrado';
        document.getElementById('sucursal').value = '';
        step3.classList.add('visible');
    });
    
    initializeAllScanners();
}

function initializeAllScanners() {
    const ocrScannerModal = document.getElementById('ocr-scanner-modal');
    const barcodeScannerModal = document.getElementById('barcode-scanner-modal');

    document.querySelectorAll('.scan-ocr-btn').forEach(btn => {
        btn.addEventListener('click', () => showAlert('Función OCR necesita conexión a base de datos.'));
    });
    document.getElementById('scan-tracking-barcode-btn').addEventListener('click', () => {
        showAlert('Función de escáner necesita conexión a base de datos.');
    });

    if(document.getElementById('close-ocr-btn')) {
        document.getElementById('close-ocr-btn').addEventListener('click', () => ocrScannerModal.classList.add('hidden'));
    }
    if(document.getElementById('close-barcode-btn')) {
        document.getElementById('close-barcode-btn').addEventListener('click', () => barcodeScannerModal.classList.add('hidden'));
    }
}

function initializeRecibirSucursalListeners() {
    document.querySelectorAll('.notify-email-btn, .notify-whatsapp-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            showAlert('Esta función requiere datos de un paquete para operar.');
        });
    });
}

function initializeCobrarListeners() {
    const searchInputs = document.querySelectorAll('.search-input');
    searchInputs.forEach(input => {
        input.addEventListener('blur', () => {
            showAlert('La búsqueda de clientes está deshabilitada. No hay base de datos.');
        });
    });
}

function initializeModal(openBtnId, modalId, closeBtnClass) {
    const openBtn = document.getElementById(openBtnId);
    const modal = document.getElementById(modalId);
    const closeBtns = document.querySelectorAll(`.${closeBtnClass}`);
    if (openBtn && modal) {
        openBtn.addEventListener('click', () => modal.classList.remove('hidden'));
        closeBtns.forEach(btn => {
            btn.addEventListener('click', () => modal.classList.add('hidden'));
        });
    }
}

function initializeFilterToggle() {
    const toggleButton = document.getElementById('toggle-filters-btn');
    const filtersDiv = document.getElementById('advanced-filters');
    if (toggleButton && filtersDiv) {
        toggleButton.addEventListener('click', () => {
            filtersDiv.classList.toggle('visible');
        });
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
    document.querySelectorAll('.manage-anaqueles-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            showAlert('Esta función requiere datos de sucursales para operar.');
        });
    });
}

function initializeNotificacionesListeners() {
    const mainTabs = document.querySelectorAll('.main-tab-btn');
    const mainTabContents = document.querySelectorAll('.main-tab-content');
    const templateTabs = document.querySelectorAll('.tab-btn');
    const templateTabContents = document.querySelectorAll('.tab-content');
    const actionsPanels = document.querySelectorAll('.actions-panel');

    function switchMainTab(target) {
        mainTabs.forEach(tab => tab.classList.toggle('border-emerald-500', tab.dataset.target === target));
        mainTabContents.forEach(content => content.style.display = content.id === `main-tab-${target}` ? 'block' : 'none');
    }

    function switchTemplateTab(target) {
        templateTabs.forEach(tab => tab.classList.toggle('border-emerald-500', tab.dataset.target === target));
        templateTabContents.forEach(content => content.style.display = content.id === `tab-${target}` ? 'block' : 'none');
        actionsPanels.forEach(panel => panel.style.display = panel.id === `actions-${target}` ? 'block' : 'none');
    }

    mainTabs.forEach(tab => tab.addEventListener('click', () => switchMainTab(tab.dataset.target)));
    templateTabs.forEach(tab => tab.addEventListener('click', () => switchTemplateTab(tab.dataset.target)));

    switchMainTab('editor');
    switchTemplateTab('llegada');
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
            <h2 class="text-lg font-semibold text-slate-700 mb-4 flex items-center"><span class="code">[OP-01A]</span>Acceso Rápido</h2>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <button onclick="window.location.hash='#/recibir-paquete'" class="flex items-center justify-center gap-3 bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all transform hover:-translate-y-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>Recibir Paquete</span>
                </button>
                <button onclick="window.location.hash='#/recibir-en-sucursal'" class="flex items-center justify-center gap-3 bg-sky-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-sky-500/20 hover:bg-sky-600 transition-all transform hover:-translate-y-1">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    <span>Recibir en Sucursal</span>
                </button>
                <button onclick="window.location.hash='#/cobrar'" class="flex items-center justify-center gap-3 bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-indigo-500/20 hover:bg-indigo-600 transition-all transform hover:-translate-y-1">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                    <span>Cobrar y Facturar</span>
                </button>
                <button onclick="window.location.hash='#/clientes'" class="flex items-center justify-center gap-3 bg-white text-slate-700 font-bold py-3 px-4 rounded-lg shadow-sm hover:bg-slate-50 transition-all transform hover:-translate-y-1 border border-slate-200">
                     <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <span>Buscar Cliente</span>
                </button>
            </div>
        </div>
        <div>
            <h2 class="text-lg font-semibold text-slate-700 mb-4 flex items-center"><span class="code">[OP-01B]</span>Resumen de Actividad del Día</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-white p-6 rounded-lg border border-slate-200"><h3 class="text-slate-500 font-medium">Paquetes Recibidos Hoy</h3><p class="text-4xl font-bold text-emerald-500 mt-2">0</p></div>
                <div class="bg-white p-6 rounded-lg border border-slate-200"><h3 class="text-slate-500 font-medium">Paquetes por Entregar</h3><p class="text-4xl font-bold text-amber-500 mt-2">0</p></div>
                <div class="bg-white p-6 rounded-lg border border-slate-200"><h3 class="text-slate-500 font-medium">Total Cobros del Día</h3><p class="text-4xl font-bold text-slate-800 mt-2">$0.00</p></div>
            </div>
        </div>
    `;
}

function renderRecibirPaquete() {
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

function renderRecibirEnSucursal() {
    return `
        <h1 class="text-3xl font-bold text-slate-900 flex items-center mb-8"><span class="code">[OP-04A]</span>Recepción en Sucursal</h1>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2">
                <div class="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                      <label for="tracking-sucursal-main" class="block text-lg font-semibold text-slate-700 mb-2">Escanear Paquete</label>
                    <div class="relative">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
                          <input type="text" id="tracking-sucursal-main" placeholder="Esperando escaneo de tracking interno..." class="w-full text-lg pl-12 pr-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 transition">
                    </div>
                </div>
                <div class="bg-white p-6 mt-6 rounded-lg border border-slate-200 shadow-sm">
                    <h2 class="text-lg font-semibold text-slate-700 mb-4">Paquetes Pendientes de Notificación</h2>
                    <div class="overflow-x-auto"><table id="packages-to-notify-table" class="w-full text-sm text-left text-slate-500"><thead class="text-xs text-slate-700 uppercase bg-slate-100"><tr><th scope="col" class="px-6 py-3 rounded-l-lg">Tracking</th><th scope="col" class="px-6 py-3">Cliente</th><th scope="col" class="px-6 py-3">Estado</th><th scope="col" class="px-6 py-3 rounded-r-lg">Acciones</th></tr></thead><tbody><tr><td colspan="4" class="text-center p-4">No hay paquetes pendientes.</td></tr></tbody></table></div>
                </div>
            </div>
            <div class="lg:col-span-1">
                 <div class="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                    <h2 class="text-lg font-semibold text-slate-700 mb-4">Guardar en</h2>
                    <div class="space-y-4">
                        <div><label for="sucursal-destino" class="block text-sm font-medium text-slate-600 mb-1">Sucursal (Sesión)</label><input type="text" id="sucursal-destino" value="No disponible" disabled class="w-full p-2 border border-slate-300 rounded-md bg-slate-100"></div>
                        <div><label for="anaquel-destino" class="block text-sm font-medium text-slate-600 mb-1">Anaquel</label><select id="anaquel-destino" class="w-full p-2 border border-slate-300 rounded-md"><option>No hay anaqueles</option></select></div>
                    </div>
                    <div class="mt-6 pt-6 border-t border-slate-200">
                        <h3 class="text-md font-semibold text-slate-700 mb-2">Info del Paquete</h3>
                        <div id="info-paquete-sucursal" class="text-sm text-slate-600 space-y-1"><p>Esperando escaneo...</p></div>
                    </div>
                    <button class="w-full mt-6 bg-sky-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-sky-500/20 hover:bg-sky-600 transition-all">Confirmar Recepción</button>
               </div>
            </div>
        </div>
    `;
}

function renderClientes() {
    return `
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-3xl font-bold text-slate-900 flex items-center"><span class="code">[OP-02]</span>Gestión de Clientes</h1>
            <button id="add-client-btn" class="flex items-center gap-2 bg-emerald-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-emerald-600 transition-all transform hover:-translate-y-px shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                <span>Crear Cliente</span>
            </button>
        </div>
        <div class="bg-white p-4 rounded-lg border border-slate-200 mb-6">
            <div class="flex flex-wrap items-center gap-4">
                <div class="relative flex-grow">
                     <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <input type="text" placeholder="Buscar por Nombre, Box, Email, Cédula..." class="w-full p-2 pl-10 border border-slate-300 rounded-md">
                </div>
                <button id="toggle-filters-btn" class="flex items-center gap-2 p-2 border border-slate-300 rounded-md text-slate-600 hover:bg-slate-100">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6-4.14 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                    <span>Filtros Avanzados</span>
                </button>
                <button class="bg-emerald-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-emerald-600">Buscar</button>
            </div>
            <div id="advanced-filters" class="advanced-filters">
                 <div class="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-slate-200">
                    <select class="p-2 border border-slate-300 rounded-md"><option>Cualquier Sucursal</option></select>
                    <select class="p-2 border border-slate-300 rounded-md"><option>Cualquier Tarifa</option></select>
                    <select class="p-2 border border-slate-300 rounded-md"><option>Cualquier Término</option></select>
                    <select class="p-2 border border-slate-300 rounded-md"><option>Cualquier Tipo</option></select>
                 </div>
            </div>
        </div>
        <div class="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-sm text-left text-slate-500 whitespace-nowrap">
                    <thead class="text-xs text-slate-700 uppercase bg-slate-100">
                        <tr><th class="px-6 py-3">Nombre</th><th class="px-6 py-3">Box</th><th class="px-6 py-3">Email</th><th class="px-6 py-3">Celular</th><th class="px-6 py-3">Sucursal</th><th class="px-6 py-3">Acciones</th></tr>
                    </thead>
                    <tbody><tr><td colspan="6" class="text-center p-4">No hay clientes para mostrar. Agregue uno para comenzar.</td></tr></tbody>
                </table>
            </div>
        </div>
        <div id="add-client-modal" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 hidden modal-backdrop">
            <div class="bg-white w-full max-w-4xl rounded-lg shadow-xl p-8 modal-content">
                <div class="flex justify-between items-center mb-6"><h2 class="text-2xl font-bold text-slate-800">Crear Nuevo Cliente</h2><button class="close-modal text-slate-400 hover:text-slate-600 text-3xl font-bold">&times;</button></div>
                <form class="space-y-4"><div class="grid grid-cols-1 md:grid-cols-3 gap-4"><div><label class="block text-sm font-medium text-slate-600 mb-1">Nombre</label><input type="text" class="w-full p-2 border border-slate-300 rounded-md"></div><div><label class="block text-sm font-medium text-slate-600 mb-1">Box</label><input type="text" class="w-full p-2 border border-slate-300 rounded-md"></div><div><label class="block text-sm font-medium text-slate-600 mb-1">Email</label><input type="email" class="w-full p-2 border border-slate-300 rounded-md"></div><div><label class="block text-sm font-medium text-slate-600 mb-1">Celular</label><input type="tel" class="w-full p-2 border border-slate-300 rounded-md"></div><div><label class="block text-sm font-medium text-slate-600 mb-1">Cédula</label><input type="text" class="w-full p-2 border border-slate-300 rounded-md"></div><div><label class="block text-sm font-medium text-slate-600 mb-1">Fecha de Nacimiento</label><input type="date" class="w-full p-2 border border-slate-300 rounded-md text-slate-500"></div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-slate-600 mb-1">Dirección</label><input type="text" class="w-full p-2 border border-slate-300 rounded-md"></div><div><label class="block text-sm font-medium text-slate-600 mb-1">Sucursal</label><select class="w-full p-2 border border-slate-300 rounded-md"><option>Seleccionar</option></select></div></div><div class="grid grid-cols-1 md:grid-cols-4 gap-4"><div><label class="block text-sm font-medium text-slate-600 mb-1">Tarifa 1</label><input type="text" class="w-full p-2 border border-slate-300 rounded-md"></div><div><label class="block text-sm font-medium text-slate-600 mb-1">Tarifa 2</label><input type="text" class="w-full p-2 border border-slate-300 rounded-md"></div><div><label class="block text-sm font-medium text-slate-600 mb-1">Tarifa 3</label><input type="text" class="w-full p-2 border border-slate-300 rounded-md"></div><div><label class="block text-sm font-medium text-slate-600 mb-1">Tarifa 4</label><input type="text" class="w-full p-2 border border-slate-300 rounded-md"></div></div><div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg mt-4"><label for="whatsapp-toggle" class="font-medium text-slate-700">Activar Notificaciones por WhatsApp</label><div class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in"><input type="checkbox" name="whatsapp-toggle" id="whatsapp-toggle" class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/><label for="whatsapp-toggle" class="toggle-label block overflow-hidden h-6 rounded-full bg-slate-300 cursor-pointer"></label></div></div><div class="flex justify-end gap-4 pt-4"><button type="button" class="close-modal bg-slate-100 text-slate-700 font-semibold py-2 px-4 rounded-md hover:bg-slate-200">Cancelar</button><button type="submit" class="bg-emerald-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-emerald-600">Guardar Cliente</button></div></form>
            </div>
        </div>
    `;
}

function renderPaquetes() { 
    return `
        <h1 class="text-3xl font-bold text-slate-900 flex items-center mb-6"><span class="code">[OP-03]</span>Gestión de Paquetes</h1>
        <div class="bg-white p-4 rounded-lg border border-slate-200 mb-6">
            <div class="flex flex-wrap items-center gap-4">
                <div class="relative flex-grow"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg><input type="text" placeholder="Buscar por Tracking, Cliente, Box..." class="w-full p-2 pl-10 border border-slate-300 rounded-md"></div>
                <button id="toggle-filters-btn" class="flex items-center gap-2 p-2 border border-slate-300 rounded-md text-slate-600 hover:bg-slate-100"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg><span>Filtros Avanzados</span></button>
                <button class="bg-emerald-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-emerald-600">Buscar</button>
            </div>
            <div id="advanced-filters" class="advanced-filters"><div class="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-slate-200"><select class="p-2 border border-slate-300 rounded-md"><option>Todos los Estados</option></select><select class="p-2 border border-slate-300 rounded-md"><option>Cualquier Sucursal</option></select><input type="date" class="p-2 border border-slate-300 rounded-md text-slate-500"><select class="p-2 border border-slate-300 rounded-md"><option>Aéreo/Marítimo</option></select></div></div>
        </div>
        <div class="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-sm text-left text-slate-500 whitespace-nowrap">
                    <thead class="text-xs text-slate-700 uppercase bg-slate-100">
                        <tr><th class="px-6 py-3">Tracking</th><th class="px-6 py-3">Status</th><th class="px-6 py-3">Cliente</th><th class="px-6 py-3">Sucursal</th><th class="px-6 py-3">Anaquel</th><th class="px-6 py-3">Lb</th><th class="px-6 py-3">Valor</th><th class="px-6 py-3">Fecha</th><th class="px-6 py-3"># Factura</th><th class="px-6 py-3">Acciones</th></tr>
                    </thead>
                    <tbody><tr><td colspan="10" class="text-center p-4">No hay paquetes registrados.</td></tr></tbody>
                </table>
            </div>
        </div>
    `;
}

function renderCobrar() {
    return `
        <h1 class="text-3xl font-bold text-slate-900 flex items-center mb-8"><span class="code">[OP-05]</span>Cobro y Facturación</h1>
        <div class="bg-white p-8 rounded-lg border border-slate-200 shadow-sm">
            <div>
                <h2 class="block text-lg font-semibold text-slate-700 mb-2">1. Buscar Cliente</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" id="casillero-search" placeholder="Por Casillero..." class="search-input text-base p-3 border-2 border-slate-300 rounded-lg">
                    <input type="text" placeholder="Por Nombre..." class="search-input text-base p-3 border-2 border-slate-300 rounded-lg">
                    <input type="text" placeholder="Por Nro. de Factura..." class="search-input text-base p-3 border-2 border-slate-300 rounded-lg">
                </div>
            </div>
            <div class="text-center p-6 mt-6 bg-slate-50 rounded-lg">
                <p class="text-slate-500">Busque un cliente para ver sus paquetes pendientes de pago.</p>
            </div>
        </div>
    `;
}

function renderUsuarios() {
    return `
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-3xl font-bold text-slate-900 flex items-center"><span class="code">[AD-01]</span>Usuarios y Roles</h1>
            <button id="add-user-btn" class="flex items-center gap-2 bg-emerald-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-emerald-600 transition-all transform hover:-translate-y-px shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                <span>Crear Usuario</span>
            </button>
        </div>
        <div class="bg-white rounded-lg border border-slate-200 overflow-hidden">
             <div class="overflow-x-auto">
                <table class="w-full text-sm text-left text-slate-500 whitespace-nowrap">
                    <thead class="text-xs text-slate-700 uppercase bg-slate-100">
                        <tr><th class="px-6 py-3">Nombre</th><th class="px-6 py-3">Rol</th><th class="px-6 py-3">Acciones</th></tr>
                    </thead>
                    <tbody>
                        ${db.users.map(user => `
                        <tr class="bg-white border-b hover:bg-slate-50">
                            <td class="px-6 py-4 font-medium text-slate-900">${user.username}</td>
                            <td class="px-6 py-4"><span class="font-semibold px-2 py-1 text-xs rounded-full ${user.role === 'ADMIN' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-800'}">${user.role}</span></td>
                            <td class="px-6 py-4"><div class="flex items-center gap-4"><a href="#" class="text-slate-500 hover:text-indigo-600">Editar</a><a href="#" class="text-slate-500 hover:text-red-600">Eliminar</a></div></td>
                        </tr>`).join('')}
                    </tbody>
                </table>
            </div>
        </div>
        <div id="add-user-modal" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 hidden modal-backdrop">
            <div class="bg-white w-full max-w-md rounded-lg shadow-xl p-8 modal-content">
                <div class="flex justify-between items-center mb-6"><h2 class="text-2xl font-bold text-slate-800">Crear Nuevo Usuario</h2><button class="close-modal text-slate-400 hover:text-slate-600 text-3xl font-bold">&times;</button></div>
                <form class="space-y-4">
                    <div><label class="block text-sm font-medium text-slate-600 mb-1">Nombre de Usuario</label><input type="text" class="w-full p-2 border border-slate-300 rounded-md"></div>
                    <div><label class="block text-sm font-medium text-slate-600 mb-1">Contraseña</label><input type="password" class="w-full p-2 border border-slate-300 rounded-md"></div>
                    <div><label class="block text-sm font-medium text-slate-600 mb-1">Rol</label><select class="w-full p-2 border border-slate-300 rounded-md"><option>ADMIN</option><option>SUPERVISOR</option><option>RECEPCION</option></select></div>
                    <div class="flex justify-end gap-4 pt-4"><button type="button" class="close-modal bg-slate-100 text-slate-700 font-semibold py-2 px-4 rounded-md hover:bg-slate-200">Cancelar</button><button type="submit" class="bg-emerald-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-emerald-600">Guardar Usuario</button></div>
                </form>
            </div>
        </div>
    `;
}

function renderSucursales() {
    return `
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-3xl font-bold text-slate-900 flex items-center"><span class="code">[OP-04]</span>Gestión de Sucursales</h1>
            <button id="add-sucursal-btn" class="flex items-center gap-2 bg-emerald-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-emerald-600"><span>Crear Sucursal</span></button>
        </div>
        <div class="text-center p-6 bg-slate-50 rounded-lg"><p class="text-slate-500">No hay sucursales. Agregue una para comenzar.</p></div>
        <div id="add-sucursal-modal" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 hidden modal-backdrop">
            <div class="bg-white w-full max-w-md rounded-lg shadow-xl p-8 modal-content">
                <div class="flex justify-between items-center mb-6"><h2 class="text-2xl font-bold text-slate-800">Crear Nueva Sucursal</h2><button class="close-modal text-slate-400 hover:text-slate-600 text-3xl font-bold">&times;</button></div>
                <form class="space-y-4">
                    <div><label class="block text-sm font-medium text-slate-600 mb-1">Nombre</label><input type="text" class="w-full p-2 border border-slate-300 rounded-md"></div>
                    <div><label class="block text-sm font-medium text-slate-600 mb-1">Dirección</label><input type="text" class="w-full p-2 border border-slate-300 rounded-md"></div>
                    <div class="flex justify-end gap-4 pt-4"><button type="button" class="close-modal bg-slate-100 text-slate-700 font-semibold py-2 px-4 rounded-md hover:bg-slate-200">Cancelar</button><button type="submit" class="bg-emerald-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-emerald-600">Guardar</button></div>
                </form>
            </div>
        </div>
    `;
}

function renderConfiguracion() {
    return `<h1 class="text-3xl font-bold text-slate-900 flex items-center mb-8"><span class="code">[AD-02]</span>Configuración del Sistema</h1><p>Aquí irán los formularios de configuración.</p>`;
}

function renderNotificaciones() {
    return `<h1 class="text-3xl font-bold text-slate-900 flex items-center mb-8"><span class="code">[AD-03]</span>Gestión de Notificaciones</h1><p>Aquí irá el editor de plantillas de notificaciones.</p>`;
}

function renderAnaqueles() {
    return `<h1>Gestión de Anaqueles</h1><p>Contenido para gestionar anaqueles de una sucursal específica.</p>`;
}


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
        
        if (basePath === '/recibir-paquete') initializeRecibirPaqueteListeners();
        if (basePath === '/recibir-en-sucursal') initializeRecibirSucursalListeners();
        if (basePath === '/cobrar') initializeCobrarListeners();
        if (basePath === '/clientes') initializeClientesListeners();
        if (basePath === '/paquetes') initializeFilterToggle();
        if (basePath === '/usuarios') initializeUsuariosListeners();
        if (basePath === '/notificaciones') initializeNotificacionesListeners();
        if (basePath === '/sucursales' && !param) initializeSucursalesListeners();

    } else {
        window.location.hash = '/dashboard';
        router();
    }
}

// --- INICIALIZACIÓN ---
window.addEventListener('hashchange', router);
window.addEventListener('load', () => {
    // Si hay un hash en la URL al cargar, el router intentará navegar.
    // Si no hay sesión, el router forzará la pantalla de login.
    router();
});
