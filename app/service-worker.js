// service-worker.js

self.addEventListener('push', function(event) {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: data.icon || 'https://static.wixstatic.com/media/f7f5e1_a5d98b45aa6647c7a63a372f0ca2cd81~mv2.jpg',
    badge: data.badge || 'https://static.wixstatic.com/media/f7f5e1_a5d98b45aa6647c7a63a372f0ca2cd81~mv2.jpg'
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});
