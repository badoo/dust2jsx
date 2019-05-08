const ATTRIBUTE = '="';

function fixQuotedReferences(node, ndx, arr) {
    if (node[0] === 'buffer' && node[1].includes(ATTRIBUTE)) {
        if (!node[1].slice(node[1].indexOf(ATTRIBUTE) + ATTRIBUTE.length).includes('"')) {

            // class="foo {isBar ? 'bar' : ''} baz"
            //      ->
            // class={`foo ${isBar ? 'bar' : ''} baz`}
            if (arr[ndx+1] && arr[ndx+1][0] === 'body' &&
                arr[ndx+2] && arr[ndx+2][0] === 'buffer') {

                arr[ndx][1] = arr[ndx][1].replace('="', '={`');
                const body = arr[ndx+1];
                if (body[1][1].startsWith('{')) {
                    arr[ndx+1][1][1] = body[1][1].replace('{', '${');
                }
                arr[ndx+2][1] = arr[ndx+2][1].replace('"', '`}');
            }

            // class="foo {bar} baz"
            //      ->
            // class={`foo ${bar} baz`}
            if (arr[ndx+1] && arr[ndx+1][0] === 'reference' &&
                arr[ndx+2] && arr[ndx+2][0] === 'buffer') {

                arr[ndx][1] = arr[ndx][1].replace('="', '={`') + '$';
                arr[ndx+2][1] = arr[ndx+2][1].replace('"', '`}');
            }
        }
    }
}

function visit(node) {
    if (node[0] === 'body') {
        node.forEach(visit);
        node.forEach(fixQuotedReferences);
    }
}

module.exports = visit;
