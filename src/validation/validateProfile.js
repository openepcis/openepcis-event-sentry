/**
 * (c) Copyright Reserved OpenEPCIS 2024. All rights reserved.
 * Use of this material is subject to license.
 * Copying and unauthorised use of this material strictly prohibited.
 */

import Ajv from 'ajv';
const ajv = new Ajv();
import {
  detectDocumentType,
  eventProfileValidationResult,
  documentTypes,
  isMultidimensionalArray,
  isPropertyString,
  parseExpression,
  expressionExecutor,
  profileValidationRulesSchema,
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

const validateEventProfiles = (event, profileName, profileRules) => {
  let eventProfileValidationResults = [];
  const uniqueProfiles = {};
  const filteredRules = profileRules.filter((profileRule) =>
    profileRule.eventProfile.includes(profileName),
  );
  for (const rule of filteredRules) {
    const result = customMatches(rule.expression, event);
    const validationResult = eventProfileValidationResult(result, rule);
    if (validationResult !== '' && !uniqueProfiles[rule.name]) {
      eventProfileValidationResults.push(validationResult);
      uniqueProfiles[rule.name] = true;
    }
  }
  return eventProfileValidationResults;
};

const validateEpcisDocumentProfiles = (document, profileNames, profileRules) => {
  const validationResults = [];
  if (Array.isArray(document.epcisBody.eventList)) {
    document.epcisBody.eventList.forEach((event, index) => {
      if (isMultidimensionalArray(profileNames)) {
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
  if (isPropertyString(profileNames)) {
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

export const validateProfile = (
  document = {},
  profileName = [],
  eventProfileValidationRules = [],
) => {
  const validate = ajv.compile(profileValidationRulesSchema);
  const valid = validate(eventProfileValidationRules);
  const detectedDocumentType = detectDocumentType(document);
  if (valid) {
    if (detectedDocumentType === documentTypes.epcisDocument) {
      return validateEpcisDocumentProfiles(document, profileName, eventProfileValidationRules);
    } else if (detectedDocumentType === documentTypes.bareEvent) {
      return validateBareEventProfiles(document, profileName, eventProfileValidationRules);
    } else if (detectedDocumentType === documentTypes.unidentified) {
      return -1;
    }
  } else {
    return validate.errors;
  }
  return [];
};
