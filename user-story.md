# User Story Template

Title: As a [type of user], I want [an action or feature] so that [benefit/value].
Description: A short paragraph describing the context and motivation behind this story.
Details and Assumptions:
- [Add any technical, design, or user constraints/assumptions here]
Acceptance Criteria:
Given [context], when [action], then [expected outcome].
Given [context], when [action], then [expected outcome].
Given [context], when [action], then [expected outcome].
Priority: High / Medium / Low
Story Points: (estimate, e.g. 1, 2, 3, 5, 8)
Labels: new / icebox / technical-debt / backlog

## Example

Title: As a user, I want to search gift items by category so that I can quickly find items I'm interested in.
Description: Users browsing GiftLink often know what type of item they want (e.g., furniture, electronics). Adding category-based search reduces friction and improves discoverability.
Details and Assumptions:
- Categories are pre-defined in the database schema.
- Search queries are case-insensitive.
Acceptance Criteria:
Given the search page, when I select a category filter, then only items in that category are shown.
Given no category is selected, when I search, then all categories are included.
Given an invalid category, when I search, then an empty result set is returned without error.
Priority: High Story Points: 3 Labels: new