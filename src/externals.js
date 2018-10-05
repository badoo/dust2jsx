const externals = [];

function push(name) {
    if (!externals.includes(name)) {
        externals.push(name);
    }
}

function get() {
    return externals;
}

function clear() {
    externals.splice(0, externals.length);
}

module.exports = {
    push,
    get,
    clear
};
