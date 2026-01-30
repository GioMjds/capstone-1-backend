# Code Standards for NestJS

## Clean Architecture + Domain-Driven Design

## File Length Rules

### Maximum Lines Per File
- **Controllers**: 150-250 lines maximum
- **Use Cases**: 100-200 lines maximum
- **Domain Entities**: 150-250 lines maximum
- **Value Objects**: 50-100 lines maximum
- **Repository Implementations**: 200-300 lines maximum
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
- A domain entity has too many business rules (extract to domain services)
- A use case orchestrates too many operations (split into multiple use cases)

## Architecture Organization

### Clean Architecture Layers
```
src/
├── application/              -> Application Layer
│   ├── dto/                 -> Data Transfer Objects
│   │   ├── request/         -> Request DTOs
│   │   ├── response/        -> Response DTOs
│   │   └── index.ts
│   ├── events/              -> Application Events
│   │   ├── handlers/        -> Event Handlers
│   │   └── index.ts
│   ├── ports/               -> Port Interfaces (Dependency Inversion)
│   │   └── index.ts
│   ├── use-cases/           -> Use Case Implementations
│   │   └── index.ts
│   └── index.ts
├── domain/                   -> Domain Layer
│   ├── entities/            -> Domain Entities
│   │   └── index.ts
│   ├── interfaces/          -> Domain Interfaces
│   │   └── index.ts
│   ├── repositories/        -> Repository Interfaces
│   │   └── index.ts
│   ├── value-objects/       -> Value Objects
│   │   └── index.ts
│   └── index.ts
├── infrastructure/           -> Infrastructure Layer
│   ├── config/              -> Configuration
│   │   └── index.ts
│   ├── persistence/         -> Database Implementation
│   │   ├── prisma/
│   │   │   ├── repositories/  -> Repository Implementations
│   │   │   ├── mappers/       -> Entity-Model Mappers
│   │   │   └── prisma.service.ts
│   │   └── index.ts
│   └── index.ts
├── modules/                  -> Feature Modules
│   ├── feature-name/
│   │   ├── feature-name.module.ts
│   │   ├── feature-name.controller.ts
│   │   └── index.ts
│   └── index.ts
├── shared/                   -> Shared Resources
│   ├── decorators/
│   ├── docs/
│   ├── guards/
│   ├── interfaces/
│   └── utils/
└── index.ts
```

### Naming Conventions

#### Files
- **Modules**: kebab-case with `.module.ts` (e.g., `user-profile.module.ts`)
- **Controllers**: kebab-case with `.controller.ts` (e.g., `user-profile.controller.ts`)
- **Use Cases**: kebab-case with `.use-case.ts` (e.g., `create-user.use-case.ts`)
- **Domain Entities**: kebab-case with `.entity.ts` (e.g., `user.entity.ts`)
- **Value Objects**: kebab-case with `.value-object.ts` (e.g., `email.value-object.ts`)
- **Repository Interfaces**: kebab-case with `.repository.ts` (e.g., `user.repository.ts`)
- **Repository Implementations**: kebab-case with prefix (e.g., `prisma-user.repository.ts`)
- **Mappers**: kebab-case with `.mapper.ts` (e.g., `user.mapper.ts`)
- **DTOs**: kebab-case with `.dto.ts` (e.g., `create-user.dto.ts`)
- **Guards**: kebab-case with `.guard.ts` (e.g., `jwt-auth.guard.ts`)
- **Interceptors**: kebab-case with `.interceptor.ts` (e.g., `response.interceptor.ts`)
- **Ports**: kebab-case with `.port.ts` (e.g., `email-service.port.ts`)
- **Events**: kebab-case with `.event.ts` (e.g., `user-created.event.ts`)

#### Classes and Types
- **Classes**: PascalCase (e.g., `User`, `CreateUserUseCase`, `UserRepository`)
- **Interfaces**: PascalCase with `I` prefix for ports (e.g., `IUserRepository`, `IEmailService`)
- **DTOs**: PascalCase with descriptive suffix (e.g., `CreateUserDto`, `UserResponseDto`)
- **Value Objects**: PascalCase (e.g., `Email`, `Money`, `Address`)
- **Events**: PascalCase with `Event` suffix (e.g., `UserCreatedEvent`)
- **Constants**: SCREAMING_SNAKE_CASE for values (e.g., `MAX_RETRY_ATTEMPTS`)
- **Variables**: camelCase (e.g., `userName`, `userRepository`)
- **Functions**: camelCase (e.g., `createUser`, `validateEmail`)

