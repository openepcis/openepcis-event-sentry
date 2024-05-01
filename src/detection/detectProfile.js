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
  parseExpression,
  replaceMsgParams,
  expressionExecutor,
  profileDetectionRulesSchema,
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

const detectEventProfiles = (event, profileRules) => {
  let detectedProfiles = [];
  for (const rule of profileRules) {
    if (rule.eventType === event.type) {
      const result = customMatches(rule.expression, event);
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

const detectEpcisDocumentProfiles = (document, profileRules) => {
  let detectedProfiles = [];
  if (Array.isArray(document.epcisBody.eventList)) {
    document.epcisBody.eventList.forEach((event) => {
      const profiles = detectEventProfiles(event, profileRules);
      if (profiles.length > 1) {
        throw new Error(replaceMsgParams(errorMessages.multipleProfilesDetected, event.type));
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
      const result = customMatches(rule.expression, document);
      detectedProfile = result === true ? rule.name : '';
      break;
    }
  }
  return detectedProfile;
};

export const detectProfile = (document = {}, customEventProfileDetectionRules = []) => {
  const validate = ajv.compile(profileDetectionRulesSchema);
  const valid = validate(customEventProfileDetectionRules);
  const detectedDocumentType = detectDocumentType(document);
  if (valid) {
    if (detectedDocumentType === documentTypes.epcisDocument) {
      return detectEpcisDocumentProfiles(document, customEventProfileDetectionRules);
    } else if (detectedDocumentType === documentTypes.bareEvent) {
      return detectBareEventProfile(document, customEventProfileDetectionRules);
    } else if (detectedDocumentType === documentTypes.unidentified) {
      return -1;
    }
  } else {
    return validate.errors;
  }
  return [];
};
