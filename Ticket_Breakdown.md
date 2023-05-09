# Ticket Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Ticket Breakdown

### Ticket 1: Add custom id field to Agents table

#### Description

Currently, the `Agents` table in the database stores only the internal database id for each `Agent`. To enable `Facilities` to save their own custom ids for each `Agent`, we need to add a new field called `custom_id` to the `Agents` table. This field should be unique to every `Facility`, meaning that a combination of `agents.custom_id` and `facilities.id` must be unique.

#### Acceptance Criteria

- The `Agents` table should have a new column named `custom_id` of type `VARCHAR` (length 100, check with product team if this would be enough).
- The migration process for adding the `custom_id` field should be evaluated for potential performance impact before execution. To achieve this, we can add a default value of `null` to the `custom_id` field. This way, we can avoid breaking existing functionality and performance issues.
- Ensure the `custom_id` field is unique within the context of each `Facility` by adding a `UNIQUE` constraint to the combination of `custom_id` and `facility_id` columns.
- The `Agents` table schema documentation should be updated to reflect the addition of the `custom_id` field.

#### Effort Estimate

This task is estimated to take approximately 4 hours.

#### Implementation Details

- Using `pg-migrate` migration tool, add a new column named `custom_id` of type VARCHAR (length 100) to the `Agents` table.
- Ensure the `custom_id` field is unique by adding a `UNIQUE` constraint to the combination of `agents.custom_id` and `facilities.id` columns.
- Ensure the `custom_id` field is null by default to avoid breaking existing functionality and performance issues. In Postgres 14 and older versions unique constraints always treat `NULL` values as not equal to other NULL values.
- Update the `Agents` table schema documentation to reflect the addition of the `custom_id` field.

### Ticket 2: Update `getShiftsByFacility` function to include custom id

#### Description

The `getShiftsByFacility` function currently returns all `Shifts` worked at a `Facility`, including metadata about the assigned `Agent`. We need to modify this function to include the `custom_id` of the `Agent` in the returned metadata.

#### Acceptance Criteria

- The `getShiftsByFacility` function should retrieve all `Shifts` worked at a `Facility` for the given quarter.
- The function should include the `custom_id` of the assigned `Agent` in the returned `Shifts` metadata.

#### Effort Estimate

This task is estimated to take approximately 2 hours.

#### Implementation Details

- Identify the function or method responsible for retrieving `Shifts` by `Facility`.
- Modify the function to fetch the `custom_id` of the assigned `Agent` along with the other metadata.
- Update the relevant documentation or comments to reflect the change in the returned metadata.

### Ticket 3: Update `generateReport` function to use custom id

#### Description

The `generateReport` function currently converts `Shifts` into a PDF report, but it uses the internal database id for each `Agent`. We need to update this function to include the `custom_id` provided by `Facilities` when generating reports.

#### Acceptance Criteria

- The `generateReport` function should convert the `Shifts` into a PDF report for submission by the `Facility`.
- The function should include the `custom_id` of the assigned `Agent` in the generated report.

#### Effort Estimate

This task is estimated to take approximately 2 hours.

#### Implementation Details

- Identify the function or method responsible for generating the PDF report.
- Modify the function to include the `agents.custom_id` provided by the `Facility`.
- Add test to ensure the `custom_id` is included in the generated report.
- Update the relevant documentation or comments to reflect the change in the report generation process.

### Ticket 4: Validate uniqueness of custom ids set by Facilities

#### Description

To maintain data integrity and prevent conflicts, we need to enforce a unique constraint for the combination of `agents.custom_id` and `facilities.id` in the `Agents` table. This will ensure that each `Facility`'s custom ids for their agents are unique within their own context.

To maintain data integrity and prevent conflicts, we need to ensure that the custom ids provided by `Facilities` for each `Agent` are unique. This ticket involves adding validation to enforce uniqueness when saving or updating custom ids.

#### Acceptance Criteria

- The system should validate that the custom id provided by a `Facility` is unique among custom ids already stored in the database.
- Each facility should be able to have unique custom ids for their agents without any duplicates within their own context.

#### Effort Estimate

This task is estimated to take approximately 4 hours.

#### Implementation Details

- Identify the code responsible for saving or updating the custom id in the database.
- Before saving or updating the custom id, search the database for existing custom ids limited to the context of the `Facility` (e.g. `select exists(select 1 from agents where agents.custom_id = $1 and facilities.id = $2)`)
- If the custom id is found to be non-unique, reject the operation and provide an appropriate error message to the `Facility`.
- Add tests to ensure the uniqueness validation works as expected.
- Update the relevant documentation or comments to reflect the uniqueness validation for custom ids.

### Ticket 5: Allow Facilities to set/update custom ids for agents

#### Description

Currently, the system needs to be modified to allow `Facilities` to set and update custom ids for `Agents` they work with. This will provide flexibility for `Facilities` to manage their own unique identifiers for agents within their organization.

#### Acceptance Criteria

- `Facilities` should have the ability to set and update custom ids for agents they work with.
- The system should provide a user-friendly interface or mechanism for `Facilities` to input and manage the custom ids.
- The system should validate the custom ids to ensure they are unique within the context of the `Facility`, and present error messages or warnings if any discrepancies or mismatches are found.

#### Effort Estimate

This task is estimated to take approximately 8 hours.

#### Implementation Details

- Identify the user interface component or form where `Facilities` can input `Agent` information.
- Enhance the user interface to include a field for entering custom ids.
- Modify the backend code responsible for processing agent data to capture and store the custom ids in the `Agents` table.
- Implement the necessary validation for client-side to ensure the uniqueness of custom ids within each `Facility`.
- Update relevant documentation or user guides to explain the process of setting and updating custom ids.

Note: The time/effort estimates provided are rough approximations and may vary based on the specific implementation details, development environment, and team familiarity with the codebase.