## Code Style

### No Comments Rule
- Code should be self-documenting
- Use descriptive variable and function names
- Extract complex logic into well-named functions
- Only add comments for non-obvious business logic or complex algorithms
- Domain rules should be expressed in code, not comments

### File Structure
```list
1. Imports (NestJS core, third-party, local)
2. Types/Interfaces (if small, otherwise separate file)
3. Constants (if small, otherwise separate file)
4. Class definition with decorators
```

### Dependency Injection Pattern
- Inject dependencies through constructor
- Use readonly modifier for injected dependencies
- Keep constructor parameter count under 7
- Inject interfaces (ports), not concrete implementations
- Use string tokens for interface injection (e.g., `@Inject('IUserRepository')`)

## Layer-Specific Guidelines

### Domain Layer Rules
- **NO dependencies** on other layers
- **NO framework dependencies** (NestJS, Express, etc.)
- Pure business logic only
- Rich domain models with behavior
- Entities should validate their own state
- Value objects must be immutable
- Use factory methods for entity creation

```typescript
// ✅ GOOD - Rich domain entity
export class User {
  private constructor(
    public readonly id: string,
    public name: string,
    private email: Email, // Value object
  ) {}

  static create(props: CreateUserProps): User {
    const email = Email.create(props.email);
    return new User(uuid(), props.name, email);
  }

  changeName(newName: string): void {
    if (newName.length < 3) {
      throw new DomainException('Name too short');
    }
    this.name = newName;
  }
}

// ❌ BAD - Anemic domain model
export class User {
  id: string;
  name: string;
  email: string;
}
```

### Application Layer Rules
- Orchestrate domain logic
- Define use cases (one per class)
- Use DTOs for data transfer
- Depend on domain layer only
- Define ports (interfaces) for infrastructure
- Keep use cases focused on single responsibility

```typescript
// ✅ GOOD - Focused use case
@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(dto: CreateUserDto): Promise<UserResponseDto> {
    const user = User.create(dto);
    const savedUser = await this.userRepository.save(user);
    return this.toResponse(savedUser);
  }
}
```

### Infrastructure Layer Rules
- Implement ports defined in application layer
- Handle external dependencies (database, APIs, file system)
- Use mappers to convert between domain and persistence models
- Keep infrastructure details isolated

```typescript
// ✅ GOOD - Repository implementation
@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: UserMapper,
  ) {}

  async save(user: User): Promise<User> {
    const model = this.mapper.toPersistence(user);
    const saved = await this.prisma.user.upsert({
      where: { id: model.id },
      update: model,
      create: model,
    });
    return this.mapper.toDomain(saved);
  }
}
```

### Modules Layer Rules
- Keep controllers thin (orchestrators only)
- Delegate to use cases
- Handle HTTP concerns only
- Wire up dependencies
- Export only what's needed

```typescript
// ✅ GOOD - Thin controller
@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    return await this.createUserUseCase.execute(dto);
  }
}
```

### Shared Layer Rules
- No dependencies on feature modules
- Provide utilities and cross-cutting concerns
- Keep utilities pure when possible
- No business logic

## Refactoring Guidelines

### Signs Code Needs Refactoring
- More than 300 lines in a single file
- More than 7 injected dependencies
- Multiple unrelated responsibilities
- Difficult to test
- Domain logic in controllers or services
- Anemic domain models
- Fat services doing everything

### How to Refactor

#### 1. Extract Domain Logic
Move business rules from services to domain entities:
```typescript
// ❌ BEFORE - Logic in service
class UserService {
  updateEmail(user: User, newEmail: string) {
    if (!this.isValidEmail(newEmail)) {
      throw new Error('Invalid email');
    }
    user.email = newEmail;
  }
}

// ✅ AFTER - Logic in domain
class User {
  changeEmail(newEmail: string): void {
    const email = Email.create(newEmail); // Validates inside
    this.email = email;
  }
}
```

