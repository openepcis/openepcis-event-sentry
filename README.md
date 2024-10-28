# Background

EPCIS is a traceability event messaging standard that enables supply chain visibility through sharing event data using a common language across, between and within enterprises.

However, this standard is quite openended and it may not be obvious for business to understand and operate on top of what EPCIS provide with respect to event compliance.

Event profile concept and openepcis-event-sentry framework or SDK so to say comes handy to define event profile, custom validation rules and checking whether event conforms to the rules mapped to specific profile.

What is an event profile?

Event profile is derived from event attributes representing the unique nature of the event which is business specific and can’t be represented as EPCIS standard vocabulary.

For example, fishing, farming, and slaughtering are the event profiles derived from visibility of event type ObjectEvent containing specific information about products in their ilmd data.

- Call it a fishing profile if ILMD field in an event contains catchArea element within it
- Call it farming profile if ILMD field in an event contains countryOfOrigin element within it
- Call it a slaugtering profile if ILMD field in an event contains preStageDetails element within it.

# Installation

1. <b>Using npm (Node Package Manager):</b>

Open your terminal and execute the following command

```bash
npm install openepcis-event-sentry
```

This will download and install the library into your project's node_modules directory.

2. <b>From CDN (Content Delivery Network):</b>

If you prefer to use a CDN, include the library directly in your HTML file using a script tag:

```html
<script src="https://unpkg.com/openepcis-event-sentry@latest/dist/openepcis-event-sentry.browser.js"></script>
```

# Example Usage

The following sections provides with sample usages of various features of SDK

## Define Event Profile Rule

Event profile is a combination of many rules. 
For example, a business can consider an ObjectEvent valid only when it meets the below criteria.

1. The EPCIS Event is an ObjectEvent.
2. The EPC List includes at least one ID.
3. The value(s) of the ID(s) in the EPCList is an/are SSCC(s).
4. If bizStep is "shipping", then bizLocation is empty.
5. The Event must include one user extension ("example:workingShift"), and its value is a numeric String (e.g. "5").
6. The namespace of the extension is "https://epcis.example.com/".

JSON Schema is used to come up with technical representation of the above rules which can later be used by frameworks for validation purpose.
Here is the JSON Schema of above rules.

Learn more about JSON schema from [here](https://json-schema.org/).

```javascript
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "allOf": [
    {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "type": "object",
      "properties": {
        "@context": {
          "type": "array",
          "items": {
            "oneOf": [
              {
                "type": "string"
              },
              {
                "type": "object",
                "patternProperties": {
                  "^[a-zA-Z0-9]+$": {
                    "type": "string",
                    "const": "http://ns.example.com/epcis/"
                  }
                },
                "additionalProperties": true
              }
            ]
          },
          "minItems": 1
        },
        "type": {
          "type": "string",
          "enum": [
            "ObjectEvent"
          ]
        },
        "action": {
          "type": "string"
        },
        "bizStep": {
          "type": "string"
        },
        "epcList": {
          "type": "array",
          "items": {
            "type": "string",
            "pattern": "/00/"
          },
          "minItems": 1,
          "uniqueItems": true
        },
        "example:workingShift": {
          "type": "string",
          "pattern": "^[0-9]+$"
        }
      },
      "required": [
        "epcList",
        "type",
        "bizStep",
        "@context",
        "example:workingShift"
      ],
      "if": {
        "properties": {
          "bizStep": {
            "const": "shipping"
          }
        }
      },
      "then": {
        "properties": {
          "bizLocation": {
            "maxProperties": 0
          }
        }
      },
      "additionalProperties": true
    }
  ]
}
```

## Check event complies to the rule

TBD

# Contribute

We welcome your contributions to openepcis-event-sentry! Here are some ways you can get involved:

- Bug Fixes: Identify and report any bugs you encounter.
- Feature Requests: Suggest new features that would benefit the project.
- Pull Requests: Submit code changes that address issues or add functionality.
- Documentation: Help improve the project's documentation by providing corrections or suggestions.
