'use strict';

const uuid = require('uuid4');
const DB = require('../helpers/dbclient');

const FRAME_SIZE = 60;
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

        this.createdAt = Date.now();
        this.frame = frame.index;

        await DB.post(DB.getKey('messages', this.chatId, 'frame', frame.index), { type: 'add', ...this });

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

        // Если фрейм не указан получаем последний
        frameId = frameId || frame.index;

        // Проверка на существование сообщений
        if (!frame || frame.index < frameId || frameId < 0) {
            return null;
        }

        const events = await DB.getAll(DB.getKey('messages', chatId, 'frame', frameId));
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
            const index = Number(await DB.get(DB.getKey('messages', chatId, 'frames')));
            const count = (await DB.getAll(DB.getKey('messages', chatId, 'frame', index))).length;

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
}

module.exports = Message;
