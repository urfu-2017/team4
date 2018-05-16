import RPC from './rpc-client';
declare var firebase: any;

firebase.initializeApp({
    messagingSenderId: '488280294774'
});

const messaging = firebase.messaging();

export default async function() {
    try {
        await messaging.requestPermission();
        const token = await messaging.getToken();

        if (!token) {
            return;
        }

        await RPC.request('setToken', { token });
    } catch (e) {
        console.error(e);
        console.info('Не удалось получить токен');
    }
}
