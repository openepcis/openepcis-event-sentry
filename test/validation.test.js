/**
 * (c) Copyright Reserved OpenEPCIS 2024. All rights reserved.
 * Use of this material is subject to license.
 * Copying and unauthorised use of this material strictly prohibited.
 */

import { describe, expect, it } from 'vitest';
import { errorMessages } from '../src';
import { eventProfileValidationRules } from '../src/rules/event-profile-validation-rules';
import { validateProfile } from '../src/validation/validateProfile';
import * as EpcisDocumentWithMissingData from '../test/data/EpcisDocumentWithMissingData.json';
import * as EpcisQueryDocumentForValidation from '../test/data/EpcisQueryDocumentForValidation.json';
import * as IncorrectBareEvent from '../test/data/IncorrectBareEvent.json';
import * as IncorrectEpcisDocument from '../test/data/IncorrectEpcisDocument.json';
import * as TransformationBareEvent from '../test/data/TransformationBareEvent.json';
import {
  multiDimensionalProfilesEpcisDocumentResponse,
  multiDimensionalProfilesEpcisQueryDocumentResponse,
  multipleProfilesBareEventResponse,
  validationProfileEpcisDocumentResponse,
  validationProfileEpcisQueryDocumentResponse,
} from '../test/data/validationRulesResponse';

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

  it('should return error response for single event profile for single EPCIS query document event if the event is not validated successfully', () => {
    expect(
      validateProfile(
        EpcisQueryDocumentForValidation,
        ['transforming', 'slaughtering'],
        eventProfileValidationRules,
      ),
    ).toEqual(validationProfileEpcisQueryDocumentResponse);
  });

  it('should return error response for single or multiple event profile(s) for single EPCIS query document event if the event is not validated successfully', () => {
    expect(
      validateProfile(
        EpcisQueryDocumentForValidation,
        [['transforming', 'fishing'], ['slaughtering']],
        eventProfileValidationRules,
      ),
    ).toEqual(multiDimensionalProfilesEpcisQueryDocumentResponse);
  });
});

describe('Test case for the document', () => {
  it('should throw error if the document is empty', () => {
    expect(() => validateProfile()).toThrowError(errorMessages.EMPTY_DOCUMENT_OR_PROFILE_OR_RULES);
  });

  it('should throw error if the document, profiles and rules are empty', () => {
    expect(() => validateProfile({}, [], [])).toThrowError(
      errorMessages.EMPTY_DOCUMENT_OR_PROFILE_OR_RULES,
    );
  });

  describe('Test case for the bare event', () => {
    it('should throw error if the event type is incorrect in the bare event', () => {
      expect(() =>
        validateProfile(IncorrectBareEvent, ['transforming'], eventProfileValidationRules),
      ).toThrowError(errorMessages.INVALID_EPCIS_OR_BARE_EVENT);
    });
  });

  describe('Test case for the EPCIS document', () => {
    it('should throw error if the EPCIS document is not valid', () => {
      expect(() =>
        validateProfile(IncorrectEpcisDocument, ['transforming'], eventProfileValidationRules),
      ).toThrowError(errorMessages.INVALID_EPCIS_OR_BARE_EVENT);
    });
  });
});
