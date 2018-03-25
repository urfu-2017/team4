'use strict';

const path = require('path');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const expressSession = require('express-session');

const config = require('./api/config');
const passport = require('./api/utils/passport');
const authMiddleware = require('./api/middlewares/auth');
const authController = require('./api/controllers/auth');

const app = express();

app.use(express.static(path.resolve(__dirname, 'build'), { redirect: false }));
app.use(cors());
app.use(bodyParser.json());

app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: config.SECRET_KEY
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(authMiddleware);

const clientEntry = path.resolve(__dirname, 'build/index.html');

app.get('/', (req, res) => res.sendFile(clientEntry));
app.get('/api/me', (req, res) => res.json(req.session.passport.user));
app.use('/auth', authController);

app.listen(8080, () => {
    console.info('Backend api started at http://localhost:8080');
});
