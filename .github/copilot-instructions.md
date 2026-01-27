
# Copilot / Reviewer Instructions for API (NestJS)

Purpose
- Help automated tools and human reviewers perform consistent, high-quality code reviews for this NestJS "api" repository.

Scope
- Focus on architecture, layering (domain → application → infrastructure → modules → shared), security, testing, and Prisma persistence code. Ignore frontend code located in the sibling `frontend/` folder.

Primary Goals
- Enforce Clean Architecture and DDD boundaries: domain must not depend on infrastructure or NestJS framework classes.
- Ensure use-cases are focused, controllers are thin, and services act as coordinators only.
- Validate security best-practices: input validation, password handling, token management, and secret leakage.
- Verify Prisma usage and migrations are correct and safe for production.

Quick Checks (Automated + Manual)
- File locations: follow `src/{domain,application,infrastructure,modules,shared}`.
- Naming: kebab-case file names, PascalCase classes, `I` prefix for ports/interfaces where applicable.
- Layer boundaries: domain imports must only reference domain/value-objects; application may import domain; infrastructure implements ports/interfaces from application/domain.
- No NestJS imports in `domain/` or `value-objects/`.
- DTOs: use `class-validator` decorators for request DTOs and validate types strictly.
- Controllers: should delegate to use-cases; no business logic or direct Prisma calls.
- Use Cases: one responsibility per class; explicit constructor injection of ports/interfaces.
- Repositories: interfaces in `domain`/`application` and implementations in `infrastructure/persistence` (e.g., Prisma repositories and mappers).
- Mappers: ensure mapping between Prisma models and domain aggregates is complete and deterministic.

Security & Secrets
- Never commit `.env` or credentials. Check for accidental secrets in commits.
- Passwords must be hashed (bcrypt or equivalent) before persistence. No plaintext passwords logged.
- JWT/refresh token handling: verify expiry, rotation, and secure storage patterns.
- Sanitize and validate file uploads and user-provided filenames.

Prisma and Database
- Schema changes must include a migration; prefer small, incremental migrations.
- Repository implementations should use parameterized queries via Prisma Client only.
- Check for potential N+1 queries; prefer `select` to fetch only needed fields.

Testing
- Unit tests for domain entities and use-cases required. Use mocked repositories for use-case tests.
- Integration tests for controllers and Prisma repositories should use a test database or in-memory DB strategy.
- E2E tests should live under `test/` and use `jest` config provided.

Linting & Formatting
- Repo uses ESLint & Prettier. Ensure PRs pass `pnpm lint` and `pnpm test`.

PR Review Checklist (short)
- Architecture: correct layer placement and imports
- Business logic: located in domain/use-cases, not controllers
- Security: no secrets, proper hashing, token validation
- Validation: DTOs + class-validator coverage
- Tests: unit + integration where applicable
- Prisma: migrations present for schema changes
- Docs: update README or relevant docs if behavior or contract changed

How Copilot should suggest fixes
- Prefer small, focused changes that preserve existing style.
- When moving logic into domain/use-case, suggest a clear refactor: new entity method or use-case class + tests.
- For missing validation, suggest a DTO with `class-validator` decorators and show the minimal controller change to apply `ValidationPipe`.

Common Review Examples
- "Move business validation from controller to domain entity: create `User.changeEmail()` and call it from `UpdateUserUseCase`."
- "Replace direct `prisma.user.findUnique` in controller with `IUserRepository.findByEmail` and implement `PrismaUserRepository`."
- "Add `@IsEmail()` and `@IsString()` to `CreateUserDto` and enable `ValidationPipe` in `main.ts` if missing."

Automation
- Ensure CI runs `pnpm install`, `pnpm lint`, `pnpm test`, and `pnpm prisma generate` where appropriate.

Reporting Issues
- If a violation affects security or data integrity, mark PR as `blocking` and explain the recommended fix with code snippets.

Contact
- For ambiguous domain rules, ask the author for business intent before refactoring.

---
This file is a living document — update it as repository conventions evolve.

