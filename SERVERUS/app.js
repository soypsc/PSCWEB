/**
 * SGL - PSC v1.8
 * Main application logic for the package and client management system.
 *
 * This file handles:
 * - Mock database and session management.
 * - User authentication (login/logout).
 * - SPA (Single Page Application) routing.
 * - Rendering different views (Dashboard, Packages, Clients, etc.).
 * - Initializing event listeners for interactive forms and components.
 * - OCR and Barcode scanning functionalities.
 */

// --- APPLICATION STATE & DATABASE ---

// A simple in-memory database for demonstration purposes.
// In a real application, this data would come from a server API.
const db = {
    users: [
        { id: 1, username: 'Alvin', password: '12345', role: 'ADMIN' },
        { id: 2, username: 'Supervisor', password: '123', role: 'SUPERVISOR' },
        { id: 3, username: 'Recepcion', password: '123', role: 'RECEPCION' },
    ],
    clients: [
        { id: 1, box: 'PASC12345', name: 'Juan Pérez', email: 'juan.perez@email.com', phone: '66778899', cedula: '8-123-456', dob: '1990-05-15', address: 'Calle 50, Edificio F&F', sucursal: 'Vía España', t1: 3.00, t2: 2.75, t3: 2.50, t4: 2.25, whatsappNotifications: true, sucursalColor: 'bg-sky-500' },
        { id: 2, box: 'PASC54321', name: 'Maria Rodriguez', email: 'maria.r@email.com', phone: '65554433', cedula: '4-567-890', dob: '1985-10-20', address: 'Av. Ricardo J. Alfaro', sucursal: 'El Dorado', t1: 2.90, t2: 2.65, t3: 2.40, t4: 2.15, whatsappNotifications: false, sucursalColor: 'bg-amber-500' },
    ],
    packages: [
        { id: 1, tracking: 'PSC-12345', status: 'En Sucursal', clientId: 1, sucursal: 'Vía España', anaquel: 'A-01', weight: 5.2, value: 15.60, isMaritime: false, date: '2024-07-15', invoice: null },
        { id: 2, tracking: 'PSC-12346', status: 'Entregado', clientId: 2, sucursal: 'El Dorado', anaquel: 'C-05', weight: 10.1, value: 25.25, isMaritime: true, date: '2024-07-14', invoice: 'F-2024-587' },
        { id: 3, tracking: 'PSC-12347', status: 'En Sucursal', clientId: 1, sucursal: 'Vía España', anaquel: 'B-02', weight: 2.0, value: 10.00, isMaritime: false, date: '2024-07-18', invoice: null },
    ],
    sucursales: [
        { id: 1, name: 'Vía España', address: 'Edificio A, Local 5, Vía España', anaqueles: ['A-01', 'A-02', 'B-01', 'B-02'] },
        { id: 2, name: 'El Dorado', address: 'Centro Comercial El Dorado, Local 22', anaqueles: ['C-01', 'C-02', 'C-03'] }
    ]
};

// Session object to store the currently logged-in user.
let session = {
    user: null
};

// --- DOM ELEMENT CACHING ---
// Caching DOM elements for faster access and cleaner code.
const DOM = {
    content: document.getElementById('content'),
    loginScreen: document.getElementById('login-screen'),
    mainApp: document.getElementById('main-app'),
    loginForm: document.getElementById('login-form'),
    loginError: document.getElementById('login-error'),
    logoutBtn: document.getElementById('logout-btn'),
    sessionUsername: document.getElementById('session-username'),
    mainNav: document.getElementById('main-nav'),
    alertBox: document.getElementById('custom-alert'),
    alertMessage: document.getElementById('custom-alert-message'),
    alertCloseBtn: document.getElementById('custom-alert-close'),
};


// --- UTILITY FUNCTIONS ---

/**
 * Displays a custom alert modal with a given message.
 * @param {string} message - The message to display in the alert.
 */
function showAlert(message) {
    DOM.alertMessage.textContent = message;
    DOM.alertBox.classList.remove('hidden');
    DOM.alertCloseBtn.onclick = () => DOM.alertBox.classList.add('hidden');
}

