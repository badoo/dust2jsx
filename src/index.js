const pegjs = require('pegjs');

const parser = require('./parser');
const replaceInlinePartials = require('./replace-inline-partials');
const dangerouslySetInnerHTML = require('./dangerously-set-inner-html');
const printJsx = require('./print-jsx');

const LOOP_VARIABLE = 'item';

function contextualise(context) {
    return (variable) => {
        if (!variable) {
            return context;
        } else {
            return context ? `${context}.${variable}` : variable;
        }
    };
}

function replaceCondition(node, context) {
    const ctxvar = contextualise(context);
    const body = node[4][1][2];
    const literal = node[4][1][1];

    // Negative or positive condition
    const negate = node[0] === '^' ? '!' : '';

    switch (literal[1]) {
    case 'else':

        // {:else} provided
        return [
            'body',
            ['buffer', `{${negate}${ctxvar(node[1].text)} ? (`],
            replaceDust(node[4][2][2], context),
            ['buffer', ') : ('],
            replaceDust(node[4][1][2], context),
            ['buffer', ')}'],
        ];

    default:

        // Inline condition block - print out as string
        if (node.location.start.line === node.location.end.line) {

            // Attribute
            const ATTRS_LIST = ['checked'];
            if (ATTRS_LIST.includes(body[1][1])) {
                return [
                    'body',
                    ['buffer', `${body[1][1]}={`],
                    ['buffer', `${negate}${ctxvar(node[1].text)} ? true : undefined`],
                    ['buffer', '}']
                ];
            }

            // Plain inline condition
            return [
                'body',
                ['buffer', `{${negate}${ctxvar(node[1].text)} ? `],
                ['buffer', `'${body[1][1]}' : ''}`]
            ];
        }

        // Regular condition block
        return [
            'body',
            ['buffer', `{${negate}${ctxvar(node[1].text)} ?`],
            replaceDust(body, context),
            ['buffer', ' : null}']
        ];
    }
}

function replaceSwitch(node, context) {
    const body = node[4][1][2];
    let defaultCase = '';

    // Switch cases
    const cases = body.slice(1).filter(node => node[0] === '@').map(node => {
        const body = node[4][1][2];

        // @default
        if (node[1].text === 'default') {
            defaultCase = ` || 'default'`;
            return [`'default'`, body];
        }

        // @eq key=value
        const param = node[3][1][2];
        const value = param[0] === 'literal' ? `'${param[1]}'` : `[${contextualise(context)(param.text)}]`;
        return [value, body];
    });

    // Construct output React "switch" structure
    const select = node[3][1][2];
    return [
        'body',
        ['buffer', '{{'],
        ['body', ...body.splice(1).map(node => {
            if (node[0] !== '@') {
                return node;
            }

            const nextCase = cases.shift();
            return [
                'body',
                ['buffer', `${nextCase[0]}: (`],
                replaceDust(nextCase[1], context),
                ['buffer', `)${cases.length > 0 ? ',' : ''}`]
            ];
            return node;
        })],
        ['buffer', `}[${contextualise(context)(select[1][1].text)}${defaultCase}]}`]
    ];
    return node;
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

    case 'comment':
        return [
            'buffer',
            `{/*${node[1]}*/}`
        ];

    case '?':
    case '^':
        // Condition
        return replaceCondition(node, context);

    case '@':
        // Switch
        if (node[1].text === 'select') {
            return replaceSwitch(node, context);
        }

        // Component
        const params = node[3].slice(1).map(param => {
            const value = param[2][0] === 'literal' ? `"${param[2][1]}"` : `{${contextualise(context)(param[2].text)}}`;
            return `${param[1][1]}=${value}`;
        });


        // Literal blocks - multiline params for Component
        const bodies = node[4];
        if (bodies.length > 1) {
            const blocks = bodies.slice(1).map(param => {
                const literal = param[1][1];
                if (literal === 'block') {
                    return param[2];
                }

                return [
                    'body',
                    ['buffer', ` ${contextualise(context)(literal)}={`],
                    replaceDust(param[2], context),
                    ['buffer', '}']
                ];
            });
            return [
                'body',
                ['buffer', `<${node[1].text} ${params.join(' ')}`],
                ['body', ...blocks],
                ['buffer', '/>']
            ];
        }

        return [
            'buffer',
            `<${node[1].text} ${params.join(' ')}/>`
        ];

    case '#':
        // Lexeme
        if (node[1].text === '_t') {
            const body = node[4][1][2];
            const lexeme = body[1][1].text;
            return [
                'buffer',
                `{nelly.get('${lexeme}')}`
            ];
        }

        // Loop
        return [
            'body',
            ['buffer', `{${contextualise(context)(node[1].text)}.map(${LOOP_VARIABLE} =>`],
            replaceDust(node[4][1][2], LOOP_VARIABLE),
            ['buffer', ')}']
        ];

    default:
        return node;
    }
}

function dust2jsx(code, { context }={}) {
    let tokens = parser.parse(code);
    tokens = replaceInlinePartials(tokens);
    tokens = replaceDust(tokens, context || '');
    dangerouslySetInnerHTML(tokens);
    return printJsx(tokens);
}

module.exports = dust2jsx;
