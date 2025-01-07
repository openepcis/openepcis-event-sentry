# Transformation Event with extension and event Hash ID

## Set of rules

1. "type" must be TransformationEvent
2. "readPoint" must not be empty
3. "eventID" has the syntax of an Event Hash ID, as defined in the CBV (doesn't need to verify that the value is correct)
4. "bizStep" must be either commissioning or creating_class_instance
5. The event must contain an extension "ext:eventProfile", where ext maps to http://example.com/ext/ in the "@context"
6. "bizLocation" must not be empty if output products are specified
7. "bizLocation" must be empty if no output products are specified