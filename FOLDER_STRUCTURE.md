# **NestJS Backend Folder Structure Guide**

## Clean Architecture + Domain-Driven Design

This documentation serves as a contributor's guide for maintaining the design architecture in this NestJS backend following **Clean Architecture** and **Domain-Driven Design (DDD)** principles. Please read this document along with **`CONTRIBUTING.md`** and **`AI_ASSISTED_CODING.md`** before working on this project.

---

## **Why This Folder Structure?**

This architecture focuses on:

- **Separation of Concerns**: Clear boundaries between layers
- **Maintainability**: Easy to locate and modify code
- **Scalability**: Structure supports growth from monolith to microservices
- **Testability**: Each layer can be tested independently
- **Domain-Centric**: Business logic takes center stage
- **Production-Ready**: Battle-tested patterns for enterprise applications

---

## **NestJS CLI Usage**

The NestJS CLI is configured to work with our Clean Architecture structure. The `nest-cli.json` file is optimized for this layout.

### **Installation**

Install NestJS CLI globally if you haven't already:

```bash
npm install -g @nestjs/cli
```

Verify installation:

```bash
nest --version
```

### **Generating Modules**

For feature modules in our architecture:

```bash
# Generate a complete feature module
nest g module feature-name

# You'll be prompted to select the project location
# Choose 'modules' for feature modules
```

**Example:**

```bash
nest generate module user
```

### **Post-Generation Steps**

After generating resources:

1. Move generated files to appropriate layers if needed
2. Update DTOs with validation decorators (`class-validator`)
3. Create domain entities in `domain/entities/`
4. Add barrel exports in `index.ts` files
5. Import the module in `app.module.ts`
6. Follow naming conventions from `AI_ASSISTED_CODING.md`
7. Ensure code adheres to `code_standards.instructions.md`

---

## **Architecture Overview**

```folder
src/
├── application/        -> Application Layer (Use Cases & Application Logic)
├── domain/             -> Domain Layer (Business Logic & Entities)
├── infrastructure/     -> Infrastructure Layer (External Concerns)
├── modules/            -> Feature Modules (Entry Points)
├── shared/             -> Shared Utilities & Constants
├── app.module.ts       -> Root Module
└── main.ts             -> Application Bootstrap
```

---

## **Complete Folder Structure**

```folder
project-root/
├── __tests__/                        -> Jest test files
├── prisma/
│   ├── schema.prisma                -> Database schema definitions
│   └── scripts/                     -> Database-related scripts
├── src/
│   ├── application/                 -> Application Layer
│   │   ├── dto/                     -> Data Transfer Objects
│   │   │   ├── *.dto.ts
│   │   │   └── index.ts
│   │   ├── events/                  -> Application Events
│   │   │   ├── *.event.ts
│   │   │   └── index.ts
│   │   ├── ports/                   -> Port Interfaces (Dependency Inversion)
│   │   │   ├── *.port.ts
│   │   │   └── index.ts
│   │   ├── use-cases/               -> Use Case Implementations
│   │   │   ├── *.use-case.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── domain/                      -> Domain Layer
│   │   ├── entities/                -> Domain Entities (Business Objects)
│   │   │   ├── *.entity.ts
│   │   │   └── index.ts
│   │   ├── interfaces/              -> Domain Interfaces
│   │   │   ├── *.interface.ts
│   │   │   └── index.ts
│   │   ├── repositories/            -> Repository Interfaces (Abstractions)
│   │   │   ├── *.repository.ts
│   │   │   └── index.ts
│   │   ├── value-objects/           -> Value Objects (Immutable Domain Concepts)
│   │   │   ├── *.value-object.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── infrastructure/              -> Infrastructure Layer
│   │   ├── config/                  -> Configuration Files
│   │   │   ├── *.config.ts
│   │   │   └── index.ts
│   │   ├── persistence/             -> Database Implementation
│   │   │   ├── prisma/
│   │   │   │   ├── repositories/   -> Concrete Repository Implementations
│   │   │   │   ├── mappers/        -> Entity-Model Mappers
│   │   │   │   └── prisma.service.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── modules/                     -> Feature Modules (Presentation Layer)
│   │   ├── admin/
│   │   │   ├── admin.module.ts
│   │   │   ├── admin.controller.ts
│   │   │   ├── admin.service.ts
│   │   │   └── index.ts
│   │   ├── email/
│   │   │   ├── email.module.ts
│   │   │   ├── email.service.ts
│   │   │   └── index.ts
│   │   ├── identity/
│   │   │   ├── identity.module.ts
│   │   │   ├── identity.controller.ts
│   │   │   ├── identity.service.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── shared/                      -> Shared Resources
│   │   ├── decorators/              -> Custom Decorators
│   │   │   ├── *.decorator.ts
│   │   │   └── index.ts
│   │   ├── docs/                    -> API Documentation Decorators
│   │   │   ├── *.docs.ts
│   │   │   └── index.ts
│   │   ├── guards/                  -> Authorization Guards
│   │   │   ├── *.guard.ts
│   │   │   └── index.ts
│   │   ├── interfaces/              -> Shared Interfaces
│   │   │   ├── *.interface.ts
│   │   │   └── index.ts
│   │   ├── utils/                   -> Utility Functions
│   │   │   ├── *.util.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── app.module.ts
│   └── main.ts
├── .env
├── .env.example
├── nest-cli.json
├── package.json
└── tsconfig.json
```

