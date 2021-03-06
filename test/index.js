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
        const result1 = dust2jsx(readFile('test/examples/context.html'));
        expect(result1).to.be.equal(file('test/examples/context.jsx'));
        const result2 = dust2jsx(readFile('test/examples/context.html'), { context: 'foo' });
        expect(result2).to.be.equal(file('test/examples/context-foo.jsx'));
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

    // ="foo {bar} baz"
    it('should replace quoted references', () => {
        const result = dust2jsx(readFile('test/examples/quoted-references.html'));
        expect(result).to.be.equal(file('test/examples/quoted-references.jsx'));
    });

    // TODO
    xit('should convert svg content', () => {
        const result = dust2jsx(readFile('test/examples/svg.html'));
        expect(result).to.be.equal(file('test/examples/svg.jsx'));
    });

    // <img ... >
    it('should close some unclosed HTML tags', () => {
        const result = dust2jsx(readFile('test/examples/unclosed-tags.html'));
        expect(result).to.be.equal(file('test/examples/unclosed-tags.jsx'));
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

        it('should recognize literal blocks inside component with properly applied context', () => {
            const result = dust2jsx(readFile('test/examples/component-literal.html'), { context: 'props' });
            expect(result).to.be.equal(file('test/examples/component-literal-props.jsx'));
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

        // {@Button}
        it('should convert common @Button usages', () => {
            const result = dust2jsx(readFile('test/examples/buttons.html'));
            expect(result).to.be.equal(file('test/examples/buttons.jsx'));
        });

        describe('@PhotoUrl', () => {

            it('should recognize custom @PhotoUrl helper', () => {
                const result = dust2jsx(readFile('test/examples/photo-url-helper.html'));
                expect(result).to.be.equal(file('test/examples/photo-url-helper.jsx'));
            });

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

    describe(':externals parameter', () => {

        it('should extract external variables referenced in template', () => {
            const result1 = dust2jsx(readFile('test/examples/plain.html'), { externals: true });
            expect(result1).to.deep.equal([]);

            const result2 = dust2jsx(readFile('test/examples/component-literal.html'), { externals: true });
            expect(result2).to.deep.equal(['Bar', 'Baz', 'Icon']);
        });

        it('should recognise i18n library in templates', () => {
            const result = dust2jsx(readFile('test/examples/lexeme.html'), { externals: true });
            expect(result).to.deep.equal(['nelly']);
        });

        it('should know that @select is not external', () => {
            const result = dust2jsx(readFile('test/examples/switches.html'), { externals: true });
            expect(result).to.deep.equal(['Icon']);
        });
    });
});
