/**
 * (c) Copyright Reserved OpenEPCIS 2024. All rights reserved.
 * Use of this material is subject to license.
 * Copying and unauthorised use of this material strictly prohibited.
 */

export const customProfileRules = [
  {
    name: 'observing',
    eventType: 'ObjectEvent',
    expression: `_.isEqual(_.get(event, 'action'), 'OBSERVE') && _.isEqual(_.get(event, 'type'), 'ObjectEvent')`,
  },
];