**Important Note**: Each folder should contain an `index.ts` file for barrel exports and a `types.ts` file for TypeScript type definitions where applicable.

---

## **Layer Responsibilities**

### **1. Application Layer** (`src/application/`)

The application layer orchestrates the flow of data and coordinates business logic execution.

#### **`dto/`** - Data Transfer Objects

**Purpose**: Define the shape of data coming in and going out of the application.

**Contents**:

- Request DTOs with validation decorators
- Response DTOs for API responses
- Internal DTOs for inter-layer communication

**Best Practices**:

- Use `class-validator` decorators for validation
- Keep DTOs flat and simple
- Separate request and response DTOs
- Use transformation decorators when needed

**Example**:

```typescript
// create-user.dto.ts
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
```

#### **`events/`** - Application Events

**Purpose**: Define events that occur in the application for event-driven architecture.

**Contents**:

- Event class definitions
- Event handlers
- Event publishers

**Best Practices**:

- Events should be immutable
- Name events in past tense (e.g., `UserCreatedEvent`)
- Keep events focused on a single occurrence

#### **`ports/`** - Port Interfaces

**Purpose**: Define interfaces (contracts) for external dependencies following the Dependency Inversion Principle.

**Contents**:

- Repository port interfaces
- External service interfaces
- Infrastructure abstractions

**Best Practices**:

- Define what the application needs, not how it's implemented
- Keep ports technology-agnostic
- Use ports for all external dependencies

**Example**:

```typescript
// user-repository.port.ts
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<User>;
  delete(id: string): Promise<void>;
}
```

#### **`use-cases/`** - Use Case Implementations

**Purpose**: Implement specific business use cases and application workflows.

**Contents**:

- Business logic orchestration
- Use case classes
- Application service implementations

**Best Practices**:

- One use case per class
- Use dependency injection for ports
- Keep use cases focused and cohesive
- Return domain entities or DTOs

**Example**:

```typescript
// create-user.use-case.ts
@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(dto: CreateUserDto): Promise<User> {
    const user = User.create(dto);
    return await this.userRepository.save(user);
  }
}
```

---

### **2. Domain Layer** (`src/domain/`)

The domain layer contains the core business logic and rules. This is the heart of your application.

#### **`entities/`** - Domain Entities

**Purpose**: Represent business objects with identity and lifecycle.

**Contents**:

- Domain entities with business rules
- Entity methods that enforce business logic
- Factory methods for entity creation

**Best Practices**:

- Entities should be rich with behavior
- Encapsulate business rules within entities
- Use private constructors with factory methods
- Validate state changes within the entity

**Example**:

```typescript
// user.entity.ts
export class User {
  private constructor(
    public readonly id: string,
    public name: string,
    public email: string,
    private password: string,
  ) {}

  static create(props: CreateUserProps): User {
    // Business validation
    if (props.name.length < 3) {
      throw new Error('Name must be at least 3 characters');
    }
    return new User(uuid(), props.name, props.email, props.password);
  }

  changeName(newName: string): void {
    if (newName.length < 3) {
      throw new Error('Name must be at least 3 characters');
    }
    this.name = newName;
  }
}
```

#### **`interfaces/`** - Domain Interfaces

**Purpose**: Define contracts and abstractions within the domain.

**Contents**:

- Domain service interfaces
- Business rule interfaces
- Domain-specific contracts

**Best Practices**:

- Keep interfaces focused on domain concepts
- Avoid infrastructure concerns
- Use for polymorphic behavior in the domain

#### **`repositories/`** - Repository Interfaces

