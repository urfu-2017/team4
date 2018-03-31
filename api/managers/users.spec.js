'use strict';

const assert = require('assert');

const User = require('../models/user');
const DialogsManager = require('./dialogs');
const UsersManager = require('./users');

const dialogsManager = DialogsManager;
const usersManager = UsersManager;

const username1 = 'user1';
const username2 = 'user2';
const firstName = 'User';
const dialogId = '123';

describe('UsersManager tests', () => {
    jest.setTimeout(15000);

    beforeEach(async () => {
        await usersManager.removeUser(username1);
        await usersManager.removeUser(username2);
    });

    it('createUser должен создавать нового пользователя и возвращать его', async () => {
        const user = await usersManager.createUser({ username: username1, firstName });

        assert.deepStrictEqual(user, new User({ username: username1, firstName }));
        assert.deepStrictEqual(await usersManager.getUser(username1), user);
    });

    it('saveUser должен перезаписывать информацию пользователя', async () => {
        const user = await usersManager.createUser({ username: username1, firstName });
        user.lastName = 'LastName';
        await usersManager.saveUser(user);

        assert.deepStrictEqual(await usersManager.getUser(username1), user);
    });

    it('addDialog должен создавать новый диалог и добавлять его всем участникам', async () => {
        const dialogName = 'some dialog';

        await dialogsManager.removeDialog(dialogId);

        const user1 = await usersManager.createUser({ username: username1 });
        const user2 = await usersManager.createUser({ username: username2 });

        const dialog = await usersManager.addDialog({
            username: user1.username,
            dialogId,
            dialogName,
            participantsNames: [user2.username]
        });

        assert.deepStrictEqual(await dialogsManager.getDialog(dialog.id), dialog);
        assert.deepStrictEqual(await usersManager.getDialogs(user1.username), [dialog]);
        assert.deepStrictEqual(await usersManager.getDialogs(user2.username), [dialog]);
    });

    it('addContact должен добавлять пользователя в список контактов', async () => {
        const user1 = await usersManager.createUser({ username: username1 });
        const user2 = await usersManager.createUser({ username: username2 });

        await usersManager.addContact(user1.username, user2.username);
        assert.deepStrictEqual(await usersManager.getContacts(user1.username), [user2]);
    });
});
