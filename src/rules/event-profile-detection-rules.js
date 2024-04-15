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
      'isNotEmpty(event,transformationID) && isNotEmpty(event,inputQuantityList) && isNotEmpty(event,outputQuantityList)',
  },
  {
    name: 'farming',
    eventType: 'ObjectEvent',
    expression: 'isPropertyKeyExists(event,cbvmda:countryOfOrigin)',
  },
  {
    name: 'fishing',
    eventType: 'ObjectEvent',
    expression:
      'isPropertyKeyExists(event,catchArea) && isPropertyKeyExists(event,vesselCatchInformation)',
  },
  {
    name: 'slaughtering',
    eventType: 'ObjectEvent',
    expression: 'isPropertyKeyExists(event,agricultureDetails)',
  },
];
