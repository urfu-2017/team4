'use strict';

const express = require('express');
const passport = require('../utils/passport');

const router = express.Router();
const redirectUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '/';

router.get('/', passport.authenticate('github'));
router.get('/callback', passport.authenticate('github', {
    failureRedirect: redirectUrl,
    successRedirect: redirectUrl
}));

module.exports = router;
