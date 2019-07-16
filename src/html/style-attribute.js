const REPLACEMENTS = {
    'background-image': 'backgroundImage',
    'background-position': 'backgroundPosition',
    'max-width': 'maxWidth'
};

function styleAttribute(html) {
    return html.split('\n').map(line => {
        if (line.indexOf('style="') !== -1) {
            const pos1 = line.indexOf('style="') + 6; // " position
            const pos2 = line.indexOf('"', pos1 + 1);
            let inner = line.substr(pos1 + 1, pos2 - pos1 - 1);
            for (const key in REPLACEMENTS) {
                inner = inner.replace(key, REPLACEMENTS[key]);
            }

            line = `${line.substr(0, pos1)}{{ ${inner} }}${line.substr(pos2 + 1)}`;
        }
        return line;
    }).join('\n');
}

module.exports = styleAttribute;
