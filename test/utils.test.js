/**
 * (c) Copyright Reserved OpenEPCIS 2024. All rights reserved.
 * Use of this material is subject to license.
 * Copying and unauthorised use of this material strictly prohibited.
 */

import { describe, expect, it } from 'vitest';
import {
  EpcisDocument,
  IncorrectBareEvent,
  IncorrectEpcisDocument,
  TransformationBareEvent,
  detectDocumentType,
  documentTypes,
  isValidEpcisDocument,
  isValidEpcisEvent,
} from '../src/index';

describe('Test case for isValidEpcisDocument', () => {
  it('should return true if the EPCIS document is valid', () => {
    expect(isValidEpcisDocument(EpcisDocument)).toEqual(true);
  });

  it('should return false if the EPCIS document is not valid', () => {
    expect(isValidEpcisDocument(IncorrectEpcisDocument)).toEqual(false);
  });
});

describe('Test case for isValidEpcisEvent', () => {
  it('should return true if the EPCIS event is valid', () => {
    expect(isValidEpcisEvent(TransformationBareEvent)).toEqual(true);
  });

  it('should return false if the EPCIS event is not valid', () => {
    expect(isValidEpcisEvent(IncorrectBareEvent)).toEqual(false);
  });
});

describe('Test case for detectDocumentType', () => {
  it('should return the EPCIS document type', () => {
    expect(detectDocumentType(EpcisDocument)).toEqual(documentTypes.epcisDocument);
    expect(detectDocumentType(TransformationBareEvent)).toEqual(documentTypes.bareEvent);
    expect(detectDocumentType(IncorrectEpcisDocument)).toEqual(documentTypes.unidentified);
    expect(detectDocumentType(IncorrectBareEvent)).toEqual(documentTypes.unidentified);
  });
});
