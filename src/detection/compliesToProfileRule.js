/**
 * (c) Copyright Reserved OpenEPCIS 2024. All rights reserved.
 * Use of this material is subject to license.
 * Copying and unauthorised use of this material strictly prohibited.
 */

import _ from 'lodash';
import {
  detectDocumentType,
  isPropertyKeyExists,
  isNotEmpty,
  isValidEpcisEvent,
  parseExpression,
  isKeyValuePairExists,
  replaceMsgParams,
} from '../index';

const utilMethods = {
  parseExpression,
  isValidEpcisEvent,
  detectDocumentType,
  isNotEmpty,
  isPropertyKeyExists,
  isKeyValuePairExists,
  replaceMsgParams,
};

const utilMethodMap = {};

const preprocessExpression = (expression) => {
  let utilMethodIndex = Object.keys(utilMethodMap).length;

  return expression.replace(/(\w+)\(([^)]+)\)/g, (_, functionName, args) => {
    args = args.replace(/\s/g, '');
    utilMethodMap[utilMethodIndex++] = {
      name: functionName,
      args: args.split(','),
    };
    return `{UTIL_${utilMethodIndex - 1}}`;
  });
};

const customMatches = (expression, event, utilMethodMap) => {
  const segments = expression.split(/&&|\|\|/);

  const utilMethodsData = [];
  const nonUtilMethodsData = [];

  segments.forEach((segment) => {
    if (segment !== '&&' && segment !== '||') {
      if (/\{UTIL_(\d+)}|[\w.]+\(.+\)/.test(segment)) {
        utilMethodsData.push(segment);
      } else {
        nonUtilMethodsData.push(segment);
      }
    }
  });

  utilMethodsData.forEach((segment) => {
    const match = segment.match(/{UTIL_(\d+)}/);
    const index = match[1];
    const utilMethod = utilMethodMap[index].name;
    if (!utilMethod) {
      throw new Error(replaceMsgParams('Util method not found for the segment {0}', segment));
    }
    const originalArgs = utilMethodMap[index].args;
    const remainingArgs = originalArgs.slice(1);

    const result = segment.replace(/{UTIL_(\d+)}/g, () => {
      return utilMethods[utilMethod](event, ...remainingArgs);
    });
    segments[segments.indexOf(segment)] = result;
  });

  nonUtilMethodsData.forEach((segment) => {
    try {
      const evaluateExpression = new Function('event', `return ${segment};`);
      const result = evaluateExpression(event);
      segments[segments.indexOf(segment)] = result;
    } catch {
      segments[segments.indexOf(segment)] = false;
    }
  });
  return parseExpression(segments.join(' '));
};

const isEventCompliesToProfileRule = (event, profileRules) => {
  //   let detectedProfiles = [];
  for (const rule of profileRules) {
    if (rule.eventType === event.type) {
      const processedExpression = customMatches(
        preprocessExpression(rule.expression),
        event,
        utilMethodMap,
      );
      const result = _.template(processedExpression)(event);
      return parseExpression(result);
    }
  }
};

export const compliesToProfileRule = (document = {}, customEventProfileDetectionRules = []) => {
  if (document && customEventProfileDetectionRules) {
    return isEventCompliesToProfileRule(document, customEventProfileDetectionRules);
  }
};
