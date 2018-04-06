'use strict';

const assert = require('assert');

const DbClient = require('./dbclient');

const testKey = `test_${getRandomStr(10)}`;
const testValues = ['test1', 'test2', 'test3'];

function getRandomStr(len) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < len; i += 1) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

describe('dbclient tests', () => {
    beforeAll(async () => {
        await DbClient.del(testKey);
    });

    afterAll(async () => {
        await DbClient.del(testKey);
    });

    it('get должен возвращать null, если запись по данному ключу отсутствует', async () => {
        assert.strictEqual(await DbClient.get(testKey), null);
    });

    it('put должен создавать запись с одним значением', async () => {
        await DbClient.put(testKey, testValues[0]);
        assert.deepStrictEqual(await DbClient.getAll(testKey), [testValues[0]]);
        await DbClient.del(testKey);
    });

    it('post должен добавлять новые значения', async () => {
        for (let i = 0; i < 3; i++) {
            await DbClient.post(testKey, testValues[i]);
        }

        assert.deepStrictEqual(await DbClient.getAll(testKey), testValues);
    });

    it('getAll должен учитывать параметры, когда они есть', async () => {
        for (let i = 0; i < 3; i++) {
            await DbClient.post(testKey, testValues[i]);
        }
        assert.deepStrictEqual(
            await DbClient.getAll(testKey, { offset: 1, limit: 1 }),
            [testValues[1]],
        );
    });

    it('del должен удалять все значения', async () => {
        await DbClient.del(testKey);
        assert.deepStrictEqual(await DbClient.getAll(testKey), []);
    });
});
