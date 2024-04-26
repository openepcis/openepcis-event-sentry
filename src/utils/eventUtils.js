/**
 * (c) Copyright Reserved OpenEPCIS 2024. All rights reserved.
 * Use of this material is subject to license.
 * Copying and unauthorised use of this material strictly prohibited.
 */

import { documentTypes } from '../index';

//Epcis event types
const epcisEventTypes = [
  'ObjectEvent',
  'AggregationEvent',
  'TransactionEvent',
  'TransformationEvent',
  'AssociationEvent',
];

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

//Function to detect the document type whether it is Epcis Document or Bare Event
export const detectDocumentType = (document) => {
  if (isValidEpcisDocument(document)) {
    return documentTypes.epcisDocument;
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

//Function to check if the property is empty or not
export const isNotEmpty = (object, property) => {
  if (typeof object !== 'object' || object === null) {
    return false;
  }

  if (Array.isArray(object[property])) {
    return object[property].length > 0;
  } else if (
    typeof object[property] === 'object' &&
    !Array.isArray(object[property]) &&
    Object.keys(object[property]).length > 0
  ) {
    return true;
  } else if (
    object[property] !== '' &&
    object[property] !== undefined &&
    object[property] !== null
  ) {
    return true;
  }

  for (const key in object) {
    if (isNotEmpty(object[key], property)) {
      return true;
    }
  }

  return false;
};

//Function to check whether the key exists in the object or not
export const isPropertyKeyExists = (object, propertyKey) => {
  if (!object || typeof object !== 'object') {
    return false;
  }

  const jsonString = JSON.stringify(object);
  const parsedObject = JSON.parse(jsonString);

  if (propertyKey in parsedObject) {
    return true;
  }

  const keys = Object.keys(parsedObject);
  for (const key of keys) {
    if (typeof parsedObject[key] === 'object') {
      if (isPropertyKeyExists(parsedObject[key], propertyKey)) {
        return true;
      }
    }
  }

  return false;
};

//Function to check whether the given value matches with actual value of the given key or not
export const isKeyValuePairExists = (object, propertyKey, value) => {
  const jsonString = JSON.stringify(object);
  const parsedObject = JSON.parse(jsonString);

  if (parsedObject[propertyKey] === value) {
    return true;
  }

  const keys = Object.keys(parsedObject);
  for (const key of keys) {
    if (typeof parsedObject[key] === 'object') {
      if (isKeyValuePairExists(parsedObject[key], propertyKey, value)) {
        return true;
      }
    }
  }

  return false;
};
