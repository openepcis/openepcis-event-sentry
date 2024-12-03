# Event Profile 'Fishing Event'

## Set of rules

1. The EPCIS Event is an ObjectEvent.
2. The `action` field is populated with the value "ADD".
3. The `bizStep` field is populated with the value "commissioning".
4. The `readPoint` is populated with an SGLN EPC URI (e.g. "urn:epc:id:sgln:4012345.00001.0")
5. The `quantityList` includes exactly one ID.
6. The ID in the `quantityList` is an LGTIN, expressed as an EPC Class URI (e.g. "urn:epc:class:lgtin:4012345.099914.LOT1").
7. The `quantity` field as part of the QuantityElement must be populated with a positive decimal value. 
8. The `uom` field as part of the QuantityElement must be populated with a UN/CEFACT Rec 20 value for mass (FYC, see https://github.com/gs1/UnitConverterUNECERec20/blob/master/src/UnitConverterUNECERec20.js - type "mass"), e.g. "KGM"
9. The event contains an `ilmd` field.
10. All ILMD field names are prefixed with "cbvmda".
11. Within the ILMD element, there is a `cbvmda:bestBeforeDate` field.
12. The `cbvmda:bestBeforeDate` field is filled with a proper date value.
13. Within the ILMD element, there is a `cbvmda:storageStateCode` field.
14. The `cbvmda:storageStateCode` field is filled with a corresponding code value according to https://navigator.gs1.org/gdsn/class-details?name=StorageStateCode&version=12 (e.g. "PREVIOUSLY_FROZEN")
15. Within the ILMD element, there is a `cbvmda:vesselCatchInformationList` field.
16. Within the `cbvmda:vesselCatchInformationList` field, there are two sub-fields: `cbvmda:vesselID` and `cbvmda:vesselFlagState`.
17. The `cbvmda:vesselID` field is filled with a string value.
18. The `cbvmda:vesselFlagState` field is filled with a ISO 3166-1 alpha-2 code value (e.g. "DE").
