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

// En tu archivo app.js

async function initializeMenuLogic() {
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

    // --- NUEVA LÓGICA DE VISIBILIDAD POR ROLES ---
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            const { data: rol } = await supabase.rpc('get_my_rol');

            if (rol === 'empleado') {
                // Si es empleado, oculta los de admin y los de cde
                document.querySelectorAll('.admin-section, .cde-link').forEach(el => el.style.display = 'none');
            } else if (rol === 'cde') {
                // Si es cde, oculta los de admin y los de empleado
                document.querySelectorAll('.admin-section, .employee-link').forEach(el => el.style.display = 'none');
            }
            // Si es 'admin', no se oculta nada, por lo que ve todo.
        }
    } catch (error) {
        console.error("Error al verificar el rol para el menú:", error);
    }
    // --- FIN DE LA NUEVA LÓGICA ---

    // Lógica para cerrar sesión
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
