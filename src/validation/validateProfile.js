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
  eventProfileValidationResult,
  isValueMultidimensionalArray,
  isValueString,
  profileValidationRulesSchema,
  throwError,
} from '../index';
const ajv = new Ajv();

const validateEventProfiles = (event, profileName, profileRules) => {
  let eventProfileValidationResults = [];
  const uniqueProfiles = {};
  const filteredRules = profileRules.filter((profileRule) =>
    profileRule.eventProfile.includes(profileName),
  );
  for (const rule of filteredRules) {
    const result = evaluateRuleExpression(rule.expression, event);
    const validationResult = eventProfileValidationResult(result, rule);
    if (validationResult !== '' && !uniqueProfiles[rule.name]) {
      eventProfileValidationResults.push(validationResult);
      uniqueProfiles[rule.name] = true;
    }
  }
  return eventProfileValidationResults;
};

const validateDocumentProfiles = (profileNames, profileRules, eventPath) => {
  const validationResults = [];
  if (Array.isArray(eventPath)) {
    eventPath.forEach((event, index) => {
      if (isValueMultidimensionalArray(profileNames)) {
        let eventValidationResults = [];
        const profilesForEvent = Array.isArray(profileNames[index])
          ? profileNames[index]
          : [profileNames[index]];
        profilesForEvent.forEach((profileName) => {
          eventValidationResults.push(validateEventProfiles(event, profileName, profileRules));
        });
        if (eventValidationResults.length > 0) {
          validationResults.push([{ index: index + 1, errors: eventValidationResults.flat() }]);
        }
      } else {
        const profileName = profileNames[index];
        const eventValidationResults = validateEventProfiles(event, profileName, profileRules);
        if (eventValidationResults.length > 0) {
          validationResults.push([{ index: index + 1, errors: eventValidationResults }]);
        }
      }
    });
  }
  return validationResults;
};

const validateBareEventProfiles = (document, profileNames, profileRules) => {
  const validationResults = [];
  if (isValueString(profileNames)) {
    const eventValidationResults = validateEventProfiles(document, profileNames, profileRules);
    if (eventValidationResults.length > 0) {
      validationResults.push({ index: 1, errors: eventValidationResults });
    }
  } else if (profileNames.length === 1) {
    const profileName = profileNames[0];
    const eventValidationResults = validateEventProfiles(document, profileName, profileRules);
    if (eventValidationResults.length > 0) {
      validationResults.push({ index: 1, errors: eventValidationResults });
    }
  } else if (profileNames.length > 1) {
    profileNames.forEach((profileName) => {
      const eventValidationResults = validateEventProfiles(document, profileName, profileRules);
      if (eventValidationResults.length > 0) {
        validationResults.push({ index: 1, errors: eventValidationResults });
      }
    });
  }
  return validationResults;
};

/**
 * Validate the event against the provided rules and returns the validation response.
 *
 * @param {{}} document - document you wish to utilize for event validation
 * @param {[]} profileName - profile name or names you wish to utlize for event validation
 * @param {[]} rules - profile detection rules upon which you base the validation of the event.
 * @returns {[]} - returns the event validation response.
 * @throws {Error} - throws an error if the document, profileName or rules are empty.
 */
export const validateProfile = (document = {}, profileName = [], rules = []) => {
  if (_.isEmpty(document) || _.isEmpty(profileName) || _.isEmpty(rules)) {
    throwError(400, errorMessages.EMPTY_DOCUMENT_OR_PROFILE_OR_RULES);
  }

  const validate = ajv.compile(profileValidationRulesSchema);
  const valid = validate(rules);

  if (!valid) {
    throw new Error(validate.errors[0].message);
  }

  const detectedDocumentType = detectDocumentType(document);
  let eventPath = '';

  if (detectedDocumentType === documentTypes.EPCIS_DOCUMENT) {
    eventPath = document.epcisBody.eventList;
    return validateDocumentProfiles(profileName, rules, eventPath);
  } else if (detectedDocumentType === documentTypes.EPCIS_QUERY_DOCUMENT) {
    eventPath = document.epcisBody.queryResults.resultsBody.eventList;
    return validateDocumentProfiles(profileName, rules, eventPath);
  } else if (detectedDocumentType === documentTypes.BARE_EVENT) {
    return validateBareEventProfiles(document, profileName, rules);
  } else if (detectedDocumentType === documentTypes.UNIDENTIFIED) {
    throwError(400, errorMessages.INVALID_EPCIS_OR_BARE_EVENT);
  }
  return [];
};
