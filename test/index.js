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

    // {?...}
    // {^...}
    describe('conditions', () => {

        it('should convert conditions', () => {
            const result = dust2jsx(readFile('test/examples/condition.html'));
            expect(result).to.be.equal(file('test/examples/condition.jsx'));
        });

        it('should convert negative conditions', () => {
            const result = dust2jsx(readFile('test/examples/condition-negative.html'));
            expect(result).to.be.equal(file('test/examples/condition-negative.jsx'));
        });

        it('should convert inline conditions', () => {
            const result = dust2jsx(readFile('test/examples/condition-inline.html'));
            expect(result).to.be.equal(file('test/examples/condition-inline.jsx'));
        });

        it('should convert :else in conditions', () => {
            const result = dust2jsx(readFile('test/examples/condition-else.html'));
            expect(result).to.be.equal(file('test/examples/condition-else.jsx'));
        });
    });

    // {@Component/}
    it('should convert components', () => {
        const result = dust2jsx(readFile('test/examples/component.html'));
        expect(result).to.be.equal(file('test/examples/component.jsx'));
    });

    // {#array}
    it('should convert loops', () => {
        const result = dust2jsx(readFile('test/examples/loop.html'));
        expect(result).to.be.equal(file('test/examples/loop.jsx'));
    });

    // {#_t}
    it('should convert lexemes', () => {
        const result = dust2jsx(readFile('test/examples/lexeme.html'));
        expect(result).to.be.equal(file('test/examples/lexeme.jsx'));
    });

    // TODO {@select key=type}
    //        {@eq value="..."
    //        {@default}
    xit('should convert switches', () => {
        const result = dust2jsx(readFile('test/examples/switches.html'));
        expect(result).to.be.equal(file('test/examples/switches.jsx'));
    });


    // {text|s}
    it('should keep unescaped html', () => {
        const result = dust2jsx(readFile('test/examples/unescaped.html'));
        expect(result).to.be.equal(file('test/examples/unescaped.jsx'));
    });

    // TODO {@idx}
    // TOOO {@idx}{.}{/idx}
    xit('should recognize index in loops', () => {
        const result = dust2jsx(readFile('test/examples/index.html'));
        expect(result).to.be.equal(file('test/examples/index.jsx'));
    });

    // {! Comments !}
    it('should keep comments', () => {
        const result = dust2jsx(readFile('test/examples/comments.html'));
        expect(result).to.be.equal(file('test/examples/comments.jsx'));
    });
});
