# **AI Coding Rules and Standards for NestJS**

---

## **Table of Contents**

1. Quick Reference (TL;DR)
2. Code Quality Standards
3. Clean Architecture Principles
4. Domain-Driven Design Rules
5. API Design Guidelines
6. Error Handling
7. Testing Requirements
8. Performance Considerations
9. Git and Version Control

---

## **Quick Reference (TL;DR)**

### 🔴 CRITICAL Rules (MUST Follow)
- **NO comments** - Code must be self-documenting
- **NO framework dependencies in domain layer**
- **Rich domain entities** - Entities must have behavior, not just data
- **Use cases orchestrate** - One use case per operation
- **Repository pattern** - Abstract all data access
- **Remove all console.log** before committing

### 🟡 Important Patterns
- Keep functions under 20 lines when possible
- Use dependency injection everywhere
- Test domain logic thoroughly
- Controllers should only orchestrate, never contain business logic

### Priority Levels Used in This Document
- **⚠️ CRITICAL** - Violations break architecture or cause bugs
- **🔴 REQUIRED** - Must follow for consistency and maintainability
- **🟡 RECOMMENDED** - Strong recommendation, exceptions need justification
- **💡 OPTIONAL** - Nice-to-have improvements

---

## **Code Quality Standards**

### ⚠️ CRITICAL: No Comments Policy

**MUST NOT:**
- Write inline comments in code
- Write block comments
- Write JSDoc comments (unless explicitly requested for public APIs)
- Leave TODO or FIXME comments in production code

**MUST:**
- Make code self-documenting through clear naming
- Use descriptive variable and function names
- Express business rules in code, not comments

**Exception:** Complex algorithms that cannot be simplified may have minimal explanatory comments.

```typescript
// ❌ BAD - Using comments to explain unclear code
// Loop through users and check if active
for (let i = 0; i < u.length; i++) {
  // Check the active flag
  if (u[i].a) {
    // Add to results
    r.push(u[i]);
  }
}

// ✅ GOOD - Self-documenting code
const activeUsers = users.filter(user => user.isActive);
```

### 🔴 REQUIRED: Clean Code Requirements

**Before Committing:**
- Remove ALL console.log statements
- Remove ALL debugging code
- Remove ALL placeholder or mock data
- Ensure no TODO/FIXME comments remain

**Code Organization:**
- Functions should be under 20 lines when possible
- Each function should do ONE thing
- Avoid magic numbers - use named constants
- Extract complex conditions into well-named functions

```typescript
// ❌ BAD - Magic numbers and unclear logic
if (user.age >= 18 && user.status === 1 && user.verified) {
  // allow access
}

// ✅ GOOD - Named constants and extracted logic
const MINIMUM_AGE = 18;
const USER_STATUS_ACTIVE = 1;

function canAccessPremiumFeatures(user: User): boolean {
  return user.age >= MINIMUM_AGE 
    && user.status === USER_STATUS_ACTIVE 
    && user.isVerified;
}

if (canAccessPremiumFeatures(user)) {
  // allow access
}
```

### 🔴 REQUIRED: TypeScript Standards

**Type Safety:**
- NEVER use `any` type
- Use `unknown` when type is truly unknown, then narrow it
- Define proper interfaces and types
- Use union types instead of `any`
- Enable strict mode in tsconfig.json

```typescript
// ❌ BAD - Using any
function processData(data: any): any {
  return data.value;
}

// ✅ GOOD - Proper typing
interface DataInput {
  value: string;
  timestamp: Date;
}

interface DataOutput {
  processedValue: string;
  processedAt: Date;
}

function processData(data: DataInput): DataOutput {
  return {
    processedValue: data.value.toUpperCase(),
    processedAt: new Date(),
  };
}
```

---

## Clean Architecture Principles

### ⚠️ CRITICAL: Dependency Rule

**The Golden Rule:** Dependencies flow inward ONLY. Inner layers must not know about outer layers.

```
┌─────────────────────────────────────┐
│       Modules (HTTP/Controllers)    │  ← Outermost
├─────────────────────────────────────┤
│      Infrastructure (DB/External)   │
├─────────────────────────────────────┤
│    Application (Use Cases/DTOs)     │
├─────────────────────────────────────┤
│       Domain (Entities/Rules)       │  ← Innermost (Pure)
└─────────────────────────────────────┘
```

**Layer Dependencies:**
- **Domain Layer**: NO dependencies on any other layer (100% pure TypeScript)
- **Application Layer**: Depends ONLY on Domain layer
- **Infrastructure Layer**: Implements interfaces from Application/Domain
- **Modules Layer**: Depends on Application, Domain, and Infrastructure
- **Shared Layer**: Used by all, depends on nothing

### Layer Responsibilities

#### ⚠️ Domain Layer (Business Logic - Pure)

