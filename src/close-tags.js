const TAGS = [
    'img',
    'input'
];

function closeTags(html) {
    return html.split('\n').map(line => {
        const trimmed = line.trim();
        TAGS.forEach(tagName => {
            if (trimmed.startsWith(`<${tagName} `) && trimmed.endsWith('>') && !trimmed.endsWith('/>')) {
                line = line.replace('>', '/>');
            }
        });
        return line;
    }).join('\n');
}

module.exports = closeTags;
