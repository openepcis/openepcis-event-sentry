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

/**
 * Verifies if the event is valid EPCIS event or not
 *
 * @param {{}} event - EPCIS event
 * @return {boolean} - returns true of false
 */
export const isValidEpcisEvent = (event) => {
  return epcisEventTypes.includes(event.type);
};

/**
 * Verifies if valid EPCIS document or not
 *
 * @param {{}} event - EPCIS document
 * @return {boolean} - returns true of false
 */
export const isValidEpcisDocument = (document) => {
  return document.type === 'EPCISDocument';
};

/**
 * Verifies if valid EPCIS Query document or not
 *
 * @param {{}} event - EPCIS Query document
 * @return {boolean} - returns true of false
 */
export const isValidEpcisQueryDocument = (document) => {
  return document.type === 'EPCISQueryDocument';
};

/**
 * Detect the document type whether it is Epcis Document, Epcis Query Document or Bare Event
 *
 * @param {{}} event - document
 * @return {string} - returns string based on detected document type
 */
export const detectDocumentType = (document) => {
  if (isValidEpcisDocument(document)) {
    return documentTypes.EPCIS_DOCUMENT;
  } else if (isValidEpcisQueryDocument(document)) {
    return documentTypes.EPCIS_QUERY_DOCUMENT;
  } else if (isValidEpcisEvent(document)) {
    return documentTypes.BARE_EVENT;
  }
  return documentTypes.UNIDENTIFIED;
};

/**
 * Get the validated event object
 *
 * @param {boolean} isValidEvent - true if the event is validated successfully or else false
 * @param {{}} validationRule - particular rule based on event has validated
 * @return {(string|{})} - returns empty string if true or else error object if false
 */
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