**Purpose:** Encapsulate business rules and domain knowledge

**Contains:**
- Business entities with rich behavior
- Value objects with validations
- Repository interfaces (abstractions only)
- Domain services for cross-entity operations
- Domain events
- Business rule enforcement

**MUST NOT contain:**
- Framework dependencies (NestJS, Express, etc.)
- Database code (Prisma, TypeORM)
- HTTP concerns
- File system operations
- External service calls
- Any infrastructure code

```typescript
// ✅ GOOD - Pure domain entity
// domain/entities/user.entity.ts
export class User {
  private constructor(
    public readonly id: string,
    private name: string,
    private email: Email, // Value object
    private passwordHash: string,
    private createdAt: Date,
  ) {}

  static create(props: CreateUserProps): User {
    const email = Email.create(props.email);
    
    if (props.name.length < 3) {
      throw new DomainException('Name must be at least 3 characters');
    }

    if (props.password.length < 8) {
      throw new DomainException('Password must be at least 8 characters');
    }

    const passwordHash = this.hashPassword(props.password);
    
    return new User(
      uuid(),
      props.name,
      email,
      passwordHash,
      new Date(),
    );
  }

  changeName(newName: string): void {
    if (newName.length < 3) {
      throw new DomainException('Name must be at least 3 characters');
    }
    this.name = newName;
  }

  changeEmail(newEmail: string): void {
    this.email = Email.create(newEmail);
  }

  verifyPassword(password: string): boolean {
    return bcrypt.compareSync(password, this.passwordHash);
  }

  private static hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  getEmail(): string {
    return this.email.getValue();
  }
}

// ❌ BAD - Anemic domain model (just a data container)
export class User {
  id: string;
  name: string;
  email: string;
  password: string;
}
```

#### 🔴 Application Layer (Use Cases - Orchestration)

**Purpose:** Coordinate business logic execution and define application operations

**Contains:**
- Use cases (one per operation)
- DTOs for data transfer
- Port interfaces for external dependencies
- Application events
- Command and query handlers

**Responsibilities:**
- Orchestrate domain objects
- Handle transactions
- Emit events
- Transform domain entities to DTOs
- Coordinate multiple domain operations

```typescript
// ✅ GOOD - Use case with clear orchestration
// application/use-cases/create-user.use-case.ts
@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IEmailService')
    private readonly emailService: IEmailService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(dto: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = User.create({
      name: dto.name,
      email: dto.email,
      password: dto.password,
    });

    const savedUser = await this.userRepository.save(user);

    await this.emailService.sendWelcomeEmail(savedUser.getEmail());

    this.eventEmitter.emit(
      'user.created',
      new UserCreatedEvent(savedUser.id, savedUser.getEmail())
    );

    return this.toResponseDto(savedUser);
  }

  private toResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.getEmail(),
      createdAt: user.createdAt,
    };
  }
}

// ❌ BAD - Business logic in controller
@Controller('users')
export class UserController {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    if (!dto.email.includes('@')) {
      throw new BadRequestException('Invalid email');
    }

    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email }
    });

    if (exists) {
      throw new ConflictException('User exists');
    }

    const user = await this.prisma.user.create({ data: dto });
    await this.emailService.sendWelcome(user.email);
    
    return user;
  }
}
```

#### 🔴 Infrastructure Layer (Technical Implementation)

**Purpose:** Implement technical details and external integrations

**Contains:**
- Repository implementations (Prisma, TypeORM)
- External service clients (Email, SMS, Payment)
- File storage implementations (Cloudinary, S3)
- Configuration providers
- Database migrations
- Mappers (Domain ↔ Persistence)

```typescript
// ✅ GOOD - Repository implementation
// infrastructure/persistence/repositories/prisma-user.repository.ts
@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: UserMapper,
  ) {}

  async findById(id: string): Promise<User | null> {
    const userModel = await this.prisma.user.findUnique({
      where: { id },
    });

    return userModel ? this.mapper.toDomain(userModel) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const userModel = await this.prisma.user.findUnique({
      where: { email },
    });

    return userModel ? this.mapper.toDomain(userModel) : null;
  }

  async save(user: User): Promise<User> {
    const persistenceModel = this.mapper.toPersistence(user);

    const savedModel = await this.prisma.user.upsert({
      where: { id: persistenceModel.id },
      update: persistenceModel,
      create: persistenceModel,
    });

    return this.mapper.toDomain(savedModel);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
```

#### 🔴 Modules Layer (Entry Points)

**Purpose:** Wire up dependencies and provide HTTP endpoints

**Contains:**
- Feature modules
- Controllers (thin, delegation only)
- Module dependency configuration
- Guards and interceptors
- Request/response transformation

