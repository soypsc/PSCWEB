// service-worker.js

self.addEventListener('push', function(event) {
  // Intenta analizar los datos del push como JSON.
  const data = event.data.json();
  
  // Opciones para la notificación que se mostrará.
  const options = {
    body: data.body,
    icon: data.icon || 'https://static.wixstatic.com/media/f7f5e1_a5d98b45aa6647c7a63a372f0ca2cd81~mv2.jpg', // Icono por defecto
    badge: data.badge || 'https://static.wixstatic.com/media/f7f5e1_a5d98b45aa6647c7a63a372f0ca2cd81~mv2.jpg' // Badge por defecto
  };

  // Muestra la notificación. El service worker se mantendrá activo hasta que la notificación se cierre.
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});
