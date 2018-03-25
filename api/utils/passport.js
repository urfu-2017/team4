'use strict';

const passport = require('passport');
const passportGithub = require('passport-github');

const config = require('../config');

const strategy = new passportGithub.Strategy(
    {
        clientID: config.GITHUB_CLIENT_ID,
        clientSecret: config.GITHUB_CLIENT_SECRET,
        callbackURL: 'http://localhost:8080/auth/callback'
    },

    (accessToken, refreshToken, profile, done) => {
        // В этом месте можно сохранить пользователя в свою базу
        // Или найти уже существующего в базе по данным из `profile`
        //
        // User.findOrCreate(profile.username, (err, profile) => {
        //     Done(err, profile);
        // });

        // Чтобы завершить процесс аутентификации необходимо вызвать `done`
        // И передать туда профиль пользователя – исходный или дополненный из базы
        done(null, profile);
    },
);

passport.use(strategy);

passport.serializeUser((profile, done) => {
    // Мы можем сохранить целиком
    done(null, profile);

    // Или, например, только id из базы:
    // Done(null, profile.id);
});

passport.deserializeUser((profile, done) => {
    // Мы сохранили целиком, поэтому данные уже готовы
    done(null, profile);

    // Если бы мы сохранили только id пользователя,
    // То понадобилось бы в начале сходить в базу:
    //
    // User.findById(id, (err, profile) => {
    //     Done(err, profile);
    // });
});

module.exports = passport;
