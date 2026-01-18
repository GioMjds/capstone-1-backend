# AI-Assisted API Documentation Rules for NestJS Swagger

## Overview

This document provides AI-assisted coding rules for documenting API endpoints using NestJS Swagger (`@nestjs/swagger`). Follow these rules strictly when creating or modifying API documentation.

**Reference:** All rules are based on `API_DOCUMENTATION_RULES.md` in the project root.

---

## Core Principles

### 1. Documentation Decorator Layer

**ALWAYS** create documentation decorators in `src/docus` folder instead of inline Swagger decorators in controllers.

```
src/docus/
├── index.ts                  # Barrel exports
├── auth.decorator.ts         # Auth module documentation
├── users.decorator.ts        # Users module documentation
└── [module].decorator.ts     # Per-module documentation
```

### 2. Naming Convention for Documentation Decorators

Use pattern: `{Action}Docs` or `{Action}{Resource}Docs`

Examples:
- `RegisterDocs`
- `LoginDocs`
- `CreateUserDocs`
- `GetUserByIdDocs`
- `ListUsersDocs`
- `UpdateUserDocs`
- `DeleteUserDocs`

---

## Mandatory Documentation Structure

### Every Documentation Decorator MUST Include:

```ts
import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiTooManyRequestsResponse,
  ApiInternalServerErrorResponse,
  ApiBearerAuth
} from '@nestjs/swagger';

export const ExampleDocs = () => applyDecorators(
  // 1. REQUIRED: Operation summary and description
  ApiOperation({
    summary: 'Action-oriented summary (max 60 chars)',
    description: `
      Detailed explanation of what endpoint does.
      
      **Feature:** Module > Feature Name
      **Flow:**
      1. Step one
      2. Step two
      
      **Business Rules:**
      - Rule one
      - Rule two
    `
  }),
  
  // 2. REQUIRED for POST/PUT/PATCH: Request body type
  ApiBody({ 
    type: RequestDto,
    description: 'Description of request payload'
  }),
  
  // 3. REQUIRED: Success response
  ApiOkResponse({  // or ApiCreatedResponse for POST
    description: 'Success description',
    type: ResponseDto
  }),
  
  // 4. REQUIRED: All applicable error responses
  ApiBadRequestResponse({
    description: 'Specific validation error description'
  }),
  
  // 5. REQUIRED for protected endpoints
  ApiBearerAuth(),
  ApiUnauthorizedResponse({
    description: 'Access token is missing, invalid, or expired.'
  })
);
```

---

## HTTP Status Code Requirements

### For Public POST Endpoints (e.g., Register, Login):

```ts
ApiCreatedResponse({ description: 'Resource created successfully.' }),
ApiBadRequestResponse({ description: 'Validation errors in request.' }),
ApiConflictResponse({ description: 'Resource already exists.' }),
ApiTooManyRequestsResponse({ description: 'Rate limit exceeded.' }),
ApiInternalServerErrorResponse({ description: 'Unexpected server error.' })
```

### For Protected GET Endpoints:

```ts
ApiBearerAuth(),
ApiOkResponse({ description: 'Resource retrieved successfully.', type: ResponseDto }),
ApiBadRequestResponse({ description: 'Invalid request parameters.' }),
ApiUnauthorizedResponse({ description: 'Access token missing or invalid.' }),
ApiForbiddenResponse({ description: 'Insufficient permissions.' }),
ApiNotFoundResponse({ description: 'Resource not found.' }),
ApiInternalServerErrorResponse({ description: 'Unexpected server error.' })
```

### For Protected POST/PUT/PATCH Endpoints:

```ts
ApiBearerAuth(),
ApiCreatedResponse({ description: 'Resource created/updated.', type: ResponseDto }),
ApiBadRequestResponse({ description: 'Validation errors.' }),
ApiUnauthorizedResponse({ description: 'Access token missing or invalid.' }),
ApiForbiddenResponse({ description: 'Insufficient permissions.' }),
ApiConflictResponse({ description: 'Resource conflict.' }),
ApiTooManyRequestsResponse({ description: 'Rate limit exceeded.' }),
ApiInternalServerErrorResponse({ description: 'Unexpected server error.' })
```

### For Protected DELETE Endpoints:

```ts
ApiBearerAuth(),
ApiOkResponse({ description: 'Resource deleted successfully.' }),
ApiUnauthorizedResponse({ description: 'Access token missing or invalid.' }),
ApiForbiddenResponse({ description: 'Insufficient permissions.' }),
ApiNotFoundResponse({ description: 'Resource not found.' }),
ApiInternalServerErrorResponse({ description: 'Unexpected server error.' })
```

---

## DTO Documentation Rules

### Request DTO Properties MUST Include:

```ts
@ApiProperty({
  description: 'Clear explanation of what this property is',  // REQUIRED
  example: 'realistic_example_value',                          // REQUIRED
  required: true,                                              // REQUIRED
  minLength: 8,                                                // If applicable
  maxLength: 100,                                              // If applicable
  minimum: 1,                                                  // If applicable (numbers)
  maximum: 100,                                                // If applicable (numbers)
  enum: ['OPTION_1', 'OPTION_2'],                             // If applicable
  default: 'default_value'                                     // If applicable
})
```

### Response DTO Properties MUST Include:

```ts
@ApiProperty({
  description: 'Clear explanation of the property',  // REQUIRED
  example: 'realistic_example_value'                 // REQUIRED
})
```

---

## Route Parameter Documentation

When endpoint has route parameters, include `ApiParam`:

```ts
ApiParam({
  name: 'id',
  description: 'Unique identifier for the resource',
  example: 'usr_8f92kdla21',
  required: true,
  type: String
})
```

---

## Query Parameter Documentation

