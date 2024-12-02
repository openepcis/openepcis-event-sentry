# Overall Process

Imagine a process chain were raw materials are produced. These raw materials could be used in a production process for products, which are subject to regulations on the declaration of environmental impacts at individual item level.

In this scenario we focus on the production of raw materials. The corresponding EPCIS events should contain
* the CO2 equivalent (co2e) produced during this process step (as an example for enviromental impact data)
* all physical measurements of the created raw material which could be necessary to calculate the share of co2e in subsequent processes, where (parts of) the raw materials are used. This could be volume, mass, density.

# Event 01: Raw material production

**Validations to identify the process**

| Element     | Requirement     |
| ----------- | --------------- |
| eventType   | `ObjectEvent`   |
| action      | `ADD`           |
| bizStep     | `commissioning` |
| disposition | `active`        |

**Validations to verify data completeness**

1. `epcList` is _null_ or not present
2. `quantityList` contains exactly one quantityElement
    1. `epcClass` contains a valid LGTIN in URN or DL representation
    2. `uom` contains a unit of measure value referring to mass or volume. \[If that's too many values: `uom` should represent one of kg (KGM), cubic metre (MTQ) and litre (LTR), respectively\]
3. A `sensorReport` element should be present, containing a `value`, `type`and `uom` element
4. The `sensorReport.type` attribute should have on of the following values: 
    * `https://gs1.org/voc/Density` (or equivalent representation), or
    * `https://gs1.org/voc/Volume` (or equivalent representation), iff the uom in the quantityElement refers to mass (e.g. KGM), or
    * `https://gs1.org/voc/Mass` (or equivalent representation), iff the uom in the quantityElement refers to volume (e.g. LTR)
5. A `readPoint` element should be present containing an SGLN (URN)
6. If a `bizLocation` element is present, it should contain an SGLN (URN)
7. `bizTransactionList` contains at least one bizTransaction object and
    1. the `type` is `https://ref.gs1.org/cbv/BTT-prodorder` (or equivalent representation)
