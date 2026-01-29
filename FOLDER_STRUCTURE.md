# **NestJS Backend Folder Structure Guide (Enhanced)**

## Clean Architecture + Domain-Driven Design with Complete Code Examples

This documentation serves as a comprehensive contributor's guide for maintaining the design architecture in this NestJS backend following **Clean Architecture** and **Domain-Driven Design (DDD)** principles. This enhanced version includes detailed code examples for every folder and subfolder, plus routing documentation to "connect the dots."

---

## **Table of Contents**

1. [Why This Folder Structure?](#why-this-folder-structure)
2. [Architecture Overview](#architecture-overview)
3. [Complete Folder Structure](#complete-folder-structure)
4. [Layer-by-Layer Code Examples](#layer-by-layer-code-examples)
5. [Routing & Connection Guide](#routing--connection-guide)
6. [Complete Feature Example](#complete-feature-example)
7. [Dependency Flow Rules](#dependency-flow-rules)
8. [Common Workflows](#common-workflows)

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
│   │   │   │   ├── repositories/    -> Concrete Repository Implementations
│   │   │   │   ├── mappers/         -> Entity-Model Mappers
│   │   │   │   └── prisma.service.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── modules/                     -> Feature Modules (Presentation Layer)
│   │   ├── admin/
│   │   │   ├── admin.module.ts
│   │   │   ├── admin.controller.ts
│   │   │   └── index.ts
│   │   ├── email/
│   │   │   ├── email.module.ts
│   │   │   └── index.ts
│   │   ├── identity/
│   │   │   ├── identity.module.ts
│   │   │   ├── identity.controller.ts
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

---

## **Layer-by-Layer Code Examples**

### **1. Domain Layer** (`src/domain/`) - (**WHAT** the business does)

#### 📁 **`entities/`** - Domain Entities

WHAT: Business objects with identity and lifecycle

WHEN: You need objects that have an ID and can change over time

WHERE: Core business concepts (User, Product, Order)

HOW: Rich domain models with business logic methods

WHY: Encapsulate business rules in one place

**Example**: User Entity

```typescript
// domain/entities/product.entity.ts
import { Money } from '../value-objects/money.value-object';

export enum ProductStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export class Product {
  constructor(
    public readonly id: string,
    public name: string,
    public description: string,
    public price: Money,
    public stock: number,
    public status: ProductStatus = ProductStatus.DRAFT,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.stock < 0) {
      throw new Error('Stock cannot be negative');
    }
    if (this.name.length < 3) {
      throw new Error('Product name must be at least 3 characters');
    }
  }

  // Business logic
  isAvailable(): boolean {
    return (
      this.status === ProductStatus.PUBLISHED &&
      this.stock > 0
    );
  }

  publish(): void {
    if (this.status === ProductStatus.PUBLISHED) {
      throw new Error('Product is already published');
    }
    this.status = ProductStatus.PUBLISHED;
    this.updatedAt = new Date();
  }

  archive(): void {
    this.status = ProductStatus.ARCHIVED;
    this.updatedAt = new Date();
  }

  addStock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('Quantity must be positive');
    }
    this.stock += quantity;
    this.updatedAt = new Date();
  }

  reduceStock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('Quantity must be positive');
    }
    if (this.stock < quantity) {
      throw new Error('Insufficient stock');
    }
    this.stock -= quantity;
    this.updatedAt = new Date();
  }

  updatePrice(newPrice: Money): void {
    this.price = newPrice;
    this.updatedAt = new Date();
  }
}
```

---

#### 📁 **`value-objects/`** - Value Objects

WHAT: Immutable domain concepts without identity

WHEN: You need to represent a concept defined by its value

WHERE: Attributes like Email, Money, Address

HOW: Immutable classes with validation and equality methods

WHY: Ensure validity and prevent primitive obsession

**Example**: Email Value Object

```typescript
// domain/value-objects/email.value-object.ts
export class Email {
  private readonly value: string;

  constructor(email: string) {
    this.value = this.validate(email);
  }

  private validate(email: string): string {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
    return email.toLowerCase().trim();
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  getDomain(): string {
    return this.value.split('@')[1];
  }

  getLocalPart(): string {
    return this.value.split('@')[0];
  }
}
```

**Example**: Password Value Object

```typescript
// domain/value-objects/password.value-object.ts
import { compare, hash } from 'bcrypt';

export class Password {
  private readonly hashedValue: string;

  private constructor(hashedValue: string) {
    this.hashedValue = hashedValue;
  }

  // Factory method for creating from plain text
  static async fromPlainText(plainPassword: string): Promise<Password> {
    this.validatePlainPassword(plainPassword);
    const hashed = await hash(plainPassword, 10);
    return new Password(hashed);
  }

  // Factory method for creating from already hashed password
  static fromHash(hashedPassword: string): Password {
    return new Password(hashedPassword);
  }

  private static validatePlainPassword(password: string): void {
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      throw new Error('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      throw new Error('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      throw new Error('Password must contain at least one number');
    }
  }

  async compare(plainPassword: string): Promise<boolean> {
    return compare(plainPassword, this.hashedValue);
  }

  getHashedValue(): string {
    return this.hashedValue;
  }
}
```

---

#### 📁 **`repositories/`** - Repository Interfaces

WHAT: Contracts defining how to persist/retrieve domain entities

WHEN: Domain needs to specify persistence requirements

WHERE: Abstractions for data access (IUserRepository)

HOW: Interface with method signatures, no implementation

WHY: Domain defines needs without depending on infrastructure

**Example**: User Repository Interface

```typescript
// domain/repositories/user.repository.ts
import { User } from '../entities/user.entity';
import { Email } from '../value-objects/email.value-object';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  findAll(page: number, limit: number): Promise<User[]>;
  save(user: User): Promise<User>;
  update(user: User): Promise<User>;
  delete(id: string): Promise<void>;
  count(): Promise<number>;
  existsByEmail(email: Email): Promise<boolean>;
}
```

---

#### 📁 **`interfaces/`** - Domain Interfaces

WHAT: Define domain-level contracts and specifications

WHEN: Need domain services or specifications for business rules

WHERE: Interfaces like IPasswordHasher, IEmailValidator

HOW: Pure interfaces with no framework dependencies

WHY: Keep domain layer framework-agnostic and testable

**Example**: Domain Service Interfaces

```typescript
// domain/interfaces/password-hasher.interface.ts
export interface IPasswordHasher {
  hash(plainPassword: string): Promise<string>;
  compare(plainPassword: string, hashedPassword: string): Promise<boolean>;
}
```

```typescript
// domain/interfaces/email-validator.interface.ts
export interface IEmailValidator {
  isValid(email: string): boolean;
  getDomain(email: string): string;
}
```

```typescript
// domain/interfaces/specification.interface.ts
// Specification pattern for complex business rules
export interface ISpecification<T> {
  isSatisfiedBy(candidate: T): boolean;
  and(other: ISpecification<T>): ISpecification<T>;
  or(other: ISpecification<T>): ISpecification<T>;
  not(): ISpecification<T>;
}
```

---

### **2. Application Layer** (`src/application/`) - (**HOW** the business is done)

#### 📁 **`dto/`** - Data Transfer Objects

WHAT: Data structures for API input/output with validation

WHEN: Data crosses application boundary (API requests/responses)

WHERE: Input DTOs for controllers, Output DTOs for responses

HOW: Classes with validation decorators

WHY: Validate, transform, and shape data at boundaries

**Example**: User DTOs

```typescript
// application/dto/create-user.dto.ts
import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@/domain/entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({ example: 'john@example.com', description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password123', description: 'User password', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ enum: UserRole, default: UserRole.USER, required: false })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
```

---

#### 📁 **`use-cases/`** - Use Case Implementations

WHAT: Specific business workflows and operations

WHEN: Each distinct business operation or user story

WHERE: CreateUserUseCase, UpdateUserUseCase, etc.

HOW: Classes that orchestrate domain logic and repositories

WHY: One class per business operation, testable, maintainable

**Example**: Create User Use Case

```typescript
// application/use-cases/create-user.use-case.ts
import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { IUserRepository } from '@/domain/repositories/user.repository';
import { User, UserRole } from '@/domain/entities/user.entity';
import { Email } from '@/domain/value-objects/email.value-object';
import { Password } from '@/domain/value-objects/password.value-object';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(dto: CreateUserDto): Promise<UserResponseDto> {
    // Create value objects
    const email = new Email(dto.email);
    
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Create password value object
    const password = await Password.fromPlainText(dto.password);

    // Create domain entity
    const user = new User(
      uuidv4(),
      dto.name,
      email,
      password,
      dto.role || UserRole.USER,
    );

    // Persist
    const savedUser = await this.userRepository.save(user);

    // Map to response DTO
    return this.toResponseDto(savedUser);
  }

  private toResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email.getValue(),
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
```

#### **Barrel Imports**: (CRUCIAL for cleaner imports)

```typescript
export * from './create-user.use-case';

import { CreateUserUseCase } from './create-user.use-case';

// To spread use cases in modules, so all `*<feature>*.module.ts` can import easily for cleaner code
export const YOUR_USE_CASE = [
  CreateUserUseCase,
]
```

---

#### 📁 **`events/`** - Application Events

WHAT: Application events and their handlers

WHEN: Actions trigger side effects or need to notify other parts

WHERE: UserCreatedEvent, UserSuspendedEvent, handlers.

HOW: Event classes + handlers decorated with `@OnEvent`

WHY: Decouple components, enable async processing

**Example**: User Events

```typescript
// application/events/user-created.event.ts
export class UserCreatedEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly name: string,
    public readonly occurredAt: Date = new Date(),
  ) {}
}
```

```typescript
// application/events/user-suspended.event.ts
export class UserSuspendedEvent {
  constructor(
    public readonly userId: string,
    public readonly reason: string,
    public readonly occurredAt: Date = new Date(),
  ) {}
}
```

**Example**: Event Handler

```typescript
// application/events/handlers/send-welcome-email.handler.ts
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserCreatedEvent } from '../user-created.event';

@Injectable()
export class SendWelcomeEmailHandler {
  @OnEvent('user.created')
  async handle(event: UserCreatedEvent) {
    console.log(`Sending welcome email to ${event.email}`);
    // Implementation: send email via email service
  }
}
```

---

#### 📁 **`ports/`** - Port Interfaces

WHAT: Interfaces for external services (Dependency Inversion)

WHEN: Application needs to interact with external systems

WHERE: IEmailService, IStorageService, IPaymentService

HOW: Interfaces defining what app needs from infrastructure

WHY: Application independent of infrastructure implementations

**Example**: Email Service Port

```typescript
// application/ports/email-service.port.ts
export interface IEmailService {
  sendWelcomeEmail(to: string, name: string): Promise<void>;
  sendPasswordResetEmail(to: string, resetToken: string): Promise<void>;
  sendOrderConfirmation(to: string, orderDetails: any): Promise<void>;
}
```

**Example**: Cache Service Port

```typescript
// application/ports/cache-service.port.ts
export interface ICacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
}
```

---

### **3. Infrastructure Layer** (`src/infrastructure/`) - (**WHERE** things are stored/implemented)

#### 📁 **`config/`** - Configuration Files

WHAT: Application configuration and environment variables

WHEN: Need centralized config management

WHERE: Database config, JWT config, third-party service configs

HOW: `@nestjs/config` module with `registerAs()` functions

WHY: Type-safe config, environment-based settings

**Example**: Email Configuration

```typescript
// infrastructure/config/email.config.ts
import { registerAs } from '@nestjs/config';

export default registerAs('email', () => ({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT, 10) || 587,
  username: process.env.EMAIL_USERNAME,
  password: process.env.EMAIL_PASSWORD,
  from: process.env.EMAIL_FROM || 'noreply@example.com',
}));
```

---

#### 📁 **`persistence/prisma/`** - Prisma Implementation

**Example**: Prisma Service

```typescript
// infrastructure/persistence/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

---

#### 📁 **`persistence/prisma/mappers/`** - Entity Mappers

WHAT: Converters between domain entities and database models

WHEN: Translating domain objects to/from Prisma models

WHERE: UserMapper, ProductMapper, OrderMapper

HOW: Static methods for `toDomain()` and `toPersistence()`

WHY: Keep domain entities independent of database structure

**Example**: User Mapper

```typescript
// infrastructure/persistence/prisma/mappers/user.mapper.ts
import { User as PrismaUser } from '@prisma/client';
import { User, UserRole, UserStatus } from '@/domain/entities/user.entity';
import { Email } from '@/domain/value-objects/email.value-object';
import { Password } from '@/domain/value-objects/password.value-object';

export class UserMapper {
  static toDomain(prismaUser: PrismaUser): User {
    const email = new Email(prismaUser.email);
    const password = Password.fromHash(prismaUser.password);

    return new User(
      prismaUser.id,
      prismaUser.name,
      email,
      password,
      prismaUser.role as UserRole,
      prismaUser.status as UserStatus,
      prismaUser.createdAt,
      prismaUser.updatedAt,
    );
  }

  static toPersistence(user: User): Omit<PrismaUser, 'createdAt' | 'updatedAt'> {
    return {
      id: user.id,
      name: user.name,
      email: user.email.getValue(),
      password: user['password'].getHashedValue(), // Access private field
      role: user.role,
      status: user.status,
    };
  }
}
```

---

#### 📁 **`persistence/prisma/repositories/`** - Repository Implementations

WHAT: Concrete implementations of repository interfaces

WHEN: Need to actually persist/retrieve domain entities

WHERE: PrismaUserRepository, PrismaProductRepository

HOW: Classes implementing domain repository interfaces

WHY: Provide actual database operations, can be swapped

**Example**: User Repository Implementation

```typescript
// infrastructure/persistence/prisma/repositories/prisma-user.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { IUserRepository } from '@/domain/repositories/user.repository';
import { User } from '@/domain/entities/user.entity';
import { Email } from '@/domain/value-objects/email.value-object';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { id },
    });

    return prismaUser ? UserMapper.toDomain(prismaUser) : null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { email: email.getValue() },
    });

    return prismaUser ? UserMapper.toDomain(prismaUser) : null;
  }

  async findAll(page: number, limit: number): Promise<User[]> {
    const skip = (page - 1) * limit;
    const prismaUsers = await this.prisma.user.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return prismaUsers.map((user) => UserMapper.toDomain(user));
  }

  async save(user: User): Promise<User> {
    const data = UserMapper.toPersistence(user);
    const savedUser = await this.prisma.user.create({ data });
    return UserMapper.toDomain(savedUser);
  }

  async update(user: User): Promise<User> {
    const data = UserMapper.toPersistence(user);
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data,
    });
    return UserMapper.toDomain(updatedUser);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  async count(): Promise<number> {
    return this.prisma.user.count();
  }

  async existsByEmail(email: Email): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { email: email.getValue() },
    });
    return count > 0;
  }
}
```

---

### **4. Modules Layer** (`src/modules/`) - (**ENTRY POINTS** of your features)

WHAT: Feature-based modules grouping related functionality

WHEN: Creating a new feature or bounded context

WHERE: identity/, admin/, modules

HOW: Module + Controller only

WHY: Organize by feature, clear boundaries, easy to find and maintain

#### 📄 **`<feature>`.module.ts**

WHAT: Dependency injection configuration for feature

WHEN: Wiring up providers, controllers, imports, and exports

WHERE: IdentityModule, AdminModule, etc.

HOW: `@Module` decorator with imports/controllers/providers/exports

WHY: Configure how NestJS injects dependencies

#### 📄 **`<feature>`.controller.ts**

WHAT: HTTP endpoints and request handling

WHEN: Exposing functionality via REST API

WHERE: Routes like POST /users, GET /users/:id

HOW: Decorators (@Controller, @Get, @Post) + inject service

WHY: Separate transport layer from business logic

#### **Example**: Identity Module

#### **Module File**

```typescript
// modules/identity/identity.module.ts
import { Module } from '@nestjs/common';
import { IdentityController } from './identity.controller';
import { IdentityService } from './identity.service';
import { PrismaModule } from '@/infrastructure/persistence/prisma/prisma.module';
import { PrismaUserRepository } from '@/infrastructure/persistence/prisma/repositories';
import {
  CreateUserUseCase,
  UpdateUserUseCase,
  GetUserByIdUseCase,
} from '@/application/use-cases';