**Purpose**: Define how domain entities are persisted and retrieved (abstractions only).

**Contents**:

- Repository interface definitions
- Specification patterns
- Query interfaces

**Best Practices**:

- Define repository methods in terms of domain operations
- Keep repositories focused on a single aggregate
- Return domain entities, not database models

**Example**:

```typescript
// user.repository.ts
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<User>;
  delete(id: string): Promise<void>;
  findAll(): Promise<User[]>;
}
```

#### **`value-objects/`** - Value Objects

**Purpose**: Represent domain concepts that are defined by their attributes, not identity.

**Contents**:

- Immutable value objects
- Value object validation
- Value object operations

**Best Practices**:

- Value objects should be immutable
- Implement equality based on values
- Encapsulate complex validations
- Use for concepts like Email, Money, Address

**Example**:

```typescript
// email.value-object.ts
export class Email {
  private constructor(private readonly value: string) {}

  static create(email: string): Email {
    if (!this.isValid(email)) {
      throw new Error('Invalid email format');
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
```

---

### **3. Infrastructure Layer** (`src/infrastructure/`)

The infrastructure layer provides implementations for external concerns and technical capabilities.

#### **`config/`** - Configuration

**Purpose**: Centralized application configuration and environment management.

**Contents**:

- Environment-based configuration
- Configuration modules
- Validation schemas

**Best Practices**:

- Use `@nestjs/config` for configuration management
- Validate configuration at startup
- Use typed configuration objects
- Avoid direct `process.env` access outside this layer

**Example**:

```typescript
// database.config.ts
import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  url: process.env.DATABASE_URL,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 5432,
}));
```

#### **`persistence/`** - Data Persistence

**Purpose**: Implement data storage and retrieval mechanisms.

**Contents**:

- **`prisma/`**: Prisma-specific implementations
  - **`repositories/`**: Concrete repository implementations
  - **`mappers/`**: Convert between domain entities and Prisma models
  - **`prisma.service.ts`**: Prisma client service

**Best Practices**:

- Implement repository interfaces from the domain layer
- Use mappers to convert between domain and persistence models
- Keep database concerns isolated
- Never expose database models outside infrastructure

**Example**:

```typescript
// prisma-user.repository.ts
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
```

---

### **4. Modules Layer** (`src/modules/`)

The modules layer contains feature-based modules that serve as entry points for specific functionalities.

#### **Purpose**

- Group related controllers, services, and dependencies
- Define module boundaries
- Export functionality for use by other modules
- Wire up dependencies (controllers, providers)

#### **Structure**

Each module typically contains:

- `*.module.ts` - Module definition with imports, controllers, providers, exports
- `*.controller.ts` - HTTP endpoints and request handling
- `*.service.ts` - Coordination between use cases and application logic
- `*.gateway.ts` - WebSocket gateway (optional)
- `index.ts` - Barrel exports

#### **Best Practices**

- Keep modules focused on a single feature or bounded context
- Controllers should delegate to use cases or services
- Services in this layer should be thin coordinators
- Import domain and application layers as needed
- Export only what other modules need

**Example**:

```typescript
// identity.module.ts
@Module({
  imports: [
    // Import other modules
  ],
  controllers: [IdentityController],
  providers: [
    IdentityService,
    CreateUserUseCase,
    {
      provide: 'IUserRepository',
      useClass: PrismaUserRepository,
    },
  ],
  exports: [IdentityService],
})
export class IdentityModule {}
```

---

### **5. Shared Layer** (`src/shared/`)

The shared layer contains reusable utilities, constants, and cross-cutting concerns.

#### **`decorators/`** - Custom Decorators

**Purpose**: Provide syntactic sugar and metadata for cleaner code.

**Contents**:

- `@CurrentUser()` - Extract user from request
- `@Roles()` - Define required roles
- `@Public()` - Mark endpoints as public

**Best Practices**:

- Decorators should only define metadata
- Keep decorators simple and focused
- Business logic belongs in guards or interceptors

#### **`docs/`** - API Documentation

**Purpose**: Centralize Swagger/OpenAPI documentation.

**Contents**:

- Documentation decorators for endpoints
- API schemas and examples
- Documentation utilities

**Best Practices**:

- Separate documentation from business logic
- Be descriptive about inputs, outputs, and errors
- Include examples for complex requests/responses

#### **`guards/`** - Authorization Guards

**Purpose**: Implement request-level authorization and access control.

**Contents**:

- Authentication guards (JWT, API key)
- Role-based access control guards
- Permission guards

