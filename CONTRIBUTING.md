# API Contribution

Thank you for your interest for contributing into this backend API. This document outlines the process for contributing to the backend API.

## Getting Started

1. Fork the repository to your GitHub account
2. Clone your forked repository locally
3. Install dependencies with `pnpm install`
4. Set up your environment variables in `.env`
5. Create a new branch for your feature or fix

Each time you are going to implement something, check your branch if matches to the `main` branch for update. If not, `git pull origin main` first.

## Branch Naming Convention

Use descriptive branch names following this format:

- `feature/short-description` - For new features
- `fix/short-description` - For bug fixes
- `refactor/short-description` - For code refactoring
- `docs/short-description` - For documentation updates
- `api/short-description` - For API endpoint changes
- `test/short-description` - For adding or updating tests

Examples:

- `feature/add-currency-module`
- `fix/auth-token-expiry`
- `refactor/optimize-database-queries`
- `api/add-payment-webhooks`

## Creating a New Branch

```bash
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

## Making Changes

1. Make your changes in the new branch
2. Follow NestJS conventions and patterns
3. Keep changes focused and atomic
4. Test your changes locally with `pnpm run start:dev`
5. Ensure the build passes with `pnpm run build`
6. Run linting with `pnpm run lint`

## Commit Message Guidelines

Write clear and descriptive commit messages:

```list
type: short description

Longer description if needed explaining what and why.
```

Types:

- `feat` - New feature
- `fix` - Bug fix
- `refactor` - Code refactoring
- `docs` - Documentation changes
- `api` - API endpoint changes
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

Example:

```list
feat: add currency conversion module

Created CurrencyModule with FastForex API integration.
Added rate caching with 5-minute TTL.
Endpoints: GET /currency/rate, GET /currency/rates
```

## Creating a Pull Request

1. Push your branch to your forked repository:

```bash
git push origin feature/your-feature-name
```

2. Go to the original repository on GitHub

3. Click "New Pull Request"

4. Select your branch as the compare branch

5. Fill out the pull request template with:
   - A clear and descriptive title
   - Summary of changes made
   - API endpoints added or modified
   - Database migrations if applicable
   - Testing steps performed

## Pull Request Description Template

```list
## Summary
Brief description of what this PR does.

## Changes Made
- Change 1
- Change 2
- Change 3

## API Changes
List any new or modified endpoints:
- `GET /endpoint` - Description
- `POST /endpoint` - Description

## Database Changes
- [ ] No database changes
- [ ] New migrations added

## Related Issues
Fixes #123 (if applicable)

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Refactoring
- [ ] API change
- [ ] Database change

## Testing
Describe the tests you performed:
1. Step 1
2. Step 2
3. Step 3

## Environment Variables
List any new environment variables:
- `VARIABLE_NAME` - Description

## Checklist
- [ ] Code follows NestJS conventions
- [ ] Changes have been tested locally
- [ ] Build passes without errors
- [ ] No new linting warnings
- [ ] API documentation updated if needed
- [ ] Database migrations tested
```

## Code Review Process

1. All pull requests require at least one approval before merging
2. Address all review comments and suggestions
3. Keep the PR focused on a single feature or fix
4. Respond to feedback promptly

## Development Guidelines

### Module Structure

Each module should contain:

- `module-name.module.ts` - Module definition
- `module-name.controller.ts` - HTTP endpoints
- `module-name.service.ts` - Business logic
- `module-name.gateway.ts` - WebSockets Gateway
- `dto/` - Data transfer objects (if applicable)

### Code Standards

- Use TypeScript for all files
- Follow NestJS dependency injection patterns
- Keep services under 200-300 lines
- Extract complex logic into separate services
- Use meaningful variable and function names
- Add proper error handling

### Database

- Use Prisma for database operations
- Create migrations for schema changes
- Test migrations before submitting
- Use transactions for multi-step operations

### API Design

- Follow RESTful conventions
- Use proper HTTP status codes
- Return consistent response formats
- Add input validation with class-validator
- Document endpoints with Swagger decorators

### Security

- Never commit sensitive data or credentials
- Use environment variables for secrets
- Validate and sanitize all inputs
- Use guards for protected routes

### Testing

- Test endpoints with Postman or similar tools
- Verify database operations work correctly
- Test error handling scenarios
- Ensure existing functionality is not broken

## Environment Setup

Required environment variables:

```env
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
PORT=5000
```

## Questions

If you have questions about contributing, open an issue for discussion before starting work on large changes.
