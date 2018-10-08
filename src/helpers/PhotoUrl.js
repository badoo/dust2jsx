const contextualise = require('../contextualise');

function PhotoUrl(node, context) {
    const params = node[3];

    function getVal(param) {
        switch (param[0]) {
        case 'literal':
            return param[1];
        case 'path':
            return contextualise(context)(param.text);
        default:
            return contextualise(context)(param.text);
        }
    }

    return [
        'body',
        ['buffer', '${PhotoUrl({ '],
        ['buffer', params.splice(1).map(param => `${param[1][1]}: ${getVal(param[2])}`).join(', ')],
        ['buffer', ' })}'],
    ];
    return node;
}

module.exports = PhotoUrl;
