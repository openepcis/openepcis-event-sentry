/**
 * (c) Copyright Reserved OpenEPCIS 2024. All rights reserved.
 * Use of this material is subject to license.
 * Copying and unauthorised use of this material strictly prohibited.
 */

import Ajv from 'ajv';
import _ from 'lodash';
import {
  detectDocumentType,
  documentTypes,
  errorMessages,
  evaluateRuleExpression,
  profileDetectionRulesSchema,
  throwError,
} from '../index';
const ajv = new Ajv();

const isEventCompliesToProfileRule = (event, profileRules) => {
  for (const rule of profileRules) {
    if (rule.eventType === event.type) {
      const result = evaluateRuleExpression(rule.expression, event);
      return result;
    }
  }
};

/**
 * Verifies if a given document adheres to a specific rule set. returns true or false.
 * 
 * @param {{}} document - document you wish to utilize for compliance with profile rules.
 * @param {[]} rules - profile detection rules used for the compliance check.
 * @returns {boolean} - returns true or false based on the compliance check.
 * @throws {Error} - throws an error if the document or rules are empty.
 */
export const compliesToProfileRule = (document = {}, rules = []) => {
  const validate = ajv.compile(profileDetectionRulesSchema);
  const valid = validate(rules);
  const detectedDocumentType = detectDocumentType(document);

  if (_.isEmpty(document) || _.isEmpty(rules)) {
    throwError(400, errorMessages.EMPTY_DOCUMENT_OR_RULES);
  }

  if (!valid) {
    throw new Error(validate.errors[0].message);
  }

  if (detectedDocumentType === documentTypes.BARE_EVENT) {
    return isEventCompliesToProfileRule(document, rules);
  }
  return [];
};
