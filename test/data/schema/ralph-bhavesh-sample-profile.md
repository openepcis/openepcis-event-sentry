# Event Profile 'Ralph's & Bhavesh's First Sample Profile'

## Set of rules

1. The EPCIS Event is an ObjectEvent.
2. The EPC List includes at least one ID.
3. The value(s) of the ID(s) in the EPCList is an/are SSCC(s).
4. If bizStep is "shipping", then bizLocation is empty.
5. The Event must include one user extension ("example:workingShift"), and its value is a numeric String (e.g. "5").
6. The namespace of the extension is "https://epcis.example.com/".