#### 2. Split Large Use Cases
Break down complex use cases into smaller, focused ones:
```typescript
// ❌ BEFORE - One large use case
class ManageUserUseCase {
  create() { }
  update() { }
  delete() { }
  activate() { }
}

// ✅ AFTER - Multiple focused use cases
class CreateUserUseCase { execute() { } }
class UpdateUserUseCase { execute() { } }
class DeleteUserUseCase { execute() { } }
class ActivateUserUseCase { execute() { } }
```

#### 3. Extract Value Objects
Encapsulate complex validations in value objects:
```typescript
// ❌ BEFORE - Validation scattered
if (email.length < 5 || !email.includes('@')) {
  throw new Error('Invalid email');
}

// ✅ AFTER - Value object
class Email {
  static create(value: string): Email {
    if (!this.isValid(value)) {
      throw new Error('Invalid email');
    }
    return new Email(value);
  }
}
```

#### 4. Use Ports for External Dependencies
Abstract infrastructure details behind interfaces:
```typescript
// ❌ BEFORE - Direct dependency
class UserService {
  constructor(private prisma: PrismaService) {}
}

// ✅ AFTER - Dependency inversion
class CreateUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private repository: IUserRepository,
  ) {}
}
```

## Testing Requirements

### Test Organization
```
__tests__/
├── unit/
│   ├── domain/           -> Test entities, value objects
│   ├── application/      -> Test use cases
│   └── infrastructure/   -> Test repositories, mappers
├── integration/
│   └── modules/          -> Test controllers, full flows
└── e2e/                  -> End-to-end API tests
```

### Testing Guidelines
- Domain entities should have extensive unit tests
- Use cases should be tested in isolation
- Mock repository interfaces in use case tests
- Test repository implementations with test database
- Test controllers with integration tests
- Keep tests focused and readable

## Best Practices Summary

### DO
✅ Use rich domain models with behavior
✅ Keep layers independent
✅ Use dependency inversion for infrastructure
✅ Create focused, single-purpose use cases
✅ Use value objects for complex validations
✅ Extract constants to separate files
✅ Use barrel exports (index.ts) in each folder
✅ Keep controllers thin
✅ Test domain logic thoroughly
✅ Use descriptive names

### DON'T
❌ Put business logic in controllers
❌ Create anemic domain models
❌ Mix layers (domain importing infrastructure)
❌ Create god classes doing everything
❌ Skip validation in domain layer
❌ Expose database models outside infrastructure
❌ Use concrete implementations in application layer
❌ Write comments instead of clear code
❌ Ignore the single responsibility principle

## File Size Targets by Type

| File Type | Target Lines | Max Lines | When to Split |
|-----------|-------------|-----------|---------------|
| Domain Entity | 100-150 | 250 | Extract domain services or value objects |
| Value Object | 30-50 | 100 | Extract validation logic |
| Use Case | 50-100 | 200 | Split into multiple use cases |
| Repository Implementation | 100-200 | 300 | Split by aggregate root |
| Controller | 50-100 | 150 | Split by bounded context |
| DTO | 20-50 | 100 | Split into request/response |
| Mapper | 50-100 | 200 | Split by complexity |
| Module | 30-50 | 100 | Already too large if over 100 |

## Code Review Checklist

### Architecture
- [ ] Domain layer has no dependencies
- [ ] Application layer uses ports for infrastructure
- [ ] Infrastructure implements domain interfaces
- [ ] No business logic in controllers
- [ ] Use cases are focused and single-purpose

### Code Quality
- [ ] Files under maximum line limits
- [ ] Clear, descriptive names
- [ ] No unnecessary comments
- [ ] Proper error handling
- [ ] TypeScript types defined

### Testing
- [ ] Domain entities have unit tests
- [ ] Use cases have isolated tests
- [ ] Repository tests use test database
- [ ] Controllers have integration tests

### Clean Code
- [ ] No console.log statements
- [ ] No TODO/FIXME comments
- [ ] No placeholder data
- [ ] Proper exception handling
- [ ] Consistent formatting