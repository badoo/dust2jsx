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

function jsx(tokens) {
    switch (tokens[0]) {
    case 'body':
        return tokens.slice(1).reduce((memo, item) => {
            if (['buffer', 'format'].includes(item[0])) {
                memo += item[1];
            }
            return memo;
        }, '');
        break;
    }
}

function dust2jsx(code) {
    const tokens = parser.parse(code);
    console.log(tokens);
    return jsx(tokens);
}

module.exports = dust2jsx;
