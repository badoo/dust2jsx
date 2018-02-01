const pegjs = require('pegjs');

const parser = require('./parser');
const dangerouslySetInnerHTML = require('./dangerously-set-inner-html');

function contextualise(context) {
    return (variable) => context ? `${context}.${variable}` : variable;
}

function replaceCondition(node, context) {
    const ctxvar = contextualise(context);
    const body = node[4][1][2];
    const literal = node[4][1][1];

    switch (literal[1]) {
    case 'else':

        // {:else} provided
        return [
            'body',
            ['buffer', `{${ctxvar(node[1].text)} ? (`],
            replaceDust(node[4][2][2], context),
            ['buffer', ') : ('],
            replaceDust(node[4][1][2], context),
            ['buffer', ')}'],
        ];

    default:

        // Inline condition block - print out as string
        if (node.location.start.line === node.location.end.line) {
            return [
                'body',
                ['buffer', `{${ctxvar(node[1].text)} ? `],
                ['buffer', `'${body[1][1]}' : ''}`]
            ];
        }

        // Regular condition block
        return [
            'body',
            ['buffer', `{${ctxvar(node[1].text)} ?`],
            replaceDust(body, context),
            ['buffer', ' : null}']
        ];
    }
}

function replaceDust(node, context) {
    switch (node[0]) {
    case 'body':
        return [
            node[0],
            ...node.slice(1).map(item => replaceDust(item, context))
        ];

    case 'reference':
        node[1].text = contextualise(context)(node[1].text);
        return node;

    case '?':
        // Condition
        return replaceCondition(node, context);

    case '@':
        // Component
        const params = node[3].slice(1)
            .map(param => `${param[1][1]}="${param[2][1]}"`);
        return [
            'buffer',
            `<${node[1].text} ${params.join(' ')}/>`
        ]

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
        return [
            'body',
            ['buffer', `{${node[1].text}.map(item =>`],
            replaceDust(node[4][1][2], 'item'),
            ['buffer', ')}']
        ];

    default:
        return node;
    }
}

function replaceClass(html) {
    return html.replace(' class="', ' className="');
}

function printJsx(node) {
    switch (node[0]) {
    case 'body':
        return node.slice(1).reduce((memo, item) => memo + printJsx(item), '');

    case 'buffer':
        return replaceClass(node[1]);

    case 'format':
        return node.slice(1).join('');

    case 'reference':
        return `{${node[1].text}}`;

    default:
        return '';
    }
}

function dust2jsx(code, { context }={}) {
    let tokens = parser.parse(code);
    tokens = replaceDust(tokens, context || '');
    dangerouslySetInnerHTML(tokens);
    return printJsx(tokens);
}

module.exports = dust2jsx;