**Best Practices**:

- Keep guards focused on a single concern
- Read metadata from decorators
- Return clear error messages

#### **`interfaces/`** - Shared Interfaces

**Purpose**: Define contracts used across multiple layers.

**Contents**:

- Common interfaces
- Type definitions
- Shared abstractions

**Best Practices**:

- Use for cross-layer contracts
- Avoid feature-specific interfaces
- Keep interfaces minimal

#### **`utils/`** - Utility Functions

**Purpose**: Provide common helper functions.

**Contents**:

- String manipulation
- Date formatting
- Validation helpers
- Common algorithms

**Best Practices**:

- Keep utilities pure functions when possible
- No feature-specific logic
- Well-tested and documented

---

## **Barrel Exporting Pattern**

Each folder should have an `index.ts` file that exports all its contents. This enables clean imports throughout the application.

**Example**:

```typescript
// domain/entities/index.ts
export * from './user.entity';
export * from './post.entity';
export * from './comment.entity';
```

**Usage**:

```typescript
// Instead of:
import { User } from '@/domain/entities/user.entity';
import { Post } from '@/domain/entities/post.entity';

// You can do:
import { User, Post } from '@/domain/entities';
```

---

## **Mental Model**

Understanding the flow through layers:

```list
Request -> Module (Controller)
   |
   v
Application Layer (Use Cases/DTOs)
   |
   v
Domain Layer (Entities/Business Logic)
   |
   v
Infrastructure Layer (Repositories/Persistence)
   |
   v
Database
```

**Key Principles**:

- **`domain/`** - WHAT the business does (pure business logic)
- **`application/`** - HOW to execute business logic (orchestration)
- **`infrastructure/`** - WHERE things are stored/implemented (technical details)
- **`modules/`** - ENTRY POINTS for features (HTTP, WebSocket, etc.)
- **`shared/`** - CROSS-CUTTING concerns (used everywhere)

---

## **Dependency Flow Rules**

To maintain clean architecture:

```list
modules -> application -> domain
   |           |
   v           v
infrastructure
```

**Rules**:

1. ✅ **Domain** depends on nothing (pure business logic)
2. ✅ **Application** depends on domain (uses domain entities and interfaces)
3. ✅ **Infrastructure** implements domain/application interfaces
4. ✅ **Modules** depend on application, domain, and infrastructure
5. ✅ **Shared** is used by all layers but depends on nothing

6. ❌ **Domain** should NEVER import from application or infrastructure
7. ❌ **Application** should NEVER import from infrastructure directly (use ports)

---

## **Common Workflows**

### **Adding a New Feature**

1. **Define domain entities** in `domain/entities/`
2. **Create repository interface** in `domain/repositories/`
3. **Create DTOs** in `application/dto/`
4. **Create use cases** in `application/use-cases/`
5. **Implement repository** in `infrastructure/persistence/`
6. **Create module** in `modules/` with controller and service
7. **Wire up dependencies** in the module file
8. **Add barrel exports** in each `index.ts`
9. **Import module** in `app.module.ts`

### **Adding a New Endpoint**

1. **Create/update DTO** in `application/dto/`
2. **Add controller method** in `modules/*/controller.ts`
3. **Create/update use case** in `application/use-cases/`
4. **Add documentation** in `shared/docs/` if complex
5. **Add guards** if authorization is needed

---

## **Testing Strategy**

```folder
__tests__/
├── unit/
│   ├── domain/          -> Test entities and value objects
│   ├── application/     -> Test use cases
│   └── infrastructure/  -> Test repositories
├── integration/
│   └── modules/         -> Test controllers and full flows
└── e2e/                 -> End-to-end tests
```

---

## **Migration from Previous Structure**

If you're migrating from a traditional NestJS structure:

1. **Entities** -> Move to `domain/entities/`
2. **Services with business logic** -> Split into use cases (`application/use-cases/`) and domain methods
3. **DTOs** -> Move to `application/dto/`
4. **Database repositories** -> Move to `infrastructure/persistence/`
5. **Utilities** -> Move to `shared/utils/`
6. **Guards/Decorators** -> Move to `shared/guards/` and `shared/decorators/`

---

## **Additional Resources**

- Read `AI_ASSISTED_CODING.md` for AI-assisted development guidelines
- Review `code_standards.instructions.md` for coding standards
- Check `CONTRIBUTING.md` for contribution guidelines

---

### **Questions?**

Feel free to contact the maintainers for clarifications or suggestions for improving this structure!
