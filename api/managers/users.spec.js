'use strict';

const assert = require('assert');

const User = require('../models/user');
const DialogsManager = require('./dialogs');
const UsersManager = require('./users');

const username1 = 'user1';
const username2 = 'user2';
const firstName = 'User';
const dialogId = '123';

describe('UsersManager tests', () => {
    jest.setTimeout(15000);

    beforeEach(async () => {
        await UsersManager.removeUser(username1);
        await UsersManager.removeUser(username2);
    });

    it('createUser должен создавать нового пользователя и возвращать его', async () => {
        const user = await UsersManager.createUser({ username: username1, firstName });

        assert.deepStrictEqual(user, new User({ username: username1, firstName }));
        assert.deepStrictEqual(await UsersManager.getUser(username1), user);
    });

    it('saveUser должен перезаписывать информацию пользователя', async () => {
        const user = await UsersManager.createUser({ username: username1, firstName });
        user.lastName = 'LastName';
        await UsersManager.saveUser(user);

        assert.deepStrictEqual(await UsersManager.getUser(username1), user);
    });

    it('addDialog должен создавать новый диалог и добавлять его всем участникам', async () => {
        const dialogName = 'some dialog';

        await DialogsManager.removeDialog(dialogId);

        const user1 = await UsersManager.createUser({ username: username1 });
        const user2 = await UsersManager.createUser({ username: username2 });

        const dialog = await UsersManager.addDialog({
            username: user1.username,
            dialogId,
            dialogName,
            participantsNames: [user2.username]
        });

        assert.deepStrictEqual(await DialogsManager.getDialog(dialog.id), dialog);
        assert.deepStrictEqual(await UsersManager.getDialogs(user1.username), [dialog]);
        assert.deepStrictEqual(await UsersManager.getDialogs(user2.username), [dialog]);
    });

    it('addContact должен добавлять пользователя в список контактов', async () => {
        const user1 = await UsersManager.createUser({ username: username1 });
        const user2 = await UsersManager.createUser({ username: username2 });

        await UsersManager.addContact(user1.username, user2.username);
        assert.deepStrictEqual(await UsersManager.getContacts(user1.username), [user2]);
    });
});
