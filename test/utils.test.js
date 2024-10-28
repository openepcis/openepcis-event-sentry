/**
 * (c) Copyright Reserved OpenEPCIS 2024. All rights reserved.
 * Use of this material is subject to license.
 * Copying and unauthorised use of this material strictly prohibited.
 */

import { describe, expect, it } from 'vitest';
import { documentTypes } from '../src/utils/constants';
import { isValueMultidimensionalArray, isValueString } from '../src/utils/commonUtils';
import {
  detectDocumentType,
  isValidEpcisDocument,
  isValidEpcisEvent,
} from '../src/utils/eventUtils';

import * as EpcisDocument from '../test/data/events/EpcisDocument.json';
import * as EpcisQueryDocument from '../test/data/events/EpcisQueryDocument.json';
import * as IncorrectBareEvent from '../test/data/events/IncorrectBareEvent.json';
import * as IncorrectEpcisDocument from '../test/data/events/IncorrectEpcisDocument.json';
import * as TransformationBareEvent from '../test/data/events/TransformationBareEvent.json';

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
    expect(detectDocumentType(EpcisDocument)).toEqual(documentTypes.EPCIS_DOCUMENT);
    expect(detectDocumentType(EpcisQueryDocument)).toEqual(documentTypes.EPCIS_QUERY_DOCUMENT);
    expect(detectDocumentType(TransformationBareEvent)).toEqual(documentTypes.BARE_EVENT);
    expect(detectDocumentType(IncorrectEpcisDocument)).toEqual(documentTypes.UNIDENTIFIED);
    expect(detectDocumentType(IncorrectBareEvent)).toEqual(documentTypes.UNIDENTIFIED);
  });
});

describe('Test case for isValueMultidimensionalArray', () => {
  it('should return true if the value is a multi-dimensional array', () => {
    expect(isValueMultidimensionalArray([['shipping', 'slaughtering'], ['receiving']])).toEqual(
      true,
    );
  });

  it('should return false if the value is not a multi-dimensional array', () => {
    expect(isValueMultidimensionalArray(['shipping', 'slaughtering', 'receiving'])).toEqual(false);
  });
});

describe('Test case for isValueString', () => {
  it('should return true if the value is a string', () => {
    expect(isValueString('shipping')).toEqual(true);
  });

  it('should return false if the value is not a string', () => {
    expect(isValueString(['shipping'])).toEqual(false);
  });
});
