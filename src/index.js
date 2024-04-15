/**
 * (c) Copyright Reserved OpenEPCIS 2024. All rights reserved.
 * Use of this material is subject to license.
 * Copying and unauthorised use of this material strictly prohibited.
 */

export * from './utils/eventUtils';
export * from './utils/constants';

export * as TransformationBareEvent from '../test/data/TransformationBareEvent.json';
export * as IncorrectBareEvent from '../test/data/IncorrectBareEvent.json';
export * as EpcisDocument from '../test/data/EpcisDocument.json';
export * as EpcisDocument2 from '../test/data/EpcisDocument2.json';
export * as EpcisDocument3 from '../test/data/EpcisDocument3.json';
export * as IncorrectEpcisDocument from '../test/data/IncorrectEpcisDocument.json';
export * as CustomEpcisDocument from '../test/data/CustomEpcisDocument.json';
export { customProfileRules } from '../test/data/custom-profile-rules';
export { eventProfileDetectionRules } from './rules/event-profile-detection-rules';
export { eventProfileValidationRules } from './rules/event-profile-validation-rules';
export * from '../test/data/validationRulesResponse';

export { detectAllProfiles } from './detection/detectAllProfiles';
export { detectProfile } from './detection/detectProfile';
export { validateProfile } from './validation/validateProfile';
