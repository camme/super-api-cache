const expect = require('chai').expect;
const fetch = require('isomorphic-fetch');
const sac = require('../../src');
const serverSetup = require('./server-setup');

describe('Control endpoints', () => {

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

    it('An endpoint exists to delete cache entries by label', async () => {

        let internalUrl = `http://localhost:${process.env.PORT || 8765}`;
        let cache = await sac.create();

        server.use(cache.middleware(server));

        server.get('/foo', (req, res, next) => {
            cache.add(req.url, ['bar', 'baq'], { data: 1 });
            res.send({ data: 1 });
            return next();
        });

        server.get('/omega', (req, res, next) => {
            cache.add(req.url, ['bar', 'beta'], { tjena: 1 });
            res.send({ tjena: 2 });
            return next();
        });

        await fetch(`${internalUrl}/foo`).then((result) => result.json());
        await fetch(`${internalUrl}/omega`).then((result) => result.json());

        // Check so the cache has saved the data
        let cacheItems = await cache.find('bar');
        expect(cacheItems).to.have.lengthOf(2);

        await fetch(`${internalUrl}/sac/invalidate/bar`).then((result) => result.json());

        // After we invalidated the cache, we should have none
        let cachedItems2 = await cache.find('bar');
        expect(cachedItems2).to.have.lengthOf(0);

        return Promise.resolve();

    });

});