**Controllers Must:**
- Be thin (under 10 lines per method)
- Only handle HTTP concerns
- Delegate all logic to use cases
- Transform requests to DTOs
- Transform responses for HTTP

```typescript
// ✅ GOOD - Thin controller
@Controller('users')
@ApiTags('Users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new user' })
  async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    return this.createUserUseCase.execute(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  async getById(@Param('id') id: string): Promise<UserResponseDto> {
    return this.getUserUseCase.execute(id);
  }
}

// ❌ BAD - Fat controller with business logic
@Controller('users')
export class UserController {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    if (dto.name.length < 3) {
      throw new BadRequestException('Name too short');
    }

    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email }
    });

    if (exists) {
      throw new ConflictException('User exists');
    }

    const user = await this.prisma.user.create({ data: dto });
    await this.emailService.sendWelcome(user.email);
    this.eventEmitter.emit('user.created', user);

    return user;
  }
}
```

#### 💡 Shared Layer (Cross-Cutting Concerns)

**Purpose:** Provide utilities used across all layers

**Contains:**
- Custom decorators
- Guards (authentication, authorization)
- Interceptors (logging, transformation)
- Utilities and helpers
- Common constants
- API documentation helpers

**MUST NOT contain:**
- Feature-specific logic
- Business rules
- Domain knowledge

---

## Domain-Driven Design Rules

### ⚠️ CRITICAL: Entities (Objects with Identity)

**Entities are the heart of your domain model**

**Characteristics:**
- Have unique identity (ID)
- Mutable state
- Rich behavior (methods)
- Enforce invariants
- Encapsulate validation

```typescript
// ✅ GOOD - Rich entity with behavior and validation
export class Order {
  private constructor(
    public readonly id: string,
    public readonly customerId: string,
    private items: OrderItem[],
    private status: OrderStatus,
    private totalAmount: Money,
    private createdAt: Date,
  ) {}

  static create(customerId: string, items: OrderItem[]): Order {
    if (items.length === 0) {
      throw new DomainException('Order must have at least one item');
    }

    const totalAmount = this.calculateTotal(items);

    return new Order(
      uuid(),
      customerId,
      items,
      OrderStatus.PENDING,
      totalAmount,
      new Date(),
    );
  }

  addItem(item: OrderItem): void {
    if (this.status !== OrderStatus.PENDING) {
      throw new DomainException('Cannot modify confirmed order');
    }

    this.items.push(item);
    this.totalAmount = Order.calculateTotal(this.items);
  }

  removeItem(itemId: string): void {
    if (this.status !== OrderStatus.PENDING) {
      throw new DomainException('Cannot modify confirmed order');
    }

    this.items = this.items.filter(item => item.id !== itemId);
    
    if (this.items.length === 0) {
      throw new DomainException('Order must have at least one item');
    }

    this.totalAmount = Order.calculateTotal(this.items);
  }

  confirm(): void {
    if (this.status !== OrderStatus.PENDING) {
      throw new DomainException('Only pending orders can be confirmed');
    }

    this.status = OrderStatus.CONFIRMED;
  }

  cancel(): void {
    if (this.status === OrderStatus.DELIVERED) {
      throw new DomainException('Cannot cancel delivered order');
    }

    this.status = OrderStatus.CANCELLED;
  }

  private static calculateTotal(items: OrderItem[]): Money {
    const total = items.reduce(
      (sum, item) => sum + item.price.amount * item.quantity,
      0
    );
    return Money.create(total, 'USD');
  }

  getTotal(): Money {
    return this.totalAmount;
  }

  getItems(): readonly OrderItem[] {
    return Object.freeze([...this.items]);
  }
}

// ❌ BAD - Anemic entity (just a data holder with no behavior)
export class Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  status: string;
  totalAmount: number;
  createdAt: Date;
}

// ❌ BAD - Business logic in service instead of entity
export class OrderService {
  addItemToOrder(order: Order, item: OrderItem): void {
    if (order.status !== 'PENDING') {
      throw new Error('Cannot modify confirmed order');
    }
    order.items.push(item);
    order.totalAmount = this.calculateTotal(order.items);
  }
}
```

### ⚠️ CRITICAL: Value Objects (Domain Concepts)

**Value Objects represent descriptive aspects of the domain with no identity**

**Characteristics:**
- Immutable (no setters)
- Equality based on value, not identity
- Self-validating
- Can contain validation logic
- Created through factory methods

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
    return new Email(email.toLowerCase().trim());
  }

  private static isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    if (!(other instanceof Email)) {
      return false;
    }
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}

// ✅ GOOD - Money value object
export class Money {
  private constructor(
    private readonly amount: number,
    private readonly currency: string,
  ) {}

