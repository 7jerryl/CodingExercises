const isProperlyClosedAndNested = (string, nestingLevel = 0) => {
  const whereParenthesisOpens = string.indexOf('(');
  const whereParenthesisCloses = string.indexOf(')');
  const hasParenthesisOpen = whereParenthesisOpens > -1;
  const hasParenthesisClose = whereParenthesisCloses > -1;
  // If we're opening a new expression.
  if (hasParenthesisOpen && whereParenthesisOpens < whereParenthesisCloses) {
    const fromParenthesisOpen = string.substring(whereParenthesisOpens + 1);
    // We return whether there is a properly closed and nested expression from the last parenthesis-open found.
    return isProperlyClosedAndNested(fromParenthesisOpen, nestingLevel + 1);
  }
  // If we're closing an open expression.
  else if (hasParenthesisClose) {
    const fromParenthesisClose = string.substring(whereParenthesisCloses + 1);
    // We return whether there is a properly closed and nested expression from the last parenthesis-close found.
    return isProperlyClosedAndNested(fromParenthesisClose, nestingLevel - 1);
  }
  // If we've properly nested and closed an expression.
  else if (nestingLevel === 0) {
    return true;
  }
  // If we haven't properly nested and closed an expression.
  else {
    return false;
  }
};
