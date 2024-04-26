/**
 * (c) Copyright Reserved OpenEPCIS 2024. All rights reserved.
 * Use of this material is subject to license.
 * Copying and unauthorised use of this material strictly prohibited.
 */

export const multipleProfilesBareEventResponse = [
  {
    index: 1,
    errors: [
      {
        name: 'agricultureDetailsInIlmdExists_Rule',
        eventProfile: ['slaughtering'],
        errorMessage: 'agricultureDetails is not exists',
        warning: 'agricultureDetails is not exists',
        field: 'agricultureDetails',
      },
    ],
  },
];

export const validationProfileEpcisDocumentResponse = [
  [
    {
      index: 1,
      errors: [
        {
          name: 'nonEmptyInputQuantityList_Rule',
          eventProfile: ['transforming'],
          errorMessage:
            'No object ID present - Transformation Event needs to have non empty inputQuantityList',
          warning: 'Transformation Event needs to have non empty inputQuantityList',
          field: 'inputQuantityList',
        },
        {
          name: 'nonEmptyOutputQuantityList_Rule',
          eventProfile: ['transforming'],
          errorMessage:
            'No object ID present - Transformation Event needs to have non empty outputQuantityList',
          warning: 'Transformation Event needs to have non empty outputQuantityList',
          field: 'outputQuantityList',
        },
      ],
    },
  ],
  [
    {
      index: 2,
      errors: [
        {
          name: 'agricultureDetailsInIlmdExists_Rule',
          eventProfile: ['slaughtering'],
          errorMessage: 'agricultureDetails is not exists',
          warning: 'agricultureDetails is not exists',
          field: 'agricultureDetails',
        },
      ],
    },
  ],
];

export const multiDimensionalProfilesEpcisDocumentResponse = [
  [
    {
      index: 1,
      errors: [
        {
          name: 'nonEmptyInputQuantityList_Rule',
          eventProfile: ['transforming'],
          errorMessage:
            'No object ID present - Transformation Event needs to have non empty inputQuantityList',
          warning: 'Transformation Event needs to have non empty inputQuantityList',
          field: 'inputQuantityList',
        },
        {
          name: 'nonEmptyOutputQuantityList_Rule',
          eventProfile: ['transforming'],
          errorMessage:
            'No object ID present - Transformation Event needs to have non empty outputQuantityList',
          warning: 'Transformation Event needs to have non empty outputQuantityList',
          field: 'outputQuantityList',
        },
        {
          name: 'catchAreaInIlmdExists_Rule',
          eventProfile: ['fishing'],
          errorMessage: 'catchArea is not exists',
          warning: 'catchArea is not exists',
          field: 'catchArea',
        },
        {
          name: 'vesselCatchInformationInIlmdExists_Rule',
          eventProfile: ['fishing'],
          errorMessage: 'vesselCatchInformation is not exists',
          warning: 'vesselCatchInformation is not exists',
          field: 'vesselCatchInformation',
        },
      ],
    },
  ],
  [
    {
      index: 2,
      errors: [
        {
          name: 'agricultureDetailsInIlmdExists_Rule',
          eventProfile: ['slaughtering'],
          errorMessage: 'agricultureDetails is not exists',
          warning: 'agricultureDetails is not exists',
          field: 'agricultureDetails',
        },
      ],
    },
  ],
];
