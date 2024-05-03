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

Profile definition contains name, eventType, and expression/rule that evaluates the event to be called that profile.

Sample definition of event profile "transforming"

```javascript
{
  "name": "transforming",
  "eventType": "TransformationEvent",
  "expression": "!_.isEmpty(event.transformationID)"
}
```

Note: The expression syntax in this example utilizes the function from the Lodash library. For comprehensive documentation and information on all available Lodash functions, please refer to the official Lodash documentation: 

1. [https://lodash.com/](https://lodash.com/)
2. [https://lodash.com/docs/4.17.15](https://lodash.com/docs/4.17.15)
3. [https://github.com/lodash/lodash](https://github.com/lodash/lodash)

## Check Profile of an EPCIS event

The SDK empowers you to define custom event profile rules, allowing you to tailor event evaluation to your specific needs, catering to various use cases:

1. Single event profile detection

The function analyzes the event against the provided rules and returns the single most appropriate event profile.

```javascript
import { detectProfile } from 'openepcis-event-sentry';
```

Syntax:

```javascript
/*
  1. event: The event you wish to utilize for profile detection, for example, a bare event or an EPCIS document.
  2. rules: Profile detection rules upon which you base the detection of the profile.
*/
detectProfile(event, rules);
```

Example:

```javascript
//Single profile detection using bare event
const bareEventProfile = detectProfile(bareEvent, customProfileRules);
console.log(bareEventProfile); //Output: transforming

//Single profile detection per event using epcis document
const epcisDocumentProfile = detectProfile(epcisDocument, customProfileRules);
console.log(epcisDocumentProfile); //Output: ['transforming','farming','fishing','slaughtering']
```

2. Multiple event profiles detection

The function analyzes the event against the provided rules and returns the multiple event profiles.

```javascript
import { detectAllProfiles } from 'openepcis-event-sentry';
```

Syntax:

```javascript
/*
  1. event: The event you wish to utilize for profile(s) detection, for example, a bare event or an EPCIS document.
  2. rules: Profile detection rules upon which you base the detection of the profile(s).
*/
detectAllProfiles(event, rules);
```

Example:

```javascript
//Multiple profile(s) detection using bare event
const bareEventProfiles = detectAllProfiles(bareEvent, customProfileRules);
console.log(bareEventProfiles); //Output: ['transforming']

//Multiple profile(s) detection per event using epcis document
const epcisDocumentProfiles = detectAllProfiles(
  epcisDocumentForSlaughteringAndFishing,
  customProfileRules,
);
console.log(epcisDocumentProfiles); //Output: [['transforming'],['farming'],['farming','fishing'],['slaughtering']]
```

Note: The documents and rules mentioned above correspond to specific file names stored in the following paths:

1. [bareEvent](https://github.com/openepcis/openepcis-event-sentry/blob/main/test/data/TransformationBareEvent.json)
2. [epcisDocument](https://github.com/openepcis/openepcis-event-sentry/blob/main/test/data/EpcisDocument.json)
3. [epcisDocumentForSlaughteringAndFishing](https://github.com/openepcis/openepcis-event-sentry/blob/main/test/data/EpcisDocumentForSlaughteringAndFishing.json)
4. [customProfileRules](https://github.com/openepcis/openepcis-event-sentry/blob/main/src/rules/event-profile-detection-rules.js)

## Check event complies to the rule

This SDK provides the functionality to verify if a given event adheres to a specific rule set.

```javascript
import { compliesToProfileRule } from 'openepcis-event-sentry';
```

Syntax:

```javascript
/*
  1. event: The event object you want to evaluate.
  2. rule: The profile detection rules used for the compliance check.
*/
compliesToProfileRule(event, rule);
```

Example:

```javascript
//Multiple profile(s) detection using bare event
const isComplies = compliesToProfileRule(bareEvent, customProfileRule);
console.log(isComplies); //Output: false
```

Note: The documents and rules mentioned above correspond to specific file names stored in the following paths:

1. [bareEvent](https://github.com/openepcis/openepcis-event-sentry/blob/main/test/data/TransformationBareEvent.json)
2. [customProfileRule](https://github.com/openepcis/openepcis-event-sentry/blob/main/test/data/custom-profile-rules.js)

## Define Validation Rules for an Event Profile

Business may want to define many validation rules that qualifies and event for a specific profile.

For example, the followings are additional rules necessary to be complied for an event with profile `transforming`

- Event must have a valid `transformationID`
- It must have a non-empty `inputQuantityList` or `inputEPCs`
- It must have a non-empty `outputQuantityList` or `outputEPCs`

Rules definitions mapped to event profiles:

```javascript
{
  "name": 'transformationID_Rule',
  "expression": '!_isEmpty(event.transformationID)',
  "eventProfile": ['transforming'],
  "order": 1,
  "errorMessage": 'TransformationID malformed',
  "warning": 'TransformationID should not be null or undefined',
  "field": 'transformationID',
  "value": 'event.transformationID',
},
{
  "name": 'nonEmptyInputQuantityList_Rule',
  "expression": '!_isEmpty(event.inputQuantityList)',
  "eventProfile": ['transforming'],
  "order": 2,
  "errorMessage":
    'No object ID present - Transformation Event needs to have non empty inputQuantityList',
  "warning": 'Transformation Event needs to have non empty inputQuantityList',
  "field": 'inputQuantityList',
  "value": 'inputQuantityList is empty',
},
{
  "name": 'nonEmptyOutputQuantityList_Rule',
  "expression": '!_isEmpty(event.outputQuantityList)',
  "eventProfile": ['transforming'],
  "order": 3,
  "errorMessage":
    'No object ID present - Transformation Event needs to have non empty outputQuantityList',
  "warning": 'Transformation Event needs to have non empty outputQuantityList',
  "field": 'outputQuantityList',
  "value": 'outputQuantityList is empty',
}
```

## Check EPCIS Event against validation rules

Similar to profile checker SDK provides way to verify event against validation rules:

1. Verify an EPCIS event against custom validation rules

```javascript
import { validateProfile } from 'openepcis-event-sentry';
```

Syntax:

```javascript
/*
  1. event: The event you wish to utilize for profile detection, for example, a bare event or an EPCIS document.
  2. profileName: The names of the event profile you intend to validate against the particular event, such as  [transforming, fishing, farming] etc... 
  3. rules: validation rules based on which you want to validate the event
*/
validateProfile(event, profileNames, rules);
```

Example:

```javascript
//validation using the bare event
const response = validateProfile(bareEvent, ['transforming'], customValidationRules);
console.log(response); //output: []

//validation using the epcis document
const response = validateProfile(
  epcisDocumentWithMissingData,
  ['transforming', 'slaughtering'],
  customValidationRules,
);
console.log(response);
/*
output: 
[
  [
    {
      index: 1,
      errors: [
        {
          name: 'nonEmptyInputQuantityList_Rule',
          eventProfile: ['transforming'],
          errorMessage:
            'No object ID present - Transformation Event needs to have non empty inputQuantityList',
          warning: 'Transformation Event needs to have non empty inputQuantityList',
          field: 'inputQuantityList',
        },
        {
          name: 'nonEmptyOutputQuantityList_Rule',
          eventProfile: ['transforming'],
          errorMessage:
            'No object ID present - Transformation Event needs to have non empty outputQuantityList',
          warning: 'Transformation Event needs to have non empty outputQuantityList',
          field: 'outputQuantityList',
        },
      ],
    },
  ],
  [
    {
      index: 2,
      errors: [
        {
          name: 'agricultureDetailsInIlmdExists_Rule',
          eventProfile: ['slaughtering'],
          errorMessage: 'agricultureDetails is not exists',
          warning: 'agricultureDetails is not exists',
          field: 'agricultureDetails',
        },
      ],
    },
  ],
]
*/
```

Note: The documents and rules mentioned above correspond to specific file names stored in the following paths:

1. [bareEvent](https://github.com/openepcis/openepcis-event-sentry/blob/main/test/data/TransformationBareEvent.json)
2. [epcisDocumentWithMissingData](https://github.com/openepcis/openepcis-event-sentry/blob/main/test/data/EpcisDocumentWithMissingData.json)
3. [customValidationRules](https://github.com/openepcis/openepcis-event-sentry/blob/main/src/rules/event-profile-validation-rules.js)

# Contribute

We welcome your contributions to openepcis-event-sentry! Here are some ways you can get involved:

- Bug Fixes: Identify and report any bugs you encounter.
- Feature Requests: Suggest new features that would benefit the project.
- Pull Requests: Submit code changes that address issues or add functionality.
- Documentation: Help improve the project's documentation by providing corrections or suggestions.
