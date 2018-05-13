self.addEventListener('notificationclick', function(event) {
    event.notification.close();
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
    }));
});
