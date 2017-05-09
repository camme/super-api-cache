const List = require('./list');

function create() {

    return Promise.resolve()
        .then(() => {

            let list = new List();

            return {

                items: list.items,
                get: list.get.bind(list),
                getItem: list.getItem.bind(list),
                add: list.add.bind(list),
                find: list.find.bind(list),
                clear: list.clear.bind(list),

                middleware: (server) => {

                    // Add invalidation endpoint
                    server.get('/sac/invalidate/:labels', (req, res, next) => {
                        let labels = req.params.labels.split(',');
                        list.clear(labels)
                            .then(deleted => {
                                res.send({action: 'clear', labels: labels, deleted: deleted.length, success: true});
                            });
                    });

                    // Check if we should send the cache
                    return (req, res, next) => {

                        if (req.headers['cache-control'] !== 'no-cache') {

                            let cacheKey = req.url;
                            list.get(cacheKey)
                                .then(cachedData => {
                                    if (cachedData) {
                                        res.send(cachedData);
                                        return;
                                    }
                                    next();
                                });

                        } else {
                            next();
                        }
                    }

                }

            }

        });

}

exports.create = create;

