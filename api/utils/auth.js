'use strict';

const express = require('express');
const passport = require('passport');
const passportGithub = require('passport-github');
const expressSession = require('express-session');

const config = require('../config');
const UserManager = require('../managers/users');

const strategy = new passportGithub.Strategy(
    {
        clientID: config.GITHUB_CLIENT_ID,
        clientSecret: config.GITHUB_CLIENT_SECRET,
        callbackURL: config.GITHUB_AUTH_CALLBACK
    },
    async (accessToken, refreshToken, profile, done) => {
        const username = profile.username.toLowerCase();
        let firstName = '';
        let lastName = '';
        let bio = '';
        const { profileUrl } = profile;
        if (profile.displayName) {
            [firstName, lastName] = profile.displayName.split(/\s+/);
        }
        if (profile._json.bio) {
            bio = profile._json.bio; // eslint-disable-line
        }

        let user = await UserManager.getUser(username);

        if (!user) {
            user = await UserManager.createUser({ username, firstName, lastName, profileUrl, bio });
        }

        done(null, user);
    },
);

passport.serializeUser((profile, done) => {
    done(null, profile.username);
});

passport.deserializeUser((profile, done) => {
    done(null, profile);
});

const router = express.Router();

router.get('/', passport.authenticate('github'));
router.get('/callback', passport.authenticate('github', {
    failureRedirect: config.AUTH_REDIRECT_URL,
    successRedirect: config.AUTH_REDIRECT_URL
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
