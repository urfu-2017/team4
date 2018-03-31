'use strict';

const assert = require('assert');
const DbCollection = require('./dbcollection');

const collection = new DbCollection('testCollection');
const testValues = [{ test: 'test1' }, { test: 'test2' }, { test: 'test3' }];

describe('dbcollection tests', () => {
    jest.setTimeout(10000);

    beforeEach(async () => {
        await collection.clear();
    });

    it('addRange должен добавлять несколько элементов в коллекцию', async () => {
        await collection.addRange(testValues);
        assert.deepStrictEqual(await collection.getAll(), testValues);
    });

    it('replaceAll должен заменять коллекцию целиком', async () => {
        const replaceFn = items => items.map(item => item.test);
        await collection.addRange(testValues);
        await collection.replaceAll(replaceFn);
        assert.deepStrictEqual(await collection.getAll(), replaceFn(testValues));
    });

    it('removeItem должен удалять примитивный элемент', async () => {
        await collection.addRange([1, 2, 3]);
        await collection.removeItem(2);
        assert.deepStrictEqual(await collection.getAll(), [1, 3]);
    });
});
