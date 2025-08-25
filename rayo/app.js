// Contenido de app.js
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

function initializeMenuLogic() {
    // Lógica para el botón del menú móvil
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const sidebar = document.getElementById('sidebar');
    
    // El botón del menú móvil solo existe en el header que se mantiene en cada página
    if (mobileMenuButton && sidebar) {
        mobileMenuButton.addEventListener('click', () => {
            sidebar.classList.toggle('-translate-x-full');
        });
    }

    // Lógica para marcar el link de la página actual como activo
    const currentPage = window.location.pathname.split('/').pop() || 'index.html'; 
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach(link => {
        if (link.dataset.path === currentPage) {
            link.classList.add('active');
        }
    });
}
