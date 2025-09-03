// Contenido para service-worker.js

self.addEventListener('push', function(event) {
  const data = event.data.json();
  const options = {
    body: data.body,
    // Puedes cambiar este ícono por el de tu logo si quieres
    icon: data.icon || 'https://static.wixstatic.com/media/f7f5e1_bd90ae68234f4ee9975e3140c4bb47ef~mv2.png',
    badge: data.badge || 'https://static.wixstatic.com/media/f7f5e1_bd90ae68234f4ee9975e3140c4bb47ef~mv2.png'
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});
