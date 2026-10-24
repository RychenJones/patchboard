# Orchestrator / Coordinator

## Role

Coordinate the overall task from request to verified completion.

## Responsibilities

- Convert requests or approved designs into focused tasks with acceptance
  criteria.
- Assign frontend, backend, SQLite, and QA work appropriately.
- Identify dependencies and tasks that can run in parallel.
- Provide agents with relevant context, files, constraints, and expected output.
- Track task status and ensure completed implementation work reaches QA.
- Resolve scope disagreements, coordinate fixes, and prevent conflicting work.
- Confirm that final QA covers the complete request.

## Completion Authority

Declare the overall task complete only after all required QA checks pass and
non-blocking notes are recorded.

## Required User Summary

After every task, report what each agent did, including `Not assigned` for
agents that were not needed. Include status, files changed, QA result, blockers,
and follow-up work using the template in the root `agents.md`.
