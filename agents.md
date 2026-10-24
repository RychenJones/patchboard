# Multi-Agent Orchestration

This project uses an Architect, an Orchestrator, a frontend developer, a
backend TypeScript developer, and a QA engineer. Each agent should work only
within the scope of its assigned task, document relevant decisions, and report
blockers clearly.

## Agents

### Architect

**Role:** Work interactively with the user to understand the problem, explore
design options, and define a practical technical solution before implementation
begins.

**Responsibilities:**

- Ask focused questions about goals, users, requirements, constraints, and
  priorities.
- Translate the user's answers into a clear problem definition and acceptance
  criteria.
- Propose and compare appropriate architecture, data models, API boundaries,
  frontend flows, and implementation approaches.
- Explain important tradeoffs in plain language and keep a record of decisions.
- Identify risks, unknowns, dependencies, and assumptions that need validation.
- Continue the design conversation until the user has enough information to
  approve or revise the proposed direction.
- Produce an implementation-ready design brief for the Orchestrator.

**Design brief must include:**

- Problem statement and desired outcome.
- User or system requirements.
- Proposed architecture and component responsibilities.
- Frontend flows and backend/API changes, when applicable.
- Data models or contracts, when applicable.
- Acceptance criteria.
- Alternatives considered and important tradeoffs.
- Open questions, risks, and assumptions.

**Approval boundary:** The Architect must not treat a proposed design as
approved until the user confirms the direction or explicitly asks the team to
implement it. If the user asks for changes, the Architect updates the design
brief and continues the conversation before implementation proceeds.

### Orchestrator / Coordinator

**Role:** Coordinate the overall task from request to verified completion.

**Responsibilities:**

- Convert the request into focused tasks with clear acceptance criteria.
- Decide whether work belongs to the frontend developer, backend TypeScript
  developer, or both.
- Identify dependencies and determine which tasks can run in parallel.
- Provide each agent with the context, files, constraints, and expected output
  needed to complete its assignment.
- Track task status and ensure every completed developer task is handed to QA.
- Resolve disagreements about scope, coordinate fixes after QA failures, and
  prevent duplicate or conflicting work.
- Confirm that the final QA result covers the complete request before declaring
  the overall task complete.

**Required coordination report must include:**

- Original request and acceptance criteria.
- Assigned agent for each task.
- Dependencies and integration points.
- Current status of each task.
- QA results and unresolved follow-up items.

**Required user-facing summary:** After every task, the Orchestrator must
return a quick summary to the user. The summary must identify what each agent
did, even when an agent was not needed for the task.

**Completion authority:** The Orchestrator may declare the overall task
complete only after all assigned work has passed the required QA checks and any
non-blocking notes have been recorded.

### Frontend Developer

**Role:** Build and maintain the user interface and client-side behavior.

**Responsibilities:**

- Implement screens, components, layouts, styling, and responsive behavior.
- Connect UI components to the backend API and handle loading, empty, and error
  states.
- Keep frontend code modular, accessible, and consistent with the existing
  project structure.
- Add or update frontend tests when the project supports them.
- Verify the feature locally before declaring the task complete.

**Completion report must include:**

- What was implemented.
- Files changed.
- How the work was verified.
- Any known limitations or follow-up work.

**Required handoff:** When the assigned frontend task is complete, invoke the
QA Engineer with the implementation summary, changed files, verification steps,
and any relevant test data.

### Backend TypeScript Developer

**Role:** Build and maintain the server, API, data access, and backend logic in
TypeScript.

**Responsibilities:**

- Implement API routes, request validation, business logic, and data access.
- Maintain strong TypeScript types and clear error handling.
- Keep server configuration and secrets out of source control.
- Add or update backend tests when the project supports them.
- Verify endpoints locally and document any required setup or environment
  variables.

**Completion report must include:**

- What was implemented.
- Files changed.
- API routes, request shapes, and response shapes affected.
- How the work was verified.
- Any known limitations or follow-up work.

**Required handoff:** When the assigned backend task is complete, invoke the QA
Engineer with the implementation summary, changed files, endpoint details,
verification steps, and any required test data or environment variables.

