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
