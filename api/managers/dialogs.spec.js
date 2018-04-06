'use strict';

const assert = require('assert');

const Dialog = require('../models/dialog');
const Message = require('../models/message');
const DialogsManager = require('./dialogs');

const dialogId = '123';
const messageId = '987';

describe('DialogsDialogsManager tests', () => {
    jest.setTimeout(10000);

    beforeEach(async () => {
        await DialogsManager.removeDialog(dialogId);
    });

    it('createDialog должен сохранять новый диалог и возвращать его', async () => {
        const name = 'some dialog';
        const participantsNames = ['user1', 'user2'];
        const dialog = await DialogsManager.createDialog({ id: dialogId, name, participantsNames });

        assert.deepStrictEqual(dialog, new Dialog({ id: dialogId, name }));
        assert.deepStrictEqual(await DialogsManager.getDialog(dialogId), dialog);
        assert.deepStrictEqual(
            await DialogsManager.getParticipantsNames(dialogId),
            participantsNames
        );
    });

    it('addMessage должен сохранять новое сообщение и возвращать его', async () => {
        const messageData = { dialogId, messageId, text: 'some text', senderName: 'user1' };
        const message = await DialogsManager.addMessage(messageData);

        const expectedMessage = new Message(messageData);
        expectedMessage.id = messageId;
        assert.deepStrictEqual(message, expectedMessage);
        assert.deepStrictEqual((await DialogsManager.getLastMessage(dialogId)), message);
    });

    it('getLastMessages должен возвращать указанное число последних сообщений', async () => {
        const messages = ['message1', 'message2', 'message3', 'message4'];

        for (let i = 0; i < messages.length; i++) {
            await DialogsManager.addMessage({
                dialogId,
                messageId: i,
                text: messages[i],
                senderName: 'user1'
            });
        }

        assert.deepStrictEqual(
            (await DialogsManager.getLastMessages(dialogId, 2, 1)).map(msg => msg.text),
            messages.slice(1, 3)
        );
    });
});