@Module({
  imports: [PrismaModule],
  controllers: [IdentityController],
  providers: [
    IdentityService,
    CreateUserUseCase,
    UpdateUserUseCase,
    GetUserByIdUseCase,
    {
      provide: 'IUserRepository',
      useClass: PrismaUserRepository,
    },
  ],
  exports: [IdentityService],
})
export class IdentityModule {}
```

#### **Controller File**

```typescript
// modules/identity/identity.controller.ts
import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IdentityService } from './identity.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from '@/application/dto';

@ApiTags('Identity')
@Controller('identity')
export class IdentityController {
  constructor(private readonly identityService: IdentityService) {}

  @Post('users')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully', type: UserResponseDto })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async createUser(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    return this.identityService.createUser(dto);
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(@Param('id') id: string): Promise<UserResponseDto> {
    return this.identityService.getUserById(id);
  }

  @Patch('users/:id')
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'User updated successfully', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.identityService.updateUser(id, dto);
  }
}
```

#### **Service File**

```typescript
// modules/identity/identity.service.ts
import { Injectable } from '@nestjs/common';
import {
  CreateUserUseCase,
  UpdateUserUseCase,
  GetUserByIdUseCase,
} from '@/application/use-cases';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from '@/application/dto';

@Injectable()
export class IdentityService {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
  ) {}

  async createUser(dto: CreateUserDto): Promise<UserResponseDto> {
    return this.createUserUseCase.execute(dto);
  }

  async getUserById(id: string): Promise<UserResponseDto> {
    return this.getUserByIdUseCase.execute(id);
  }

  async updateUser(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    return this.updateUserUseCase.execute(id, dto);
  }
}
```

---

### **5. Shared Layer** (`src/shared/`) - (**COMMON RESOURCES** used across the application)

#### 📁 **`decorators/`**

WHAT: Custom parameter and method decorators

WHEN: Need to extract metadata or add syntactic sugar

WHERE: `@CurrentUser()`, `@Roles()`, Public decorators

HOW: Use `createParamDecorator` and `SetMetadata()`

WHY: Reusable, clean code for common patterns

**Example**: Current User Decorator

```typescript
// shared/decorators/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
```

**Example**: Roles Decorator

```typescript
// shared/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@/domain/entities/user.entity';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
```

**Example**: Public Decorator

```typescript
// shared/decorators/public.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

