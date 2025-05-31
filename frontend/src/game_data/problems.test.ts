import { describe, it, expect } from 'vitest';
import { SourceCode, SourceCodeInstances } from './problems';

describe('Problems', () => {
    it('0 not in [9]', () => {
        expect(!(0 in [9]));
    })
    it('should have at least one problem instance', () => {
        expect(SourceCodeInstances.length).toBeGreaterThan(0);
    });
    it('should produce problem', () => {
        for (const src of SourceCodeInstances) {
            expect(src).toBeDefined();
            expect(src.generateProblem()).toBeDefined();
        }
    });
    it('should not produce letters in order', () => {
        const src = new SourceCode(
            "sample",
            `console.log("Hello,World!");`,
            "typescript"
        );
        const problem = src.generateProblem();
        for (const c of `console.log("Hello,World!");`) {
            if (c !== " ") {
                expect(problem.charAtCursor()).toBe(c);
                problem.proceed();
            }
        }
    })
    it('should not produce comment', () => {
        const srctext = `
console.log("Hello, World!");
// This is a comment
function test() {}
`
        const src = new SourceCode(
            "sample",
            srctext,
            "typescript"
        );

        const expectedText = `
console.log("Hello, World!");
function test() {}
`
        const problem = src.generateProblem();
        for (const c of expectedText) {
            if (c !== " " && c !== "\n") {
                expect(problem.charAtCursor()).toBe(c);
                problem.proceed();
            }
        }
    })
    it('', () => {});
});