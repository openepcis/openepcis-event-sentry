/**
 * (c) Copyright Reserved OpenEPCIS 2024. All rights reserved.
 * Use of this material is subject to license.
 * Copying and unauthorised use of this material strictly prohibited.
 */

export const queryDocumentDetectionRulesForSlaughtering = [
  {
    name: 'shipping',
    eventType: 'ObjectEvent',
    expression: `_.isEqual(_.get(event, 'disposition'), 'in_transit') && _.isEqual(_.get(event, 'bizStep'), 'shipping')`,
  },
  {
    name: 'receiving',
    eventType: 'ObjectEvent',
    expression: `_.isEqual(_.get(event, 'disposition'), 'in_progress') && _.isEqual(_.get(event, 'bizStep'), 'receiving')`,
  },
  {
    name: 'slaughtering',
    eventType: 'ObjectEvent',
    expression: `_.isEqual(_.get(event, 'bizTransactionList[0].type'), 'po')`,
  },
];
