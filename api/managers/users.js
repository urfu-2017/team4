'use strict';

const DB = require('../helpers/dbclient');
const DbCollection = require('../helpers/dbcollection');
const getAvatar = require('../utils/gravatar');

const User = require('../models/user');

class UsersManager {
    constructor(keyPrefix = 'users') {
        this._keyPrefix = keyPrefix;
    }

    async createUser(userInfo) {
        userInfo.avatar = await getAvatar(userInfo.username);
        const user = new User(userInfo);
        await this.saveUser(user);
        await DB.put(DB.getKey('users', user.username, 'dialogs'), []);

        return user;
    }

    async getUser(username) {
        const user = await DB.get(this._getUserKey(username));
        return user ? new User(user) : null;
    }

    saveUser(user) {
        return DB.put(this._getUserKey(user.username), user);
    }

    async removeUser(username) {
        await DB.del(this._getUserKey(username));
        await this._getDialogsCollection(username).clear();
        await this._getContactsCollection(username).clear();
    }

    getDialogsIds(username) {
        return this._getDialogsCollection(username).getAll();
    }

    getContactsNames(username) {
        return this._getContactsCollection(username).getAll();
    }

    getDialogs(username) {
        return DB.get(DB.getKey('users', username, 'dialogs'));
    }

    getContacts(username) {
        return this._getObjectsByIds(
            () => this.getContactsNames(username),
            id => this.getUser(id)
        );
    }

    async addDialog(username, dialogId) {
        let userDialogs = await this.getDialogs(username);

        userDialogs = userDialogs.filter(id => id !== dialogId).concat(dialogId);
        await DB.put(DB.getKey('users', username, 'dialogs'), userDialogs);
    }

    async removeDialog(username, dialogId) {
        let userDialogs = await this.getDialogs(username);

        userDialogs = userDialogs.filter(id => id !== dialogId);
        await DB.put(DB.getKey('users', username, 'dialogs'), userDialogs);
    }

    addContact(username, contactName) {
        return this._getContactsCollection(username).add(contactName);
    }

    removeContact(username, contactName) {
        return this._getContactsCollection(username).removeItem(contactName);
    }

    _getContactsCollection(username) {
        return new DbCollection(`${this._getUserKey(username)}_contactsNames`);
    }

    _getDialogsCollection(username) {
        return new DbCollection(`${this._getUserKey(username)}_dialogsIds`);
    }

    _getUserKey(username) {
        return `${this._keyPrefix}_${username}`;
    }

    _getObjectsByIds(idsGetter, objectGetter) {
        return idsGetter().then(ids => Promise.all(ids.map(objectGetter)));
    }
}

module.exports = new UsersManager();
