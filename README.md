# f1-system

Project-specific AI agent configuration and coordination rules for the React frontend and NestJS backend services.

## Agent set

The project has seven agents: `lead-developer`, `senior-react-developer`, `senior-nestjs-developer`, `tester`, `manual-tester`, `security-auditor`, and `compliance-auditor`.

Their TOML files are mirrored in `.codex/agents/` and `agents/` for the two project integrations that consume them. Keep matching filenames byte-for-byte aligned when editing; `.codex/agents/` is the canonical copy. Do not add an agent for a stack or role that this project does not use.

See [.ai/README.md](.ai/README.md) for the worktree, scope ownership, handoff, and integration workflow. The scope map is [.ai/ownership.yaml](.ai/ownership.yaml).

The `manual-tester` skill lives in `.codex/skills/manual-tester/` and writes customer-perspective UI test reports under `user-check/`.

## Short agent aliases

- `frontend` → `senior-react-developer` agent and `lead-frontend-engineer` skill.
- `backend` → `senior-nestjs-developer` agent and skill.

## Local application setup

The initial runnable application lives in `frontend/`, `backend-api-gateway/`, and `backend-api-auth/`.
It uses PostgreSQL and Mailpit from Docker Compose.

```powershell
Copy-Item .env.example .env
pnpm install
pnpm docker:dev
```

The development Compose file bind-mounts the source and runs Next.js/Nest watch mode. Source edits are
picked up without rebuilding images. Compose builds the development image only the first time, or when
you explicitly run `pnpm docker:dev:build` after changing a Dockerfile. After changing package dependencies,
run `pnpm docker:dev:install` to update the shared dependency volumes without a Docker image rebuild.
The auth container regenerates Prisma Client from the mounted schema before applying migrations at startup,
so schema changes do not leave the persistent generated-client volume stale.
Use `pnpm docker:dev:logs` to follow logs and `pnpm docker:dev:down` to stop the stack.

Open `http://localhost:3000`; Mailpit is at `http://localhost:8025`. Create the first Super Admin through
the documented CRM endpoint; the generated password is delivered to the Mailpit inbox. The complete
PowerShell request and implementation notes are in [`document/task/done/2026-10-04-initial-frontend-backend-setup.md`](document/task/done/2026-10-04-initial-frontend-backend-setup.md).

Replace the development `AUTH_SECRET`, `CRM_API_KEY`, SMTP configuration, and database credentials before deploying outside localhost.
