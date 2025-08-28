// --- UBICADO EN js/pages/modules/direcciones.js ---

/**
 * Muestra la información del casillero del usuario en la página.
 */
function displayDireccion(userProfile) {
    if (!userProfile) {
        console.log("No se encontró el perfil de usuario para mostrar la dirección.");
        return;
    }

    // Poblar los campos con la información del perfil del usuario
    document.getElementById('dir-nombre').textContent = userProfile.nombre || 'No disponible';
    document.getElementById('dir-box').textContent = userProfile.box || 'No asignado';
    
    // La línea 2 de la dirección incluye el número de casillero
    document.getElementById('dir-linea2').textContent = `STE PSC-PANAMA ${userProfile.box || ''}`;
}


/**
 * Función de inicialización del módulo.
 */
export function init(supabase, profile, goHome) {
    // Configura el botón para volver a la pantalla de inicio
    document.getElementById('back-to-home-btn').addEventListener('click', (e) => {
        e.preventDefault();
        goHome();
    });

    // Muestra la información del casillero inmediatamente
    displayDireccion(profile);
}
