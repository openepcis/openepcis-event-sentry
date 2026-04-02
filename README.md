<p align="center">
  <img src="media/logo-white-circle.svg" alt="EPCIS Profile Checker Logo" width="180">
</p>

<h1 align="center">OpenEPCIS Event Sentry</h1>

<p align="center">
  An open-source SDK and web application for validating <a href="https://www.gs1.org/standards/epcis">GS1 EPCIS</a> supply chain events against custom business profiles using JSON Schema.
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-Apache%202.0-blue.svg" alt="License"></a>
  <a href="https://github.com/openepcis/openepcis-event-sentry"><img src="https://img.shields.io/github/stars/openepcis/openepcis-event-sentry?style=social" alt="GitHub Stars"></a>
</p>

---

## What is EPCIS?

[EPCIS (Electronic Product Code Information Services)](https://www.gs1.org/standards/epcis) is a GS1 standard for supply chain visibility and traceability. It enables organizations
to capture and share event data in 5 dimensions — WHAT, WHEN, WHERE, WHY and HOW — using a common language across enterprises.

## What is an Event Profile?

An event profile defines business-specific validation rules derived from EPCIS event attributes. While the EPCIS standard is open-ended, businesses often need to enforce stricter
rules for compliance and data quality.

For example, given an `ObjectEvent` with ILMD (Item-Level Master Data):

- **Fishing profile** — ILMD contains a `catchArea` element
- **Farming profile** — ILMD contains a `countryOfOrigin` element
- **Slaughtering profile** — ILMD contains a `preStageDetails` element

Profiles are defined as [JSON Schema](https://json-schema.org/) documents, making them portable, machine-readable, and easy to validate against.

## Features

### SDK

- **Validate events** against custom JSON Schema profiles using [AJV](https://ajv.js.org/)
- **Detect document types** — EPCISDocument or bare events
- **Type checking utilities** — verify event types (ObjectEvent, AggregationEvent, TransactionEvent, TransformationEvent, AssociationEvent)
- **Profile rule schemas** — built-in schemas for profile detection and validation rules
- **Dual build targets** — works in both Node.js and browser environments

### Web Application

A full-featured web UI is available as [Web Application](https://profile-checker.openepcis.io/) or source code
at [openepcis-snippet-web](https://github.com/openepcis/openepcis-snippet-web):

<table>
  <tr>
    <td align="center" width="33%">
      <img src="media/profile-builder-light.svg" alt="Profile Builder" width="120"><br>
      <b>Profile Builder</b><br>
      <sub>Visually create JSON Schema profiles for EPCIS document/event validation</sub>
    </td>
    <td align="center" width="33%">
      <img src="media/event-validator-light.svg" alt="Event Validator" width="120"><br>
      <b>Event Validator</b><br>
      <sub>Validate EPCIS events against profiles with instant compliance feedback</sub>
    </td>
    <td align="center" width="33%">
      <img src="media/snippet-search-light.svg" alt="Snippet Search" width="120"><br>
      <b>Snippet Search</b><br>
      <sub>Search and filter reusable EPCIS event snippets from the library</sub>
    </td>
  </tr>
</table>

## Getting Started

### Run the Web App with Docker / Podman

The quickest way to get started. Pull and run the pre-built container:

```bash
# Docker
docker pull ghcr.io/openepcis/openepcis-snippet-web:latest
docker run -p 3000:3000 ghcr.io/openepcis/openepcis-snippet-web:latest

# Podman
podman pull ghcr.io/openepcis/openepcis-snippet-web:latest
podman run -p 3000:3000 ghcr.io/openepcis/openepcis-snippet-web:latest
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**With Docker Compose:**

```yaml
services:
  openepcis-snippet-web:
    image: ghcr.io/openepcis/openepcis-snippet-web:latest
    ports:
      - "3000:3000"
    environment:
      - NUXT_PUBLIC_SNIPPET_API_URL=https://api.epcis.cloud
    restart: unless-stopped
```

```bash
docker-compose up -d
```

For more Docker options and environment variables, see the [openepcis-snippet-web](https://github.com/openepcis/openepcis-snippet-web) repository.

### Run the Web App from Source

Requires [Node.js](https://nodejs.org/) 18+ and [pnpm](https://pnpm.io/).

```bash
git clone https://github.com/openepcis/openepcis-snippet-web.git
cd openepcis-snippet-web
pnpm install
pnpm dev

```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Examples

The [`examples/`](examples/) directory contains paired EPCIS events and their corresponding validation profiles:

- `epcis-events/` — Sample EPCIS event documents
- `epcis-profiles/` — Matching JSON Schema profiles for validation

The [`json-schema-epcis-snippets/`](json-schema-epcis-snippets/) directory contains reusable JSON Schema components for building custom profiles.

## Contributing

We welcome contributions! Here are ways to get involved:

- **Bug Reports** — identify and report issues
- **Feature Requests** — suggest improvements
- **Pull Requests** — submit code changes or new profiles
- **Documentation** — help improve guides and examples

Please review the [Code of Conduct](codeOfConduct.md) before contributing.

## License

[Apache License 2.0](LICENSE)
