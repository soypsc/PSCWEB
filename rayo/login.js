// Importamos la librería de Supabase
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Creamos el cliente de Supabase usando la configuración de tu archivo config.js
const supabase = createClient(window.PSC_CONFIG.supabaseUrl, window.PSC_CONFIG.supabaseAnonKey);

// Seleccionamos los elementos del formulario del archivo login.html
const loginForm = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');
const submitButton = document.getElementById('submit-button');

// Escuchamos cuando el usuario envía el formulario (hace clic en "Ingresar")
loginForm.addEventListener('submit', async (e) => {
    // Prevenimos que la página se recargue
    e.preventDefault();

    // Deshabilitamos el botón para evitar múltiples clics y mostramos un mensaje
    submitButton.disabled = true;
    submitButton.textContent = 'Ingresando...';
    errorMessage.textContent = '';

    // Obtenemos el email y la contraseña que el usuario escribió
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Usamos Supabase para intentar iniciar sesión
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            // Si Supabase devuelve un error, lo mostramos
            throw error;
        }

        // --- CÓDIGO CLAVE PARA RESTRINGIR ACCESO ---
        if (data.session) {
            // 1. Obtener el perfil del usuario recién logueado
            const { data: perfil, error: perfilError } = await supabase
                .from('perfiles')
                .select('rol')
                .eq('id', data.session.user.id)
                .single();

            if (perfilError || !perfil || perfil.rol === 'cliente') {
                // Si el perfil no existe, hay un error, o el rol es 'cliente',
                // bloqueamos el acceso.
                await supabase.auth.signOut(); // Cerramos la sesión por seguridad
                errorMessage.textContent = 'Acceso denegado. Credenciales incorrectas o sin permisos.';
                console.error('Intento de acceso denegado.');
            } else {
                // 2. Si el rol es válido, redirigimos al dashboard
                window.location.href = 'index.html';
            }
        }

    } catch (error) {
        // Si ocurre cualquier error, mostramos un mensaje genérico
        errorMessage.textContent = 'Email o contraseña incorrectos.';
        console.error('Error de inicio de sesión:', error.message);
    } finally {
        // Haya o no error, volvemos a habilitar el botón
        submitButton.disabled = false;
        submitButton.textContent = 'Ingresar';
    }
});
