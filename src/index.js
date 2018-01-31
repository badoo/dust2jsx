const pegjs = require('pegjs');

const parser = require('./parser');

function replaceCondition(node) {
    const body = node[4][1][2];
    const literal = node[4][1][1];

    switch (literal[1]) {
    case 'else':

        // {:else} provided
        return [
            'body',
            ['buffer', `{${node[1].text} ? (`],
            replaceDust(node[4][2][2]),
            ['buffer', ') : ('],
            replaceDust(node[4][1][2]),
            ['buffer', ')}'],
        ];
        break;

    default:

        // Inline condition block - print out as string
        if (node.location.start.line === node.location.end.line) {
            return [
                'body',
                ['buffer', `{${node[1].text} ? `],
                ['buffer', `'${body[1][1]}' : ''}`]
            ];
        }

        // Regular condition block
        return [
            'body',
            ['buffer', `{${node[1].text} ?`],
            replaceDust(body),
            ['buffer', ' : null}']
        ];
        break;
    }
}

function replaceDust(node) {
    switch (node[0]) {
    case 'body':
        return [
            node[0],
            ...node.slice(1).map(replaceDust)
        ];
        break;

    case '?':
        // Condition
        return replaceCondition(node);
        break;

    case '@':
        // Component
        const params = node[3].slice(1)
            .map(param => `${param[1][1]}="${param[2][1]}"`);
        return [
            'buffer',
            `<${node[1].text} ${params.join(' ')}/>`
        ]
        break;

    case '#':
        // Lexeme
        if (node[1].text === '_t') {
            const body = node[4][1][2];
            const lexeme = body[1][1].text;
            return [
                'buffer',
                `{nelly.get('${lexeme}')}`
            ]
        }

        // Loop
        // TODO: Scope
        return [
            'body',
            ['buffer', `{${node[1].text}.map(item =>`],
            replaceDust(node[4][1][2]),
            ['buffer', ')}']
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
    tokens = replaceDust(tokens);
    return printJsx(tokens);
}

module.exports = dust2jsx;
