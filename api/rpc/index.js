'use strict';

const RPC = require('../utils/rpc');
const fetchUser = require('./users/fetch-user');
const saveUser = require('./users/save-user');
const fetchDialogs = require('./users/fetch-dialogs');
const fetchContacts = require('./users/fetch-contacts');
const addContact = require('./users/add-contact');
const logout = require('./users/logout');

const joinToDialog = require('./dialogs/join-to-dialog');
const createDialog = require('./dialogs/create-dialog');
const fetchDialog = require('./dialogs/fetch-dialog');
const sendMessage = require('./dialogs/send-message');
const fetchHistory = require('./dialogs/fetch-history');
const removeDialog = require('./dialogs/remove-dialog');
const addMember = require('./dialogs/add-member');
const removeMember = require('./dialogs/remove-member');

const fetchOGData = require('./fetch-og-data');
const fetchWeather = require('./fetchWeather');

module.exports = () => {
    RPC.Registry.register('fetchUser', fetchUser);
    RPC.Registry.register('saveUser', saveUser);
    RPC.Registry.register('fetchDialogs', fetchDialogs);
    RPC.Registry.register('fetchContacts', fetchContacts);
    RPC.Registry.register('addContact', addContact);
    RPC.Registry.register('logout', logout);

    RPC.Registry.register('sendMessage', sendMessage);
    RPC.Registry.register('fetchHistory', fetchHistory);
    RPC.Registry.register('joinToDialog', joinToDialog);
    RPC.Registry.register('createDialog', createDialog);
    RPC.Registry.register('fetchDialog', fetchDialog);
    RPC.Registry.register('removeDialog', removeDialog);
    RPC.Registry.register('addMember', addMember);
    RPC.Registry.register('removeMember', removeMember);

    RPC.Registry.register('fetchOGData', fetchOGData);
    RPC.Registry.register('fetchWeather', fetchWeather);
};
