/**
 * (c) Copyright Reserved OpenEPCIS 2024. All rights reserved.
 * Use of this material is subject to license.
 * Copying and unauthorised use of this material strictly prohibited.
 */

import { describe, expect, it } from 'vitest';
import {
  TransformationBareEvent,
  detectAllProfiles,
  IncorrectBareEvent,
  IncorrectEpcisDocument,
  EpcisDocument,
  CustomEpcisDocument,
  customProfileRules,
  eventProfileDetectionRules,
  detectProfile,
  EpcisDocument2,
} from '../src/index';

describe('Test case for detecting event profile', () => {
  it('should return valid event profile(s) for the bare event using detectAllProfiles', () => {
    expect(detectAllProfiles(TransformationBareEvent, eventProfileDetectionRules)).toEqual([
      'transforming',
    ]);
  });

  it('should return valid event profile(s) for multiple EPCIS event(s) using detectAllProfiles', () => {
    expect(detectAllProfiles(EpcisDocument2, eventProfileDetectionRules)).toEqual([
      ['transforming'],
      ['farming'],
      ['farming', 'fishing'],
      ['slaughtering'],
    ]);
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