When endpoint has query parameters, include `ApiQuery`:

```ts
ApiQuery({
  name: 'page',
  description: 'Page number for pagination',
  required: false,
  type: Number,
  example: 1
}),
ApiQuery({
  name: 'limit',
  description: 'Number of items per page',
  required: false,
  type: Number,
  example: 10
})
```

---

## Controller Usage

### CORRECT ✅

```ts
@ApiTags('Users')
@Controller('users')
export class UsersController {
  @Post()
  @CreateUserDocs()  // Use documentation decorator
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }
}
```

### INCORRECT ❌

```ts
@Controller('users')
export class UsersController {
  @Post()
  @ApiOperation({ summary: 'Create user' })  // Inline decorators
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({ type: UserResponseDto })
  create(@Body() dto: CreateUserDto) {}
}
```

---

## Feature Context Template

Always include feature context in `ApiOperation.description`:

```ts
ApiOperation({
  summary: 'Action-oriented summary',
  description: `
    Brief explanation of what the endpoint does.
    
    **Feature:** Authentication > User Registration
    **Module:** auth
    
    **Flow:**
    1. Validate input data
    2. Check for existing resources
    3. Perform action
    4. Return response
    
    **Related Endpoints:**
    - POST /auth/verify-email
    - POST /auth/resend-verification
    
    **Business Rules:**
    - Rule 1
    - Rule 2
  `
})
```

---

## Barrel Export Rule

After creating a new documentation decorator, export it from `src/docus/index.ts`:

```ts
export * from './auth.decorator';
export * from './users.decorator';
export * from './[new-module].decorator';
```

---

## Quality Checklist for AI

Before generating API documentation, verify:

- [ ] Documentation decorator is in `src/docus/[module].decorator.ts`
- [ ] Decorator name follows `{Action}Docs` or `{Action}{Resource}Docs` pattern
- [ ] `ApiOperation` has `summary` (max 60 chars) and detailed `description`
- [ ] `description` includes feature context, flow, and business rules
- [ ] All request DTO properties have `@ApiProperty` with `description`, `example`, `required`
- [ ] All response DTO properties have `@ApiProperty` with `description`, `example`
- [ ] All applicable HTTP status codes are documented
- [ ] Protected endpoints include `ApiBearerAuth()` and auth error responses
- [ ] Route/query parameters have `ApiParam`/`ApiQuery` with proper metadata
- [ ] Decorator is exported from `src/docus/index.ts`
- [ ] Controller uses the documentation decorator, not inline Swagger decorators

---

## Common Mistakes to Avoid

1. **Missing error responses**: Always document 400, 401, 403, 404, 409, 429, 500 as applicable
2. **Vague descriptions**: Use specific, actionable descriptions
3. **Missing examples**: Every property needs a realistic example
4. **Inline decorators**: Always use `src/docus` documentation layer
5. **Missing `ApiBearerAuth()`**: Required on all protected endpoints
6. **Generic summaries**: Use action verbs (Create, Update, Delete, Get, List)
7. **Missing feature context**: Always include **Feature:** in description

---

## Example: Complete Auth Documentation

```ts
// src/docus/auth.decorator.ts
import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
  ApiTooManyRequestsResponse,
  ApiInternalServerErrorResponse
} from '@nestjs/swagger';
import { RegisterUserDto, LoginUserDto, UserResponseDto } from '@/modules/auth/dto';

export const RegisterDocs = () => applyDecorators(
  ApiOperation({
    summary: 'Register a new user account',
    description: `
      Registers a new user and initiates email verification flow.
      
      **Feature:** Authentication > User Registration
      **Module:** auth
      
      **Flow:**
      1. Validate email format and password strength
      2. Check if email already exists
      3. Hash password and create user record
      4. Generate verification token
      5. Send verification email
      
      **Related Endpoints:**
      - POST /auth/verify-email
      - POST /auth/resend-verif
      
      **Business Rules:**
      - Email must be unique
      - Password must meet complexity requirements
      - Verification token expires in 24 hours
    `
  }),
  ApiBody({ 
    type: RegisterUserDto,
    description: 'User registration credentials'
  }),
  ApiOkResponse({
    description: 'Registration successful. Verification email sent.'
  }),
  ApiBadRequestResponse({ 
    description: 'Invalid input data. Check email format or password requirements.' 
  }),
  ApiConflictResponse({ 
    description: 'Email address is already registered.' 
  }),
  ApiTooManyRequestsResponse({ 
    description: 'Too many registration attempts. Try again later.' 
  }),
  ApiInternalServerErrorResponse({
    description: 'Unexpected server error occurred.'
  })
);

export const LoginDocs = () => applyDecorators(
  ApiOperation({
    summary: 'Authenticate user and get access token',
    description: `
      Authenticates user credentials and returns JWT access token.
      
      **Feature:** Authentication > User Login
      **Module:** auth
      
      **Flow:**
      1. Validate email and password format
      2. Find user by email
      3. Verify password hash
      4. Check if email is verified
      5. Generate and return JWT token
      
      **Business Rules:**
      - Email must be verified before login
      - Token expires based on JWT configuration
      - Failed attempts may trigger rate limiting
    `
  }),
  ApiBody({ 
    type: LoginUserDto,
    description: 'User login credentials'
  }),
  ApiOkResponse({
    description: 'Login successful. Access token returned.'
  }),
  ApiBadRequestResponse({ 
    description: 'Invalid email format or password.' 
  }),
  ApiUnauthorizedResponse({ 
    description: 'Invalid credentials or email not verified.' 
  }),
  ApiTooManyRequestsResponse({ 
    description: 'Too many login attempts. Try again later.' 
  }),
  ApiInternalServerErrorResponse({
    description: 'Unexpected server error occurred.'
  })
);
```