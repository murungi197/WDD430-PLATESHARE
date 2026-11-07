<!--
Sync Impact Report
- Version: uninitialized template -> 1.0.0 (initial project constitution).
- Principles: added user value/simplicity, type-safe Next.js, accessible UI,
  observable testing, privacy/safety, and collaboration/maintainability.
- Sections: added technical constraints, quality/delivery, and governance.
- Templates: spec-template.md aligns with required scenarios and success
  criteria; plan-template.md generates a constitution check per plan; updated
  tasks-template.md to require tests for core user stories.
- Follow-up: team review and ratification are pending.
-->

# PlateShare Constitution

## Core Principles

### I. User Value and Simplicity
Build the smallest complete workflow that helps a community member offer or find
surplus food. Keep requirements and interfaces understandable; do not add
features or dependencies without a demonstrated need.

### II. Type-Safe Next.js
Use the Next.js App Router with TypeScript in strict mode. Do not use `any`.
Prefer server components and server-side data access by default; use client
components only for interactions that require browser state or event handling.
Follow file-based routing and keep route handlers focused on HTTP concerns.

### III. Accessible, Consistent UI
Use Tailwind CSS utility classes as the default styling approach. Add custom CSS
only when utilities cannot reasonably express the required design. Build
responsive layouts, semantic HTML, keyboard-operable controls, visible focus
states, and accessible form labels and error messages into each workflow.

### IV. Test Observable Behavior
Test validation, authorization, listing lifecycle, and claim availability at
their relevant boundaries. Add unit tests for non-trivial pure logic and
integration or end-to-end coverage for critical user journeys. A change is not
complete until its relevant checks pass.

### V. Privacy, Safety, and Trust
Collect only data needed for sharing food. Enforce ownership and authorization
on the server, validate all untrusted input, and never rely on UI controls as an
authorization boundary. Make food details, pickup expectations, and relevant
allergen information visible to users. Do not expose private pickup details
before an exchange is accepted.

### VI. Collaboration and Maintainability
Use descriptive, consistent names: PascalCase for React components and types,
camelCase for functions and variables, and kebab-case for route segments and
feature folders. Keep changes focused, document meaningful product or API
decisions, and request review for changes to shared contracts or security
boundaries.

## Technical Constraints

- Framework: Next.js App Router.
- Language: TypeScript, strict mode; `any` is prohibited.
- Styling: Tailwind CSS; custom CSS is exceptional.
- Rendering: server components by default; client components only as needed.
- Data storage, authentication provider, deployment target, and image storage
  have not yet been selected. Do not imply that a specific provider is already
  part of the application.

## Quality and Delivery

- Keep application behavior testable without depending on external production
  services.
- Validate inputs and return useful, non-sensitive error messages.
- For changes to API contracts, update the specification and tests together.
- Before merging, run the checks relevant to the change, including linting,
  type-checking, tests, and a production build when available.

## Governance

This constitution guides implementation and review. Amendments should be
reviewed by the team and reflected in affected specifications and tests.
When a requirement conflicts with a principle, record the reason and obtain
team agreement rather than silently bypassing the principle. Review each
implementation plan against these principles before work begins and again
before delivery. Version amendments semantically: MAJOR for incompatible
principle changes, MINOR for new principles or material expansions, and PATCH
for clarifications that do not change meaning.

**Version**: 1.0.0 | **Status**: Proposed | **Created**: 2026-11-06
