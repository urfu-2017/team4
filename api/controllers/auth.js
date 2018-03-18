'use strict';
const express = require('express');
const passport = require('../utils/passport');

const router = express.Router();

router.get('/', passport.authenticate('github'));
router.get('/callback',
    passport.authenticate('github', { failureRedirect: '/', successRedirect: '/' }));

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;
