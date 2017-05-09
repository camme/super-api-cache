const List = require('../src/lib/list');
const expect = require('chai').expect;

describe('List', () => {

    it('Add item to list', async () => {

        let list = new List();

        await list.add('datamaskin1', ['foo', 'bar']);
        await list.add('datamaskin2', ['foo', 'baq']);

        let item1 = await list.getItem('datamaskin1');
        expect(item1).to.exist;
        expect(item1).to.have.property('labels');
        expect(item1.labels).to.include.members(['foo', 'bar', 'datamaskin1']);

        let item2 = await list.getItem('datamaskin2');
        expect(item2).to.exist;
        expect(item2).to.have.property('labels');
        expect(item2.labels).to.include.members(['foo', 'baq', 'datamaskin2']);

        return Promise.resolve();

    });

    it('Get item by key', async () => {

        let list = new List();

        await list.add('datamaskin1', ['foo', 'bar']);
        await list.add('datamaskin2', ['foo', 'baq']);

        let item1 = await list.getItem('datamaskin1');
        expect(item1).to.exist;
        expect(item1).to.have.property('labels');
        expect(item1.labels).to.include.members(['foo', 'bar']);

        let item2 = await list.getItem('datamaskin2');
        expect(item2).to.exist;
        expect(item2).to.have.property('labels');
        expect(item2.labels).to.include.members(['foo', 'baq']);

        return Promise.resolve();

    });

    it('Find an item by label', async () => {

        let key = 'datamaskin';
        let labels = ['foo', 'bar'];
        let list = new List();
        await list.add(key, labels);

        let result = await list.find('foo');
        expect(result).to.have.length.of(1);
        expect(result[0]).to.have.property('labels');

        return Promise.resolve();

    });

    it('Delete an item by label', async () => {

        let key = 'datamaskin';
        let labels = ['foo', 'bar'];
        let list = new List();

        await list.add(key, labels);
        await list.clear('foo');

        let result = await list.find('foo');
        expect(result).to.exist;
        expect(result).to.have.length.of(0);

    });

    it('Delete multiple items by label as a string', async () => {

        let list = new List();
        await list.add('datamaskin1', ['foo', 'bar']);
        await list.add('datamaskin2', ['foo', 'baq']);
        await list.add('datamaskin3', ['baq', 'bar']);

        let deleted = await list.clear('foo');
        expect(deleted).to.exist;
        expect(deleted).to.have.length.of(2);

        let result = await list.find('foo');
        expect(result).to.exist;
        expect(result).to.have.length.of(0);

    });

    it('Delete multiple items by labels as an array', async () => {

        let list = new List();
        await list.add('datamaskin1', ['foo', 'bar']);
        await list.add('datamaskin2', ['foo', 'baq']);
        await list.add('datamaskin3', ['baq', 'bar']);

        let deleted = await list.clear(['foo']);
        expect(deleted).to.exist;
        expect(deleted).to.have.length.of(2);

        let result = await list.find('foo');
        expect(result).to.exist;
        expect(result).to.have.length.of(0);

    });

 
    it('Get an item data by key', async () => {

        let list = new List();

        await list.add('datamaskin1', ['foo', 'bar'], { text: 'hej' });
        await list.add('datamaskin2', ['foo', 'baq'], { text: 'tjena' });
        await list.add('datamaskin3', ['baq', 'bar'], { text: 'hallo' });

        let result = await list.get('datamaskin2');
        expect(result).not.to.be.equal(null); // to.exist;
        expect(result).to.have.property('text');
        expect(result.text).to.be.equal('tjena');

        return Promise.resolve();

    });

    it('Getting an item should increae a counter', async () => {

        let list = new List();

        await list.add('datamaskin1', ['foo', 'bar'], { text: 'hej' });
        await list.add('datamaskin2', ['foo', 'baq'], { text: 'tjena' });
        await list.add('datamaskin3', ['baq', 'bar'], { text: 'hallo' });

        let item;

        await list.get('datamaskin2');

        item = await list.getItem('datamaskin2');
        expect(item.counter).to.be.equal(1);

        await list.get('datamaskin2');
        await list.get('datamaskin2');
        await list.get('datamaskin2');
        await list.get('datamaskin2');

        item = await list.getItem('datamaskin2');
        expect(item.counter).to.be.equal(5);


        return Promise.resolve();

    });


});


