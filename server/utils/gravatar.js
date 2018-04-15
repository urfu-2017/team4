'use strict';

const retricon = require('retricon-without-canvas');
const base64 = require('base64-stream');

const options = {
    pixelSize: 40,
    bgColor: '#F0F0F0',
    pixelPadding: -1,
    imagePadding: 20,
    tiles: 5
};

function getGravatar(login) {
    return new Promise((res, rej) => {
        const pngB64 = retricon(login, options)
            .pngStream()
            .pipe(base64.encode());
        let result = '';
        pngB64.on('data', chunk => {
            result += chunk;
        });
        pngB64.on('error', error => rej(error));
        pngB64.on('end', () => {
            res(result);
        });
    });
}

module.exports = getGravatar;
