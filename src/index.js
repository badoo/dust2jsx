const pegjs = require('pegjs');

const parser = require('./parser');

const visitor = pegjs.compiler.visitor.build({
    body: function(node) {
        console.log('BODY', node);
    },
    buffer: function(node) {
        console.log('BUFFER', node);
    },
    format: function(node) {
        console.log('FORMAT', node);
    }
});

function printJsx(node) {
    switch (node[0]) {
    case 'body':
        return node.slice(1).reduce((memo, item) => memo + printJsx(item), '');
        break;

    case 'buffer':
    case 'format':
        return node[1];
        break;

    default:
        return '';
        break;
    }
}

function dust2jsx(code) {
    const tokens = parser.parse(code);
    //console.log(tokens);
    return printJsx(tokens);
}

module.exports = dust2jsx;
