# super-api-cache

Super alpha DONT USE IN PRODUCTION version of a API gateway cache module to keep track of 
underlying micro-services cache dependencies.

With simple labels, each response can be insterted into a list with a track of all dependecies.
Clearing a label, will clear all cached responses with that label.

# How to use it with restify

    const restify = require('restify');
    const sac = require('super-api-cache');

    const server = restify.createServer({
        name: 'Super API Cache test',
        version: '1.0.0'
    });

    server.use(restify.acceptParser(server.acceptable));
    server.use(restify.queryParser());
    server.use(restify.bodyParser());

    let cache = await sac.create();

    // UGLY
    api.server.use(cache.middleware(api.server));

    api.get('/foo', (req, res, next) => {

        let data = {hello: 1};

        // key, labels, data
        cache.add('/foo', ['bar'], data);
        res.send(data);

    });

    server.listen(1337, (err) => {
        if (err) {
            console.log(err);
            return;
        }
    });

First type, the endpoint will handle it as usual
Next time, it will be handled by the cache. 

There are more complex scenarios to show how it is meant to be used, but just in the tests
    
