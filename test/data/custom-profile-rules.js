/**
 * (c) Copyright Reserved OpenEPCIS 2024. All rights reserved.
 * Use of this material is subject to license.
 * Copying and unauthorised use of this material strictly prohibited.
 */

export const customProfileRules = [
  {
    name: 'observing',
    eventType: 'ObjectEvent',
    expression:
      'isPropertyWithValue(event,action,OBSERVE) && isPropertyWithValue(event,type,ObjectEvent)',
  },
];
