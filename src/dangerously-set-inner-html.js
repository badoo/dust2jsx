
// Search for 'reference' nodes with filter=s and replace previous 'buffer' node
function setInnerHTML(node, ndx, arr) {
    if (node[0] === 'reference' && node[2][1] === 's') {

        // Search for the last 'buffer' type node
        let prev = ndx;
        while (arr[prev][0] !== 'buffer' && prev > 0) {
            prev--;
        }

        // Insert attribute for that node
        if (prev > 0 && arr[prev][1].endsWith('>')) {
            let attr = `dangerouslySetInnerHTML={{__html: ${node[1].text}}}`;
            arr[prev][1] = `${arr[prev][1].substring(0, arr[prev][1].length - 1)} ${attr}>`
            arr.splice(ndx, 1);
        }
    }
}

function visit(node) {
    switch (node[0]) {
    case 'body':
        node.forEach(setInnerHTML);
        break;

    default:
        if (node[4] && 'bodies' === node[4][1]) {
            node[4][1].splice(1).forEach(visit);
        }
        break;
    }
}

module.exports = visit;
