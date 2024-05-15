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

const processEventProfiles = (event, profileRules) => {
  const detectedEventProfiles = [];
  for (const rule of profileRules) {
    if (rule.eventType === event.type) {
      const result = evaluateRuleExpression(rule.expression, event);
      detectedEventProfiles.push(result === true ? rule.name : '');
    }
  }
  return detectedEventProfiles.filter(
    (profile, index, self) => profile !== '' && self.indexOf(profile) === index,
  );
};

const detectDocumentProfiles = (profileRules, eventPath) => {
  return Array.isArray(eventPath)
    ? eventPath.map((event) => processEventProfiles(event, profileRules))
    : [];
};

/**
 * Analyzes the event against the provided rules and returns event profile(s).
 *
 * @param {{}} document - document you wish to utilize for profile detection
 * @param {[]} rules - profile detection rules upon which you base the detection of the profile.
 * @returns {(string[]|string[[]])} - returns detected event profiles. It can be a single or multiple profiles.
 * @throws {Error} - throws an error if the document or rules are empty.
 */
export const detectAllProfiles = (document = {}, rules = []) => {
  if (_.isEmpty(document) || _.isEmpty(rules)) {
    throwError(400, errorMessages.EMPTY_DOCUMENT_OR_RULES);
  }

  const validate = ajv.compile(profileDetectionRulesSchema);
  const valid = validate(rules);

  if (!valid) {
    throw new Error(validate.errors[0].message);
  }

  const detectedDocumentType = detectDocumentType(document);
  let eventPath = '';

  if (detectedDocumentType === documentTypes.EPCIS_DOCUMENT) {
    eventPath = document.epcisBody.eventList;
    return detectDocumentProfiles(rules, eventPath);
  } else if (detectedDocumentType === documentTypes.EPCIS_QUERY_DOCUMENT) {
    eventPath = document.epcisBody.queryResults.resultsBody.eventList;
    return detectDocumentProfiles(rules, eventPath);
  } else if (detectedDocumentType === documentTypes.BARE_EVENT) {
    return processEventProfiles(document, rules);
  } else if (detectedDocumentType === documentTypes.UNIDENTIFIED) {
    throwError(400, errorMessages.INVALID_EPCIS_OR_BARE_EVENT);
  }
  return [];
};
