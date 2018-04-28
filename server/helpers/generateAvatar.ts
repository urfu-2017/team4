'use strict';

import * as retricon from 'retricon-without-canvas';
import * as base64 from 'base64-stream';

const options = {
    pixelSize: 40,
    bgColor: '#F0F0F0',
    pixelPadding: -1,
    imagePadding: 20,
    tiles: 5
};

export const generateAvatar = (sid: string) => new Promise<string>((resolve, reject) => {
    const pngB64 = (retricon as any)(sid, options).pngStream().pipe(base64.encode());
    let result = '';

    pngB64.on('data', (chunk: string) => {
        result += chunk;
    });

    pngB64.on('error', (error: Error) => reject(error));
    pngB64.on('end', () => resolve(result));
});
