
// Search for 'reference' nodes that are inside quotes and remove quotes
//   `="{params.reference}"` -> `={params.reference}`

function removeQuotes(node, ndx, arr) {
    if (node[0] === 'reference' &&
        arr[ndx-1] && arr[ndx-1][0] === 'buffer' && arr[ndx-1][1].endsWith('="') &&
        arr[ndx+1] && arr[ndx+1][0] === 'buffer' && arr[ndx+1][1].startsWith('"')) {

        arr[ndx-1][1] = arr[ndx-1][1].slice(0, arr[ndx-1][1].length - 1);
        arr[ndx+1][1] = arr[ndx+1][1].slice(1);
    }
}

function visit(node) {
    if (node[0] === 'body') {
        node.forEach(visit);
        node.forEach(removeQuotes);
    }
}

module.exports = visit;
