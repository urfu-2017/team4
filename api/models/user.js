'use strict';

const DB = require('../helpers/dbclient');

class User {
    /**
     * @param {String} username
     * @param {String} firstName
     * @param {String} lastName
     * @param {String} avatar
     * @param contactsNames
     * @param chatsIds
     */
    constructor({ username, firstName, lastName, avatar, contactsNames = [], chatsIds = [] }) {
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.avatar = avatar;
        this.contactsNames = contactsNames;
        this.chatsIds = chatsIds;
    }

    async addContact(username) {
        if (username === this.username) {
            return;
        }
        this._addUnique(this.contactsNames, username);
        await this.save();
    }

    async removeContact(username) {
        this.contactsNames = this._remove(this.contactsNames, username);
        await this.save();
    }

    /**
     * Получить массив профилей контактов
     * @returns {Promise<User[]>}
     */
    getContacts() {
        return Promise.all(this.contactsNames.map(User.get));
    }

    /**
     * Добавить пользователя в чат
     * @param chatId
     * @returns {Promise<void>}
     */
    async addToChat(chatId) {
        this._addUnique(this.chatsIds, chatId);
        await this.save();
    }

    async removeFromChat(chatId) {
        this.chatsIds = this._remove(this.chatsIds, chatId);
        await this.save();
    }

    /**
     * Сохранить пользователя в базу данных
     * @returns {Promise<void>}
     */
    async save() {
        await DB.put(DB.getKey('users', this.username), this);
    }

    /**
     * Получение пользователя по username
     * @param {String} username
     * @returns {Promise<User | null>}
     */
    static async get(username) {
        const user = await DB.get(DB.getKey('users', username));
        return user ? new User(user) : null;
    }

    _addUnique(array, item) {
        if (!array.includes(item)) {
            array.push(item);
        }
    }

    _remove(array, itemToRemove) {
        return array.filter(item => item !== itemToRemove);
    }
}

module.exports = User;
