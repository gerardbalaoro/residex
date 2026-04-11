# Concept

Residex is a census app for medical residents to record patient encounters for analytics and to satisfy residency program requirements.

The core data entity is a **case**, which represents a single patient encounter. The app is focused less on patient identity and more on the clinical encounter itself. A single patient may have multiple cases over time.

## Core data model

### Case

Each case records the following structured data:

- **Case type**: Emergency, Ambulatory, Ward, Home Care
- **Institution**: The hospital, clinic, or facility where the encounter occurred
- **Encounter date**: When the case happened

### Patient details

Each case also includes basic patient information:

- **Name**
- **Age**: Stored as years and months, not date of birth
- **Sex**: Male, Female, Other
- **Disposition**: Admitted, Discharged, Deceased

### Clinical notes

Each case supports free-text charting fields:

- **History**: Chief complaint and initial assessment
- **Diagnosis**: Physician findings
- **Procedures**: Procedures performed during the encounter or admission
- **Management**: Prescriptions and physician instructions for ongoing care

## Derived and tagged data

The system should infer structured metadata from the free-text fields, with the physician able to review and manually adjust the results.

Supported derived fields include:

- **Diagnostic codes**: ICD-10 codes
- **Skills**: Skills demonstrated by the physician, grouped by type (for example: surgical, communication)
- **Procedures**: Specific procedures performed by the physician, each with applicability rules based on patient demographics such as age and sex

AI should assist with extracting and populating these values from free text, but users must always be able to manually add or remove them.

Skills and procedures should be dynamic. The app should include built-in presets that are automatically populated during onboarding, while still allowing users to create custom entries later.

## Reporting

The app should generate counter-based reports from recorded cases.

Each report follows this table structure:

- **Columns**: Category, Year 1, Year 2, Year 3, Year 4, Total
- **Category**: A label backed by a query that matches specific cases
- **Residency year**: Determined from the encounter date so cases are counted in the correct training year

Planned report types:

- **Clinical case reports**: Categories are defined by sets of ICD-10 codes
  - Separate report templates for adult, pediatric, elderly, and women
- **Procedure reports**: Categories are defined by procedures
  - Separate report templates for adult, pediatric, elderly, and women
- **Skill reports**: Categories are defined by skill or skill type

These reports should start as templates, but the long-term goal is to make report generation fully customizable.

## Media support

Cases should support media attachments for clinical documentation.

## AI-assisted import

The app should provide a way to import cases from images of patient charts, using AI to extract relevant data into the case record.

## Product principles

- The primary unit of data is the **case**, not the patient
- Structured data and free-text notes should coexist in the same workflow
- AI should speed up data entry, but users must remain in control
- Reporting should be template-driven at first, then customizable over time