---

#### 📁 **`guards/`**

WHAT: Request-level authorization and authentication

WHEN: Protecting routes, checking permissions/roles

WHERE: JwtAuthGuard, RolesGuard

HOW: Implement `CanActivate` or extend `AuthGuard`

WHY: Centralize control logic for security

**Example**: JWT Auth Guard

```typescript
// shared/guards/jwt-auth.guard.ts
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}
```

**Example**: Roles Guard

```typescript
// shared/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '@/domain/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role === role);
  }
}
```

---

#### 📁 **`utils/`**

WHAT: Pure helper functions and utilities

WHEN: Common functions used across modules

WHERE: String utils, Date utils, Validation utils

HOW: Static methods in classes or standalone functions

WHY: DRY code, no feature-specific logic

**Example**: String Utilities

```typescript
// shared/utils/string.util.ts
export class StringUtil {
  static capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  static slugify(str: string): string {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  static truncate(str: string, length: number): string {
    return str.length > length ? str.substring(0, length) + '...' : str;
  }
}
```

**Example**: Date Utilities

```typescript
// shared/utils/date.util.ts
export class DateUtil {
  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  static formatDate(date: Date, format: string = 'YYYY-MM-DD'): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return format
      .replace('YYYY', String(year))
      .replace('MM', month)
      .replace('DD', day);
  }

  static isExpired(date: Date): boolean {
    return date < new Date();
  }
}
```

