const restify = require('restify');

exports.create = function() {

    const server = restify.createServer({
        name: 'Super API Cache test',
        version: '1.0.0'
    });

    server.use(restify.acceptParser(server.acceptable));
    server.use(restify.queryParser());
    server.use(restify.bodyParser());

    return server;

}


