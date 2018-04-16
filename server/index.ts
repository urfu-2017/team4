import * as path from 'path';
import * as express from 'express';
import * as compression from 'compression';

import { Server as RpcServer } from './rpc/server';
import { getMethods } from './api';

const app = express();
app.use(compression());
app.use(
    express.static(path.resolve(__dirname, '..', 'prod_build'), {
        redirect: false
    })
);

app.get('/rpccat', (req, res) => {
    res.sendFile(path.resolve(__dirname, './rpccat.html'));
});

const server = app.listen(8080, () => {
    const { address, port } = server.address();
    console.info(`Сервер запущен по адресу http://${address}:${port}`);
});

new RpcServer(getMethods()).listen(server);
