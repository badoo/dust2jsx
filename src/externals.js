const externals = [];

function push(name) {
    if (externals.includes(name)) {
        externals.push(name);
    }
}

function get() {
    return externals;
}

module.exports = {
    push,
    get
};
