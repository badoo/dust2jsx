const replaceComponent = require('../replacers/component');

function buttonType(type) {
    const TYPES = {
        'primary': 'button--primary',
        'secondary': 'button--secondary',
        'border-only': 'button--stroke',
        'stroke': 'button--stroke',
        'red': 'button--red',
        'green': 'button--green',
        'transparent': 'button--transparent',
        'billing-green': 'button--billing-green',
        'facebook': 'button--facebook',
        'vkontakte': 'button--vkontakte',
        'odnoklassniki': 'button--odnoklassniki',
        'google': 'button--google',
        'instagram': 'button--instagram',
        'linkedin': 'button--linkedin',
        'twitter': 'button--twitter',
        'phone': 'button--phone',
        'add-photo': 'button--add-photo',
        'attention-boost': 'button--attention-boost',
        'bundle-sale': 'button--bundle-sale',
        'chat-with-tired': 'button--chat-with-tired',
        'chat-with-newbies': 'button--chat-with-newbies',
        'chat-quota': 'button--chat-quota',
        'criteria': 'button--criteria',
        'crush': 'button--crush',
        'extra-shows': 'button--extra-shows',
        'favourites': 'button--favourites',
        'invisible-mode': 'button--invisible-mode',
        'liked-you': 'button--liked-you',
        'riseup': 'button--riseup',
        'special-delivery': 'button--special-delivery',
        'spotlight': 'button--spotlight',
        'spp': 'button--spp',
        'undo': 'button--undo',
        'verification': 'button--verification',
        'never-loose-account': 'button--never-loose-account',
        'inherited': 'button--inherited',
        'primary-inverted': 'button--primary-inverted',
        'signup-inherited': 'button--signup button--inherited',
        'signup': 'button--signup'
    }

    if (type) {
        return TYPES[type] || 'button-primary';
    }

    return null;
}

function buttonSize(size) {
    return size === 'lg' ? 'button--lg' : '';
}

function buttonLayout(params) {
    return params.narrow ? 'button--narrow' :
        (params.stroke ? 'button--stroke' : '');
}

// TODO extraClass

function dustButton(params) {
    const classnames = [
        buttonType(params.type),
        buttonSize(params.size),
        buttonLayout(params),
        params.extraClass
    ].filter(Boolean).join(' ');

    return [
        ['buffer', `<button className="button ${classnames ? `${classnames} ` : ''}js-action js-touchable qa-button">\n`],
        ['buffer', '    <div className="button__content">\n'],
        ['buffer', '        <span className="button__text js-button-text"></span>\n'],
        ['buffer', '    </div>\n'],
        ['buffer', '</button>']
    ];
}

function Button(node, context, parent) {
    const component = replaceComponent(node, context, parent);
    const params = node[3].splice(1).reduce((memo, param) => {
        if (param[1][0] === 'literal' && param[2][0] === 'literal') {
            memo[ param[1][1] ] = param[2][1];
        }
        return memo;
    }, {});

    return [
        'body',
        ['buffer', '{/* '],
        component,
        ['buffer', ' */}\n'],
        ...dustButton(params)
    ];
}

module.exports = Button;
