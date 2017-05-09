const List = require('./list');

function create() {

    return Promise.resolve()
        .then(() => {

            let list = new List();

            return {

                get: list.get.bind(list),
                getItem: list.getItem.bind(list),
                add: list.add.bind(list),
                find: list.find.bind(list),
                clear: list.clear.bind(list),

                middleware: () => (req, res, next) => {
                    next();
                }

            }

        });

}

exports.create = create;

