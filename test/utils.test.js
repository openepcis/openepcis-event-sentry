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
  expressionExecutor,
  sanitizeInput,
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

describe('Test case for sanitizeInput', () => {
  it('should return empty string the script tag included in the expression', () => {
    expect(sanitizeInput('<script>onerror=alert;throw 1&</script>')).toEqual('');
  });

  it('should return string as it is if the script tag is not included in the expression', () => {
    expect(sanitizeInput(`_.get(event,'epcisBody.eventList[0].bizStep')`)).toEqual(
      `_.get(event,'epcisBody.eventList[0].bizStep')`,
    );
  });
});

describe('Test case for lodashExpressionExecutor', () => {
  it('should return true if the lodash expression is correct', () => {
    expect(
      expressionExecutor(
        `_.isEqual(_.get(event,'epcisBody.eventList[0].bizStep'),'receiving')`,
        event,
      ),
    ).toEqual(true);
  });

  it('should return false if the lodash expression is incorrect', () => {
    expect(
      expressionExecutor(
        `_.isEqual(_.get(event,'epcisBody.eventList[0].bizStep'),'sending')`,
        event,
      ),
    ).toEqual(false);
  });

  it('should return true if the non-lodash expression is correct', () => {
    expect(
      expressionExecutor("event.epcisBody.eventList[0].bizStep === 'receiving'", event),
    ).toEqual(true);
  });

  it('should return false if the non-lodash expression is incorrect', () => {
    expect(expressionExecutor("event.epcisBody.eventList[0].bizStep === 'sending'", event)).toEqual(
      false,
    );
  });

  it('should return undefined if the lodash expression is invalid', () => {
    expect(
      expressionExecutor(`_.isEqual(get(event,'epcisBody.eventList[0].bizStep'),'sending')`, event),
    ).toEqual(undefined);
  });

  it('should return undefined if the expression is empty', () => {
    expect(expressionExecutor('', event)).toEqual(undefined);
  });
});
