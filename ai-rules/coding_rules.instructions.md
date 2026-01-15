# AI Coding Rules and Standards for NestJS

## Code Quality Standards

### No Comments Policy
- Do not write inline comments in code
- Do not write block comments
- Do not write JSDoc comments unless explicitly requested
- Code should be self-documenting through clear naming
- Use descriptive variable and function names instead of comments

### Clean Code Requirements
- Write code without placeholder data or mock content
- Remove all console.log statements before committing
- Remove all debugging code before committing
- Do not leave TODO comments in production code
- Do not leave FIXME comments in production code

## Security Rules

### Input Validation
- Validate all user inputs using class-validator decorators
- Use DTOs with validation decorators for all request bodies
- Use parameterized queries for database operations
- Never interpolate user input directly into queries

### Authentication and Authorization
- Never store passwords in plain text
- Never log sensitive information
- Never expose API keys in responses
- Always verify user permissions using Guards
- Use secure session/token management

### Data Protection
- Never commit .env files
- Never commit credentials or secrets
- Never expose internal error messages to users
- Sanitize error messages in production
- Use exception filters to handle errors

## Code Structure

### File Organization
- One class per file (controller, service, module)
- Group related files in feature modules
- Use index files for barrel exports
- Keep files under 300 lines when possible

### Naming Conventions
- PascalCase for classes, types, and interfaces
- camelCase for variables, functions, and methods
- SCREAMING_SNAKE_CASE for constants
- kebab-case for file names (e.g., `user-profile.service.ts`)
- Suffix files appropriately (`.controller.ts`, `.service.ts`, `.module.ts`)

### TypeScript Requirements
- Always define types for function parameters
- Always define return types for functions
- Never use any type unless absolutely necessary
- Use interfaces for object shapes
- Use type for unions and primitives

## NestJS Backend Patterns

### CQRS Architecture
- Use Command Query Responsibility Segregation pattern
- Create Commands for write operations (create, update, delete)
- Create Queries for read operations
- Implement CommandHandlers and QueryHandlers
- Register handlers in module providers

### Module Organization
- Create feature modules for domain separation
- Import shared modules (PrismaModule, AuthModule, etc.)
- Export services that need to be shared
- Use global modules sparingly

### Controller Design
- Use decorators for route metadata (@Get, @Post, @Put, @Delete)
- Apply guards at controller or handler level
- Use DTOs for request validation
- Return consistent response structures
- Keep controllers thin - delegate to services

### Service Layer
- Mark services with @Injectable() decorator
- Inject dependencies through constructor
- Handle business logic in services
- Throw appropriate NestJS exceptions (HttpException, NotFoundException, etc.)

### Data Transfer Objects (DTOs)
- Use class-validator decorators for validation
- Use class-transformer for data transformation
- Create separate DTOs for create, update, and response
- Use enums for constrained values

### Guards and Middleware
- Create custom guards for authentication
- Implement role-based permission checks
- Use throttling guards for rate limiting
- Apply guards globally or per-route

### Database Access
- Use Prisma as the ORM
- Create PrismaService extending PrismaClient
- Handle database errors gracefully
- Use transactions for multi-step operations

### File Uploads
- Use Multer for file handling
- Upload files to cloud storage (Cloudinary)
- Validate file types and sizes
- Store file metadata in database

### WebSockets
- Use @nestjs/websockets for real-time features
- Create Gateway classes for WebSocket handlers
- Implement proper authentication for WebSocket connections
- Handle connection and disconnection events

## API Design

### Endpoints
- Use RESTful conventions for routes
- Use appropriate HTTP methods
- Return appropriate status codes
- Handle errors gracefully with exception filters
- Rate limit sensitive endpoints using @Throttle decorator

### Response Structure
- Use consistent response format
- Include appropriate metadata
- Handle pagination for list endpoints
- Use interceptors for response transformation

## Git and Version Control

### Commit Guidelines
- Write clear commit messages
- One logical change per commit
- Reference issue numbers when applicable
- Do not commit generated files
- Do not commit node_modules

### Branch Strategy
- Create feature branches for new work
- Keep branches focused and short-lived
- Delete merged branches

## Testing Requirements

### Test Coverage
- Write unit tests for services
- Write e2e tests for API endpoints
- Write tests for utility functions
- Test error scenarios

### Test Quality
- Use descriptive test names
- One assertion per test when possible
- Mock external dependencies (PrismaService, etc.)
- Clean up after tests

## Error Handling

### Exception Filters
- Create custom exception filters for specific error types
- Return user-friendly error messages
- Log errors for debugging
- Never expose stack traces in production

### Development Errors
- Use TypeScript strict mode
- Handle null and undefined cases
- Validate external data shapes
- Use NestJS built-in exceptions

## Dependency Management

### Package Selection
- Prefer well-maintained packages
- Check security advisories
- Pin major versions

### Updates
- Regularly update dependencies
- Test after updates
- Review changelogs for breaking changes
