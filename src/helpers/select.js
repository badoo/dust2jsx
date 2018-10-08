const contextualise = require('../contextualise');

function select(node, context, parent) {
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
    const key = select.text ? select.text : select[1][1].text;
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
                parent(nextCase[1], context),
                ['buffer', `)${cases.length > 0 ? ',' : ''}`]
            ];
            return node;
        })],
        ['buffer', `}[${contextualise(context)(key)}${defaultCase}]}`]
    ];
}

module.exports = select;
