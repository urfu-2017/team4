'use strict';

const uuid = require('uuid4');
const DB = require('../helpers/dbclient');

const FRAME_SIZE = 30;
const frames = new Map();

class Message {
    /**
     * @param {String} chatId
     * @param {String} from
     * @param {String} text
     */
    constructor({ chatId, from, text }) {
        this.id = uuid();
        this.chatId = chatId;
        this.from = from;
        this.text = text;
        this.createdAt = null;
        this.frame = null;
    }

    /**
     * Сохранить сообщение в базу данных
     * @returns {Promise<Message>}
     */
    async save() {
        let frame = await Message._getLastFrame(this.chatId);

        if (!frame || frame.count > FRAME_SIZE) {
            frame = { index: frame ? Number(frame.index) + 1 : 0, count: 0 };

            frames.set(this.chatId, frame);
            await DB.post(DB.getKey('messages', this.chatId, 'frames'), String(frame.index));
        }

        this.createdAt = new Date().toISOString();
        this.frame = frame.index;

        await DB.post(DB.getKey('messages', this.chatId, 'frame', frame.index), { type: 'add', ...this });
        frame.count++;

        return this;
    }

    /**
     * Получить сообщения для чата
     * @param {String} chatId
     * @param {Number} frameId
     * @returns {Promise<Message[] | null>}
     */
    static async getMessages(chatId, frameId) {
        const frame = await Message._getLastFrame(chatId);

        // Проверка на существование сообщений
        if (!frame || frame.index < frameId || frameId < 0) {
            return [];
        }

        // Если фрейм не указан получаем последний
        frameId = Number.isNaN(frameId) ? frame.index : frameId;
        const cache = frameId === frame.index;

        const events = await DB.getAll(DB.getKey('messages', chatId, 'frame', frameId), {}, cache);
        return events.filter(e => e.type === 'add').map(({ type, ...message }) => message);
    }

    /**
     * Загрузить информацию о последнем фрейме сообщений в чате
     * @param {String} chatId
     * @returns {Promise<{ index: Number, count: Number } | null>}
     * @private
     */
    static async _getLastFrame(chatId) {
        let frame = frames.get(chatId);

        if (!frame) {
            const index = Number(await DB.get(DB.getKey('messages', chatId, 'frames'), false));
            const count = (await DB.getAll(DB.getKey('messages', chatId, 'frame', index), {}, true)).length;

            if (!count) {
                return null;
            }

            // Если кто-то другой успел получить информацию, пока выполнялся этот запрос
            frame = frames.get(chatId);

            if (!frame) {
                frame = { index, count };
                frames.set(chatId, frame);
            }
        }

        return frame;
    }

    static async removeAllMessages(chatId) {
        const chatFrames = await DB.getAll(DB.getKey('messages', chatId, 'frames'));
        await Promise.all(chatFrames.map(id => DB.del(DB.getKey('messages', chatId, 'frame', id))));
        await DB.del(DB.getKey('messages', chatId, 'frames'));

        frames.delete(chatId);
    }
}

module.exports = Message;
