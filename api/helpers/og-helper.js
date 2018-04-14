'use strict';

const urlRegExp = /^(https?:\/\/|\/\/)?([\w.-]+)\.([a-z]{2,6}\.?)(\/[\w.?\-=%]*)*\/?$/;
const trimRegExp = /^\/+|\/+$/g;

module.exports = {
    resolveImageUrl(ogImage) {
        if (!ogImage) {
            return undefined;
        }

        if (ogImage instanceof Array) {
            return ogImage.length ? ogImage[0].url : undefined;
        }

        return ogImage.url;
    },
    makeAbsoluteImageUrl(imageUrl, baseUrl) {
        if (!imageUrl || !baseUrl) {
            throw new Error('Some parameter is not specified in ogHelper.makeAbsoluteImageUrl');
        }

        if (urlRegExp.test(imageUrl)) {
            return imageUrl;
        }

        const trimmedImage = imageUrl.replace(trimRegExp, '');
        const trimmedUrl = baseUrl.replace(trimRegExp, '');

        return `${trimmedUrl}/${trimmedImage}`;
    }
};
