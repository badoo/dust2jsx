const pegjs = require('pegjs');

const parser = require('./parser');

function replaceDustSyntax(node) {
    switch (node[0]) {
    case 'body':
        return [
            node[0],
            ...node.slice(1).map(replaceDustSyntax)
        ];
        break;

    case '?':
        // Conditions
        return [
            'body',
            ['buffer', `{${node[1].text} ?`],
            node[4][1][2],
            ['buffer', ' : null}']
        ];
        break;

    case '@':
        // Component
        const params = node[3].slice(1)
            .map(param => `${param[1][1]}="${param[2][1]}"`);
        return [
            'buffer',
            `<${node[1].text} ${params.join(' ')}/>`
        ]
        break

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

    case 'reference':
        return `{${node[1].text}}`;
        break;

    default:
        return '';
        break;
    }
}

function dust2jsx(code) {
    let tokens = parser.parse(code);
    tokens = replaceDustSyntax(tokens);
    return printJsx(tokens);
}

module.exports = dust2jsx;
