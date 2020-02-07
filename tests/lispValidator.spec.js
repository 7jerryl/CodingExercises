const { expect } = require('chai');

const lispParser = require('../exercises/lispValidator/lispValidator');

describe('LISP PARSER', () => {
  // This could represent a LISP comment, with no expression.
  it('should return true if there are no parenthetic blocks.', () => {
    const lispValid = lispParser('');
    expect(lispValid).to.be.true;
  });
  it('should return false if a parent expression is not properly closed.', () => {
    const lispValid = lispParser('(');
    expect(lispValid).to.be.false;
  });
  it('should return false if a parent expression is not properly open.', () => {
    const lispValid = lispParser(')');
    expect(lispValid).to.be.false;
  });
  it('should return false if a nested expression is not properly closed.', () => {
    const lispValid = lispParser('(()');
    expect(lispValid).to.be.false;
  });
  it('should return false if a nested expression is not properly open.', () => {
    const lispValid = lispParser('())');
    expect(lispValid).to.be.false;
  });
  it('should return true if a nested expression is properly nested and closed.', () => {
    const lispValid = lispParser('(())');
    expect(lispValid).to.be.true;
  });
  it('should return true if more than one parent expression is properly closed.', () => {
    const lispValid = lispParser('()()');
    expect(lispValid).to.be.true;
  });
  it('should return true if more than one parent expression is properly nested and closed.', () => {
    const lispValid = lispParser('(())(())');
    expect(lispValid).to.be.true;
  });
  it('should return true if all expressions are properly closed, even if not all are nested.', () => {
    const lispValid = lispParser('(())()');
    expect(lispValid).to.be.true;
  });
  it('should return false if any one of multiple expressions is not properly closed.', () => {
    const lispValid = lispParser('(())(');
    expect(lispValid).to.be.false;
  });
  it('should return false if any one of multiple expressions is not properly open.', () => {
    const lispValid = lispParser(')()');
    expect(lispValid).to.be.false;
  });
});