/**
 * A generic function to initialize a modal's open and close behavior.
 * @param {string} openBtnId - The ID of the button that opens the modal.
 * @param {string} modalId - The ID of the modal element.
 * @param {string} closeBtnClass - The class for all elements that should close the modal.
 */
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

/**
 * Toggles the visibility of the advanced filters section.
 */
function initializeFilterToggle() {
    const toggleButton = document.getElementById('toggle-filters-btn');
    const filtersDiv = document.getElementById('advanced-filters');
    if (toggleButton && filtersDiv) {
        toggleButton.addEventListener('click', () => {
            filtersDiv.classList.toggle('visible');
        });
    }
}


// --- AUTHENTICATION & SESSION MANAGEMENT ---

/**
 * Handles the login form submission.
 * @param {Event} e - The form submission event.
 */
function handleLogin(e) {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    // IMPORTANT: This is a mock authentication. In a real application,
    // you should NEVER handle passwords this way. Use a secure backend.
    const user = db.users.find(u => u.username === username && u.password === password);

    if (user) {
        session.user = user;
        DOM.loginScreen.classList.add('hidden');
        DOM.mainApp.classList.remove('hidden');
        DOM.sessionUsername.textContent = session.user.username;
        buildSidebar();
        window.location.hash = '/dashboard';
        router(); // Initial route after login
    } else {
        DOM.loginError.classList.remove('hidden');
    }
}

/**
 * Handles the logout process.
 * @param {Event} e - The click event.
 */
function handleLogout(e) {
    e.preventDefault();
    session.user = null;
    window.location.hash = '';
    DOM.mainApp.classList.add('hidden');
    DOM.loginScreen.classList.remove('hidden');
    DOM.mainNav.innerHTML = ''; // Clear the sidebar
}


