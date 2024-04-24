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
  eventProfileValidationResult,
  documentTypes,
} from '../index';

const utilMethods = {
  parseExpression,
  isValidEpcisEvent,
  detectDocumentType,
  isNotEmpty,
  isPropertyKeyExists,
  isKeyValuePairExists,
  replaceMsgParams,
  eventProfileValidationResult,
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

const validateEventProfiles = (event, profileName, profileRules) => {
  let eventProfileValidationResults = [];
  const uniqueProfiles = {};
  const filteredRules = profileRules.filter((r) => r.eventProfile.includes(profileName));
  for (const rule of filteredRules) {
    const processedExpression = customMatches(
      preprocessExpression(rule.expression),
      event,
      utilMethodMap,
    );
    const result = _.template(processedExpression)(event);
    const validationResult = eventProfileValidationResult(parseExpression(result), rule);

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
      const profileName = profileNames[index];
      const eventValidationResults = validateEventProfiles(event, profileName, profileRules);
      if (eventValidationResults.length > 0) {
        validationResults.push([{ index: index + 1, errors: eventValidationResults }]);
      }
    });
  }
  return validationResults;
};

const validateBareEventProfiles = (document, profileNames, profileRules) => {
  const validationResults = [];
  const profileName = profileNames[0];
  const eventValidationResults = validateEventProfiles(document, profileName, profileRules);
  if (eventValidationResults.length > 0) {
    validationResults.push({ index: 1, errors: eventValidationResults });
  }
  return validationResults;
};

export const validateProfile = (
  document = {},
  profileName = [],
  eventProfileValidationRules = [],
) => {
  if (document && profileName && eventProfileValidationRules) {
    const detectedDocumentType = detectDocumentType(document);
    if (detectedDocumentType === documentTypes.epcisDocument) {
      return validateEpcisDocumentProfiles(document, profileName, eventProfileValidationRules);
    } else if (detectedDocumentType === documentTypes.bareEvent) {
      return validateBareEventProfiles(document, profileName, eventProfileValidationRules);
    } else if (detectedDocumentType === documentTypes.unidentified) {
      return -1;
    }
  }
  return [];
};
