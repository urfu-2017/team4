import * as path from 'path';
import * as express from 'express';
import * as compression from 'compression';
import * as expressSession from 'express-session';

import * as config from './config';
import { configurePassport } from './passport';

import { Server as RpcServer } from './rpc/server';
import { getMethods } from './api';

const app = express();
app.use(compression());
app.use(
    express.static(path.resolve(__dirname, '..', 'prod_build'), {
        redirect: false
    })
);

const passport = configurePassport();
const sessionStore = new expressSession.MemoryStore();

app.use(passport.initialize());
app.use(passport.session());

app.use(
    expressSession({
        resave: false,
        saveUninitialized: false,
        secret: config.SECRET_KEY,
        store: sessionStore
    })
);

const router = express.Router();

router.get('/', passport.authenticate('github'));
router.get(
    '/callback',
    passport.authenticate('github', {
        failureRedirect: config.AUTH_REDIRECT_URL,
        successRedirect: config.AUTH_REDIRECT_URL
    })
);

app.use('/auth', router);
app.get('/rpccat', (req, res) => {
    res.sendFile(path.resolve(__dirname, './rpccat.html'));
});

const server = app.listen(8080, () => {
    const { address, port } = server.address();
    console.info(`Сервер запущен по адресу http://${address}:${port}`);
});

new RpcServer(getMethods(), sessionStore as any).listen(server);
