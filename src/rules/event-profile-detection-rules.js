/**
 * (c) Copyright Reserved OpenEPCIS 2024. All rights reserved.
 * Use of this material is subject to license.
 * Copying and unauthorised use of this material strictly prohibited.
 */

export const eventProfileDetectionRules = [
  {
    name: 'transforming',
    eventType: 'TransformationEvent',
    expression:
      '!_.isEmpty(event.transformationID) && !_.isEmpty(event.inputQuantityList) && !_.isEmpty(event.outputQuantityList)',
  },
  {
    name: 'farming',
    eventType: 'ObjectEvent',
    expression: `_.has(event,'ilmd.cbvmda:countryOfOrigin')`,
  },
  {
    name: 'fishing',
    eventType: 'ObjectEvent',
    expression: `_.has(event,'ilmd.content.vesselCatchInformation.catchArea') && _.has(event,'ilmd.content.vesselCatchInformation')`,
  },
  {
    name: 'slaughtering',
    eventType: 'ObjectEvent',
    expression: `_.has(event,'ilmd.content.preStageDetails[0].agricultureDetails')`,
  },
];
