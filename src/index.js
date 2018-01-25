const pegjs = require('pegjs');

const parser = require('./parser');

function replaceDustConditions(node) {
    switch (node[0]) {
    case 'body':
        return [
            node[0],
            ...node.slice(1).map(replaceDustConditions)
        ];
        break;

    case '?':
        return [
            'body',
            ['buffer', `{${node[1].text} ?`],
            node[4][1][2],
            ['buffer', ' : null}']
        ];
        break;

    default:
        return node;
        break;
    }
}

function replaceClass(html) {
    return html.replace(' class="', ' className="');
}

function printJsx(node) {
    switch (node[0]) {
    case 'body':
        return node.slice(1).reduce((memo, item) => memo + printJsx(item), '');
        break;

    case 'buffer':
        return replaceClass(node[1]);
        break;

    case 'format':
        return node.slice(1).join('');
        break;

    default:
        return '';
        break;
    }
}

function dust2jsx(code) {
    let tokens = parser.parse(code);
    tokens = replaceDustConditions(tokens);
    return printJsx(tokens);
}

module.exports = dust2jsx;