  static create(amount: number, currency: string): Money {
    if (amount < 0) {
      throw new DomainException('Money amount cannot be negative');
    }

    if (!['USD', 'EUR', 'GBP'].includes(currency)) {
      throw new DomainException('Invalid currency');
    }

    return new Money(amount, currency);
  }

  add(other: Money): Money {
    this.ensureSameCurrency(other);
    return new Money(this.amount + other.amount, this.currency);
  }

  subtract(other: Money): Money {
    this.ensureSameCurrency(other);
    return Money.create(this.amount - other.amount, this.currency);
  }

  multiply(multiplier: number): Money {
    return new Money(this.amount * multiplier, this.currency);
  }

  private ensureSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new DomainException('Cannot operate on different currencies');
    }
  }

  getAmount(): number {
    return this.amount;
  }

  getCurrency(): string {
    return this.currency;
  }

  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }
}

// ❌ BAD - Using primitives without validation
let email: string = userInput; // No validation
let price: number = -100; // No validation, invalid state allowed
```

### 🔴 REQUIRED: Repository Pattern

**Repository abstracts data access and provides collection-like interface**

**Interface in Domain, Implementation in Infrastructure**

```typescript
// ✅ GOOD - Repository interface in domain
// domain/repositories/user.repository.ts
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  save(user: User): Promise<User>;
  delete(id: string): Promise<void>;
  exists(email: string): Promise<boolean>;
}

// ✅ GOOD - Implementation in infrastructure
// infrastructure/persistence/repositories/prisma-user.repository.ts
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

  async findByEmail(email: string): Promise<User | null> {
    const model = await this.prisma.user.findUnique({ where: { email } });
    return model ? this.mapper.toDomain(model) : null;
  }

  async save(user: User): Promise<User> {
    const persistenceModel = this.mapper.toPersistence(user);
    
    const savedModel = await this.prisma.user.upsert({
      where: { id: persistenceModel.id },
      update: persistenceModel,
      create: persistenceModel,
    });

    return this.mapper.toDomain(savedModel);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  async exists(email: string): Promise<boolean> {
    const count = await this.prisma.user.count({ where: { email } });
    return count > 0;
  }
}

// ❌ BAD - Direct database access in use case
@Injectable()
export class CreateUserUseCase {
  constructor(private prisma: PrismaService) {}

  async execute(dto: CreateUserDto) {
    return this.prisma.user.create({ data: dto });
  }
}
```

### 🔴 REQUIRED: Domain Services

**When operation doesn't naturally fit in a single entity**

```typescript
// ✅ GOOD - Domain service for cross-entity operations
export class TransferMoneyDomainService {
  static transfer(
    fromAccount: Account,
    toAccount: Account,
    amount: Money,
  ): void {
    if (!fromAccount.canWithdraw(amount)) {
      throw new DomainException('Insufficient funds');
    }

    if (fromAccount.getId() === toAccount.getId()) {
      throw new DomainException('Cannot transfer to same account');
    }

    fromAccount.withdraw(amount);
    toAccount.deposit(amount);
  }
}

// Usage in use case
@Injectable()
export class TransferMoneyUseCase {
  constructor(
    @Inject('IAccountRepository')
    private accountRepository: IAccountRepository,
  ) {}

  async execute(dto: TransferMoneyDto): Promise<void> {
    const fromAccount = await this.accountRepository.findById(dto.fromAccountId);
    const toAccount = await this.accountRepository.findById(dto.toAccountId);

    if (!fromAccount || !toAccount) {
      throw new NotFoundException('Account not found');
    }

    const amount = Money.create(dto.amount, dto.currency);

    TransferMoneyDomainService.transfer(fromAccount, toAccount, amount);

    await this.accountRepository.save(fromAccount);
    await this.accountRepository.save(toAccount);
  }
}
```

### 🔴 REQUIRED: Mappers (Domain ↔ Persistence)

**Never expose database models outside infrastructure layer**

```typescript
// ✅ GOOD - Mapper transforms between domain and persistence
@Injectable()
export class UserMapper {
  toDomain(model: PrismaUser): User {
    return User.reconstitute({
      id: model.id,
      name: model.name,
      email: model.email,
      passwordHash: model.password,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  toPersistence(entity: User): PrismaUserCreateInput {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.getEmail(),
      password: entity.getPasswordHash(),
      createdAt: entity.createdAt,
    };
  }

  toResponseDto(entity: User): UserResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.getEmail(),
      createdAt: entity.createdAt,
    };
  }
}

// ❌ BAD - Returning database model directly
async getUser(id: string): Promise<PrismaUser> {
  return this.prisma.user.findUnique({ where: { id } });
}
```

### 🟡 RECOMMENDED: Aggregate Pattern

**Group related entities under a single root**

```typescript
// ✅ GOOD - Order as aggregate root
export class Order {
  private constructor(
    public readonly id: string,
    private customerId: string,
    private items: OrderItem[], // Entities within aggregate
    private shippingAddress: Address, // Value object
    private status: OrderStatus,
  ) {}

