# Parallel AI workspace protocol

This directory coordinates multiple AI vendors. It is not application runtime
code. Physical isolation and code ownership are both required; folders alone
cannot prevent two processes from overwriting the same file.

## Project agents

This project maintains seven agents: `lead-developer`, `senior-react-developer`,
`senior-nestjs-developer`, `tester`, `manual-tester`, `security-auditor`, and
`compliance-auditor`. Their definitions are mirrored in `.codex/agents/` and
`agents/`; `.codex/agents/` is canonical. Keep the two copies identical and
make all agent references point only to these seven roles. Frontend and backend
work must also declare a scope from `ownership.yaml`. Manual-test reports use
the `manual-test-reports` scope and are written under `user-check/`.

## Required workflow

1. The human/integration owner creates one Git worktree and branch per AI agent.
2. Each agent copies `.ai/tasks/TEMPLATE.md` to a task file and declares one scope
   from `.ai/ownership.yaml`.
3. The agent edits only that scope. Shared composition files and dependencies are
   changed by the integration owner in a separate, serialized step.
4. A cross-scope requirement is written from `.ai/handoffs/TEMPLATE.md`; the other
   scope owner applies it.
5. Each agent commits and pushes its branch, then opens a pull request into
   `staging` (never `develop`).
6. The integration owner merges AI pull requests into `staging` one at a time and
   runs checks against the combined result.
7. After the combined review passes, the human owner promotes `staging` to
   `develop` through a pull request.

## Collision boundaries

- Frontend feature work belongs inside `frontend/src/features/auth/**` or
  `frontend/src/features/home/**`; Next route files live under `frontend/src/app/`.
- Frontend providers and API clients are assigned through the integration scope
  because both app features and API contracts depend on them.
- Backend domain work belongs inside one service boundary. The initial domain is
  `backend-api-auth/src/auth/**`; gateway procedures live in
  `backend-api-gateway/src/trpc/**`.
- Composition roots, package manifests, lockfiles, and Docker files are
  integration-owned because many scopes depend on them.

## Dependency requests

Feature agents must write the desired package and reason in a handoff. Only the
integration owner edits `package.json`, runs `pnpm install`, and commits
`pnpm-lock.yaml`. This prevents the most common parallel-agent lockfile conflict.

## Minimum handoff checks

```bash
pnpm typecheck
pnpm build
```

The integration owner additionally runs:

```bash
pnpm peers check
docker compose config --quiet
docker compose build
```

The GitHub `quality-gate` workflow repeats the non-runtime checks for every push
and pull request to `staging` or `develop`. A pull request into `develop` fails
unless its source branch is exactly `staging`.
