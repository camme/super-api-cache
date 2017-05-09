const expect = require('chai').expect;
const fetch = require('isomorphic-fetch');
const sac = require('../../src');
const serverSetup = require('./server-setup');

describe('Multiple micro-services with API gateway that handles cache', () => {

    let api = { url: 'http://localhost:8880', port: 8880, server: null };
    let sv1 = { url: 'http://localhost:8881', port: 8881, server: null };
    let sv2 = { url: 'http://localhost:8882', port: 8882, server: null };
    let agg = { url: 'http://localhost:8883', port: 8883, server: null };
    let all = { sv1, sv2, agg };

    afterEach(async () => {
        api.server.close();
        api.server = null;
        sv1.server.close();
        sv1.server = null;
        sv2.server.close();
        sv2.server = null;
        agg.server.close();
        agg.server = null;
    });

    async function create(port) {
        let server = serverSetup.create();
        let promise = new Promise((resolve, reject) => {
            server.listen(port, err => {
                if (err) {
                    return reject(err);
                }
                return resolve(server);
            });
        });
        return promise;
 
    }

    beforeEach(async () => {
        api.server = await create(api.port);
        sv1.server = await create(sv1.port);
        sv2.server = await create(sv2.port);
        agg.server = await create(agg.port);
        return Promise.resolve();
    });

    it('A api setup with underlying services will serve cache with correct labels', async () => {

        let cache = await sac.create();

        api.server.use(cache.middleware(api.server));

        // Create a proxy to each underlying micro-service
        Object.keys(all).forEach(name => {

            let service = all[name];
            let path = new RegExp('^\/' + name + '\/*', 'gi');
            api.server.get(path, async (req, res, next) => {

                let url = `${service.url}${req.url.replace('/' + name, '')}`;

                let result = await fetch(url).then(response => {

                    // Gather all labels from the headers and use them later to save the cache. 
                    let sacLabels = response.headers.get('x-sac-labels');
                    let labels = sacLabels ? sacLabels.split(',') : [];
                    return response.json().then(data => ({data, labels}));

                });

                // Include the service name in the labels as well
                let allLabels = result.labels.concat(name);
                cache.add(req.url, allLabels, result.data);
                res.set('x-sac-labels', allLabels.join(','));
                res.send(result.data);
                return next();

            });
        });

        let sv1Data = {datamaskin: 1};
        let sv1Counter = 0;
        sv1.server.get(/^\//gi, async (req, res, next) => {
            sv1Counter++;
            res.set('x-sac-labels', 'foo,bar');
            res.send(sv1Data);
            return next();
        });

        let sv2Data = {omega: 'hej'};
        let sv2Counter = 0;
        sv2.server.get(/^\//gi, async (req, res, next) => {
            sv2Counter++;
            res.set('x-sac-labels', 'baq,bar');
            res.send(sv2Data);
            return next();
        });

        agg.server.get(/all/gi, async (req, res, next) => {
            let sv1Result = await fetch(`${api.url}/sv1/call1`).then(async response => {
                let sacLabels = response.headers.get('x-sac-labels');
                let labels = sacLabels ? sacLabels.split(',') : [];
                let data = await response.json()
                return { data, labels };
            });
            let sv2Result = await fetch(`${api.url}/sv2/call1`).then(async response => {
                let sacLabels = response.headers.get('x-sac-labels');
                let labels = sacLabels ? sacLabels.split(',') : [];
                let data = await response.json();
                return { data, labels };
            });
            let labels = sv1Result.labels.concat(sv2Result.labels);
            res.set('x-sac-labels', labels.join(','));
            res.send({data1: sv1Result.data, data2: sv2Result.data});
            return next();
        });

        response = await fetch(`${api.url}/agg/all`).then((result) => result.json());
        expect(response.data1.datamaskin).to.be.equal(1);
        expect(response.data2.omega).to.be.equal('hej');
        expect(sv1Counter).to.be.equal(1);
        expect(sv2Counter).to.be.equal(1);

        // Change the data for one fo the services
        sv2Data = {omega: 'new'};

        // Next time we call it, we should get the same data, and no further calls to the other data
        response = await fetch(`${api.url}/agg/all`).then((result) => result.json());
        expect(response.data1.datamaskin).to.be.equal(1);
        expect(response.data2.omega).to.be.equal('hej');
        expect(sv1Counter).to.be.equal(1);
        expect(sv2Counter).to.be.equal(1);

        // Now we invalidate one sv2, and expect it to give us new data and have called
        // the underlying service one more time
        await fetch(`${api.url}/sac/invalidate/sv2`).then((result) => result.json());
        response = await fetch(`${api.url}/agg/all`).then((result) => result.json());
        expect(response.data1.datamaskin).to.be.equal(1);
        expect(response.data2.omega).to.be.equal('new');
        expect(sv1Counter).to.be.equal(1);
        expect(sv2Counter).to.be.equal(2);

        return Promise.resolve();

    });


});