  addItem(product: Product, quantity: number): void {
    const existingItem = this.items.find(
      item => item.productId === product.id
    );

    if (existingItem) {
      existingItem.increaseQuantity(quantity);
    } else {
      this.items.push(OrderItem.create(product, quantity));
    }
  }

  getItems(): readonly OrderItem[] {
    return Object.freeze([...this.items]);
  }
}

export class OrderItem {
  private constructor(
    public readonly id: string,
    public readonly productId: string,
    private productName: string,
    private price: Money,
    private quantity: number,
  ) {}

  static create(product: Product, quantity: number): OrderItem {
    if (quantity <= 0) {
      throw new DomainException('Quantity must be positive');
    }

    return new OrderItem(
      uuid(),
      product.id,
      product.name,
      product.price,
      quantity,
    );
  }

  increaseQuantity(amount: number): void {
    this.quantity += amount;
  }
}
```

---

## API Design Guidelines

### 🔴 REQUIRED: RESTful Endpoints

**HTTP Methods:**
- `GET` - Retrieve resource(s) (safe, idempotent)
- `POST` - Create new resource (not idempotent)
- `PUT` - Replace entire resource (idempotent)
- `PATCH` - Partial update (idempotent)
- `DELETE` - Remove resource (idempotent)

**Naming Conventions:**
- Use plural nouns: `/users` not `/user`
- Use kebab-case: `/order-items` not `/orderItems`
- Nested resources: `/users/:userId/orders`
- Actions on resources: `/orders/:id/cancel` (POST)

```typescript
// ✅ GOOD - RESTful endpoints
@Controller('users')
export class UserController {
  @Get()
  async findAll(): Promise<UserResponseDto[]> { }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponseDto> { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> { }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto
  ): Promise<UserResponseDto> { }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> { }
}

@Controller('users/:userId/orders')
export class UserOrderController {
  @Get()
  async findUserOrders(
    @Param('userId') userId: string
  ): Promise<OrderResponseDto[]> { }
}

// ❌ BAD - Non-RESTful, inconsistent naming
@Controller('user')
export class UserController {
  @Get('getAllUsers')
  async getAllUsers() { }

  @Post('createUser')
  async createUser() { }

  @Get('getUserById/:id')
  async getUserById() { }
}
```

### 🔴 REQUIRED: HTTP Status Codes

**Success Codes:**
- `200 OK` - Successful GET, PUT, PATCH
- `201 Created` - Successful POST (resource created)
- `204 No Content` - Successful DELETE (no response body)

**Client Error Codes:**
- `400 Bad Request` - Validation error, malformed request
- `401 Unauthorized` - Authentication required or failed
- `403 Forbidden` - Authenticated but insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict (duplicate, state conflict)
- `422 Unprocessable Entity` - Validation error on well-formed request

**Server Error Codes:**
- `500 Internal Server Error` - Unexpected server error
- `503 Service Unavailable` - Temporary unavailability

```typescript
// ✅ GOOD - Proper status codes
@Controller('users')
export class UserController {
  @Post()
  @HttpCode(HttpStatus.CREATED) // 201
  async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    return this.createUserUseCase.execute(dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // 204
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteUserUseCase.execute(id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.getUserUseCase.execute(id);
    
    if (!user) {
      throw new NotFoundException('User not found'); // 404
    }

    return user;
  }
}
```

### 🔴 REQUIRED: Response Structure

**Standard Response Format:**

```typescript
// ✅ GOOD - Consistent response structure
// Single resource
{
  "data": {
    "id": "123",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "meta": {
    "timestamp": "2025-01-31T10:00:00Z",
    "version": "1.0"
  }
}

// List with pagination
{
  "data": [
    { "id": "1", "name": "User 1" },
    { "id": "2", "name": "User 2" }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5,
    "timestamp": "2025-01-31T10:00:00Z"
  }
}

// Error response
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format",
        "value": "invalid-email"
      }
    ],
    "timestamp": "2025-01-31T10:00:00Z",
    "path": "/api/users"
  }
}
```

**Implementation:**

```typescript
// Response interceptor
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => ({
        data,
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0',
        },
      })),
    );
  }
}
```

### 🔴 REQUIRED: DTOs (Data Transfer Objects)

**Validation with class-validator:**

```typescript
// ✅ GOOD - Proper DTO with validation
export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @ApiProperty({ example: 'John Doe' })
  name: string;

  @IsEmail()
  @ApiProperty({ example: 'john@example.com' })
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain uppercase, lowercase, and number'
  })
  @ApiProperty({ example: 'SecurePass123' })
  password: string;
}

