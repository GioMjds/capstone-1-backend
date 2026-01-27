# AI Coding Rules and Standards for NestJS

## Clean Architecture + Domain-Driven Design

## Code Quality Standards

### No Comments Policy
- Do not write inline comments in code
- Do not write block comments
- Do not write JSDoc comments unless explicitly requested
- Code should be self-documenting through clear naming
- Use descriptive variable and function names instead of comments
- Business rules should be expressed in code, not comments

### Clean Code Requirements
- Write code without placeholder data or mock content
- Minimal comments only for complex algorithms that cannot be simplified
- Keep functions and methods short and focused (under 20 lines when possible)
- Remove all console.log statements before committing
- Remove all debugging code before committing
- Do not leave TODO comments in production code
- Do not leave FIXME comments in production code
- Avoid magic numbers - use named constants

## Clean Architecture Principles

### Dependency Rule
- **Domain Layer**: NO dependencies on any other layer
- **Application Layer**: Depends ONLY on domain layer
- **Infrastructure Layer**: Implements interfaces from application/domain
- **Modules Layer**: Depends on application, domain, and infrastructure
- **Shared Layer**: Used by all, depends on nothing

### Layer Responsibilities

#### Domain Layer (Business Logic)
- Define business entities with rich behavior
- Define value objects for complex validations
- Define repository interfaces (abstractions)
- Define domain services for cross-entity operations
- Enforce business rules and invariants
- NO framework dependencies (NestJS, Express, Prisma)
- NO infrastructure concerns (database, HTTP, file system)

#### Application Layer (Use Cases)
- Orchestrate business logic execution
- Define use cases (one per operation)
- Define DTOs for data transfer
- Define port interfaces for external dependencies
- Handle application events
- Coordinate multiple domain operations
- Transform domain entities to DTOs

#### Infrastructure Layer (Technical Details)
- Implement repository interfaces from domain
- Handle database operations (Prisma)
- Implement external service integrations
- Handle file storage (Cloudinary)
- Provide configuration management
- Map between domain entities and persistence models

#### Modules Layer (Entry Points)
- Define feature modules
- Provide HTTP endpoints (controllers)
- Handle request/response transformation
- Apply guards and interceptors
- Wire up dependencies
- Keep controllers thin (delegate to use cases)

#### Shared Layer (Cross-Cutting)
- Provide utilities and helpers
- Define custom decorators
- Define guards for authentication/authorization
- Provide API documentation helpers
- NO feature-specific logic

## Domain-Driven Design Rules

### Entities (Domain Objects with Identity)
```typescript
// ✅ GOOD - Rich entity with behavior
export class User {
  private constructor(
    public readonly id: string,
    public name: string,
    private email: Email, // Value object
    private password: string,
  ) {}

  static create(props: CreateUserProps): User {
    const email = Email.create(props.email);
    // Business validation
    if (props.name.length < 3) {
      throw new DomainException('Name must be at least 3 characters');
    }
    return new User(uuid(), props.name, email, props.password);
  }

  changeName(newName: string): void {
    if (newName.length < 3) {
      throw new DomainException('Name must be at least 3 characters');
    }
    this.name = newName;
  }

  changeEmail(newEmail: string): void {
    this.email = Email.create(newEmail); // Validates inside
  }

  verifyPassword(password: string): boolean {
    return bcrypt.compareSync(password, this.password);
  }
}

// ❌ BAD - Anemic entity (just data holder)
export class User {
  id: string;
  name: string;
  email: string;
  password: string;
}
```

### Value Objects (Domain Concepts Defined by Values)
```typescript
// ✅ GOOD - Immutable value object with validation
export class Email {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(email: string): Email {
    if (!this.isValid(email)) {
      throw new DomainException('Invalid email format');
    }
    return new Email(email.toLowerCase());
  }

  private static isValid(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}

// ❌ BAD - Just using string (no validation or encapsulation)
let email: string = userInput;
```

### Repository Pattern (Data Access Abstraction)
```typescript
// ✅ GOOD - Interface in domain, implementation in infrastructure
// domain/repositories/user.repository.ts
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<User>;
  delete(id: string): Promise<void>;
}

// infrastructure/persistence/prisma/repositories/prisma-user.repository.ts
@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: UserMapper,
  ) {}

  async findById(id: string): Promise<User | null> {
    const model = await this.prisma.user.findUnique({ where: { id } });
    return model ? this.mapper.toDomain(model) : null;
  }

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

// ❌ BAD - Direct database access in use case
class CreateUserUseCase {
  constructor(private prisma: PrismaService) {}
  
  async execute(dto: CreateUserDto) {
    return this.prisma.user.create({ data: dto }); // Wrong!
  }
}
```

