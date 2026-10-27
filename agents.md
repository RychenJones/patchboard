# Multi-Agent Orchestration

This project uses the following agents:

- [Architect](agents/architect.md)
- [Orchestrator / Coordinator](agents/orchestrator.md)
- [UI/UX Designer](agents/ui-ux-designer.md)
- [Frontend Developer](agents/frontend-developer.md)
- [Frontend Integration Specialist](agents/frontend-integration-specialist.md)
- [Backend TypeScript Developer](agents/backend-typescript-developer.md)
- [SQLite Database Administrator](agents/sqlite-database-administrator.md)
- [QA Engineer](agents/qa-engineer.md)

Each agent must work only within the scope of its assigned task, document
relevant decisions, preserve unrelated user changes, and report blockers
clearly.

## Workflow

1. For a new feature, behavior change, or architectural decision, the
   [Architect](agents/architect.md) discusses the problem with the user and
   prepares a design brief.
2. The user approves the design, requests revisions, or decides that no design
   discussion is needed for a small change. Design approval alone does not
   authorize implementation.
3. When the user explicitly asks the team to implement the approved design, the
   Architect hands it to the [Orchestrator](agents/orchestrator.md) for large,
   multi-agent, or architecture-affecting work. For small work, the user may
   direct the Orchestrator without an Architect handoff.
4. The Orchestrator converts the approved design or request into focused tasks
   with clear acceptance criteria and assigns the appropriate agents. Frontend
   work should include the UI/UX Designer before implementation when new
   screens or user flows are needed.
5. The UI/UX Designer defines the relevant screens, interactions, responsive
   behavior, accessibility expectations, and UI states, then hands the design
   to the Frontend Developer and Frontend Integration Specialist.
6. Developers complete their assigned work. The Frontend Integration Specialist
   connects the frontend to the backend contract and verifies request,
   response, loading, validation-error, and server-error behavior.
7. Frontend, backend, database, and integration work is handed to the
   [QA Engineer](agents/qa-engineer.md) with the relevant completion report.
8. QA returns `PASS`, `PASS WITH NOTES`, or `FAIL`. A `FAIL` requires the
   responsible agent to fix the issue and hand the work to QA again.
9. For work involving both frontend and backend, the Orchestrator schedules a
   final integration-QA pass after the individual checks pass. The Frontend
   Integration Specialist participates in this pass.
10. The Orchestrator returns the required user-facing summary after every task.

## Approval Boundary

The Architect must not invoke the Orchestrator or start implementation merely
because a design is complete, the user answered questions, or the user gave
informal agreement. The user must explicitly authorize implementation.

## Integration QA

When applicable, integration QA must verify:

- The frontend calls the correct endpoint and HTTP method.
- Request parameters and response fields match the backend contract.
- Loading, empty, success, validation-error, and server-error states behave
  correctly.
- CORS, authentication, content types, and status codes work as expected.
- Database migrations apply cleanly and preserve required data.
- The application can read and write expected records.
- A representative end-to-end user flow completes successfully.

For frontend work, integration QA must also verify:

- The UI follows the approved UI/UX flow and handles responsive layouts.
- Keyboard navigation, labels, focus states, and readable error messages work.
- Empty, loading, success, validation-error, and server-error states are
  visible and understandable.

## User-Facing Task Summary

Keep the final summary brief and use this format:

```text
Task status: COMPLETE | COMPLETE WITH NOTES | NEEDS CHANGES | BLOCKED

Orchestrator: <how the task was broken down and coordinated>
Architect: <design discussion and decisions, or "Not assigned">
UI/UX Designer: <design work completed, or "Not assigned">
Frontend Developer: <work completed, or "Not assigned">
Frontend Integration Specialist: <integration work completed, or "Not assigned">
Backend TypeScript Developer: <work completed, or "Not assigned">
SQLite Database Administrator: <work completed, or "Not assigned">
QA Engineer: <checks performed and PASS, PASS WITH NOTES, or FAIL>

Files changed: <list of files, or "None">
Blockers or follow-up work: <items, or "None">
```

The Orchestrator must not report `COMPLETE` until all required QA checks have
passed. If an agent reports a blocker or QA reports `FAIL`, the summary must
surface that issue plainly and identify the next action.

## Shared Rules

- Read relevant existing code before making changes.
- Keep changes focused on the assigned scope.
- Do not claim completion without verification.
- Keep secrets, credentials, and private environment values out of reports and
  source files.
- Make failures actionable with reproduction steps and expected versus actual
  behavior.
