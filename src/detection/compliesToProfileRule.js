/**
 * (c) Copyright Reserved OpenEPCIS 2024. All rights reserved.
 * Use of this material is subject to license.
 * Copying and unauthorised use of this material strictly prohibited.
 */

import Ajv from 'ajv';
const ajv = new Ajv();
import {
  detectDocumentType,
  documentTypes,
  errorMessages,
  expressionExecutor,
  parseExpression,
  profileDetectionRulesSchema,
  throwError,
} from '../index';

const customMatches = (expression, event) => {
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

const isEventCompliesToProfileRule = (event, profileRules) => {
  for (const rule of profileRules) {
    if (rule.eventType === event.type) {
      const result = customMatches(rule.expression, event);
      return result;
    }
  }
};

export const compliesToProfileRule = (document = {}, customEventProfileDetectionRules = []) => {
  const validate = ajv.compile(profileDetectionRulesSchema);
  const valid = validate(customEventProfileDetectionRules);
  const detectedDocumentType = detectDocumentType(document);

  if (
    !document ||
    Object.keys(document).length === 0 ||
    !customEventProfileDetectionRules ||
    customEventProfileDetectionRules.length === 0
  ) {
    throwError(400, errorMessages.documentOrRulesEmpty);
  }

  if (valid) {
    if (detectedDocumentType === documentTypes.bareEvent) {
      return isEventCompliesToProfileRule(document, customEventProfileDetectionRules);
    }
  } else {
    throw new Error(validate.errors[0].message);
  }
  return [];
};
