/**
 * (c) Copyright Reserved OpenEPCIS 2024. All rights reserved.
 * Use of this material is subject to license.
 * Copying and unauthorised use of this material strictly prohibited.
 */

import { describe, expect, it } from 'vitest';
import * as TransformationBareEvent from '../test/data/TransformationBareEvent.json';
import * as IncorrectBareEvent from '../test/data/IncorrectBareEvent.json';
import * as EpcisDocumentWithMissingData from '../test/data/EpcisDocumentWithMissingData.json';
import * as IncorrectEpcisDocument from '../test/data/IncorrectEpcisDocument.json';
import { eventProfileValidationRules } from '../src/rules/event-profile-validation-rules';
import {
  multipleProfilesBareEventResponse,
  validationProfileEpcisDocumentResponse,
  multiDimensionalProfilesEpcisDocumentResponse,
} from '../test/data/validationRulesResponse';
import { validateProfile } from '../src/validation/validateProfile';

describe('Test case for validating event profile', () => {
  it('should return success response for the single string event profile for Bare event if the event is validated successfully', () => {
    expect(
      validateProfile(TransformationBareEvent, 'transforming', eventProfileValidationRules),
    ).toEqual([]);
  });

  it('should return success response for the single event profile for Bare event if the event is validated successfully', () => {
    expect(
      validateProfile(TransformationBareEvent, ['transforming'], eventProfileValidationRules),
    ).toEqual([]);
  });

  it('should return error response for the multiple event profiles for Bare event if the event is not validated successfully', () => {
    expect(
      validateProfile(
        TransformationBareEvent,
        ['transforming', 'slaughtering'],
        eventProfileValidationRules,
      ),
    ).toEqual(multipleProfilesBareEventResponse);
  });

  it('should return error response for single event profile for single EPCIS event if the event is not validated successfully', () => {
    expect(
      validateProfile(
        EpcisDocumentWithMissingData,
        ['transforming', 'slaughtering'],
        eventProfileValidationRules,
      ),
    ).toEqual(validationProfileEpcisDocumentResponse);
  });

  it('should return error response for single or multiple event profile(s) for single EPCIS event if the event is not validated successfully', () => {
    expect(
      validateProfile(
        EpcisDocumentWithMissingData,
        [['transforming', 'fishing'], ['slaughtering']],
        eventProfileValidationRules,
      ),
    ).toEqual(multiDimensionalProfilesEpcisDocumentResponse);
  });
});

describe('Test case for the document', () => {
  it('should return empty array if the document is empty', () => {
    expect(validateProfile()).toEqual(-1);
  });

  describe('Test case for the bare event', () => {
    it('should return -1 if the event type is incorrect in the bare event', () => {
      expect(
        validateProfile(IncorrectBareEvent, ['transforming'], eventProfileValidationRules),
      ).toEqual(-1);
    });
  });

  describe('Test case for the EPCIS document', () => {
    it('should return -1 if the EPCIS document is not valid', () => {
      expect(
        validateProfile(IncorrectEpcisDocument, ['transforming'], eventProfileValidationRules),
      ).toEqual(-1);
    });
  });
});
