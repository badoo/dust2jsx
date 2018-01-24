const fs = require('fs');
const path = require('path');
const pegjs = require('pegjs');

const syntax = fs.readFileSync(path.join(__dirname, 'dust.pegjs'), 'utf8');
module.exports = pegjs.generate(syntax);
