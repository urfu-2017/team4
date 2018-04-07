'use strict';

const uuid = require('uuid/v4');

const DB = require('../helpers/dbclient');

class DialogsManager {
    constructor() {
        this._frames = new Map();
        this._frameSize = 50;
    }

    async createDialog({ id = uuid(), name, members, type, owner }) {
        const dialog = { id, name, members, type, owner };
        await DB.put(DB.getKey('dialogs', id), dialog);

        return dialog;
    }

    getDialog(id) {
        return DB.get(DB.getKey('dialog', id));
    }

    async getMessages(chatId, frameId) {
        const frame = await this._getLastFrame(chatId);

        // Если не фрейм не указан получаем последний
        frameId = frameId || frame.index;

        // Проверка на существование сообщений
        if (!frame || frame.index < frameId) {
            return [];
        }

        const events = await DB.getAll(DB.getKey('dialogs', chatId, 'frame', frameId));
        return events.filter(e => e.type === 'add').map(({ type, ...message }) => message);
    }

    async addMessage(chatId, { from, text }) {
        let frame = await this._getLastFrame(chatId);

        if (!frame || frame.count > this._frameSize) {
            frame = { index: frame ? Number(frame.index) + 1 : 0, count: 0 };

            this._frames.set(chatId, frame);
            await DB.post(DB.getKey('dialogs', chatId, 'frames'), String(frame.index));
        }

        const date = new Date().toISOString();
        const message = { id: uuid(), chatId, from, text, frame: frame.index, date };
        await DB.post(DB.getKey('dialogs', chatId, 'frame', frame.index), { type: 'add', ...message });

        return message;
    }

    async _getLastFrame(chatId) {
        let frame = this._frames.get(chatId);

        if (!frame) {
            const index = await DB.get(DB.getKey('dialogs', chatId, 'frames'));
            const count = (await DB.getAll(DB.getKey('dialogs', chatId, 'frame', index))).length;

            if (!count) {
                return null;
            }

            frame = this._frames.get(chatId);

            if (!frame) {
                frame = { index, count };
                this._frames.set(chatId, frame);
            }
        }

        return frame;
    }
}

module.exports = new DialogsManager();
