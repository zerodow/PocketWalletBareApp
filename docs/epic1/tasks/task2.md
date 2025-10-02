# Task 2: Mobile Database & Models

## Overview

Set up pure local database with WatermelonDB, create data models for offline-first functionality, and implement money handling utilities. No sync fields required - this is local-only storage with future sync capability.

## Tasks

- [ ] WatermelonDB schema & migrations for `categories`, `transactions`
- [ ] Money utils: decimal library; currency minor unit; round half up
- [ ] Indexed queries for month view (occurred_at)

## Acceptance Criteria

- WatermelonDB is configured and working
- Database schema is defined for categories and transactions tables
- Database migrations are set up
- Money utilities handle decimal precision correctly
- Currency minor units are properly handled
- Rounding follows "round half up" strategy
- Indexed queries are optimized for monthly dashboard views
- All money math unit tests pass 100%

## Priority

High

## Process

100% - COMPLETED

## Estimated Time

6-8 hours

## Dependencies

- Task 1 (Mobile Foundation) must be completed first

## Notes

- Use a reliable decimal library (e.g., decimal.js) to avoid floating-point precision issues
- Ensure proper indexing on occurred_at field for performance
- Consider Vietnamese Dong (VND) currency requirements
- Schema should be purely local - no sync-related fields (sync_version, server_id, etc.)
- Focus on instant local operations and responsive UI

## Development Workflow

### Before Starting
1. Create a new feature branch: `git checkout -b feat/task2-mobile-database-models`
2. Start development work

### When Complete
1. Commit all changes with descriptive messages
2. Push branch to remote repository
3. Create PR using GitHub MCP: Use `mcp__github__create_pull_request` to create PR targeting `dev` branch
4. Add comprehensive PR description with implementation details and test results
