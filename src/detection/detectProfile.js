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
  replaceMsgParams,
  throwError,
} from '../index';
const ajv = new Ajv();

const detectEventProfiles = (event, profileRules) => {
  let detectedProfiles = [];
  for (const rule of profileRules) {
    if (rule.eventType === event.type) {
      const result = evaluateRuleExpression(rule.expression, event);
      const profileName = result === true ? rule.name : '';
      detectedProfiles.push(profileName);
    }
  }
  detectedProfiles = detectedProfiles.filter(
    (detectedProfile, index) =>
      detectedProfile !== '' && detectedProfiles.indexOf(detectedProfile) === index,
  );
  return detectedProfiles;
};

const detectDocumentProfiles = (profileRules, eventPath) => {
  let detectedProfiles = [];
  if (Array.isArray(eventPath)) {
    eventPath.forEach((event) => {
      const profiles = detectEventProfiles(event, profileRules);
      if (profiles.length > 1) {
        throw new Error(replaceMsgParams(errorMessages.MULTIPLE_PROFILE_DETECTED, event.type));
      }
      detectedProfiles = detectedProfiles.concat(profiles);
    });
  }
  return detectedProfiles;
};

const detectBareEventProfile = (document, profileRules) => {
  let detectedProfile = '';
  for (const rule of profileRules) {
    if (rule.eventType === document.type) {
      const result = evaluateRuleExpression(rule.expression, document);
      detectedProfile = result === true ? rule.name : '';
      break;
    }
  }
  return detectedProfile;
};

/**
 * Analyzes the event against the provided rules and returns the single most appropriate event profile.
 *
 * @param {{}} document - document you wish to utilize for profile detection
 * @param {[]} rules - profile detection rules upon which you base the detection of the profile.
 * @returns {(string|string[])} - returns detected event profiles. It Can be a single profile or an array of profiles.
 * @throws {Error} - throws an error if the document or rules are empty.
 */
export const detectProfile = (document = {}, rules = []) => {
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
    return detectBareEventProfile(document, rules);
  } else if (detectedDocumentType === documentTypes.UNIDENTIFIED) {
    throwError(400, errorMessages.INVALID_EPCIS_OR_BARE_EVENT);
  }
  return [];
};