---

#### 📁 **`interfaces/`**

**Example**: Paginated Response Interface

WHAT: Shared type definitions and contracts

WHEN: Types used across multiple layers/features

WHERE: Pagination, API responses, error formats

HOW: TypeScript interfaces, no implementation

WHY: Type safety for common data structures

```typescript
// shared/interfaces/paginated-response.interface.ts
export interface IPaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

**Example**: API Response Interface

```typescript
// shared/interfaces/api-response.interface.ts
export interface IApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}
```

---

#### 📁 **`docs/`**

WHAT: Reusable Swagger documentation decorators

WHEN: Documenting API endpoints consistently

WHERE: Per-feature doc files (user.docs.ts, product.docs.ts)

HOW: Functions returning `applyDecorators()` with Swagger decorators

WHY: Centralized docs, DRY, consistent API documentation

**Example**: User Documentation

```typescript
// shared/docs/user.docs.ts
import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserResponseDto } from '@/application/dto';

export function CreateUserDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new user account' }),
    ApiResponse({
      status: 201,
      description: 'User successfully created',
      type: UserResponseDto,
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid input data',
    }),
    ApiResponse({
      status: 409,
      description: 'User with this email already exists',
    }),
  );
}

export function GetUserDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get user by ID' }),
    ApiResponse({
      status: 200,
      description: 'User found',
      type: UserResponseDto,
    }),
    ApiResponse({
      status: 404,
      description: 'User not found',
    }),
  );
}
```

---

## **Routing & Connection Guide**

This section shows how all the pieces connect together in a request flow.

### **Request Flow Diagram**

```flow
┌─────────────────────────────────────────────────────────────────┐
│                         HTTP REQUEST                            │
│                    POST /api/identity/users                     │
│                    Body: { name, email, password }              │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MODULES LAYER (Entry Point)                  │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  IdentityController                                    │     │
│  │  @Post('users')                                        │     │
│  │  createUser(@Body() dto: CreateUserDto)                │     │
│  └────────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                            │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  CreateUserUseCase                                     │     │
│  │  - Validates business rules                            │     │
│  │  - Checks if user exists                               │     │
│  │  - Orchestrates the flow                               │     │
│  └────────────────────────────────────────────────────────┘     │
│                                 │                               │
│                                 ▼                               │
│         ┌───────────────────────┴─────────────────────┐         │
│         │                                             │         │
│         ▼                                             ▼         │
│  ┌─────────────────┐                            ┌──────────┐    │
│  │ CreateUserDto   │                            │  Ports   │    │
│  │ (Validation)    │                            │Interface │    │
│  └─────────────────┘                            └──────────┘    │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                        DOMAIN LAYER                             │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  User Entity                                           │     │
│  │  - Business logic methods                              │     │
│  │  - Domain validation                                   │     │
│  │  - canAccessAdminPanel()                               │     │
│  │  - isActive()                                          │     │
│  └────────────────────────────────────────────────────────┘     │
│                                 │                               │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  Value Objects                                         │     │
│  │  - Email (validation)                                  │     │
│  │  - Password (hashing, comparison)                      │     │
│  └────────────────────────────────────────────────────────┘     │
│                                 │                               │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  IUserRepository (Interface)                           │     │
│  │  - save(user: User): Promise<User>                     │     │
│  │  - findByEmail(email: Email)                           │     │
│  └────────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    INFRASTRUCTURE LAYER                         │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  PrismaUserRepository                                  │     │
│  │  implements IUserRepository                            │     │
│  │  - save(user: User)                                    │     │
│  └────────────────────────────────────────────────────────┘     │
│                                 │                               │
│                                 ▼                               │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  UserMapper                                            │     │
│  │  - toDomain(prismaUser)                                │     │
│  │  - toPersistence(domainUser)                           │     │
│  └────────────────────────────────────────────────────────┘     │
│                                 │                               │
│                                 ▼                               │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  PrismaService                                         │     │
│  │  - prisma.user.create()                                │     │
│  └────────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
                           ┌─────────────┐
                           │  DATABASE   │
                           └─────────────┘
