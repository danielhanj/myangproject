self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || '먕먕이';
  const options = {
    body: data.body || '',
    icon: data.icon || '/icon-kakao.png',
    badge: data.icon || '/icon-kakao.png',
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});
