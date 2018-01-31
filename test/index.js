const fs = require('fs');
const path = require('path');
const chai = require('chai');
const chaiFiles = require('chai-files');

chai.use(chaiFiles);

const expect = chai.expect;
const file = chaiFiles.file;

const dust2jsx = require('../src');

function readFile(filepath) {
    return fs.readFileSync(path.join(__dirname, '..', filepath), 'utf8');
}

describe('dust2jsx', () => {

    it('should be defined', () => {
        expect(dust2jsx).to.not.be.undefined;
    });

    it('should convert plain template', () => {
        const result = dust2jsx(readFile('test/examples/plain.html'));
        expect(result).to.be.equal(file('test/examples/plain.jsx'));
    });

    it('should convert conditions', () => {
        const result = dust2jsx(readFile('test/examples/condition.html'));
        expect(result).to.be.equal(file('test/examples/condition.jsx'));
    });

    it('should convert inline conditions', () => {
        const result = dust2jsx(readFile('test/examples/inline-condition.html'));
        expect(result).to.be.equal(file('test/examples/inline-condition.jsx'));
    });

    it('should convert components', () => {
        const result = dust2jsx(readFile('test/examples/component.html'));
        expect(result).to.be.equal(file('test/examples/component.jsx'));
    });

    it('should convert loops', () => {
        const result = dust2jsx(readFile('test/examples/loop.html'));
        expect(result).to.be.equal(file('test/examples/loop.jsx'));
    });

    it('should convert lexemes', () => {
        const result = dust2jsx(readFile('test/examples/lexeme.html'));
        expect(result).to.be.equal(file('test/examples/lexeme.jsx'));
    });

    // TODO {:else}

    // TODO {@select key=type}
    //          {@eq value="..."

    // TODO {text|s}

    // TODO {@idx}

    // TOOO {@idx}{.}{/idx}
});