export class UpdateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @IsOptional()
  @ApiPropertyOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  @ApiPropertyOptional()
  email?: string;
}

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  createdAt: Date;
}

// ❌ BAD - No validation
export class CreateUserDto {
  name: string;
  email: string;
  password: string;
}
```

### 🟡 RECOMMENDED: Pagination

```typescript
// ✅ GOOD - Pagination DTO
export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({ default: 1 })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @ApiPropertyOptional({ default: 20 })
  limit?: number = 20;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  sortBy?: string;

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  @ApiPropertyOptional({ enum: ['ASC', 'DESC'] })
  order?: 'ASC' | 'DESC' = 'ASC';
}

// Usage
@Get()
async findAll(@Query() pagination: PaginationDto): Promise<PaginatedResponse<UserResponseDto>> {
  return this.getUsersUseCase.execute(pagination);
}
```

---

## Error Handling

### ⚠️ CRITICAL: Exception Hierarchy

**Create domain-specific exceptions:**

```typescript
// ✅ GOOD - Custom exception hierarchy
// shared/exceptions/domain.exception.ts
export class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainException';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class EntityNotFoundException extends DomainException {
  constructor(entityName: string, id: string) {
    super(`${entityName} with id ${id} not found`);
    this.name = 'EntityNotFoundException';
  }
}

export class InvalidStateException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidStateException';
  }
}

export class ValidationException extends DomainException {
  constructor(
    message: string,
    public readonly errors: ValidationError[]
  ) {
    super(message);
    this.name = 'ValidationException';
  }
}

interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

// Usage in domain
if (!user) {
  throw new EntityNotFoundException('User', userId);
}

