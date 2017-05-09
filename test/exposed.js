const expect = require('chai').expect;

const sac = require('../src');

describe('Exposed functions', () => {

    it('All exposed functions exist', async () => {

        let cache = await sac.create();

        expect(cache).to.have.property('add');
        expect(cache).to.have.property('find');
        expect(cache).to.have.property('clear');
        expect(cache).to.have.property('get');
        expect(cache).to.have.property('getItem');

        return Promise.resolve();

    });

    it('Create a new cache', async () => {

        let cache = await sac.create();

        cache.add('/foo', ['foo', 'bar'], { datamaskin: 1 });

        let item = await cache.get('/foo');

        expect(item).to.exist;
        expect(item).to.have.property('datamaskin');
        expect(item.datamaskin).to.be.equal(1);

        return Promise.resolve();

    });

    it('Add item to the cache', async () => {

        let cache = await sac.create();

        cache.add('/foo', ['foo', 'bar'], { datamaskin: 1 });

        let item = await cache.getItem('/foo');

        expect(item).to.exist;
        expect(item).to.have.property('key');
        expect(item.key).to.be.equal('/foo');

        return Promise.resolve();

    });

    it('Get cached data from the cache', async () => {

        let cache = await sac.create();

        cache.add('/foo', ['foo', 'bar'], { datamaskin: 1 });

        let item = await cache.get('/foo');

        expect(item).to.exist;
        expect(item).to.have.property('datamaskin');
        expect(item.datamaskin).to.be.equal(1);

        return Promise.resolve();

    });

});

