const parser = require('./parser');

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
    return jsx(tokens);
}

module.exports = dust2jsx;
