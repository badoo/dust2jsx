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

    it('should convert template', () => {
        const result = dust2jsx(readFile('test/examples/plain.html'));
        expect(result).to.be.equal(file('test/examples/plain.jsx'));
    });

    it('should respect passed :context parameter', () => {
        const result = dust2jsx(readFile('test/examples/context.html'), { context: 'foo' });
        expect(result).to.be.equal(file('test/examples/context.jsx'));
    });

    // {?...}
    // {^...}
    describe('(?^) conditions', () => {

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

        // TODO
        // {@if cond="
        xit('should recognize @if conditions', () => {
            const result = dust2jsx(readFile('test/examples/condition-if.html'));
            expect(result).to.be.equal(file('test/examples/condition-if.jsx'));
        });
    });

    describe('(@) components', () => {

        // {@Component/}
        it('should convert custom components', () => {
            const result = dust2jsx(readFile('test/examples/component.html'));
            expect(result).to.be.equal(file('test/examples/component.jsx'));
        });

        // {@Component text=text}
        //   {:icon}
        //     {@Icon/}
        // {/Component}
        it('should recognize literal blocks inside component', () => {
            const result = dust2jsx(readFile('test/examples/component-literal.html'));
            expect(result).to.be.equal(file('test/examples/component-literal.jsx'));
        });

        // {@select key=type}
        //   {@eq value="..."
        //   {@default}
        it('should convert switches', () => {
            const result = dust2jsx(readFile('test/examples/switches.html'));
            expect(result).to.be.equal(file('test/examples/switches.jsx'));
        });

        // TODO
        // {@idx}
        // {@idx}{.}{/idx}
        xit('should recognize indexes in loops', () => {
            const result = dust2jsx(readFile('test/examples/index.html'));
            expect(result).to.be.equal(file('test/examples/index.jsx'));
        });
    });

    describe('(#) loops', () => {

        // {#array}
        it('should convert loops', () => {
            const result = dust2jsx(readFile('test/examples/loop.html'));
            expect(result).to.be.equal(file('test/examples/loop.jsx'));
        });

        // TODO
        // {#array}
        // ...
        // {:else}
        // ...
        xit('should recognize :else condition in loops', () => {
            const result = dust2jsx(readFile('test/examples/loop-else.html'));
            expect(result).to.be.equal(file('test/examples/loop-else.jsx'));
        });

        // {#_t}
        it('should convert lexemes', () => {
            const result = dust2jsx(readFile('test/examples/lexeme.html'));
            expect(result).to.be.equal(file('test/examples/lexeme.jsx'));
        });


        // {.}
        it('should convert item in loop', () => {
            const result = dust2jsx(readFile('test/examples/loop-item.html'));
            expect(result).to.be.equal(file('test/examples/loop-item.jsx'));
        });
    });

    // {text|s}
    it('should keep unescaped html', () => {
        const result = dust2jsx(readFile('test/examples/unescaped.html'));
        expect(result).to.be.equal(file('test/examples/unescaped.jsx'));
    });

    // {! Comments !}
    it('should keep comments', () => {
        const result = dust2jsx(readFile('test/examples/comments.html'));
        expect(result).to.be.equal(file('test/examples/comments.jsx'));
    });

    // {> inline-partial /}
    it('should replace inline partials', () => {
        const result = dust2jsx(readFile('test/examples/inline-partial.html'));
        expect(result).to.be.equal(file('test/examples/inline-partial.jsx'));
    });

    // TODO
    xit('should convert svg content', () => {
        const result = dust2jsx(readFile('test/examples/svg.html'));
        expect(result).to.be.equal(file('test/examples/svg.jsx'));
    });

    describe(':externals parameter', () => {

        it('should extract external variables referenced in template', () => {
            const result1 = dust2jsx(readFile('test/examples/plain.html'), { externals: true });
            expect(result1).to.deep.equal([]);

            const result2 = dust2jsx(readFile('test/examples/component-literal.html'), { externals: true });
            expect(result2).to.deep.equal(['Bar', 'Button', 'Icon']);
        });

        it('should recognise i18n library in templates', () => {
            const result = dust2jsx(readFile('test/examples/lexeme.html'), { externals: true });
            expect(result).to.deep.equal(['nelly']);
        });

    });
});
