const uuid = require('uuid/v4');

const DbCollection = require('../helpers/dbcollection');

const Dialog = require('../models/dialog');
const Message = require('../models/message');

class DialogsManager {
    constructor(keyPrefix = 'dialogs') {
        this._keyPrefix = keyPrefix;
        this._dialogs = new DbCollection(keyPrefix);
    }

    async createDialog({ id = uuid(), name, participantsNames }) {
        const dialog = new Dialog({ id, name });
        await this._dialogs.add(dialog);
        await this._getParticipantsCollection(id).addRange(participantsNames);
        return dialog;
    }

    getDialog(id) {
        return this._dialogs
            .getAll()
            .then(dialogs => dialogs.find(dialog => dialog.id === id))
            .then(dialog => new Dialog(dialog));
    }

    async removeDialog(id) {
        await this._dialogs.replaceAll(dialogs => dialogs.filter(dialog => dialog.id !== id));
        await this._getParticipantsCollection(id).clear();
        await this._getMessagesCollection(id).clear();
    }

    getParticipantsNames(dialogId){
        return this._getParticipantsCollection(dialogId).getAll();
    }

    getLastMessage(dialogId) {
        return this._getMessagesCollection(dialogId).getLast().then(msg => new Message(msg));
    }

    getLastMessages(dialogId, count, offset) {
        // TODO: ускорить
        return this._getMessagesCollection(dialogId)
            .getAll()
            .then(messages => messages.slice(-(count + offset), -offset))
            .then(messages => messages.map(msg => new Message(msg)));
    }

    async addMessage({ dialogId, messageId = uuid(), senderName, text, attachments }) {
        const message = new Message({ id:messageId, senderName, text, attachments });
        await this._getMessagesCollection(dialogId).add(message);
        return message;
    }

    _getParticipantsCollection(id){
        return new DbCollection(`${this._keyPrefix}_${id}_participantsNames`);
    }

    _getMessagesCollection(id) {
        return new DbCollection(`${this._keyPrefix}_${id}_messages`);
    }
}

module.exports = DialogsManager;
