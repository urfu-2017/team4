import { RpcHandler } from '../rpc/server';
import { Methods } from '../../shared/methods';

import hello from './echo';

import getCurrentUser from './session/getCurrentUser';
import addContact from './session/addContact';
import updateCurrentUser from './session/updateCurrentUser';
import logout from './session/logout';

import subscribeToUser from './user/subscribeToUser';
import getUserInfo from './user/getUserInfo';
import findUsers from './user/findUsers';

import createChat from './chat/createChat';
import getChatInfo from './chat/getChatInfo';
import getChatMessages from './chat/getChatMessages';
import sendMessage from './chat/sendMessage';
import subscribeToChat from './chat/subscribeToChat';
import addMember from './chat/addMember';
import removeMember from './chat/removeMember';

import getUrlMeta from './getUrlMeta';
import getWeather from './getWeather';

export const getMethods = (): Record<keyof Methods, RpcHandler> => ({
    hello,

    getCurrentUser,
    addContact,
    updateCurrentUser,
    logout,

    subscribeToUser,
    getUserInfo,
    findUsers,

    createChat,
    getChatInfo,
    getChatMessages,
    sendMessage,
    subscribeToChat,
    addMember,
    removeMember,

    getUrlMeta,
    getWeather
});