### Use Cases (Application Operations)
```typescript
// ✅ GOOD - Focused use case using dependency inversion
@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IEmailService')
    private readonly emailService: IEmailService,
  ) {}

  async execute(dto: CreateUserDto): Promise<UserResponseDto> {
    // Check if user exists
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('User already exists');
    }

    // Create domain entity (business validation happens here)
    const user = User.create(dto);

    // Save to database
    const savedUser = await this.userRepository.save(user);

    // Send welcome email
    await this.emailService.sendWelcome(savedUser.email);

    // Return DTO
    return this.toResponse(savedUser);
  }

  private toResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.getEmail(),
    };
  }
}

// ❌ BAD - Everything in controller or service
@Controller('users')
export class UserController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    // Validation
    if (!dto.email.includes('@')) {
      throw new BadRequestException('Invalid email');
    }
    // Check exists
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) {
      throw new ConflictException('User exists');
    }
    // Create
    return this.prisma.user.create({ data: dto });
  }
}
```

### Mappers (Domain <-> Persistence Transformation)
```typescript
// ✅ GOOD - Separate mapper for transformation
@Injectable()
export class UserMapper {
  toDomain(model: PrismaUser): User {
    return User.reconstitute({
      id: model.id,
      name: model.name,
      email: model.email,
      password: model.password,
    });
  }

  toPersistence(entity: User): PrismaUserModel {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.getEmail(),
      password: entity.getPassword(),
    };
  }
}
```

## Security Rules

### Input Validation
- Validate all user inputs using class-validator decorators in DTOs
- Use DTOs with validation decorators for all request bodies
- Never trust client-side validation alone
- Validate at application layer (DTOs) AND domain layer (entities)
- Use parameterized queries for database operations
- Never interpolate user input directly into queries
- Sanitize file names and paths
- Validate file types and sizes for uploads

### Authentication and Authorization
- Never store passwords in plain text (use bcrypt)
- Never log sensitive information (passwords, tokens, API keys)
- Never expose API keys in responses
- Always verify user permissions using Guards
- Use secure session/token management (JWT)
- Implement refresh token rotation
- Apply rate limiting to authentication endpoints
- Implement account lockout after failed attempts

### Data Protection
- Never commit .env files
- Never commit credentials or secrets
- Never expose internal error messages to users
- Sanitize error messages in production
- Use exception filters to handle errors gracefully
- Implement proper CORS configuration
- Use HTTPS in production
- Encrypt sensitive data at rest

## Code Structure

### File Organization
- One class per file (entity, use case, controller, service)
- Group related files in appropriate layers
- Use index files for barrel exports
- Keep files under 300 lines
- Split large files by responsibility

### Layer-Specific File Locations
```
src/
├── application/
│   ├── dto/                    -> DTOs for data transfer
│   ├── events/                 -> Application events
│   ├── ports/                  -> Interface definitions
│   └── use-cases/              -> Use case implementations
├── domain/
│   ├── entities/               -> Domain entities (business objects)
│   ├── interfaces/             -> Domain service interfaces
│   ├── repositories/           -> Repository interfaces
│   └── value-objects/          -> Value objects
├── infrastructure/
│   ├── config/                 -> Configuration management
│   └── persistence/
│       └── prisma/
│           ├── repositories/   -> Repository implementations
│           └── mappers/        -> Entity-Model mappers
├── modules/
│   └── feature-name/
│       ├── *.module.ts         -> Module definition
│       ├── *.controller.ts     -> HTTP endpoints
│       └── *.service.ts        -> Coordination layer
└── shared/
    ├── decorators/             -> Custom decorators
    ├── docs/                   -> API documentation
    ├── guards/                 -> Guards
    ├── interfaces/             -> Shared interfaces
    └── utils/                  -> Utility functions
```

### Naming Conventions
- **Files**: kebab-case with appropriate suffix
  - `user.entity.ts`, `create-user.use-case.ts`, `user.repository.ts`
- **Classes**: PascalCase
  - `User`, `CreateUserUseCase`, `UserRepository`
- **Interfaces**: PascalCase with `I` prefix for ports
  - `IUserRepository`, `IEmailService`
