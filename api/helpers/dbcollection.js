'use strict';

const DbClient = require('../helpers/dbclient');

const REPLACE_RETRIES = 10;

class DbCollection {
    constructor(key) {
        this._key = key;
        this._client = DbClient;
    }

    add(item, retries) {
        return this._client.post(this._key, item, retries);
    }

    async addRange(items, retries) {
        // eslint-disable-next-line no-restricted-syntax
        for (const item of items) {
            await this.add(item, retries);
        }
    }

    getLast() {
        return this._client.get(this._key);
    }

    getAll(options) {
        return this._client.getAll(this._key, options);
    }

    replace(index, item) {
        return this.replaceAll((items) => {
            if (index >= items.length) {
                throw new Error(`Trying to replace db record ${this._key}[${index}]. Index too large.`);
            }
            items[index] = item;

            return items;
        });
    }

    removeItem(itemToRemove) {
        return this.replaceAll(items => items.filter(item => item !== itemToRemove));
    }

    async replaceAll(replaceFn) {
        const items = await this.getAll();
        const replacedItems = replaceFn(items);
        await this._client.del(this._key);
        await this.addRange(replacedItems, REPLACE_RETRIES);
    }

    clear() {
        return this._client.del(this._key);
    }
}

module.exports = DbCollection;
