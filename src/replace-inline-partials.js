
// Search for and replace inline partials defined in template block (not external)
function replaceInlinePartials(node) {
    const partials = {};
    function visit(node) {
        switch (node[0]) {
        case 'body':
            node.forEach(visit);
            break;

        case '<':
            const body = node[4][1][2];
            partials[node[1].text] = body.filter((item, ndx) => {
                return !(item[0] === 'format' && (ndx === 1 || ndx === body.length -1));
            });
            partials[node[1].text] = body;
            break;
        }
    }
    visit(node);
    return replace(node, partials);
}

function replace(node, partials) {
    switch (node[0]) {
    case 'body':
        return [
            node[0],
            ...node.slice(1).filter(node => node[0] !== '<').map(item => replace(item, partials))
        ];

    case '+':
        return partials[node[1].text];

    default:
        return node;
    }
}

module.exports = replaceInlinePartials;
