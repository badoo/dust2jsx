
// Search for 'reference' nodes with filter=s and replace previous 'buffer' node
function setInnerHTML(node, ndx, arr) {
    if ((node[0] === 'reference' || node[0] === 'buffer') && node[2] && node[2][1] === 's') {

        // Search for the last 'buffer' type node
        let prev = ndx - 1;
        while (arr[prev][0] !== 'buffer' && prev > 0) {
            prev--;
        }

        const text = node[0] === 'reference' ? node[1].text : node[1];

        // Insert attribute for that node
        if (prev > 0 && arr[prev][1].endsWith('>')) {
            let attr = `dangerouslySetInnerHTML={{__html: ${text}}}`;
            arr[prev][1] = `${arr[prev][1].substring(0, arr[prev][1].length - 1)} ${attr}>`
            arr.splice(ndx, 1);
        }
    }
}

function visit(node) {
    if (node[0] === 'body') {
        node.forEach(visit);
        node.forEach(setInnerHTML);
    }
}

module.exports = visit;
