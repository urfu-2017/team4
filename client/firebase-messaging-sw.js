importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

firebase.initializeApp({
    'messagingSenderId': '488280294774'
});

var messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function(payload) { return showNotification(payload.data); });

function showNotification(data) {
    var sender = JSON.parse(data.sender);
    var message = JSON.parse(data.message);
    var title = 'Новое сообщение ' + (data.type === 'dialog' ? 'от ' + sender.name : 'в ' + data.name);
    var prefix = data.type === 'dialog' ? '' : sender.name + ': ';
    var text = prefix + (message.forwarded ? 'Пересланное сообщение' :
        (message.attachment ? 'Фотография. ' : '') + message.text);

    return self.registration.showNotification(title, {
        icon: sender.avatar,
        body: text,
        tag: data.id,
        data: { chatId: data.id },
        vibrate: [600, 200, 600]
    });
}

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    if (!event.notification.data) return;

    var chatId = event.notification.data.chatId;
    var url = '/#/chats/' + chatId;

    event.waitUntil(clients.matchAll({ type: 'window' }).then(function(clientList) {
        for (var i = 0; i < clientList.length; i++) {
            var client = clientList[i];
            var shouldFocus = client.url.indexOf(url) === -1 || !client.focused;

            if (shouldFocus && 'navigate' in client) {
                return client.focus().then(client => client.navigate(url));
            }
        }

        return clients.openWindow(url);
    }));
});
