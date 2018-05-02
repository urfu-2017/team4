import * as path from 'path';
import * as express from 'express';
import * as compression from 'compression';
import * as expressSession from 'express-session';

import * as config from './config';
import { configurePassport } from './passport';
import { createUser } from './helpers/createUser';

import { sequelize } from './sequelize';
import { configureModels, User } from './models';

import { Server as RpcServer } from './rpc/server';
import { getMethods } from './api';
import { generateAvatar } from './helpers/generateAvatar';

const app = express();
const sessionStore = new expressSession.MemoryStore();
const { passport, router } = configurePassport(createUser);

app.use(compression());
app.use(
    express.static(path.resolve(__dirname, './static'), {
        redirect: false
    })
);

app.use(
    expressSession({
        resave: false,
        saveUninitialized: false,
        secret: config.SECRET_KEY,
        store: sessionStore
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', router);
app.get('/rpccat', (req, res) => {
    res.sendFile(path.resolve(__dirname, './rpccat.html'));
});

(async () => {
    await configureModels(sequelize);
    const users = await Promise.all(
        new Array(12).fill(0).map(async (_, i) => ({
            id: i,
            username: `user${i}`,
            firstName: 'User',
            lastName: i,
            avatar: 'data:image/png;base64,' + (await generateAvatar(`user${i}`))
        }))
    );

    await User.bulkCreate<User>(users as any);

    const server = app.listen(8080, () => {
        const { address, port } = server.address();
        console.info(`Сервер запущен по адресу http://${address}:${port}`);
    });

    new RpcServer(getMethods(), sessionStore as any).listen(server);
})();
