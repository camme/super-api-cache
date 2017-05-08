const List = require('../src/lib/index');
const expect = require('chai').expect;

const sac = require('../src');

describe('Exposed functions', () => {

    it('Add item to the cache', async () => {

        sac.add('/foo', ['foo', 'bar'], { datamaskin: 1 });

        let item = await sac.getItemInfo('/foo');

        expect(item).to.exist;
        expect(item).to.have.property('key');
        expect(item.key).to.be.equal('/foo');

        return Promise.resolve();

    });


    it('Get cached data from the cache', async () => {

        sac.add('/foo', ['foo', 'bar'], { datamaskin: 1 });

        let item = await sac.get('/foo');

        expect(item).to.exist;
        expect(item).to.have.property('datamaskin');
        expect(item.datamaskin).to.be.equal(1);

        return Promise.resolve();

    });


});

