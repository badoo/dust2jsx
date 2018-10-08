const contextualise = require('../contextualise');

const externals = require('../externals');

function replaceComponent(node, context, parent) {
    // Component params
    const params = node[3].slice(1).map(param => {
        const value = param[2][0] === 'literal' ? `"${param[2][1]}"` : `{${contextualise(context)(param[2].text)}}`;
        return `${param[1][1]}=${value}`;
    });

    // Literal blocks - multiline params
    const bodies = node[4].slice(1);
    if (bodies.length) {

        // Attempt to improve indentation for parameter blocks
        let blockFormat = bodies.length > 2 && bodies[0][2][bodies[0][2].length - 1][0] === 'format' ?
            bodies[0][2][bodies[0][2].length - 1] :
            ['format', ' '];

        // Parameter blocks
        const blocks = bodies.map(param => {
            const literal = param[1][1];
            const paramBody = param[2];
            if (literal === 'block') {
                return paramBody;
            }

            return [
                'body',
                blockFormat,
                ['buffer', `${contextualise(context)(literal)}={`],
                parent(paramBody, context),
                ['buffer', '}']
            ];
        });

        externals.push(node[1].text);

        return [
            'body',
            ['buffer', `<${node[1].text} ${params.join(' ')}`],
            ['body', ...blocks],
            ['buffer', '/>']
        ];
    }

    externals.push(node[1].text);

    // Singleline params
    return [
        'buffer',
        `<${node[1].text} ${params.join(' ')}/>`
    ];
}

module.exports = replaceComponent;
