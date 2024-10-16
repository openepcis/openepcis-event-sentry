/**
 * (c) Copyright Reserved OpenEPCIS 2024. All rights reserved.
 * Use of this material is subject to license.
 * Copying and unauthorised use of this material strictly prohibited.
 */

import Ajv from 'ajv';
import _ from 'lodash';

import { errorMessages, throwError } from '../index';
import epcisSchema from '../epcis/epcis-json-schema.json';

export const validate = (document = {}, schema = {}) => {

  if (_.isEmpty(document)) {
    throwError(400, errorMessages.EMPTY_DOCUMENT);
  }
  if (_.isEmpty(schema)) {
    throwError(400, errorMessages.EMPTY_JSON_SCHEMA);
  }

  const ajv = new Ajv({ allErrors: true, strict: false });

  // Pre-load external schema
  ajv.addSchema(epcisSchema);

  const validateFn = ajv.compile(schema);
  const valid = validateFn(document);

  if (valid) {
    return { success: true, message: 'Event is valid.' };
  } else {
    const detailedErrors = validateFn.errors.map((error) => {
      return {
        field: error.instancePath || '(root)', // If no path, it means the root of the object is incorrect
        message: error.message,
        params: error.params, // Optional: include extra error parameters like 'missingProperty'
      };
    });

    return {
      success: false,
      message: 'Invalid Event',
      errors: detailedErrors, // Return specific validation errors
    };
  }
};
