/**
 * (c) Copyright Reserved OpenEPCIS 2024. All rights reserved.
 * Use of this material is subject to license.
 * Copying and unauthorised use of this material strictly prohibited.
 */

import { documentTypes } from '../index';
import _ from 'lodash';

//Epcis event types
const epcisEventTypes = [
  'ObjectEvent',
  'AggregationEvent',
  'TransactionEvent',
  'TransformationEvent',
  'AssociationEvent',
];

//schema to validate the profile detection rules
export const profileDetectionRulesSchema = {
  type: 'array',
  items: {
    type: 'object',
    required: ['name', 'eventType', 'expression'],
    properties: {
      name: { type: 'string' },
      eventType: {
        type: 'string',
        enum: [
          'ObjectEvent',
          'AggregationEvent',
          'TransactionEvent',
          'TransformationEvent',
          'AssociationEvent',
        ],
      },
      expression: { type: 'string' },
    },
  },
};

//schema to validate the profile validation rules rules
export const profileValidationRulesSchema = {
  type: 'array',
  items: {
    type: 'object',
    required: ['name', 'eventProfile', 'expression', 'errorMessage', 'warning', 'field'],
    properties: {
      name: { type: 'string' },
      eventType: { type: 'array' },
      expression: { type: 'string' },
      errorMessage: { type: 'string' },
      warning: { type: 'string' },
      field: { type: 'string' },
    },
  },
};

//Function to evaluate the string expression
export const parseExpression = (expression) => {
  const tokens = expression.match(/\S+/g) || [];
  let result = true;
  let operator = '&&';
  for (const token of tokens) {
    if (token === '||' || token === '&&') {
      operator = token;
    } else {
      const value = token === 'true';
      result = operator === '&&' ? result && value : result || value;
    }
  }
  return result;
};

//Function to check epcis event is valid or not
export const isValidEpcisEvent = (event) => {
  return epcisEventTypes.includes(event.type);
};

//Function to check if valid epcis document or not
export const isValidEpcisDocument = (document) => {
  return document.type === 'EPCISDocument';
};

//Function to check if valid epcis query document or not
export const isValidEpcisQueryDocument = (document) => {
  return document.type === 'EPCISQueryDocument';
};

//Function to detect the document type whether it is Epcis Document or Bare Event
export const detectDocumentType = (document) => {
  if (isValidEpcisDocument(document)) {
    return documentTypes.epcisDocument;
  } else if (isValidEpcisQueryDocument(document)) {
    return documentTypes.epcisQueryDocument;
  } else if (isValidEpcisEvent(document)) {
    return documentTypes.bareEvent;
  }
  return documentTypes.unidentified;
};

//Function to replace the message parameters
export const replaceMsgParams = (origMsg, ...params) => {
  let msg = origMsg;
  params.forEach((param, idx) => (msg = msg.replace(new RegExp(`\\{${idx}\\}`, 'ig'), param)));
  return msg;
};

//Function to get the validated event object
export const eventProfileValidationResult = (isValidEvent, validationRule) => {
  const failureEventObject = {
    name: validationRule.name,
    eventProfile: validationRule.eventProfile,
    errorMessage: validationRule.errorMessage,
    warning: validationRule.warning,
    field: validationRule.field,
  };

  return isValidEvent === true ? '' : failureEventObject;
};

//Function to check whether the given property is multi-dimensional array or not
export const isMultidimensionalArray = (property) => {
  return property.some(Array.isArray);
};

//Function to check whether the given property is string or not
export const isPropertyString = (property) => {
  return typeof property === 'string';
};

//Function to throw the custom error
export const throwError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  throw error;
};

//Function to throw the custom error array
export const throwArrayError = (statusCode, message) => {
  const error = new Error();
  error.statusCode = statusCode;
  error.message = JSON.stringify(message, null, 2);
  throw error;
};

//Function to sanitize the expression
export const sanitizeInput = (expression) => {
  return expression.replace(/<script[^>]*>.*?<\/script>|<\/?[^>]+>|on\w+="[^"]*"|&/g, '');
};

//Function to execute the expression eg. lodash methods
export const expressionExecutor = (expression, context) => {
  const sandbox = {};
  const sanitizedExpression = sanitizeInput(expression);
  sandbox._ = _;
  sandbox.event = context;
  try {
    const evaluator = new Function('with(this) { return ' + sanitizedExpression + '; }');
    return evaluator.call(sandbox);
  } catch {
    return undefined;
  }
};
