const pegjs = require('pegjs');

const parser = require('./parser');

const dangerouslySetInnerHTML = require('./visitors/dangerously-set-inner-html');
const fixQuotedReferences = require('./visitors/fix-quoted-references');
const removeQuotesAroundReference = require('./visitors/remove-quotes-around-reference');

const replaceInlinePartials = require('./replacers/inline-partials');
const replaceComponent = require('./replacers/component');

const closeTags = require('./html/close-tags');
const styleAttribute = require('./html/style-attribute');

const helpers = require('./helpers');
const contextualise = require('./contextualise');
const printJsx = require('./print-jsx');

const externals = require('./externals');

const LOOP_VARIABLE = 'item';

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
            const ATTRS_MAP = {
                'checked': 'defaultChecked'
            };
            if (ATTRS_MAP[body[1][1]]) {
                return [
                    'body',
                    ['buffer', `${ATTRS_MAP[body[1][1]]}={`],
                    ['buffer', `${negate}${ctxvar(node[1].text)} ? true : undefined`],
                    ['buffer', '}']
                ];
            }

            // Plain inline condition
            const singleBufferBody = body.length === 2 && body[1][0] === 'buffer';
            return [
                'body',
                ['buffer', `{${negate}${ctxvar(node[1].text)} ? `],
                singleBufferBody ? ['buffer', `'${body[1][1]}'`] : replaceDust(body, context),
                ['buffer', ' : \'\'}']
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
        // Registered helpers
        const helper = helpers[node[1].text];
        if (helper) {
            if (node[1].text !== 'select') {
                externals.push(node[1].text);
            }
            return helper(node, context, replaceDust);
        }

        // Component
        return replaceComponent(node, context, replaceDust);

    case '#':
        // Lexeme
        if (node[1].text === '_t') {
            externals.push('nelly');
            const body = node[4][1][2];
            const lexeme = body[1][1].text;
            return [
                'buffer',
                `{nelly.get('${lexeme}')}`,
                body[1][2] // 'filters'
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

function dust2jsx(code, { context, externals: externalsParam }={}) {
    externals.clear();

    code = closeTags(code);

    let tokens = parser.parse(code);
    tokens = replaceInlinePartials(tokens);
    tokens = replaceDust(tokens, context || '');
    dangerouslySetInnerHTML(tokens);
    removeQuotesAroundReference(tokens);
    fixQuotedReferences(tokens);

    if (externalsParam === true) {
        return externals.get();
    }

    return styleAttribute(printJsx(tokens));
}

module.exports = dust2jsx;
