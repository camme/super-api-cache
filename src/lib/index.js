const List = require('./list');

let cacheList;

function returnCurrentCache() {

    return Promise.resolve()
        .then(() => {
            if (!cacheList) {
                cacheList = new List();
            }
            return cacheList;
        });

}

function add(key, labels, data) {

    return returnCurrentCache()
        .then(cache => {
            return cache.add(key, labels, data);
        });

}

function get(key) {

    return returnCurrentCache()
        .then(cache => {
            return cache.getData(key);
        });

}


function getItemInfo(key) {

    return returnCurrentCache()
        .then(cache => {
            return cache.get(key);
        });

}


exports.add = add;
exports.get = get;
exports.getItemInfo = getItemInfo;
