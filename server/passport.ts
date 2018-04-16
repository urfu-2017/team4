import * as passport from 'passport';
import { Profile, Strategy } from 'passport-github';

import * as config from './config';

export function configurePassport() {
    const strategy = new Strategy(
        {
            clientID: config.GITHUB_CLIENT_ID,
            clientSecret: config.GITHUB_CLIENT_SECRET,
            callbackURL: config.GITHUB_AUTH_CALLBACK
        },
        (accessToken, refreshToken, profile, done) => {
            const username = profile.username!.toLowerCase();
            done(null, { username });
        }
    );

    passport.use(strategy);

    passport.serializeUser((profile: Profile, done) => {
        done(null, profile.username);
    });

    passport.deserializeUser((profile: Profile, done) => {
        done(null, profile);
    });

    return passport;
}
