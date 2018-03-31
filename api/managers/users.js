'use strict';

const uuid = require('uuid/v4');

const DbClient = require('../helpers/dbclient');
const DbCollection = require('../helpers/dbcollection');
const DialogsManager = require('./dialogs');

const User = require('../models/user');

class UsersManager {
    constructor(keyPrefix = 'users') {
        this._dialogsManager = DialogsManager;
        this._keyPrefix = keyPrefix;
        this._dbclient = DbClient;
    }

    async createUser(userInfo) {
        const user = new User(userInfo);
        await this.saveUser(user);
        return user;
    }

    async getUser(username) {
        const user = await this._dbclient.get(this._getUserKey(username));
        return user ? new User(user) : null;
    }

    saveUser(user) {
        return this._dbclient.put(this._getUserKey(user.username), user);
    }

    async removeUser(username) {
        await this._dbclient.del(this._getUserKey(username));
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
        return this._getObjectsByIds(
            () => this.getDialogsIds(username),
            id => this._dialogsManager.getDialog(id)
        );
    }

    getContacts(username) {
        return this._getObjectsByIds(
            () => this.getContactsNames(username),
            id => this.getUser(id)
        );
    }

    async addDialog({ username, dialogId = uuid(), dialogName, participantsNames }) {
        const dialog = await this._dialogsManager.createDialog({
            id: dialogId,
            name: dialogName,
            participantsNames
        });

        // eslint-disable-next-line
        for (const participantName of [username, ...participantsNames]) {
            await this._getDialogsCollection(participantName).add(dialogId);
        }

        return dialog;
    }

    removeDialog(username, dialogId) {
        return this._getDialogsCollection(username).removeItem(dialogId);
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
