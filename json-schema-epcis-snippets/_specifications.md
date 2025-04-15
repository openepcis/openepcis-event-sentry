# Specifications for JSON Schema EPCIS Snippets

STATUS: TO BE CONFIRMED

## Naming conventions

Concatenated string consisting of:
{JSON Schema EPCIS Snippet name} + ´-´ + {Major version} + ´.´ + {Minor version} + ´.´ + {Patch version} + '.json'

### `JSON Schema EPCIS Snippet Name`

* alphanumeric string consisting of lowercase letters
* separated by a hyphen/dash character ('-') if consisting of several words (kekab case)

### JSON Schema EPCIS Snippet Name Examples (for illustration purposes only)

* "quantity-uom-all-1.0.0.json"
* "quantity-uom-length-1.0.0.json"
* "epc-uri-sgtin-0.1.0.json"
* "example-extension-field-string-value-1.0.1.json"

Files MUST NOT be removed.

## Best practice to fill description

Apply the following 'recipe' to fill in the `description` property:

* > `Specifies value | set of values for` {indicate EPCIS field name(s)}
* > `,` `expressed as` {specify type and/or format}
* > [optional] `,` `relevant for` {insert applicable industry domain(s)} | `for illustration`
* > [optional] `,` `note` {provide additional context, if appliable} `.`

Ideally, formulate description in the specified sequence.
  