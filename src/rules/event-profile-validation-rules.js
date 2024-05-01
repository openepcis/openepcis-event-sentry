/**
 * (c) Copyright Reserved OpenEPCIS 2024. All rights reserved.
 * Use of this material is subject to license.
 * Copying and unauthorised use of this material strictly prohibited.
 */

export const eventProfileValidationRules = [
  {
    name: 'transformationID_Rule',
    expression: `!_.isEmpty(event.transformationID)`,
    eventProfile: ['transforming'],
    order: 1,
    errorMessage: 'TransformationID malformed',
    warning: 'TransformationID should not be null or undefined',
    field: 'transformationID',
    value: 'event.transformationID',
  },
  {
    name: 'nonEmptyInputQuantityList_Rule',
    expression: '!_.isEmpty(event.inputQuantityList)',
    eventProfile: ['transforming'],
    order: 2,
    errorMessage:
      'No object ID present - Transformation Event needs to have non empty inputQuantityList',
    warning: 'Transformation Event needs to have non empty inputQuantityList',
    field: 'inputQuantityList',
    value: 'inputQuantityList is empty',
  },
  {
    name: 'nonEmptyOutputQuantityList_Rule',
    expression: '!_.isEmpty(event.outputQuantityList)',
    eventProfile: ['transforming'],
    order: 3,
    errorMessage:
      'No object ID present - Transformation Event needs to have non empty outputQuantityList',
    warning: 'Transformation Event needs to have non empty outputQuantityList',
    field: 'outputQuantityList',
    value: 'outputQuantityList is empty',
  },
  {
    name: 'catchAreaInIlmdExists_Rule',
    expression: `_.has(event,'ilmd.content.vesselCatchInformation.catchArea')`,
    eventProfile: ['fishing'],
    order: 4,
    errorMessage: 'catchArea is not exists',
    warning: 'catchArea is not exists',
    field: 'catchArea',
    value: 'catchArea Not Exists',
  },
  {
    name: 'vesselCatchInformationInIlmdExists_Rule',
    expression: `_.has(event,'ilmd.content.vesselCatchInformation')`,
    eventProfile: ['fishing'],
    order: 5,
    errorMessage: 'vesselCatchInformation is not exists',
    warning: 'vesselCatchInformation is not exists',
    field: 'vesselCatchInformation',
    value: 'vesselCatchInformation Not Exists',
  },
  {
    name: 'countryOfOriginInIlmdExists_Rule',
    expression: `_.has(event,'ilmd.cbvmda:countryOfOrigin')`,
    eventProfile: ['farming'],
    order: 6,
    errorMessage: 'countryOfOrigin is not exists',
    warning: 'countryOfOrigin is not exists',
    field: 'cbvmda:countryOfOrigin',
    value: 'countryOfOrigin Not Exists',
  },
  {
    name: 'agricultureDetailsInIlmdExists_Rule',
    expression: `_.has(event,'ilmd.content.preStageDetails[0].agricultureDetails')`,
    eventProfile: ['slaughtering'],
    order: 7,
    errorMessage: 'agricultureDetails is not exists',
    warning: 'agricultureDetails is not exists',
    field: 'agricultureDetails',
    value: 'agricultureDetails Not Exists',
  },
];
