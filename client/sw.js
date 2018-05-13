self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    var chatId = event.notification.data.chatId;
    var url = '/#/chats/' + chatId;

    event.waitUntil(clients.matchAll({ type: 'window' }).then(function(clientList) {
        for (var i = 0; i < clientList.length; i++) {
            var client = clientList[i];

            if (client.url.indexOf(url) === -1 && 'navigate' in client) {
                return client.navigate(url).then(client => {
                    if (!client.focused) {
                        return client.focus();
                    }
                });
            }
        }
    }));
});
