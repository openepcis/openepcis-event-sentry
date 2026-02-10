# Specifications for JSON Schema EPCIS Profiles

STATUS: TO BE CONFIRMED

## Naming conventions

Concatenated string consisting of:
{issuer} + ´_´ + {document type} + ´_´ + {document acronym} + ´_´ + {document release} + ´_´ + {profile name} + ´_´ + {profile counter} + '.json'

### `Issuer`

* Organisation which defined the profile
* Up to 10 capital letters or digits

### `Document type` (non-normative)

| **Document type**  | **Definition**                    |
|:------------------:|:---------------------------------:|
| AS                 | Application Standard              |
| IG                 | Implementation Guideline          |
| CS                 | Industry Consortium Specification |
| ES                 | Enterprise Specification          |
| RD                 | Research Document                 |
| WP                 | White Paper                       |
| GP                 | Green Paper                       |

### `Document acronym`

* Up to 6 capital letters or digits

### `Document release`

* Release version, separated by "dot" to delimit e.g. major/minor/patch release, if applicable  

### `Profile name`

* alphanumeric string, consisting of up to 30 letters or digits 
* starting with an upper case
* expressed in camelcase in case it consists of several words

### `Profile counter`

* integer

### JSON Schema EPCIS Profile Name Examples (for illustration purposes only)

* “GS1_AS_FIT_1dot1_ApplyingUnitLevelUIs_1.json” (GS1, Application Standard, Fighting Illicit Trade with EPCIS Application Standard, Release 1.1, Application of unit level UIs on unit packets, Profile #1)
* “GS1DE_GP_EUDR_1dot0_OriginDeclarationEvent_2.json” (GS1 Germany, Green Paper, Green Paper: How GS1 Standards can help to meet the EU Deforestation Regulation, Release 1.0, Origin Declaration Event, Profile #2)

Files MAY be removed.
