// Service Worker for Push Notifications
self.addEventListener('push', function (event) {
    console.log('Push event received');

    if (event.data) {
        console.log('Push data:', event.data.text());
        try {
            const data = event.data.json();
            console.log('Parsed notification data:', data);

            const options = {
                body: data.body,
                icon: data.icon,
                badge: data.badge,
                tag: data.tag,
                data: data.data,
                actions: data.actions,
                requireInteraction: true
            };

            event.waitUntil(
                self.registration.showNotification(data.title, options)
                    .then(() => console.log('Notification shown successfully'))
                    .catch(error => console.error('Error showing notification:', error))
            );
        } catch (error) {
            console.error('Error processing push data:', error);
        }
    } else {
        console.log('Push event has no data');
    }
});

self.addEventListener('notificationclick', function (event) {
    console.log('Notification clicked:', event.action);
    event.notification.close();

    if (event.action === 'view') {
        event.waitUntil(
            clients.openWindow(event.notification.data.url)
        );
    }
});

// Skip waiting and claim clients to ensure the service worker activates immediately
self.addEventListener('install', event => {
    console.log('Service Worker installing');
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    console.log('Service Worker activating');
    event.waitUntil(clients.claim());
}); 