// --- DYNAMIC CONTENT RENDERING (VIEWS) ---
// Each function returns an HTML string for a specific view.

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
                <button class="flex items-center justify-center gap-3 bg-white text-slate-700 font-bold py-3 px-4 rounded-lg shadow-sm hover:bg-slate-50 transition-all transform hover:-translate-y-1 border border-slate-200">
                     <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <span>Buscar Cliente</span>
                </button>
            </div>
        </div>

        <div>
            <h2 class="text-lg font-semibold text-slate-700 mb-4 flex items-center"><span class="code">[OP-01B]</span>Resumen de Actividad del Día</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-white p-6 rounded-lg border border-slate-200"><h3 class="text-slate-500 font-medium">Paquetes Recibidos Hoy</h3><p class="text-4xl font-bold text-emerald-500 mt-2">124</p></div>
                <div class="bg-white p-6 rounded-lg border border-slate-200"><h3 class="text-slate-500 font-medium">Paquetes por Entregar</h3><p class="text-4xl font-bold text-amber-500 mt-2">32</p></div>
                <div class="bg-white p-6 rounded-lg border border-slate-200"><h3 class="text-slate-500 font-medium">Total Cobros del Día</h3><p class="text-4xl font-bold text-slate-800 mt-2">$1,450.75</p></div>
            </div>
        </div>
    `;
}

// ... other render functions (renderRecibirPaquete, renderClientes, etc.) would go here ...
// They are omitted for brevity but would follow the same pattern.
// For example:
function renderRecibirPaquete() {
    return `
        <!-- HTML for the Recibir Paquete view -->
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-bold text-slate-900 flex items-center"><span class="code">[OP-03A]</span>Recepción de Paquete</h1>
        </div>
        <div class="bg-white p-8 rounded-lg border border-slate-200 shadow-sm max-w-4xl mx-auto">
            <!-- Form content -->
        </div>
        <!-- Scanner Modals -->
    `;
}

function renderClientes() {
    return `<!-- HTML for the Clientes view -->`;
}
// Add all other render functions here...

function renderPlaceholder(title, code) {
    return `<h1 class="text-3xl font-bold text-slate-900 flex items-center"><span class="code">[${code}]</span>${title}</h1><p class="mt-4">Contenido para ${title} estará aquí.</p>`;
}


// --- PAGE-SPECIFIC LOGIC & EVENT LISTENERS ---

function initializeRecibirPaqueteListeners() {
    // All the logic from the original `initializeRecibirPaqueteListeners`
    // and `initializeAllScanners` goes here.
    // It's best to break down `initializeAllScanners` into smaller functions
    // for OCR and Barcode scanning to improve readability.
    console.log("Initializing listeners for 'Recibir Paquete' page.");
}

function initializeCobrarListeners() {
    console.log("Initializing listeners for 'Cobrar' page.");
}

function initializeClientesListeners() {
    initializeFilterToggle();
    initializeModal('add-client-btn', 'add-client-modal', 'close-modal');
}
// Add all other `initialize...` functions here...


// --- ROUTER & NAVIGATION ---

const navLinksConfig = {
    operaciones: [
        { href: '#/dashboard', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />', text: 'Dashboard' },
        // ... other links
    ],
    administracion: [
        { href: '#/usuarios', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />', text: 'Usuarios y Roles' },
        // ... other links
    ]
};

// Maps URL paths to their corresponding render function, title, roles, and initializer.
const routes = {
    '/dashboard': { render: renderDashboard, title: 'Dashboard', roles: ['ADMIN', 'SUPERVISOR', 'RECEPCION'], init: null },
    '/recibir-paquete': { render: renderRecibirPaquete, title: 'Recibir Paquete', roles: ['ADMIN', 'RECEPCION'], init: initializeRecibirPaqueteListeners },
    '/clientes': { render: renderClientes, title: 'Clientes', roles: ['ADMIN', 'SUPERVISOR'], init: initializeClientesListeners },
    '/cobrar': { render: renderCobrar, title: 'Cobrar', roles: ['ADMIN', 'RECEPCION'], init: initializeCobrarListeners },
    // ... all other routes
};

/**
 * Builds the sidebar navigation based on the user's role.
 */
function buildSidebar() {
    if (!session.user) return;

    const createLinkHTML = (link) => `
        <a href="${link.href}" class="sidebar-link flex items-center gap-3 px-4 py-2 rounded-lg transition-colors hover:bg-slate-100 hover:text-slate-900">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">${link.icon}</svg>
            <span>${link.text}</span>
        </a>`;

    let navHTML = '<h2 class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-4">Operaciones</h2>';
    
    navLinksConfig.operaciones.forEach(link => {
        const route = routes[link.href.replace('#', '')];
        if (route && route.roles.includes(session.user.role)) {
            navHTML += createLinkHTML(link);
        }
    });

    if (session.user.role === 'ADMIN') {
        navHTML += '<h2 class="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-6 mb-2 px-4 pt-4 border-t">Administración</h2>';
        navLinksConfig.administracion.forEach(link => {
            const route = routes[link.href.replace('#', '')];
            if (route && route.roles.includes(session.user.role)) {
                navHTML += createLinkHTML(link);
            }
        });
    }

    DOM.mainNav.innerHTML = navHTML;
}

/**
 * Main router function to handle page changes.
 */
function router() {
    if (!session.user) {
        DOM.mainApp.classList.add('hidden');
        DOM.loginScreen.classList.remove('hidden');
        return;
    }

    const pathParts = window.location.hash.slice(1).split('/');
    const basePath = `/${pathParts[1] || 'dashboard'}`;
    const param = pathParts[2] || null;

    const route = routes[basePath];

    if (route && route.roles.includes(session.user.role)) {
        // Render the view's HTML
        DOM.content.innerHTML = route.render(param);
        document.title = `SGL - ${route.title}`;

        // Update active link in sidebar
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${basePath}`);
        });

        // Run the specific initializer function for the new view
        if (route.init) {
            route.init(param);
        }
    } else {
        // If the user tries to access a restricted or non-existent route, redirect to dashboard.
        window.location.hash = '/dashboard';
    }
}

// --- APP INITIALIZATION ---

/**
 * Initializes the application.
 */
function initialize() {
    DOM.loginForm.addEventListener('submit', handleLogin);
    DOM.logoutBtn.addEventListener('click', handleLogout);

    window.addEventListener('hashchange', router);
    window.addEventListener('load', router); // Handle initial page load
}

// Start the application
initialize();
