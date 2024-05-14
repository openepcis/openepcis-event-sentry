/**
 * (c) Copyright Reserved OpenEPCIS 2024. All rights reserved.
 * Use of this material is subject to license.
 * Copying and unauthorised use of this material strictly prohibited.
 */

export const documentTypes = {
  EPCIS_DOCUMENT: 'Epcis Document',
  EPCIS_QUERY_DOCUMENT: 'EPCIS Query Document',
  BARE_EVENT: 'Bare Event',
  UNIDENTIFIED: 'Unidentified',
};

export const errorMessages = {
  MULTIPLE_PROFILE_DETECTED: 'Multiple profiles detected for the {0}',
  EMPTY_DOCUMENT_OR_RULES: 'Document or rules should not be empty',
  EMPTY_DOCUMENT_OR_PROFILE_OR_RULES: 'Document or profiles or rules should not be empty',
  INVALID_EPCIS_OR_BARE_EVENT: 'Invalid EPCIS document or bare event',
};
