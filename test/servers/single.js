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

        let data = {
            'foo': { data: 1 },
            'bar': { data: 2 }
        };

        server.use(cache.middleware());

        server.get('/:id', (req, res, next) => {
            let currentData = data[req.params.id];
            cache.add(req.url, 'service1', currentData);
            res.send(currentData);
            return next();
        });

        let response = await fetch(`${internalUrl}/foo`).then((result) => result.json());

        let item = await cache.get('/foo');
        expect(item).to.exist;
        expect(item).to.have.property('data');
        expect(item.data).to.be.equal(1);

        return Promise.resolve();

    });

});
