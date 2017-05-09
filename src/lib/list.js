const List = function () {

    this.items = new Map();

};

List.prototype.add = async function(key, labels, data) {

    // Treat the key as a label as well
    let item = {
        labels: labels.concat([key]),
        key: key,
        data: data,
        counter: 0
    };

    this.items.set(key, item);

    return this;

};

List.prototype.getItem = async function(key) {
    let item = this.items.get(key);
    return Promise.resolve(item);
};

List.prototype.get = async function(key) {
    return this.getItem(key)
        .then(item => {

            if (!item) {
                return null;
            }

            let data = item.data;

            item.counter++;

            return data;
        });
};

List.prototype.find = async function(labels) {

    if (this.items.size === 0) {
        return Promise.resolve([]);
    }

    const labelList = Array.prototype.slice.call(arguments);

    let items = [];
    let itemIterator = this.items.values();
    let currentItem = itemIterator.next().value;

    while (currentItem) {
        let labels = currentItem.labels;
        let exists = labelList.some(label => {
            return labels.indexOf(label) > -1;
        });
        if (exists) {
            items.push(this.items.get(currentItem.key));
        }
        currentItem = itemIterator.next().value;
    }

    return Promise.resolve(items);

};

List.prototype.clear = async function(labels) {

    if (this.items.size === 0) {
        return Promise.resolve([]);
    }

    const labelList = Array.isArray(labels) ? labels : [labels];

    let itemIterator = this.items.values();
    let currentItem = itemIterator.next().value;
    let deleted = [];

    while (currentItem) {
        let labels = currentItem.labels;
        let exists = labelList.some(label => {
            return labels.indexOf(label) > -1;
        });
        if (exists) {
            deleted.push(currentItem);
            this.items.delete(currentItem.key);
        }
        currentItem = itemIterator.next().value;
    }

    return Promise.resolve(deleted);

};


module.exports = List;
