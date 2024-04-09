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

``` bash
npm install openepcis-event-sentry
```

This will download and install the library into your project's node_modules directory.

2. <b>From CDN (Content Delivery Network):</b>

If you prefer to use a CDN, include the library directly in your HTML file using a script tag:

``` html
<script src="https://unpkg.com/openepcis-event-sentry@latest/dist/openepcis-event-sentry.min.js"></script>
```


# Example Usage

The following sections provides with sample usages of various features of SDK


## Define Event Profile Rule

Profile definition contains name, eventType, and expression/rule that evaluates the event to be called that profile.

Sample definition of event profile "transforming"

``` javascript
{
  "name": "transforming",
  "eventType": "TransformationEvent",
  "expression": "transformationID != undefined && type == 'TransformationEvent'"
}
```

Note: expression is DSL supported by https://github.com/TomFrost/Jexl library. It may change if better alternative is found for forming & evaluating inline javascript expressions.


## Check Profile of an EPCIS event

SDK provides the following ways to check the profile of an event.

1. Check with static profiles available internally

SDK also provide some primary statically define profiles which will be used internally to evaluate provided event.

_TBD: link to internal profiles JSON_

``` javascript
// TBD: define an event here
val profileChecker = new EventProfileChecker();
val profile = profileChecker.check(event);
console.log(profile)
```

2. Check with client provided event profiles

This approach may be relevant if user of this SDK doesn't find the suitable profile and wants to run through events with custom event profile rules which are supported by framework. You can define & validate rules through SDK's profile definition feature.

``` javascript
// TBD: define custom profiles here
val profileChecker = new EventProfileChecker(profiles);
val profile = profileChecker.check(event);
console.log(profile)
```

## Define Validation Rules for an Event Profile

Business may want to define many validation rules that qualifies and event for a specific profile.

For example, the followings are additional rules necessary to be complied for an event with profile `transforming`

- Event must have a valid `transformationID`
- It must have a non-empty `inputQuantityList` or `inputEPCs`
- It must have a non-empty  `outputQuantityList` or `outputEPCs`

Rules definitions mapped to event profiles:

``` javascript
{
  "name": "transformationID_Rule",
  "expression": "empty(event.transformationID) or service.isValidTransformationID(event.transformationID)",
  "eventProfile": ["transforming"],
  "order": 1,
  "dependsOn": [],
  "errorCode": 4202,
  "errorMessage": " \"TransformationID malformed - \" + event.transformationID",
  "warning": "",
  "field": "transformationID",
  "value": "event.transformationID"
}
{
  "name": "nonEmptyInputQuantityList_Rule",
  "expression": "negate(empty(event.inputQuantityList)) and negate(equals(service.getEpcClasses(event.inputQuantityList).size(), 0))",
  "eventProfile": ["transforming"],
  "order": 2,
  "dependsOn": [],
  "errorCode": 4104,
  "errorMessage": " \"No object ID present - Transformation Event needs to have non empty inputQuantityList\"",
  "warning": "",
  "field": "inputQuantityList",
  "value": "\"inputQuantityList is empty\""
}
{
  "name": "nonEmptyOutputQuantityList_Rule",
  "expression": "negate(empty(event.outputQuantityList)) and negate(equals(service.getEpcClasses(event.outputQuantityList).size(), 0))",
  "eventProfile": ["transforming"],
  "order": 3,
  "dependsOn": [],
  "errorCode": 4104,
  "errorMessage": " \"No object ID present - Transformation Event needs to have non empty outputQuantityList\"",
  "warning": "",
  "field": "outputQuantityList",
  "value": "\"outputQuantityList is empty\""
}
```

## Check EPCIS Event against validation rules

Similar to profile checker SDK provides two ways to verify event against validation rules

1. Verify an EPCIS event against internal profiles and respective validation rules

_ TBD: Reference to internal validation rule file _

``` javascript
// TBD: define an event here
val validator = new EventValiator();
val response = validator.validate(event);
console.log(response)
```

2. Verify an EPCIS event against custom validation rules

``` javascript
// TBD: define custom validationRules here
val validator = new EventValiator(validationRules);
val response = validator.validate(event);
console.log(response)
```

# Contribute

We welcome your contributions to openepcis-event-sentry! Here are some ways you can get involved:

- Bug Fixes: Identify and report any bugs you encounter.
- Feature Requests: Suggest new features that would benefit the project.
- Pull Requests: Submit code changes that address issues or add functionality.
- Documentation: Help improve the project's documentation by providing corrections or suggestions.