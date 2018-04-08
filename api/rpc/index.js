'use strict';

const RPC = require('../utils/rpc');
const fetchUser = require('./users/fetch-user');
const saveUser = require('./users/save-user');
const fetchDialogs = require('./users/fetch-dialogs');
const fetchContacts = require('./users/fetch-contacts');
const addContact = require('./users/add-contact');

const joinToDialogs = require('./dialogs/join-to-dialogs');
const createDialog = require('./dialogs/create-dialog');
const fetchDialog = require('./dialogs/fetch-dialog');
const sendMessage = require('./dialogs/send-message');
const fetchHistory = require('./dialogs/fetch-history');

module.exports = () => {
    RPC.Registry.register('fetchUser', fetchUser);
    RPC.Registry.register('saveUser', saveUser);
    RPC.Registry.register('fetchDialogs', fetchDialogs);
    RPC.Registry.register('fetchContacts', fetchContacts);
    RPC.Registry.register('addContact', addContact);

    RPC.Registry.register('sendMessage', sendMessage);
    RPC.Registry.register('fetchHistory', fetchHistory);
    RPC.Registry.register('joinToDialogs', joinToDialogs);
    RPC.Registry.register('createDialog', createDialog);
    RPC.Registry.register('fetchDialog', fetchDialog);
};