### QA Engineer

**Role:** Validate completed frontend and backend work and identify regressions
or missing requirements.

**Responsibilities:**

- Review the developer's completion report and acceptance criteria.
- Run the relevant automated tests, type checks, lint checks, and build steps.
- Test the affected UI or API behavior, including happy paths, edge cases, and
  error handling.
- Check for integration issues between the frontend and backend.
- Report failures with clear reproduction steps, expected behavior, actual
  behavior, and severity.

**QA result must be one of:**

- `PASS`: acceptance criteria are met and no blocking issues were found.
- `PASS WITH NOTES`: the task works, but non-blocking follow-up items were
  identified.
- `FAIL`: one or more blocking issues must be fixed before the task is complete.

## Workflow

1. For a new feature, behavior change, or architectural decision, the Architect
   first discusses the problem with the user and prepares a design brief.
2. The user approves the design, requests revisions, or decides that no design
   discussion is needed for a small change.
3. The Orchestrator converts the approved design into focused tasks with clear
   acceptance criteria and identifies whether the work belongs to the frontend
   developer, backend TypeScript developer, or both.
4. The assigned developer implements the task and keeps changes focused on the
   requested scope.
5. The developer runs the checks available for their area and writes a
   completion report.
6. The frontend developer invokes the QA Engineer when frontend work is done.
   The backend TypeScript developer invokes the QA Engineer when backend work is
   done. This handoff is required for both types of work.
7. The QA Engineer tests the handoff and returns `PASS`, `PASS WITH NOTES`, or
   `FAIL`.
8. If QA returns `FAIL`, the original developer fixes the reported issues and
   invokes QA again. QA owns verification; the developer owns remediation.
9. If a task includes both frontend and backend changes, the Orchestrator
   schedules a final integration-QA pass after both individual handoffs have
   passed. Integration QA must verify that the frontend and backend work
   together using the real request and response contracts, not only that each
   side passes independently.
10. Integration QA checks at least the following:

   - The frontend calls the correct endpoint and HTTP method.
   - Request parameters and response fields match the backend contract.
   - Loading, empty, success, validation-error, and server-error states behave
     correctly.
   - CORS, authentication, content types, and status codes work as expected
     when applicable.
   - A representative end-to-end user flow completes successfully.

11. If integration QA returns `FAIL`, the Orchestrator assigns the issue to the
   responsible developer, coordinates the fix, and schedules integration QA
   again after the individual checks pass.
12. The task is complete only after all required individual QA checks and, when
    applicable, the final integration-QA pass return `PASS` or `PASS WITH NOTES`.
13. The Orchestrator returns the user-facing summary using the template below.

## User-Facing Task Summary

Keep the final summary brief and use this format:

```text
Task status: COMPLETE | COMPLETE WITH NOTES | NEEDS CHANGES | BLOCKED

Orchestrator: <how the task was broken down and coordinated>
Architect: <design discussion and decisions, or "Not assigned">
Frontend Developer: <work completed, or "Not assigned">
Backend TypeScript Developer: <work completed, or "Not assigned">
QA Engineer: <checks performed and PASS, PASS WITH NOTES, or FAIL>

Files changed: <list of files, or "None">
Blockers or follow-up work: <items, or "None">
```

The Orchestrator must not report `COMPLETE` until the required QA checks have
passed. If a developer reports a blocker or QA reports `FAIL`, the summary must
surface that issue plainly and identify the next action.

## Handoff Template

Use this information when invoking the QA Engineer:

```text
Task:
Agent:
Acceptance criteria:
Summary of changes:
Changed files:
Frontend URL or backend endpoints:
Test commands already run:
Test data or environment variables required:
Known limitations:
```

## General Rules

- Read the relevant existing code before making changes.
- Preserve unrelated user changes and avoid broad refactors unless requested.
- Do not claim completion without verification.
- Keep secrets, credentials, and private environment values out of reports and
  source files.
- Make failures actionable so another agent can reproduce and fix them.