- **Variables**: camelCase
  - `userName`, `userRepository`, `emailService`
- **Constants**: SCREAMING_SNAKE_CASE
  - `MAX_LOGIN_ATTEMPTS`, `TOKEN_EXPIRY_TIME`

### TypeScript Requirements
- Always define types for function parameters
- Always define return types for functions
- Never use `any` type unless absolutely necessary (use `unknown` instead)
- Use interfaces for object shapes in domain
- Use type for unions and primitives
- Enable strict mode in tsconfig.json
- Handle null and undefined cases explicitly
- Use optional chaining (?.) and nullish coalescing (??) operators

## NestJS Backend Patterns

### Module Organization
```typescript
// ✅ GOOD - Proper dependency wiring
@Module({
  imports: [
    PrismaModule,
    // Other modules
  ],
  controllers: [UserController],
  providers: [
    // Use Cases
    CreateUserUseCase,
    UpdateUserUseCase,
    
    // Repositories (with interface binding)
    {
      provide: 'IUserRepository',
      useClass: PrismaUserRepository,
    },
    
    // Mappers
    UserMapper,
    
    // Services (thin coordinators)
    UserService,
  ],
  exports: [UserService],
})
export class UserModule {}
```

### Controller Design
```typescript
// ✅ GOOD - Thin controller delegating to use cases
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
  ) {}

  @Post()
  @CreateUserDocs() // API documentation decorator
  async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    return await this.createUserUseCase.execute(dto);
  }

  @Get(':id')
  @GetUserDocs()
  async getById(@Param('id') id: string): Promise<UserResponseDto> {
    return await this.getUserUseCase.execute(id);
  }

  @Patch(':id')
  @UpdateUserDocs()
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return await this.updateUserUseCase.execute(id, dto);
  }
}

// ❌ BAD - Fat controller with business logic
@Controller('users')
export class UserController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    if (!dto.email.includes('@')) throw new Error('Invalid');
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) throw new Error('Exists');
    return this.prisma.user.create({ data: dto });
  }
}
```

### Data Transfer Objects (DTOs)
```typescript
// ✅ GOOD - DTOs with validation in application layer
// application/dto/request/create-user.dto.ts
export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain uppercase, lowercase, and number',
  })
  password: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}

// application/dto/response/user-response.dto.ts
export class UserResponseDto {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}
```

### Guards and Middleware
```typescript
// ✅ GOOD - Custom guard in shared layer
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);
    
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = this.jwtService.verify(token);
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractToken(request: any): string | null {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }
}
```

### Event-Driven Architecture
```typescript
// ✅ GOOD - Application events
// application/events/user-created.event.ts
export class UserCreatedEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string,
  ) {}
}

// application/events/handlers/send-welcome-email.handler.ts
@Injectable()
export class SendWelcomeEmailHandler {
  constructor(
    @Inject('IEmailService')
    private readonly emailService: IEmailService,
  ) {}

  @OnEvent('user.created')
  async handle(event: UserCreatedEvent): Promise<void> {
    await this.emailService.sendWelcome(event.email);
  }
}

// Use case emitting event
@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(dto: CreateUserDto): Promise<UserResponseDto> {
    const user = User.create(dto);
    const savedUser = await this.userRepository.save(user);
    
    // Emit event
    this.eventEmitter.emit('user.created', new UserCreatedEvent(
      savedUser.id,
      savedUser.getEmail(),
    ));
    
    return this.toResponse(savedUser);
  }
}
```

## API Design

### RESTful Endpoints
- Use appropriate HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Use plural nouns for resources (`/users`, not `/user`)
- Use nested routes for relationships (`/users/:id/posts`)
- Return appropriate status codes:
  - 200 OK - Successful GET, PUT, PATCH
  - 201 Created - Successful POST
  - 204 No Content - Successful DELETE
  - 400 Bad Request - Validation errors
  - 401 Unauthorized - Authentication required
  - 403 Forbidden - Insufficient permissions
  - 404 Not Found - Resource not found
  - 409 Conflict - Resource conflict
  - 500 Internal Server Error - Server errors

### Response Structure
```typescript
// ✅ GOOD - Consistent response structure
{
  "data": { /* resource */ },
  "meta": {
    "timestamp": "2024-01-27T10:00:00Z",
    "version": "1.0"
  }
}

// For lists with pagination
{
  "data": [ /* resources */ ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}

// For errors
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  }
}
```

## Error Handling

