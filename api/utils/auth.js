'use strict';

const express = require('express');
const passport = require('passport');
const passportGithub = require('passport-github');
const expressSession = require('express-session');

const config = require('../config');

const strategy = new passportGithub.Strategy(
    {
        clientID: config.GITHUB_CLIENT_ID,
        clientSecret: config.GITHUB_CLIENT_SECRET,
        callbackURL: 'http://localhost:8080/auth/callback'
    },
    (accessToken, refreshToken, profile, done) => {
        // TODO: Save user to DB
        done(null, profile);
    },
);

passport.serializeUser((profile, done) => {
    // TODO: Save user id
    done(null, profile);
});

passport.deserializeUser((profile, done) => {
    // TODO: Get user from DB by id
    done(null, profile);
});

const router = express.Router();
const redirectUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '/';

router.get('/', passport.authenticate('github'));
router.get('/callback', passport.authenticate('github', {
    failureRedirect: redirectUrl,
    successRedirect: redirectUrl
}));

module.exports = (app, sessionStore) => {
    passport.use(strategy);

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(expressSession({
        resave: false,
        saveUninitialized: false,
        secret: config.SECRET_KEY,
        store: sessionStore
    }));

    app.use('/auth', router);
};
