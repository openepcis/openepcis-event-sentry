/**
 * (c) Copyright Reserved OpenEPCIS 2024. All rights reserved.
 * Use of this material is subject to license.
 * Copying and unauthorised use of this material strictly prohibited.
 */

import { describe, expect, it } from 'vitest';
import { errorMessages } from '../src';
import validEvent from './valid-event.json';
import invalidEvent from './invalid-event.json';
import * as schema from './schema-for-all.json';
import { validate } from '../src/validation/validator';

describe('Test case for validating bare events', () => {
  it('should throw error if the document is empty', () => {
    expect(() => validate({})).toThrowError(errorMessages.EMPTY_DOCUMENT);
  });

  it('should throw error if the schema is empty', () => {
    expect(() => validate(validEvent, {})).toThrowError(errorMessages.EMPTY_JSON_SCHEMA);
  });

  it('valid event', () => {
    const response = validate(validEvent, schema);
    expect(response.success).toBe(true);
    expect(response.message).toBe('Event is valid.');
  });

  it('invalid event', () => {
    const response = validate(invalidEvent, schema);
    expect(response.success).toBe(false);
    expect(response.message).toBe('Invalid Event');
    expect(response.errors.length).toBe(5);
  });
});
