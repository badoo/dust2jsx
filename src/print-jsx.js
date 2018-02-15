
function replaceClass(html) {
    return html.replace(' class="', ' className="');
}

// Output JSX code from the Dust parser AST
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

module.exports = printJsx;