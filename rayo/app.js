// Contenido de app.js
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Inicializamos Supabase una sola vez aquí para que esté disponible globalmente
const supabase = createClient(window.PSC_CONFIG.supabaseUrl, window.PSC_CONFIG.supabaseAnonKey);

document.addEventListener('DOMContentLoaded', () => {
    // 1. Cargar y mostrar el menú
    loadMenu();
});

function loadMenu() {
    fetch('menu.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('menu-container').innerHTML = html;
            
            // 2. Una vez cargado el menú, ejecutamos la lógica que depende de él
            initializeMenuLogic();
        })
        .catch(error => {
            console.error('Error al cargar el menú:', error);
            document.getElementById('menu-container').innerHTML = '<p>Error al cargar el menú.</p>';
        });
}

// En tu archivo app.js

async function initializeMenuLogic() { // Asegúrate de que la función sea async
    // Lógica para el botón del menú móvil
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const sidebar = document.getElementById('sidebar');
    
    if (mobileMenuButton && sidebar) {
        mobileMenuButton.addEventListener('click', () => {
            sidebar.classList.toggle('-translate-x-full');
        });
    }

    // Lógica para marcar el link de la página actual como activo
    const currentPage = window.location.pathname.split('/').pop() || 'index.html'; 
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach(link => {
        const linkPath = link.getAttribute('href').split('/').pop();
        if (linkPath === currentPage) {
            link.classList.add('active');
        }
    });

    // --- NUEVO CÓDIGO PARA OCULTAR ENLACES POR ROL ---
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            const { data: rol } = await supabase.rpc('get_my_rol');
            if (rol && rol !== 'admin') {
                document.querySelectorAll('.admin-link').forEach(link => link.style.display = 'none');
            }
        }
    } catch (error) {
        console.error("Error al verificar el rol del usuario:", error);
    }
    // --- FIN DEL NUEVO CÓDIGO ---

    // --- LÓGICA PARA CERRAR SESIÓN ---
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', async (e) => {
            e.preventDefault(); 
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error('Error al cerrar sesión:', error.message);
                alert('Error al cerrar sesión.');
            } else {
                window.location.href = 'login.html';
            }
        });
    }
}
