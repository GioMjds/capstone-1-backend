# Code Standards for NestJS

## File Length Rules

### Maximum Lines Per File
- **Controllers**: 150-200 lines maximum
- **Services**: 200-300 lines maximum
- **Modules**: 50-100 lines maximum
- **DTOs**: 50-100 lines maximum
- **Utilities/Helpers**: 100-150 lines maximum
- **Types/Interfaces**: 50-100 lines maximum
- **Constants**: 50-100 lines maximum
- **API Documentations**: 200+ lines per feature allowed

### When to Split Files
Split a file when:
- It exceeds 300 lines
- It contains more than 3 distinct responsibilities
- It has more than 5 exported functions/classes
- Testing becomes difficult due to complexity

## Module Organization

### Folder Structure
```
modules/
├── feature-name/
│   ├── index.ts                    (exports)
│   ├── feature-name.module.ts      (module definition)
│   ├── feature-name.controller.ts  (HTTP handlers)
│   ├── feature-name.service.ts     (business logic)
│   ├── commands/                   (CQRS commands)
│   │   ├── handlers/
│   │   └── impl/
│   ├── queries/                    (CQRS queries)
│   │   ├── handlers/
│   │   └── impl/
│   ├── dto/                        (data transfer objects)
│   ├── entities/                   (domain entities)
│   ├── interfaces/                 (types and interfaces)
│   └── constants.ts                (constants)
```

### Naming Conventions
- Modules: kebab-case with `.module.ts` suffix (e.g., `user-profile.module.ts`)
- Controllers: kebab-case with `.controller.ts` suffix (e.g., `user-profile.controller.ts`)
- Services: kebab-case with `.service.ts` suffix (e.g., `user-profile.service.ts`)
- DTOs: PascalCase with descriptive suffix (e.g., `CreateUserDto`, `UpdateUserDto`)
- Guards: kebab-case with `.guard.ts` suffix (e.g., `jwt-auth.guard.ts`)
- Interceptors: kebab-case with `.interceptor.ts` suffix (e.g., `response.interceptor.ts`)
- Constants: SCREAMING_SNAKE_CASE for values
- Types/Interfaces: PascalCase with descriptive names

## Code Style

### No Comments Rule
- Code should be self-documenting
- Use descriptive variable and function names
- Extract complex logic into well-named functions
- Only add comments for non-obvious business logic

### File Structure
```typescript
// 1. Imports (NestJS core, third-party, local)
// 2. Types/Interfaces (if small, otherwise separate file)
// 3. Constants (if small, otherwise separate file)
// 4. Class definition with decorators
```

### Dependency Injection Pattern
- Inject dependencies through constructor
- Use readonly modifier for injected dependencies
- Keep constructor parameter count under 7

## Refactoring Guidelines

### Signs a Service/Controller Needs Refactoring
- More than 300 lines
- More than 7 injected dependencies
- Multiple unrelated responsibilities
- Difficult to test

### How to Refactor
1. Extract constants to separate file
2. Extract types to separate file
3. Split into multiple services by responsibility
4. Use CQRS pattern for complex operations
5. Keep controller as thin orchestrator only
