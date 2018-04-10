'use strict';

const uuid = require('uuid4');
const DB = require('../helpers/dbclient');

class Chat {
    /**
     * @param {String} id
     * @param {String} name
     * @param {String[]} members
     * @param {String} owner
     * @param {'dialog' | 'room' } type
     */
    constructor({ id = uuid(), name = 'New chat', members, owner, type }) {
        this.id = id;
        this.name = name;
        this.members = members;
        this.owner = owner;
        this.type = type;
    }

    /**
     * Добавить участника у чату
     * @param {String} member
     */
    addMember(member) {
        if (this.type === 'dialog') {
            throw new Error('Can not add member to dialog');
        }

        this.members = this.members.filter(id => id !== member).concat(member);
    }

    /**
     * Удалить участника из чата
     * @param {String} member
     */
    removeMember(member) {
        if (this.type === 'dialog') {
            throw new Error('Can not remove member to dialog');
        }

        this.members = this.members.filter(id => id !== member);
    }

    static async remove(chatId) {
        await DB.del(DB.getKey('chats', chatId));
    }

    /**
     * Сохранить чат в базу данных
     * @returns {Promise<void>}
     */
    async save() {
        await DB.put(DB.getKey('chats', this.id), this);
    }

    /**
     * Создать диалог между двумя пользователя
     * @param {String} person1
     * @param {String} person2
     * @returns {Chat}
     */
    static createDialog(person1, person2) {
        const members = [person1, person2].sort((a, b) => a.localeCompare(b));
        const id = members.join('_');
        const name = `Chat between ${person1} and ${person2}`;

        return new Chat({ id, name, members, owner: null, type: 'dialog' });
    }

    /**
     * Создать чат-комнату для группы пользователей
     * @param {String} name
     * @param {String} owner
     * @param {String[]} members
     * @returns {Chat}
     */
    static createRoom(name, owner, members) {
        members = members.filter(id => id !== owner).concat(owner);

        return new Chat({ name, owner, members, type: 'room' });
    }

    /**
     * Поиск чата по id
     * @param {String} id
     * @returns {Promise<Chat | null>}
     */
    static find(id) {
        return DB.get(DB.getKey('chats', id));
    }
}

module.exports = Chat;
