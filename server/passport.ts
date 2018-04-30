import * as express from 'express';
import { Passport } from 'passport';
import { Profile, Strategy } from 'passport-github';

import * as config from './config';

export type UserCreation = (profile: Profile) => Promise<void>;

export function configurePassport(userCreation: UserCreation) {
    const passport = new Passport();

    const strategy = new Strategy(
        {
            clientID: config.GITHUB_CLIENT_ID,
            clientSecret: config.GITHUB_CLIENT_SECRET,
            callbackURL: config.GITHUB_AUTH_CALLBACK
        },
        async (accessToken, refreshToken, profile, done) => {
            await userCreation(profile);
            done(null, profile);
        }
    );

    passport.use(strategy);

    passport.serializeUser((profile: Profile, done) => {
        done(null, Number(profile.id));
    });

    passport.deserializeUser((id: number, done) => {
        done(null, id);
    });

    const router = express.Router();

    router.get('/', passport.authenticate('github'));
    router.get(
        '/callback',
        passport.authenticate('github', {
            failureRedirect: config.AUTH_REDIRECT_URL,
            successRedirect: config.AUTH_REDIRECT_URL
        })
    );

    return { passport, router };
}
