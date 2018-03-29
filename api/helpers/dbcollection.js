const config = require('../config');

const { DbClient } = new require('../helpers/dbclient');

const REPLACE_RETRIES = 10;

class DbCollection {
    constructor(key){
        this._key = key;
        this._client = new DbClient(config.HRUDB_TOKEN);
    }

    add(item){
        return this._client.post(this._key, item);
    }

    async addRange(items, retries){
        for (const item of items) {
            await this._client.post(this._key, item, retries);
        }
    }

    getAll(options){
        return this._client.getAll(this._key, options);
    }

    replace(index, item) {
        return this.replaceAll(items => {
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
