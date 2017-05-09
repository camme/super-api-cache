const expect = require('chai').expect;
const fetch = require('isomorphic-fetch');
const sac = require('../../src');
const serverSetup = require('./server-setup');

describe('Simple server with one single', () => {

    let server;

    afterEach(async () => {
        if (server) {
            server.close();
            server = null;
        }
    });

    beforeEach(async () => {
        server = serverSetup.create();
        let promise = new Promise((resolve, reject) => {
            server.listen(process.env.PORT || 8765, err => {
                if (err) {
                    return reject(err);
                }
                return resolve();
            });
        });
        return promise;
    });

    it('A request saves cache and is served cached content the next time', async () => {

        let internalUrl = `http://localhost:${process.env.PORT || 8765}`;
        let cache = await sac.create();

        server.use(cache.middleware(server));

        // Count how many times the route has been accessed
        let counter = 0;

        server.get('/:id', (req, res, next) => {
            let currentData = {data: 1};
            cache.add(req.url, 'service1', currentData);
            counter++;
            res.send(currentData);
            return next();
        });

        let response = await fetch(`${internalUrl}/foo`).then((result) => result.json());

        // Check so the cache has saved the data
        let item = await cache.get('/foo');
        expect(item).to.exist;
        expect(item).to.have.property('data');
        expect(item.data).to.be.equal(1);

        response = await fetch(`${internalUrl}/foo`).then((result) => result.json());

        // Check so we only run the route one time
        expect(counter).to.be.equal(1);

        return Promise.resolve();

    });

    it('A request that has been cached can be overriden with cache-control: no-cache header', async () => {

        let internalUrl = `http://localhost:${process.env.PORT || 8765}`;
        let cache = await sac.create();

        server.use(cache.middleware(server));

        // Count how many times the route has been accessed
        let counter = 0;

        server.get('/:id', (req, res, next) => {
            let currentData = {data: 1};
            cache.add(req.url, 'service1', currentData);
            counter++;
            res.send(currentData);
            return next();
        });

        let response = await fetch(`${internalUrl}/foo`).then((result) => result.json());

        let headers = { 'Cache-Control': 'no-cache' }
        response = await fetch(`${internalUrl}/foo`, { headers: headers }).then((result) => result.json());

        // Check so we got the request two times
        expect(counter).to.be.equal(2);

        return Promise.resolve();

    });


});