### Exception Hierarchy
```typescript
// ✅ GOOD - Custom domain exceptions
export class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainException';
  }
}

export class EntityNotFoundException extends DomainException {
  constructor(entityName: string, id: string) {
    super(`${entityName} with id ${id} not found`);
  }
}

// Use in domain
if (!user) {
  throw new EntityNotFoundException('User', userId);
}
```

### Exception Filters
```typescript
// ✅ GOOD - Global exception filter
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    } else if (exception instanceof DomainException) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
    }

    // Log error (don't expose to client in production)
    console.error(exception);

    response.status(status).json({
      error: {
        statusCode: status,
        message: message,
        timestamp: new Date().toISOString(),
        path: request.url,
      },
    });
  }
}
```

## Testing Requirements

### Test Structure
```
__tests__/
├── unit/
│   ├── domain/                 -> Entity and value object tests
│   ├── application/            -> Use case tests
│   └── infrastructure/         -> Repository tests
├── integration/
│   └── modules/                -> Controller and API tests
└── e2e/                        -> End-to-end API tests
```

### Unit Testing Domain
```typescript
// ✅ GOOD - Domain entity tests
describe('User Entity', () => {
  describe('create', () => {
    it('should create user with valid data', () => {
      const user = User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      expect(user.id).toBeDefined();
      expect(user.name).toBe('John Doe');
    });

    it('should throw error for short name', () => {
      expect(() => {
        User.create({
          name: 'Jo',
          email: 'john@example.com',
          password: 'password123',
        });
      }).toThrow('Name must be at least 3 characters');
    });
  });
});
```

### Testing Use Cases
```typescript
// ✅ GOOD - Use case tests with mocks
describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let mockRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockRepository = {
      findByEmail: jest.fn(),
      save: jest.fn(),
    } as any;

    useCase = new CreateUserUseCase(mockRepository);
  });

  it('should create user successfully', async () => {
    mockRepository.findByEmail.mockResolvedValue(null);
    mockRepository.save.mockResolvedValue(expect.any(User));

    const dto = { name: 'John', email: 'john@example.com', password: 'pass123' };
    const result = await useCase.execute(dto);

    expect(result).toBeDefined();
    expect(mockRepository.save).toHaveBeenCalled();
  });

  it('should throw error if user exists', async () => {
    mockRepository.findByEmail.mockResolvedValue(new User(/* ... */));

    const dto = { name: 'John', email: 'john@example.com', password: 'pass123' };
    
    await expect(useCase.execute(dto)).rejects.toThrow('User already exists');
  });
});
```

## Git and Version Control

### Commit Guidelines
- Write clear, descriptive commit messages
- Use conventional commits format:
  - `feat:` for new features
  - `fix:` for bug fixes
  - `refactor:` for code refactoring
  - `docs:` for documentation changes
  - `test:` for test changes
  - `chore:` for maintenance tasks
- One logical change per commit
- Reference issue numbers when applicable
- Do not commit generated files
- Do not commit node_modules
- Do not commit .env files

### Branch Strategy
- Create feature branches for new work (`feature/user-authentication`)
- Use descriptive branch names
- Keep branches focused and short-lived
- Delete merged branches
- Review code before merging

## Performance Considerations

### Database Queries
- Use appropriate indexes
- Avoid N+1 query problems
- Use pagination for large datasets
- Use select to fetch only needed fields
- Use transactions for multi-step operations
- Consider caching for frequently accessed data

### API Optimization
- Implement rate limiting with @Throttle decorator
- Use compression middleware
- Implement proper caching strategies
- Use DTOs to control response shape
- Avoid exposing entire entities

## Summary: Clean Architecture Checklist

### ✅ DO
- Keep domain layer pure (no framework dependencies)
- Use rich domain models with behavior
- Create focused, single-purpose use cases
- Use dependency inversion for infrastructure
- Test domain logic thoroughly
- Use value objects for complex validations
- Implement proper error handling at each layer
- Keep controllers thin (orchestrators only)
- Use descriptive names for everything
- Apply SOLID principles

### ❌ DON'T
- Put business logic in controllers
- Create anemic domain models (just data holders)
- Mix layer concerns (domain importing infrastructure)
- Use concrete implementations in application layer
- Skip validation in domain layer
- Expose database models outside infrastructure
- Write comments instead of clear code
- Create god classes doing everything
- Use `any` type in TypeScript
- Commit sensitive data or configuration
