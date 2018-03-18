/* eslint-env mocha */
'use strict';

const assert = require('assert');
const { DbClient } = require('./dbclient');

const client = new DbClient('1b702299628663048463f13db00fcdf82e818372');

const testKey = 'test';
const testValues = ['test1', 'test2', 'test3'];

describe('dbclient tests', () => {
    before(async function () {
        await client.del(testKey);
    });

    it('get должен возвращать null, если запись по данному ключу отсутствует', async function () {
        assert.strictEqual(await client.get(testKey), null);
    });

    it('put должен создавать запись с одним значением', async function () {
        await client.put(testKey, testValues[0]);
        assert.deepStrictEqual(await client.getall(testKey), [testValues[0]]);
    });

    it('post должен добавлять новые значения', async function () {
        await client.post(testKey, testValues[1]);
        await client.post(testKey, testValues[2]);
        assert.deepStrictEqual(await client.getall(testKey), testValues);
    });

    it('getall должен учитывать параметры, когда они есть', async function () {
        assert.deepStrictEqual(
            await client.getall(testKey, {offset: 1, limit: 1}),
            [testValues[1]]
        );
    });

    it('del должен удалять все значения', async function () {
        await client.del(testKey);
        assert.deepStrictEqual(await client.getall(testKey), []);
    });
});
