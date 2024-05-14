/**
 * (c) Copyright Reserved OpenEPCIS 2024. All rights reserved.
 * Use of this material is subject to license.
 * Copying and unauthorised use of this material strictly prohibited.
 */

/**
 * Replaces placeholder parameters in the original message string with provided values.
 *
 * @param {string} origMsg - The original message string containing placeholder parameters.
 * @param {...any} params - Values to replace the placeholder parameters in the message.
 * @returns {string} - The updated message string with placeholders replaced by values.
 */
export const replaceMsgParams = (origMsg, ...params) => {
  let msg = origMsg;
  params.forEach((param, idx) => (msg = msg.replace(new RegExp(`\\{${idx}\\}`, 'ig'), param)));
  return msg;
};

/**
 * Checks whether the given property is multi-dimensional array or not.
 *
 * @param {any} property - property to check if it is a multi-dimensional array or not, e.g., [['shipping', 'slaughtering'], ['receiving']].
 * @return {boolean} - returns true of false.
 */
export const isMultidimensionalArray = (property) => {
  return property.some(Array.isArray);
};

/**
 * Checks whether whether the given property is string or not.
 *
 * @param {any} property - property to check if it is a string or not, e.g., 'transformation'.
 * @return {boolean} - returns true of false.
 */
export const isPropertyString = (property) => {
  return typeof property === 'string';
};

/**
 * Throws the custom error with status code and message.
 *
 * @param {number} statusCode - status code to assign to the error, e.g., 400.
 * @param {string} message - message to associate with the error, e.g., 'Empty document or event'.
 * @throws {Error} - Throw an error with the provided status code and message.
 */
export const throwError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  throw error;
};

/**
 * Throws the custom error with custom code and message array.
 *
 * @param {number} statusCode - status code to assign to the error, e.g., 400.
 * @param {string} message - message to associate with the error, e.g.,
 * [
    {
      index: 2,
      errors: [
        {
          name: 'agricultureDetailsInIlmdExists_Rule',
          eventProfile: ['slaughtering'],
          errorMessage: 'agricultureDetails is not exists',
          warning: 'agricultureDetails is not exists',
          field: 'agricultureDetails',
        },
      ],
    },
  ],
 * @throws {Error} - Throw an error with the provided status code and message.
 */
export const throwArrayError = (statusCode, message) => {
  const error = new Error();
  error.statusCode = statusCode;
  error.message = JSON.stringify(message, null, 2);
  throw error;
};