```

---

### **Dependency Injection Flow**

Here's how dependencies are wired up in the module:

```typescript
// modules/identity/identity.module.ts
@Module({
  imports: [
    PrismaModule, // Provides PrismaService
  ],
  controllers: [
    IdentityController, // Entry point for HTTP requests
  ],
  providers: [
    IdentityService, // Coordinates use cases
    
    // Use Cases
    CreateUserUseCase,
    UpdateUserUseCase,
    GetUserByIdUseCase,
    
    // Repository Implementation (injected into use cases)
    {
      provide: 'IUserRepository', // Token used in @Inject()
      useClass: PrismaUserRepository, // Concrete implementation
    },
  ],
  exports: [
    IdentityService, // Export for other modules
  ],
})
export class IdentityModule {}
```

**How it works:**

1. **Controller (`modules/<feature>`)** depends on **Service (`modules/<feature>/.service.ts`)**
2. **Service (`modules/<feature>/.service.ts`)** depends on **Use Cases (`application/use-cases`)**
3. **Use Cases (`application/use-cases`)** depend on **Repository Interface (`domain/repository`)** (via `@Inject('IUserRepository')`)
4. **Repository Implementation (`infrastructure/persistence/prisma/repositories/prisma-<schema>.repository.ts`)** is provided by the module
5. **Repository Implementation** depends on **PrismaService (`infrastructure/persistence/prisma/prisma.service.ts`)**

---

### **Example: Complete Request Flow**

Let's trace a complete request to create a user:

1/ HTTP Request arrives

```curl

