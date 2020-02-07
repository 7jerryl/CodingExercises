/**
 * @param {string} input
 * @param {number} nestingLevel
 */
const isProperlyClosedAndNested = (input, nestingLevel = 0) => {
  const whereParenthesisOpens = input.indexOf('(');
  const whereParenthesisCloses = input.indexOf(')');
  const openingExpression =
    whereParenthesisOpens < 0 ? Infinity : whereParenthesisOpens;
  const closingExpression =
    whereParenthesisCloses < 0 ? Infinity : whereParenthesisCloses;
  // If we're opening a new expression.
  if (openingExpression < closingExpression) {
    const fromParenthesisOpen = input.substring(whereParenthesisOpens + 1);
    // We return whether there is a properly closed and nested expression from the last parenthesis-open found.
    return isProperlyClosedAndNested(fromParenthesisOpen, nestingLevel + 1);
  }
  // If we're closing an open expression.
  else if (closingExpression < openingExpression) {
    const fromParenthesisClose = input.substring(whereParenthesisCloses + 1);
    // We return whether there is a properly closed and nested expression from the last parenthesis-close found.
    return isProperlyClosedAndNested(fromParenthesisClose, nestingLevel - 1);
  }
  // If we've closed all nested expressions properly.
  else if (nestingLevel === 0) {
    return true;
  }
  // If we haven't closed all nested expressions properly.
  else {
    return false;
  }
};

const expressionIndex = process.argv.indexOf('--expression');
if (expressionIndex > -1) {
  const expression =
    process.argv[expressionIndex].split('=')[1] ||
    process.argv[expressionIndex + 1];

  if (expression && expression.length) {
    console.log(isProperlyClosedAndNested(expression));
  }
}

module.exports = isProperlyClosedAndNested;
