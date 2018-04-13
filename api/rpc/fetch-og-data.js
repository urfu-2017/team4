'use strict';

const ogs = require('open-graph-scraper');

const RPC = require('../utils/rpc/index');
const OGData = require('../models/og-data');
const ogHelper = require('../helpers/og-helper');

module.exports = async (params, response) => {
    let ogData;

    try {
        ogData = await ogs(params);
    } catch (e) {
        throw new RPC.Error(e.message);
    }

    const { ogImage, ogDescription: description, ogTitle: title } = ogData.data;
    const url = ogData.requestUrl;

    const imageUrl = ogHelper.resolveImageUrl(ogImage);
    let image;

    if (!imageUrl) {
        image = undefined;
    } else {
        image = ogHelper.makeAbsoluteImageUrl(imageUrl, url);
    }

    response.success(new OGData(title, image, description, url));
};