POST /api/users
Body: {
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

2/ Controller receives request

```typescript
// modules/identity/identity.controller.ts
@Post('users')
async createUser(@Body() dto: CreateUserDto) {
  return this.identityService.createUser(dto);
}
```

3/ Service delegates to use case

```typescript
// modules/identity/identity.service.ts
async createUser(dto: CreateUserDto) {
  return this.createUserUseCase.execute(dto);
}
```

4/ Use case orchestrates the flow

```typescript
// application/use-cases/create-user.use-case.ts
async execute(dto: CreateUserDto) {
  // Create value objects (domain layer)
  const email = new Email(dto.email);
  
  // Check business rule
  const existingUser = await this.userRepository.findByEmail(email);
  if (existingUser) {
    throw new ConflictException('User exists');
  }
  
  // Create password value object
  const password = await Password.fromPlainText(dto.password);
  
  // Create domain entity
  const user = new User(
    uuidv4(),
    dto.name,
    email,
    password,
    dto.role || UserRole.USER,
  );
  
  // Persist via repository
  const savedUser = await this.userRepository.save(user);
  
  // Return DTO
  return this.toResponseDto(savedUser);
}
```

5/ Repository implementation persists data

```typescript
// infrastructure/persistence/prisma/repositories/prisma-user.repository.ts
async save(user: User) {
  // Map domain entity to Prisma model
  const data = UserMapper.toPersistence(user);
  
  // Save to database
  const savedUser = await this.prisma.user.create({ data });
  
  // Map back to domain entity
  return UserMapper.toDomain(savedUser);
}
```

6/ Response sent back to client

```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "USER",
  "status": "ACTIVE",
  "createdAt": "2026-01-28T...",
  "updatedAt": "2026-01-28T..."
}
```

---

### **Cross-Cutting Concerns**

#### **Using Guards and Decorators**

```typescript
// modules/admin/admin.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/shared/guards/jwt-auth.guard';
import { RolesGuard } from '@/shared/guards/roles.guard';
import { Roles } from '@/shared/decorators/roles.decorator';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { UserRole } from '@/domain/entities/user.entity';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  
  @Get('dashboard')
  @Roles(UserRole.ADMIN)
  async getDashboard(@CurrentUser() user: any) {
    // Only admins can access this
    return { message: `Welcome ${user.name}` };
  }
}
```

#### **Using Events**

```typescript
// application/use-cases/create-user.use-case.ts
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserCreatedEvent } from '@/application/events';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(dto: CreateUserDto) {
    // ... create user logic ...
    
    // Emit event
    this.eventEmitter.emit(
      'user.created',
      new UserCreatedEvent(user.id, user.email.getValue(), user.name),
    );
    
    return this.toResponseDto(user);
  }
}

// The event handler will automatically pick this up
// application/events/handlers/send-welcome-email.handler.ts
@Injectable()
export class SendWelcomeEmailHandler {
  @OnEvent('user.created')
  async handle(event: UserCreatedEvent) {
    // Send welcome email
  }
}
```

---

### **Module Communication**

When one module needs functionality from another:

```typescript
// modules/order/order.module.ts
@Module({
  imports: [
    IdentityModule, // Import the module
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    // ... other providers
  ],
})
export class OrderModule {}
```

```typescript
// modules/order/order.service.ts
@Injectable()
export class OrderService {
  constructor(
    private readonly identityService: IdentityService, // Inject exported service
  ) {}

  async createOrder(userId: string, orderData: any) {
    // Use identity service
    const user = await this.identityService.getUserById(userId);
    
    // Create order logic...
  }
}
```

---

## **Complete Feature Example**

Let's build a complete feature from scratch: **Product Reviews**

### **1. Domain Layer**

Let's define the domain entity and repository interface first of the schema being used. If you have to use what's in the `schema.prisma` file, assume we have a `Review` model defined there and then make it work in the domain layer.

```typescript
// domain/entities/review.entity.ts
export enum ReviewRating {
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
}

export class Review {
  constructor(
    public readonly id: string,
    public readonly productId: string,
    public readonly userId: string,
    public rating: ReviewRating,
    public comment: string,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.comment.length < 10) {
      throw new Error('Review comment must be at least 10 characters');
    }
  }

  updateComment(newComment: string): void {
    if (newComment.length < 10) {
      throw new Error('Comment must be at least 10 characters');
    }
    this.comment = newComment;
    this.updatedAt = new Date();
  }

  updateRating(newRating: ReviewRating): void {
    this.rating = newRating;
    this.updatedAt = new Date();
  }
}
```

After we define the entity of your feature, we need to define the repository interface.

```typescript
// domain/repositories/review.repository.ts
export interface IReviewRepository {
  findById(id: string): Promise<Review | null>;
  findByProductId(productId: string): Promise<Review[]>;
  findByUserId(userId: string): Promise<Review[]>;
  save(review: Review): Promise<Review>;
  update(review: Review): Promise<Review>;
  delete(id: string): Promise<void>;
  getAverageRating(productId: string): Promise<number>;
}
```

### **2. Application Layer**

After we define what we need in the domain layer, we can move to the application layer to define the use cases and DTOs.

DTO first, so we can define their properties and then use them in the use case

```typescript
// application/dto/create-review.dto.ts
import { IsString, IsEnum, IsUUID, MinLength } from 'class-validator';
import { ReviewRating } from '@/domain/entities/review.entity';

export class CreateReviewDto {
  @IsUUID()
  productId: string;

  @IsEnum(ReviewRating)
  rating: ReviewRating;

  @IsString()
  @MinLength(10)
  comment: string;
}

// application/dto/review-response.dto.ts
export class ReviewResponseDto {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

```

After we define the DTOs, we can implement the use case. Injecting the necessary repositories to handle the business logic.

```typescript
// application/use-cases/create-review.use-case.ts
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { IReviewRepository } from '@/domain/repositories/review.repository';
import { IProductRepository } from '@/domain/repositories/product.repository';
import { Review } from '@/domain/entities/review.entity';
import { CreateReviewDto } from '@/application/dto/create-review.dto';
import { ReviewResponseDto } from '@/application/dto/review-response.dto';

@Injectable()
export class CreateReviewUseCase {
  constructor(
    @Inject('IReviewRepository')
    private readonly reviewRepository: IReviewRepository,
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(userId: string, dto: CreateReviewDto): Promise<ReviewResponseDto> {
    // Verify product exists
    const product = await this.productRepository.findById(dto.productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Create review entity
    const review = new Review(
      uuidv4(),
      dto.productId,
      userId,
      dto.rating,
      dto.comment,
    );

    // Save
    const savedReview = await this.reviewRepository.save(review);

    return {
      id: savedReview.id,
      productId: savedReview.productId,
      userId: savedReview.userId,
      rating: savedReview.rating,
      comment: savedReview.comment,
      createdAt: savedReview.createdAt,
      updatedAt: savedReview.updatedAt,
    };
  }
}
```

The use case and DTOs are now ready. Either create more use cases as needed or move to the infrastructure layer to implement the repository.

### **3. Infrastructure Layer**

After defining the domain and application layers, we can implement the repository using Prisma in the infrastructure layer. We will also need a mapper to convert between Prisma models and domain entities.

```typescript
// infrastructure/persistence/prisma/mappers/review.mapper.ts
export class ReviewMapper {
  static toDomain(prismaReview: PrismaReview): Review {
    return new Review(
      prismaReview.id,
      prismaReview.productId,
      prismaReview.userId,
      prismaReview.rating as ReviewRating,
      prismaReview.comment,
      prismaReview.createdAt,
      prismaReview.updatedAt,
    );
  }

  static toPersistence(review: Review) {
    return {
      id: review.id,
      productId: review.productId,
      userId: review.userId,
      rating: review.rating,
      comment: review.comment,
    };
  }
}
```

After we define the mapper, we can implement the repository of the feature.

```typescript
// infrastructure/persistence/prisma/repositories/prisma-review.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/persistence/prisma/prisma.service';
import { IReviewRepository } from '@/domain/repositories/review.repository';
import { Review } from '@/domain/entities/review.entity';
import { ReviewMapper } from '../mappers/review.mapper';

@Injectable()
export class PrismaReviewRepository implements IReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Review | null> {
    const review = await this.prisma.review.findUnique({ where: { id } });
    return review ? ReviewMapper.toDomain(review) : null;
  }

  async findByProductId(productId: string): Promise<Review[]> {
    const reviews = await this.prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
    });
    return reviews.map(ReviewMapper.toDomain);
  }

  async save(review: Review): Promise<Review> {
    const data = ReviewMapper.toPersistence(review);
    const saved = await this.prisma.review.create({ data });
    return ReviewMapper.toDomain(saved);
  }

  async getAverageRating(productId: string): Promise<number> {
    const result = await this.prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
    });
    return result._avg.rating || 0;
  }

  // ... other methods
}
```

And now, it is ready to be used in the modules layer.

### **4. Modules Layer**

A step-by-step implementation of the module from the service to the controller to connect what we have done so far from the domain, application, and infrastructure layers.

But first, do import the necessary pieces in the module file.

Guidelines in the `@Module` decorator:

`imports`: Import any required modules (e.g., PrismaModule, ProductModule)

`controllers`: Define the controller(s) for handling HTTP requests related to reviews (ReviewController)

`providers`: List the service(s) and use case(s) that the module provides (ReviewService, CreateReviewUseCase)

`exports`: Export the service(s) if they need to be used in other modules (ReviewService)

```typescript
// modules/review/review.module.ts
@Module({
  imports: [PrismaModule, ProductModule],
  controllers: [ReviewController],
  providers: [
    CreateReviewUseCase,
    {
      provide: 'IReviewRepository',
      useClass: PrismaReviewRepository,
    },
  ],
  exports: [ReviewService],
})
export class ReviewModule {}
```

Finally, we can implement the controller to expose the endpoints for creating and retrieving reviews.

Guidelines for the controller and we need:

- Use appropriate decorators to define routes and HTTP methods (e.g., @Post, @Get)

- Inject all use cases to handle business logic

- Use guards and decorators for authentication and authorization (e.g., JwtAuthGuard, CurrentUser)

- Use rate limiting (`@Throttle`) if necessary to prevent abuse

- Use your custom API decorators for API documentation if applicable

- Define methods for creating reviews and retrieving reviews for a product

```typescript
// modules/review/review.controller.ts
import { Controller, Post, Get, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';

@Controller('reviews')
@UseGuards(JwtAuthGuard)
export class ReviewController {
  constructor(
    private readonly yourUseCase: YourUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createReview(
    @CurrentUser() user: any,
    @Body() dto: CreateReviewDto,
  ): Promise<ReviewResponseDto> {
    return this.yourUseCase.execute(user.id, dto);
  }

  @Get('product/:productId')
  @Public()
  async getProductReviews(
    @Param('productId') productId: string,
  ): Promise<ReviewResponseDto[]> {
    return this.yourUseCase.execute(productId);
  }

  // Other endpoints as needed
}
```

Since we end in the controller part in the modules layer, don't forget to test it locally first and make sure everything is working as expected.

---

## **Dependency Flow Rules**

To maintain clean architecture:

```flow
┌─────────────────────────────────────────────────────────┐
│                    DEPENDENCY RULES                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  modules ───────────┐                                   │
│      │              │                                   │
│      ▼              ▼                                   │
│  application ──> domain                                 │
│      │                                                  │
│      ▼                                                  │
│  infrastructure                                         │
│                                                         │
│  shared (used by all, depends on nothing)               │
│                                                         │
└─────────────────────────────────────────────────────────┘

✅ ALLOWED:
  - modules → application
  - modules → domain
  - modules → infrastructure
  - modules → shared
  - application → domain
  - application → shared
  - infrastructure → domain
  - infrastructure → shared
  
❌ NOT ALLOWED:
  - domain → application
  - domain → infrastructure
  - domain → modules
  - application → infrastructure (use ports instead)
```

---

## **Common Workflows**

### **Adding a New Feature**

1. **NestJS CLI module generation** Automatically imports the feature module in `app.module.ts`

   ```bash
   nest g resource <feature> --project modules
   ```

   Choose REST API, no CRUD, and skip spec files.

2. **Define domain entities** (`domain/entities/`)
3. **Create value objects** if needed (`domain/value-objects/`)
4. **Define repository interface** (`domain/repositories/`)
5. **Create DTOs** (`application/dto/`)
6. **Create use cases** (`application/use-cases/`)
7. **Create mapper** (`infrastructure/persistence/prisma/mappers/`)
8. **Implement repository** (`infrastructure/persistence/prisma/repositories/`)
9. **Create module, controller, service** (`modules/`)
10. **Add barrel exports** in each folder
11. **Import module** in `app.module.ts`

### **Adding a New Endpoint**

1. **Create/update DTO** in `application/dto/`
2. **Add use case** in `application/use-cases/`
3. **Add controller method** in `modules/*/controller.ts`
4. **Update service** in `modules/*/service.ts` if needed
5. **Add guards/decorators** if authorization needed

---

## **Best Practices Summary**

1. **Domain layer** should have no dependencies on other layers
2. **Use value objects** for domain concepts like Email, Money, Password
3. **Keep entities rich** with business logic methods
4. **Use cases** orchestrate, entities contain logic
5. **DTOs** for data validation and transformation
6. **Repository interfaces** in domain, implementations in infrastructure
7. **Mappers** convert between domain and persistence models
8. **Guards and decorators** for cross-cutting concerns
9. **Events** for decoupling and side effects
10. **Barrel exports** for clean imports

---

## **Questions?**

For questions or suggestions for improving this structure, please contact the maintainers!
