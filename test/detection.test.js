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
import { customProfileRules } from '../test/data/custom-profile-rules';
import { eventProfileDetectionRules } from '../src/rules/event-profile-detection-rules';
import { detectAllProfiles } from '../src/detection/detectAllProfiles';
import { detectProfile } from '../src/detection/detectProfile';
import { compliesToProfileRule } from '../src';

const correctProfileRule = [
  {
    name: 'transforming',
    eventType: 'TransformationEvent',
    expression:
      'isNotEmpty(event,transformationID) && isNotEmpty(event,inputQuantityList) && isNotEmpty(event,outputQuantityList)',
  },
];

const incorrectProfileRule = [
  {
    name: 'transforming',
    eventType: 'TransformationEvent',
    expression:
      '!isNotEmpty(event,transformationID) && isNotEmpty(event,inputQuantityList) && isNotEmpty(event,outputQuantityList)',
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
});

describe('Test case for the document', () => {
  it('should return -1 if the document is empty', () => {
    expect(detectAllProfiles()).toEqual(-1);
  });

  describe('Test case for the bare event', () => {
    it('should return -1 if the event type is incorrect in the bare event using detectAllProfiles', () => {
      expect(detectAllProfiles(IncorrectBareEvent, eventProfileDetectionRules)).toEqual(-1);
    });
  });

  describe('Test case for the EPCIS document', () => {
    it('should return -1 if the EPCIS document is not valid using detectAllProfiles', () => {
      expect(detectAllProfiles(IncorrectEpcisDocument, eventProfileDetectionRules)).toEqual(-1);
    });
  });
});

describe('Test case for the compiles event to profile rule', () => {
  it('should return true if the event successfully compiles to the profile rule', () => {
    expect(compliesToProfileRule(TransformationBareEvent, correctProfileRule)).toEqual(true);
  });

  it('should return fase if the event not compiles to the profile rule', () => {
    expect(compliesToProfileRule(TransformationBareEvent, incorrectProfileRule)).toEqual(false);
  });
});
