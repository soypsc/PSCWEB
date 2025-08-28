// js/app.js

// --- CONFIGURACIÓN E INICIALIZACIÓN ---
const { createClient } = supabase;
const supabaseClient = createClient(window.PSC_CONFIG.supabaseUrl, window.PSC_CONFIG.supabaseAnonKey);
const rootContainer = document.getElementById('root-container');

let currentUserProfile = null;
let swRegistration = null;

// --- NAVEGACIÓN Y CARGA DE PÁGINAS ---

/**
 * Carga el contenido de una página HTML en el contenedor principal
 * y luego carga y ejecuta su script correspondiente.
 * @param {string} pageName - El nombre de la página (ej: 'login', 'home').
 */
async function loadPage(pageName) {
    if (!rootContainer) return;

    try {
        // 1. Cargar el HTML de la página
        const response = await fetch(`pages/${pageName}.html`);
        if (!response.ok) throw new Error(`No se pudo cargar pages/${pageName}.html`);
        const pageHtml = await response.text();
        rootContainer.innerHTML = pageHtml;

        // 2. Cargar el script específico de la página
        // Usamos import() dinámico que funciona con módulos de JavaScript
        try {
            const pageModule = await import(`./pages/${pageName}.js`);
            // Si el módulo tiene una función 'init', la ejecutamos.
            if (pageModule && typeof pageModule.init === 'function') {
                pageModule.init(supabaseClient, navigateTo);
            }
        } catch (scriptError) {
            // No todas las páginas tienen que tener un script, así que no es un error fatal.
            console.log(`No se encontró o hubo un error al cargar el script para la página ${pageName}.js`);
        }
        
        // Renderizar iconos después de cargar el nuevo contenido
        lucide.createIcons();

    } catch (error) {
        console.error("Error al cargar la página:", error);
        rootContainer.innerHTML = `<p class="text-red-500 text-center p-8">Error al cargar el contenido.</p>`;
    }
}

/**
 * Función de navegación global que será pasada a los módulos.
 * @param {string} pageName - El nombre de la página a la que se quiere navegar.
 */
function navigateTo(pageName) {
    loadPage(pageName);
}


// --- LÓGICA DE AUTENTICACIÓN ---

async function showApp(user) {
    await loadPage('app-shell'); // Carga el "cascarón" de la app (home, paquetes, etc.)
    
    // Una vez cargado el shell, obtenemos el perfil
    const { data: cliente } = await supabaseClient.from('clientes').select('nombre, box, tarifa_1').eq('user_id', user.id).single();
    currentUserProfile = cliente; // Guardamos el perfil para uso global

    // Actualizamos la UI del shell (si es necesario)
    const userNameDisplay = document.getElementById('user-name-display');
    const userBoxDisplay = document.getElementById('user-box-display');

    if (userNameDisplay && userBoxDisplay) {
        if (cliente) {
            userNameDisplay.textContent = cliente.nombre || 'Usuario';
            userBoxDisplay.textContent = `(Box ${cliente.box || 'N/A'})`;
        } else {
            userNameDisplay.textContent = user.user_metadata.nombre_completo || 'Usuario';
            userBoxDisplay.textContent = '(Casillero no asignado)';
        }
    }
    
    // Inicializar lógica de notificaciones y PWA ahora que el usuario está logueado
    initializePushNotifications();
    initializeInstallPrompt();
}

async function showAuth() {
    await loadPage('auth-shell'); // Carga el contenedor de login/registro
}

async function handleLogout() {
    await supabaseClient.auth.signOut();
    currentUserProfile = null;
    showAuth();
}


// --- NOTIFICACIONES PUSH Y PWA (Lógica de Instalación) ---

function initializePushNotifications() {
    // ... (La lógica que ya teníamos para notificaciones)
}

function initializeInstallPrompt() {
    // ... (La lógica que ya teníamos para el banner de instalación)
}


// --- PUNTO DE ENTRADA DE LA APLICACIÓN ---

async function main() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) {
        await showApp(session.user);
    } else {
        await showAuth();
    }
}

// Iniciar la aplicación
main();