if (order.status !== OrderStatus.PENDING) {
  throw new InvalidStateException('Cannot modify confirmed order');
}
```

### 🔴 REQUIRED: Global Exception Filter

```typescript
// ✅ GOOD - Comprehensive exception filter
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { status, error } = this.handleException(exception);

    this.logger.error(
      `${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : exception
    );

    response.status(status).json({
      error: {
        ...error,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
      },
    });
  }

  private handleException(exception: unknown): {
    status: number;
    error: ErrorResponse;
  } {
    if (exception instanceof HttpException) {
      return this.handleHttpException(exception);
    }

    if (exception instanceof EntityNotFoundException) {
      return {
        status: HttpStatus.NOT_FOUND,
        error: {
          code: 'ENTITY_NOT_FOUND',
          message: exception.message,
        },
      };
    }

    if (exception instanceof ValidationException) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: {
          code: 'VALIDATION_ERROR',
          message: exception.message,
          details: exception.errors,
        },
      };
    }

    if (exception instanceof DomainException) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: {
          code: 'DOMAIN_ERROR',
          message: exception.message,
        },
      };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
      },
    };
  }

  private handleHttpException(exception: HttpException): {
    status: number;
    error: ErrorResponse;
  } {
    const status = exception.getStatus();
    const response = exception.getResponse();

    return {
      status,
      error: {
        code: exception.name,
        message: typeof response === 'string' ? response : (response as any).message,
        details: typeof response === 'object' ? (response as any).details : undefined,
      },
    };
  }
}

interface ErrorResponse {
  code: string;
  message: string;
  details?: any;
}
```

---

## Testing Requirements

### 🔴 REQUIRED: Test Structure

```
tests/
├── unit/
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── user.entity.spec.ts
│   │   │   └── order.entity.spec.ts
│   │   └── value-objects/
│   │       ├── email.spec.ts
│   │       └── money.spec.ts
│   ├── application/
│   │   └── use-cases/
│   │       ├── create-user.use-case.spec.ts
│   │       └── transfer-money.use-case.spec.ts
│   └── infrastructure/
│       └── repositories/
│           └── prisma-user.repository.spec.ts
├── integration/
│   └── modules/
│       └── user.controller.integration.spec.ts
└── e2e/
    └── user-management.e2e.spec.ts
```

### 🔴 REQUIRED: Unit Testing Domain

```typescript
// ✅ GOOD - Domain entity tests
describe('User Entity', () => {
  describe('create', () => {
    it('should create user with valid data', () => {
      const user = User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePass123',
      });

      expect(user.id).toBeDefined();
      expect(user.name).toBe('John Doe');
      expect(user.getEmail()).toBe('john@example.com');
    });

    it('should throw error for short name', () => {
      expect(() => {
        User.create({
          name: 'Jo',
          email: 'john@example.com',
          password: 'SecurePass123',
        });
      }).toThrow('Name must be at least 3 characters');
    });

    it('should throw error for invalid email', () => {
      expect(() => {
        User.create({
          name: 'John Doe',
          email: 'invalid-email',
          password: 'SecurePass123',
        });
      }).toThrow('Invalid email format');
    });

    it('should throw error for weak password', () => {
      expect(() => {
        User.create({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'weak',
        });
      }).toThrow('Password must be at least 8 characters');
    });
  });

  describe('changeName', () => {
    it('should change name when valid', () => {
      const user = User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePass123',
      });

      user.changeName('Jane Doe');

      expect(user.name).toBe('Jane Doe');
    });

    it('should throw error for invalid name', () => {
      const user = User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePass123',
      });

      expect(() => {
        user.changeName('Jo');
      }).toThrow('Name must be at least 3 characters');
    });
  });

  describe('verifyPassword', () => {
    it('should return true for correct password', () => {
      const user = User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePass123',
      });

      expect(user.verifyPassword('SecurePass123')).toBe(true);
    });

    it('should return false for incorrect password', () => {
      const user = User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePass123',
      });

      expect(user.verifyPassword('WrongPass123')).toBe(false);
    });
  });
});
```

### 🔴 REQUIRED: Testing Use Cases

```typescript
// ✅ GOOD - Use case tests with mocks
describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockEmailService: jest.Mocked<IEmailService>;
  let mockEventEmitter: jest.Mocked<EventEmitter2>;

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: jest.fn(),
      save: jest.fn(),
      findById: jest.fn(),
      delete: jest.fn(),
      exists: jest.fn(),
    } as any;

    mockEmailService = {
      sendWelcomeEmail: jest.fn(),
    } as any;

    mockEventEmitter = {
      emit: jest.fn(),
    } as any;

    useCase = new CreateUserUseCase(
      mockUserRepository,
      mockEmailService,
      mockEventEmitter,
    );
  });

  describe('execute', () => {
    it('should create user successfully', async () => {
      const dto: CreateUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePass123',
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.save.mockImplementation(user => Promise.resolve(user));
      mockEmailService.sendWelcomeEmail.mockResolvedValue(undefined);

      const result = await useCase.execute(dto);

      expect(result).toBeDefined();
      expect(result.name).toBe('John Doe');
      expect(result.email).toBe('john@example.com');
      expect(mockUserRepository.save).toHaveBeenCalled();
      expect(mockEmailService.sendWelcomeEmail).toHaveBeenCalledWith('john@example.com');
      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        'user.created',
        expect.any(UserCreatedEvent)
      );
    });

    it('should throw error if user already exists', async () => {
      const dto: CreateUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePass123',
      };

      const existingUser = User.create(dto);
      mockUserRepository.findByEmail.mockResolvedValue(existingUser);

      await expect(useCase.execute(dto)).rejects.toThrow(
        'User with this email already exists'
      );

      expect(mockUserRepository.save).not.toHaveBeenCalled();
      expect(mockEmailService.sendWelcomeEmail).not.toHaveBeenCalled();
    });

    it('should throw error for invalid email', async () => {
      const dto: CreateUserDto = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'SecurePass123',
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(useCase.execute(dto)).rejects.toThrow('Invalid email format');
    });
  });
});
```

### 🟡 RECOMMENDED: Integration Tests

```typescript
// ✅ GOOD - Controller integration test
describe('UserController (Integration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  describe('POST /users', () => {
    it('should create user', async () => {
      const dto: CreateUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePass123',
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(dto)
        .expect(HttpStatus.CREATED);

      expect(response.body.data.name).toBe(dto.name);
      expect(response.body.data.email).toBe(dto.email);
      expect(response.body.data.id).toBeDefined();
    });

    it('should return 409 for duplicate email', async () => {
      const dto: CreateUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePass123',
      };

      await request(app.getHttpServer())
        .post('/users')
        .send(dto)
        .expect(HttpStatus.CREATED);

      await request(app.getHttpServer())
        .post('/users')
        .send(dto)
        .expect(HttpStatus.CONFLICT);
    });
  });
});
```

---

## Performance Considerations

### 🔴 REQUIRED: Database Optimization

```typescript
// ✅ GOOD - Efficient query with proper indexing
@Injectable()
export class PrismaUserRepository implements IUserRepository {
  async findActiveUsersByRole(role: string): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: {
        role,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return users.map(this.mapper.toDomain);
  }

  async findUserWithOrders(userId: string): Promise<UserWithOrders | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        orders: {
          include: {
            items: true,
          },
        },
      },
    });

    return user ? this.mapper.toUserWithOrders(user) : null;
  }
}

// ❌ BAD - N+1 query problem
async getUsersWithOrders(): Promise<UserWithOrders[]> {
  const users = await this.prisma.user.findMany();
  
  const usersWithOrders = [];
  for (const user of users) {
    const orders = await this.prisma.order.findMany({
      where: { userId: user.id }
    });
    usersWithOrders.push({ ...user, orders });
  }
  
  return usersWithOrders;
}
```

### 🟡 RECOMMENDED: Caching Strategy

```typescript
// ✅ GOOD - Cache frequently accessed data
@Injectable()
export class CachedUserRepository implements IUserRepository {
  constructor(
    private readonly prismaRepository: PrismaUserRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findById(id: string): Promise<User | null> {
    const cacheKey = `user:${id}`;
    
    const cached = await this.cacheManager.get<User>(cacheKey);
    if (cached) {
      return cached;
    }

    const user = await this.prismaRepository.findById(id);
    
    if (user) {
      await this.cacheManager.set(cacheKey, user, 300);
    }

    return user;
  }

  async save(user: User): Promise<User> {
    const saved = await this.prismaRepository.save(user);
    
    const cacheKey = `user:${user.id}`;
    await this.cacheManager.del(cacheKey);

    return saved;
  }
}
```

### 🟡 RECOMMENDED: Rate Limiting

```typescript
// ✅ GOOD - Rate limiting on endpoints
@Controller('users')
@UseGuards(ThrottlerGuard)
export class UserController {
  @Post()
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    return this.createUserUseCase.execute(dto);
  }

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async login(@Body() dto: LoginDto): Promise<TokenResponseDto> {
    return this.loginUseCase.execute(dto);
  }
}
```

---

## Git and Version Control

### 🔴 REQUIRED: Commit Guidelines

**Conventional Commits Format:**

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat:` New feature
- `fix:` Bug fix
- `refactor:` Code refactoring (no functionality change)
- `docs:` Documentation changes
- `test:` Test additions or updates
- `chore:` Maintenance tasks
- `perf:` Performance improvements
- `style:` Code style changes (formatting)

**Examples:**

```bash
# ✅ GOOD commits
feat(user): add email verification feature
fix(order): resolve calculation error in total amount
refactor(auth): simplify token validation logic
docs(readme): update installation instructions
test(user): add tests for password validation

# ❌ BAD commits
update stuff
fix bug
changes
wip
```

**Commit Rules:**
- One logical change per commit
- Reference issue numbers: `fix(order): resolve #123`
- Keep subject under 50 characters
- Use imperative mood: "add" not "added"

### 🔴 REQUIRED: What NOT to Commit

**Never commit:**
- `node_modules/`
- `.env` files
- `dist/` or `build/` directories
- IDE-specific files (`.idea/`, `.vscode/` unless team-agreed)
- Logs files (`*.log`)
- OS-specific files (`.DS_Store`, `Thumbs.db`)
- Database files (`.sqlite`, `.db`)
- Temporary files

**Ensure .gitignore includes:**

```
node_modules/
dist/
build/
.env
.env.local
*.log
.DS_Store
coverage/
.idea/
*.sqlite
```

### 🟡 RECOMMENDED: Branch Strategy

```bash
# Branch naming
feature/user-authentication
bugfix/order-calculation-error
hotfix/security-vulnerability
refactor/clean-architecture-migration

# Keep branches:
# - Focused on single feature/fix
# - Short-lived (delete after merge)
# - Up to date with main/develop
```

---

## Summary: Clean Architecture Checklist

### ✅ DO

**Architecture:**
- Keep domain layer pure (no framework dependencies)
- Use dependency injection everywhere
- Program to interfaces, not implementations
- Follow the dependency rule (inner layers don't know outer layers)

**Domain:**
- Create rich domain models with behavior
- Use value objects for complex validations
- Implement repository pattern for data access
- Use domain services for cross-entity operations

**Application:**
- Create focused, single-purpose use cases
- Use DTOs for all data transfer
- Handle application concerns (events, transactions)
- Transform domain entities to DTOs

**Code Quality:**
- Write self-documenting code
- Test domain logic thoroughly
- Use descriptive names
- Apply SOLID principles
- Remove all debugging code before committing

### ❌ DON'T

**Architecture:**
- Put business logic in controllers
- Mix layer concerns
- Use concrete implementations in application layer
- Skip dependency injection

**Domain:**
- Create anemic domain models (data-only classes)
- Expose database models outside infrastructure
- Skip validation in domain layer
- Put infrastructure code in domain

**Code Quality:**
- Write comments instead of clear code
- Use `any` type in TypeScript
- Leave console.log statements
- Create god classes
- Commit sensitive data

---

## Additional Resources

### Recommended Reading
- "Domain-Driven Design" by Eric Evans
- "Clean Architecture" by Robert C. Martin
- "Implementing Domain-Driven Design" by Vaughn Vernon

### NestJS Official Docs
- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)

### Code Quality Tools
- ESLint for linting
- Prettier for formatting
- Husky for pre-commit hooks
- Jest for testing

---

**Document Version:** 1.0.0  
**Last Updated:** January 31, 2025  
**Maintained By:** Development Team