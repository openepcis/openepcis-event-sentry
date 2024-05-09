/**
 * (c) Copyright Reserved OpenEPCIS 2024. All rights reserved.
 * Use of this material is subject to license.
 * Copying and unauthorised use of this material strictly prohibited.
 */

import { describe, expect, it } from 'vitest';
import * as TransformationBareEvent from '../test/data/TransformationBareEvent.json';
import * as IncorrectBareEvent from '../test/data/IncorrectBareEvent.json';
import * as EpcisDocument from '../test/data/EpcisDocument.json';
import * as EpcisDocumentForSlaughteringAndFishing from '../test/data/EpcisDocumentForSlaughteringAndFishing.json';
import * as IncorrectEpcisDocument from '../test/data/IncorrectEpcisDocument.json';
import * as CustomEpcisDocument from '../test/data/CustomEpcisDocument.json';
import * as EpcisQueryDocument from '../test/data/EpcisQueryDocument.json';
import * as EpcisQueryDocumentForSingleProfile from '../test/data/EpcisQueryDocumentForSingleProfile.json';
import { customProfileRules } from '../test/data/custom-profile-rules';
import { queryDocumentDetectionRules } from '../test/data/query-document-detection-rules';
import { queryDocumentDetectionRulesForSlaughtering } from '../test/data/query-document-detection-rules-for-slaughtering';
import { eventProfileDetectionRules } from '../src/rules/event-profile-detection-rules';
import { detectAllProfiles } from '../src/detection/detectAllProfiles';
import { detectProfile } from '../src/detection/detectProfile';
import { compliesToProfileRule, errorMessages } from '../src';

const correctProfileRule = [
  {
    name: 'transforming',
    eventType: 'TransformationEvent',
    expression:
      '!_.isEmpty(event.transformationID) && !_.isEmpty(event.inputQuantityList) && !_.isEmpty(event.outputQuantityList)',
  },
];

const incorrectProfileRule = [
  {
    name: 'transforming',
    eventType: 'TransformationEvent',
    expression:
      '_.isEmpty(event.transformationID) && _.isEmpty(event.inputQuantityList) && _.isEmpty(event.outputQuantityList)',
  },
];

describe('Test case for detecting event profile', () => {
  it('should return valid event profile(s) for the bare event using detectAllProfiles', () => {
    expect(detectAllProfiles(TransformationBareEvent, eventProfileDetectionRules)).toEqual([
      'transforming',
    ]);
  });

  it('should return valid event profile(s) for multiple EPCIS event(s) using detectAllProfiles', () => {
    expect(
      detectAllProfiles(EpcisDocumentForSlaughteringAndFishing, eventProfileDetectionRules),
    ).toEqual([['transforming'], ['farming'], ['farming', 'fishing'], ['slaughtering']]);
  });

  it('should return valid event profile(s) for multiple EPCIS event(s) for EPCIS query document using detectAllProfiles', () => {
    expect(
      detectAllProfiles(EpcisQueryDocument, queryDocumentDetectionRulesForSlaughtering),
    ).toEqual([['shipping', 'slaughtering'], ['receiving']]);
  });

  it('should return valid event profile(s) for custom events and rules using detectAllProfiles', () => {
    expect(detectAllProfiles(CustomEpcisDocument, customProfileRules)).toEqual([['observing']]);
  });

  it('should return valid event profile for the bare event using detectProfile', () => {
    expect(detectProfile(TransformationBareEvent, eventProfileDetectionRules)).toEqual(
      'transforming',
    );
  });

  it('should return valid event profile for multiple EPCIS event(s) using detectProfile', () => {
    expect(detectProfile(EpcisDocument, eventProfileDetectionRules)).toEqual([
      'transforming',
      'farming',
      'fishing',
      'slaughtering',
    ]);
  });

  it('should return valid event profile for multiple EPCIS Query document event(s) using detectProfile', () => {
    expect(detectProfile(EpcisQueryDocumentForSingleProfile, queryDocumentDetectionRules)).toEqual([
      'shipping',
      'receiving',
    ]);
  });

  it('should return valid event profile for multiple EPCIS event(s) for EPCIS query document using detectProfile', () => {
    expect(detectProfile(EpcisQueryDocument, queryDocumentDetectionRules)).toEqual([
      'shipping',
      'receiving',
    ]);
  });
});

describe('Test case for the document', () => {
  it('should throw error if the document is empty', () => {
    expect(() => detectProfile()).toThrowError(errorMessages.documentOrRulesEmpty);
  });

  it('should throw an error if the document and customEventProfileDetectionRules are empty', () => {
    expect(() => detectProfile({}, [])).toThrowError(errorMessages.documentOrRulesEmpty);
  });

  it('should throw error if the document is empty', () => {
    expect(() => detectAllProfiles()).toThrowError(errorMessages.documentOrRulesEmpty);
  });

  it('should throw an error if the document and customEventProfileDetectionRules are empty', () => {
    expect(() => detectAllProfiles({}, [])).toThrowError(errorMessages.documentOrRulesEmpty);
  });

  describe('Test case for the bare event', () => {
    it('should throe error if the event type is incorrect in the bare event using detectAllProfiles', () => {
      expect(() => detectAllProfiles(IncorrectBareEvent, eventProfileDetectionRules)).toThrowError(
        errorMessages.invalidEpcisOrBareEvent,
      );
    });
  });

  describe('Test case for the EPCIS document', () => {
    it('should throw error if the EPCIS document is not valid using detectAllProfiles', () => {
      expect(() =>
        detectAllProfiles(IncorrectEpcisDocument, eventProfileDetectionRules),
      ).toThrowError(errorMessages.invalidEpcisOrBareEvent);
    });
  });
});

describe('Test case for the compiles event to profile rule', () => {
  it('should throw error if the document is empty', () => {
    expect(() => compliesToProfileRule()).toThrowError(errorMessages.documentOrRulesEmpty);
  });

  it('should throw an error if the document and customEventProfileDetectionRules are empty', () => {
    expect(() => compliesToProfileRule({}, [])).toThrowError(errorMessages.documentOrRulesEmpty);
  });

  it('should return true if the event successfully compiles to the profile rule', () => {
    expect(compliesToProfileRule(TransformationBareEvent, correctProfileRule)).toEqual(true);
  });

  it('should return fase if the event not compiles to the profile rule', () => {
    expect(compliesToProfileRule(TransformationBareEvent, incorrectProfileRule)).toEqual(false);
  });
});
