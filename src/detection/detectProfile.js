/**
 * (c) Copyright Reserved OpenEPCIS 2024. All rights reserved.
 * Use of this material is subject to license.
 * Copying and unauthorised use of this material strictly prohibited.
 */

import _ from 'lodash';
import Ajv from 'ajv';
const ajv = new Ajv();
import {
  detectDocumentType,
  documentTypes,
  errorMessages,
  isPropertyKeyExists,
  isNotEmpty,
  isValidEpcisEvent,
  parseExpression,
  isKeyValuePairExists,
  replaceMsgParams,
  profileDetectionRulesSchema,
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

const detectEventProfiles = (event, profileRules) => {
  let detectedProfiles = [];
  for (const rule of profileRules) {
    if (rule.eventType === event.type) {
      const processedExpression = customMatches(
        preprocessExpression(rule.expression),
        event,
        utilMethodMap,
      );
      const result = _.template(processedExpression)(event);
      const profileName = parseExpression(result) === true ? rule.name : '';
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
      const processedExpression = customMatches(
        preprocessExpression(rule.expression),
        document,
        utilMethodMap,
      );
      const result = _.template(processedExpression)(document);
      detectedProfile = parseExpression(result) === true ? rule.name : '';
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
