/**
 * (c) Copyright Reserved OpenEPCIS 2024. All rights reserved.
 * Use of this material is subject to license.
 * Copying and unauthorised use of this material strictly prohibited.
 */

import { describe, expect, it } from 'vitest';
import * as TransformationBareEvent from '../test/data/TransformationBareEvent.json';
import * as IncorrectBareEvent from '../test/data/IncorrectBareEvent.json';
import * as EpcisDocument from '../test/data/EpcisDocument.json';
import * as IncorrectEpcisDocument from '../test/data/IncorrectEpcisDocument.json';
import {
  isValidEpcisEvent,
  isValidEpcisDocument,
  detectDocumentType,
  isNotEmpty,
  isPropertyKeyExists,
  isKeyValuePairExists,
} from '../src/utils/eventUtils';
import { documentTypes } from '../src/utils/constants';

const event = {
  type: 'EPCISDocument',
  epcisBody: {
    eventList: [
      {
        type: 'ObjectEvent',
        bizTransactionList: [],
        bizStep: 'receiving',
      },
    ],
  },
};

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

describe('Test case for isNotEmpty', () => {
  it('should return true if the property is not empty', () => {
    expect(isNotEmpty(event, 'type')).toEqual(true);
  });

  it('should return false if the property is empty', () => {
    expect(isNotEmpty(event, 'bizTransactionList')).toEqual(false);
  });
});

describe('Test case for isPropertyKeyExists', () => {
  it('should return true if the property key exists', () => {
    expect(isPropertyKeyExists(event, 'type')).toEqual(true);
  });

  it('should return false if the property not exists', () => {
    expect(isNotEmpty(event, 'bizLocation')).toEqual(false);
  });
});

describe('Test case for isKeyValuePairExists', () => {
  it('should return true if the property key exists', () => {
    expect(isKeyValuePairExists(event, 'bizStep', 'receiving')).toEqual(true);
  });

  it('should return false if the property not exists', () => {
    expect(isKeyValuePairExists(event, 'bizStep', 'commissioning')).toEqual(false);
  });
});
