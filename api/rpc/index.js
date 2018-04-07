'use strict';

const RPC = require('../utils/rpc');
const fetchUser = require('./users/fetch-user');
const fetchDialogs = require('./users/fetch-dialogs');

const joinToDialogs = require('./dialogs/join-to-dialogs');
const createDialog = require('./dialogs/create-dialog');
const sendMessage = require('./dialogs/send-message');
const fetchHistory = require('./dialogs/fetch-history');

module.exports = () => {
    RPC.Registry.register('fetchUser', fetchUser);
    RPC.Registry.register('fetchDialogs', fetchDialogs);

    RPC.Registry.register('sendMessage', sendMessage);
    RPC.Registry.register('fetchHistory', fetchHistory);
    RPC.Registry.register('joinToDialogs', joinToDialogs);
    RPC.Registry.register('createDialog', createDialog);
};
