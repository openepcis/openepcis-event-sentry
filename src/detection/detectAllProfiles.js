/**
 * (c) Copyright Reserved OpenEPCIS 2024. All rights reserved.
 * Use of this material is subject to license.
 * Copying and unauthorised use of this material strictly prohibited.
 */

import _ from 'lodash';
import {
  detectDocumentType,
  documentTypes,
  isPropertyKeyExists,
  isNotEmpty,
  isValidEpcisEvent,
  parseExpression,
  isPropertyWithValue,
} from '../index';

const utilMethods = {
  parseExpression,
  isValidEpcisEvent,
  detectDocumentType,
  isNotEmpty,
  isPropertyKeyExists,
  isPropertyWithValue,
};

const utilMethodMap = {};

const preprocessExpression = (expression) => {
  let utilMethodIndex = Object.keys(utilMethodMap).length;

  return expression.replace(/(\w+)\(([^)]+)\)/g, (_, functionName, args) => {
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

const processEventProfiles = (event, profileRules) => {
  const detectedEventProfiles = [];
  for (const rule of profileRules) {
    if (rule.eventType === event.type) {
      const processedExpression = customMatches(
        preprocessExpression(rule.expression),
        event,
        utilMethodMap,
      );
      const result = _.template(processedExpression)(event);
      detectedEventProfiles.push(parseExpression(result) === true ? rule.name : '');
    }
  }
  return detectedEventProfiles.filter(
    (profile, index, self) => profile !== '' && self.indexOf(profile) === index,
  );
};

const detectEpcisDocumentProfiles = (document, profileRules) => {
  return Array.isArray(document.epcisBody.eventList)
    ? document.epcisBody.eventList.map((event) => processEventProfiles(event, profileRules))
    : [];
};

const detectBareEventProfiles = (document, profileRules) => {
  return processEventProfiles(document, profileRules);
};

export const detectAllProfiles = (document = {}, eventProfileDetectionRules = []) => {
  const detectedDocumentType = detectDocumentType(document);

  if (detectedDocumentType === documentTypes.epcisDocument) {
    return detectEpcisDocumentProfiles(document, eventProfileDetectionRules);
  } else if (detectedDocumentType === documentTypes.bareEvent) {
    return detectBareEventProfiles(document, eventProfileDetectionRules);
  } else if (detectedDocumentType === documentTypes.unidentified) {
    return -1;
  }
  return [];
};
