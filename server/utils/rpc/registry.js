'use strict';

const rpc = {};

function register(name, fn, force = false) {
    if (!name || typeof fn !== 'function') {
        throw new Error('Invalid RPC handler');
    }

    if (!force && rpc[name]) {
        throw new Error('RPC handler is exists');
    }

    rpc[name] = fn;
}

function get(name) {
    return rpc[name] || null;
}

module.exports = { register, get };
