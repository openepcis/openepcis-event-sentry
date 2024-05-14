/**
 * (c) Copyright Reserved OpenEPCIS 2024. All rights reserved.
 * Use of this material is subject to license.
 * Copying and unauthorised use of this material strictly prohibited.
 */

import _ from 'lodash';

/**
 * Evalautes the string expression.
 *
 * @param {string} expression - string expression, e.g., "true && true && false".
 * @return {boolean} - returns true of false based on the evaluation of expression.
 */
export const parseExpression = (expression) => {
  const tokens = expression.match(/\S+/g) || [];
  let result = true;
  let operator = '&&';
  for (const token of tokens) {
    if (token === '||' || token === '&&') {
      operator = token;
    } else {
      const value = token === 'true';
      result = operator === '&&' ? result && value : result || value;
    }
  }
  return result;
};

/**
 * Evalautes the rule expression.
 *
 * @param {string} expression - string expression declared in rules, e.g., lodash methods or non-lodash expressions.
 * @param {{}} event - event object based on the expression is evaluated.
 * @return {boolean} - returns true of false based on the evaluation of rule expression.
 */
export const evaluateRuleExpression = (expression, event) => {
  const segments = expression.split(/&&|\|\|/);

  const lodashExpressions = [];
  const nonLodashExpressions = [];

  segments.forEach((segment) => {
    if (!segment.includes('&&') && !segment.includes('||')) {
      if (segment.match(/^\s*!?_\./)) {
        lodashExpressions.push(segment);
      } else {
        nonLodashExpressions.push(segment);
      }
    }
  });

  const processedSegments = segments.map((segment) => {
    if (!segment.includes('&&') && !segment.includes('||')) {
      return expressionExecutor(segment, event);
    }
    return segment;
  });
  return parseExpression(processedSegments.join(' '));
};

/**
 * Sanitizes the expression to prevent unwanted javascript expressions.
 *
 * @param {string} expression - string expression that needed to be sanitized.
 * @return {string} - returns sanitized string.
 */
export const sanitizeExpression = (expression) => {
  return expression.replace(/<script[^>]*>.*?<\/script>|<\/?[^>]+>|on\w+="[^"]*"|&/g, '');
};

/**
 * Executes the expression e.g., lodash methods, non-lodash expression.
 *
 * @param {string} expression - string expression taken from the given rules.
 * @param {{}} context - event context required for the properties inside the expression.
 * @return {boolean} - returns true or false.
 */
export const expressionExecutor = (expression, context) => {
  const sandbox = {};
  const sanitizedExpression = sanitizeExpression(expression);
  sandbox._ = _;
  sandbox.event = context;
  try {
    const evaluator = new Function('with(this) { return ' + sanitizedExpression + '; }');
    return evaluator.call(sandbox);
  } catch {
    return undefined;
  }
};
