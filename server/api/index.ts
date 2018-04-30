import { RpcHandler } from '../rpc/server';

import hello from './echo';

import getCurrentUser from './session/getCurrentUser';
import addContact from './session/addContact';
import updateCurrentUser from './session/updateCurrentUser';

import getUserInfo from './user/getUserInfo';
import findUsers from './user/findUsers';

import createChat from './chat/createChat';
import getChatInfo from './chat/getChatInfo';
import getChatMessages from './chat/getChatMessages';
import sendMessage from './chat/sendMessage';
import subscribeToChat from './chat/subscribeToChat';

export const getMethods = (): Record<string, RpcHandler> => ({
    hello,

    getCurrentUser,
    addContact,
    updateCurrentUser,

    getUserInfo,
    findUsers,

    createChat,
    getChatInfo,
    getChatMessages,
    sendMessage,
    subscribeToChat
});
