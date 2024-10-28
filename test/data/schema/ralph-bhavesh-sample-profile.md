## Rule for defining event profile "ralph-bhavesh-sample-profile". 

1. The EPCIS Event is an ObjectEvent.
2. The EPC List includes at least one ID.
3. The value(s) of the ID(s) in the EPCList is an/are SSCC(s).
4. If bizStep is "shipping", then bizLocation is empty.
5. The Event must include one user extension ("example:workingShift"), and its value is a numeric String (e.g. "5").
6. The namespace of the extension is "https://epcis.example.com/".

## TBD: Prepare guidelines for defining event profile rules possibly as a separate md file.

- This document contains rules in plain English most likely prepared by domain or SMEs
- Such rules makes it easy for a developer or technical person to define event profiles in terms of JSON schema
