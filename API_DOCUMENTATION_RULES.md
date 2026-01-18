# NestJS API Documentation Guide (Swagger + DTO‑Driven)

This document defines a **standard, DTO‑centric approach** to documenting API endpoints in a NestJS backend using `@nestjs/swagger`. The goal is consistency, clarity, and production‑grade API contracts.

---

## 1. Prerequisites

```bash
pnpm add @nestjs/swagger
```

In `main.ts`:

```ts
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('Project API')
  .setDescription('Backend API Documentation')
  .addBearerAuth()
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('docs', app, document);
```

---

## 2. Documentation Quality Standards

### 2.1 Mandatory Documentation Rules

Every API endpoint **MUST** include:

| Requirement         | Description                                                  | Mandatory |
| ------------------- | ------------------------------------------------------------ | --------- |
| **Summary**         | Short, action-oriented title (max 60 characters)             | ✅ Yes    |
| **Description**     | Detailed explanation of what the endpoint does               | ✅ Yes    |
| **Feature Context** | Which module/feature this endpoint belongs to                | ✅ Yes    |
| **Request Body**    | DTO type with all properties documented                      | ✅ Yes    |
| **Response Type**   | DTO type for success responses                               | ✅ Yes    |
| **Status Codes**    | All possible HTTP status codes with descriptions             | ✅ Yes    |
| **Parameters**      | Route/query parameters with types and examples               | If used   |
| **Authentication**  | Whether endpoint requires auth and what permissions          | ✅ Yes    |

### 2.2 Quality Checklist

Before merging any API changes, verify:

- [ ] Summary is concise and action-oriented (e.g., "Register a new user", not "User registration endpoint")
- [ ] Description explains the business logic and flow
- [ ] All request properties have `@ApiProperty` with `description` and `example`
- [ ] All response properties have `@ApiProperty` with `example`
- [ ] Every possible error status code is documented
- [ ] Route parameters have `@ApiParam` with `name`, `description`, and `example`
- [ ] Query parameters have `@ApiQuery` with `name`, `required`, `description`, and `example`
- [ ] Protected endpoints use `@ApiBearerAuth()` decorator

---

## 3. DTO‑First Documentation Strategy

**Rule:** Every request and response must be represented by a DTO and decorated with Swagger metadata.

Why:

- Enforces explicit contracts
- Eliminates undocumented payloads
- Keeps controllers thin

---

## 4. DTO Documentation Patterns

### 4.1 Request Body DTO

```ts
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Unique email address of the user',
    example: 'user@example.com',
    required: true
  })
  email: string;

  @ApiProperty({
    description: 'Strong password (min 8 characters, must contain uppercase, lowercase, number, and special character)',
    example: 'P@ssw0rd123',
    required: true,
    minLength: 8
  })
  password: string;
}
```

### 4.2 Request DTO Property Requirements

Every `@ApiProperty` on request DTOs **MUST** include:

| Property      | Description                              | Required      |
| ------------- | ---------------------------------------- | --------      |
| `description` | Clear explanation of the property        | ✅ Yes        |
| `example`     | Realistic example value                  | ✅ Yes        |
| `required`    | Whether the property is mandatory        | ✅ Yes        |
| `minLength`   | Minimum length for strings               | If applicable |
| `maxLength`   | Maximum length for strings               | If applicable |
| `minimum`     | Minimum value for numbers                | If applicable |
| `maximum`     | Maximum value for numbers                | If applicable |
| `enum`        | Allowed values for enums                 | If applicable |
| `default`     | Default value if not provided            | If applicable |

---

### 4.3 Response DTO

```ts
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ 
    description: 'Unique user identifier',
    example: 'usr_8f92kdla21' 
  })
  id: string;

  @ApiProperty({ 
    description: 'User email address',
    example: 'user@example.com' 
  })
  email: string;

  @ApiProperty({ 
    description: 'Account creation timestamp',
    example: '2026-01-18T12:00:00.000Z' 
  })
  createdAt: string;
}
```

---

## 5. Documentation Decorator Layer (`src/docus`)

All Swagger decorators **MUST** be extracted into reusable decorator functions in the `src/docus` directory.

### 5.1 Folder Structure

```folder
src/docus/
├── index.ts                  # Barrel exports
├── auth.decorator.ts         # Auth module documentation
├── users.decorator.ts        # Users module documentation
├── common.decorator.ts       # Shared response decorators
└── [module].decorator.ts     # Per-module documentation
```

### 5.2 Naming Convention

| Pattern                    | Example                     |
| -------------------------- | --------------------------- |
| `{Action}{Resource}Docs`   | `CreateUserDocs`            |
| `{Resource}{Action}Docs`   | `UserCreateDocs`            |
| `{Action}Docs`             | `RegisterDocs`, `LoginDocs` |

### 5.3 Documentation Decorator Template

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
  ApiBearerAuth,
  ApiParam,
  ApiQuery
} from '@nestjs/swagger';

export const CreateUserDocs = () => applyDecorators(
  ApiOperation({
    summary: 'Create a new user account',
    description: `
      Creates a new user account with the provided credentials.
      
      **Flow:**
      1. Validates email format and password strength
      2. Checks for existing account with same email
      3. Hashes password and creates user record
      4. Sends verification email to user
      
      **Feature:** User Management > Registration
    `
  }),
  ApiBody({ 
    type: CreateUserDto,
    description: 'User registration credentials'
  }),
  ApiCreatedResponse({
    description: 'User account created successfully. Verification email sent.',
    type: UserResponseDto
  }),
  ApiBadRequestResponse({
    description: 'Invalid input data. Check email format and password requirements.'
  }),
  ApiConflictResponse({
    description: 'Email address is already registered.'
  }),
  ApiTooManyRequestsResponse({
    description: 'Rate limit exceeded. Try again later.'
  }),
  ApiInternalServerErrorResponse({
    description: 'Unexpected server error occurred.'
  })
);
```

---

## 6. Controller‑Level Documentation

### 6.1 Controller Structure

```ts
@ApiTags('Users')
@Controller('users')
export class UsersController {
  @Post()
  @CreateUserDocs()
  create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(dto);
  }
}
```

### 6.2 ApiTags Naming Convention

| Pattern                | Example                      |
| ---------------------- | ------------------           |
| Resource name          | `@ApiTags('Users')`          |
| With prefix for routes | `@ApiTags('/auth')`          |
| Feature grouping       | `@ApiTags('Authentication')` |

---

## 7. Route Parameter Documentation

```ts
@Get(':id')
@GetUserByIdDocs()
findOne(@Param('id') id: string) {}
```

Documentation decorator:

```ts
export const GetUserByIdDocs = () => applyDecorators(
  ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieves a single user by their unique identifier.'
  }),
  ApiParam({
    name: 'id',
    description: 'Unique user identifier',
    example: 'usr_8f92kdla21',
    required: true,
    type: String
  }),
  ApiOkResponse({ 
    description: 'User found and returned.',
    type: UserResponseDto 
  }),
  ApiNotFoundResponse({ 
    description: 'User with specified ID does not exist.' 
  }),
  ApiBearerAuth()
);
```

---

## 8. Query Parameter Documentation

```ts
@Get()
@ListUsersDocs()
findAll(
  @Query('page') page?: number,
  @Query('limit') limit?: number
) {}
```

Documentation decorator:

```ts
export const ListUsersDocs = () => applyDecorators(
  ApiOperation({
    summary: 'List all users',
    description: 'Retrieves a paginated list of users with optional filtering.'
  }),
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
  }),
  ApiOkResponse({ 
    description: 'List of users returned successfully.',
    type: [UserResponseDto]
  }),
  ApiBearerAuth()
);
```

---

## 9. Authentication & Authorization Documentation

### 9.1 Protected Endpoints

```ts
export const ProtectedEndpointDocs = () => applyDecorators(
  ApiBearerAuth(),
  ApiUnauthorizedResponse({
    description: 'Access token is missing, invalid, or expired.'
  }),
  ApiForbiddenResponse({
    description: 'User does not have permission to access this resource.'
  })
);
```

### 9.2 Role-Based Access

```ts
export const AdminOnlyDocs = () => applyDecorators(
  ApiBearerAuth(),
  ApiOperation({
    summary: 'Admin-only endpoint',
    description: 'Requires ADMIN role to access.'
  }),
  ApiUnauthorizedResponse({
    description: 'Access token is missing or invalid.'
  }),
  ApiForbiddenResponse({
    description: 'User must have ADMIN role to access this resource.'
  })
);
```

---

## 10. HTTP Status Code Standards

### 10.1 Success Responses

| Status | Decorator              | Use Case                        |
| ------ | ---------------------- | ------------------------------- |
| 200    | `ApiOkResponse`        | GET, PUT, PATCH, DELETE success |
| 201    | `ApiCreatedResponse`   | POST resource creation          |
| 204    | `ApiNoContentResponse` | DELETE with no body             |

### 10.2 Client Error Responses

| Status | Decorator                        | Use Case                          |
| ------ | -----------------------------    | --------------------------------- |
| 400    | `ApiBadRequestResponse`          | Validation errors, malformed data |
| 401    | `ApiUnauthorizedResponse`        | Missing or invalid auth token     |
| 403    | `ApiForbiddenResponse`           | Insufficient permissions          |
| 404    | `ApiNotFoundResponse`            | Resource does not exist           |
| 409    | `ApiConflictResponse`            | Duplicate resource, state conflict|
| 422    | `ApiUnprocessableEntityResponse` | Semantic validation errors        |
| 429    | `ApiTooManyRequestsResponse`     | Rate limit exceeded               |

### 10.3 Server Error Responses

| Status | Decorator                         | Use Case                 |
| ------ | --------------------------------- | ------------------------ |
| 500    | `ApiInternalServerErrorResponse`  | Unhandled server errors  |
| 503    | `ApiServiceUnavailableResponse`   | Service temporarily down |

### 10.4 Mandatory Status Codes Per Endpoint Type

| Endpoint Type       | Required Status Codes                |
| ------------------- | ------------------------------------ |
| Public GET          | 200, 400, 404, 500                   |
| Public POST         | 201, 400, 409, 429, 500              |
| Protected GET       | 200, 400, 401, 403, 404, 500         |
| Protected POST      | 201, 400, 401, 403, 409, 429, 500    |
| Protected PUT/PATCH | 200, 400, 401, 403, 404, 409, 500    |
| Protected DELETE    | 200/204, 401, 403, 404, 500          |

---

## 11. Error Response Schema

```ts
import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ 
    description: 'HTTP status code',
    example: 400 
  })
  statusCode: number;

  @ApiProperty({ 
    description: 'Error type',
    example: 'Bad Request' 
  })
  error: string;

  @ApiProperty({ 
    description: 'Human-readable error message',
    example: 'Email already exists' 
  })
  message: string;

  @ApiProperty({ 
    description: 'Timestamp of when the error occurred',
    example: '2026-01-18T12:00:00.000Z' 
  })
  timestamp: string;

  @ApiProperty({ 
    description: 'Request path that caused the error',
    example: '/api/users' 
  })
  path: string;
}
```

Use in error responses:

```ts
ApiBadRequestResponse({ 
  description: 'Validation failed.',
  type: ErrorResponseDto 
})
```

---

## 12. Feature Context Documentation

Every documentation decorator **SHOULD** include feature context in the description:

```ts
ApiOperation({
  summary: 'Register a new user',
  description: `
    Registers a new user account and initiates email verification.
    
    **Feature:** Authentication > User Registration
    **Module:** auth
    **Related Endpoints:**
    - POST /auth/verify-email
    - POST /auth/resend-verification
    
    **Business Rules:**
    - Email must be unique across all users
    - Password must meet complexity requirements
    - Verification email expires after 24 hours
  `
})
```

---

## 13. Best Practices Summary

### Do's ✅

- Extract all Swagger decorators to `src/docus` folder
- Use `applyDecorators` for composable documentation
- Include feature context in operation descriptions
- Document all possible error responses
- Use realistic examples in `@ApiProperty`
- Keep summaries under 60 characters
- Use action verbs in summaries (Create, Update, Delete, Get, List)

### Don'ts ❌

- Never inline Swagger decorators in controllers
- Never skip error response documentation
- Never use placeholder examples like "string" or "example"
- Never omit `description` from `@ApiProperty`
- Never forget `@ApiBearerAuth()` on protected endpoints
- Never document status codes that can't actually occur

---

## 14. Documentation Review Checklist

Before approving any PR with API changes:

| Category          | Verification                                              |
| ----------------- | --------------------------------------------------------- |
| **Decorator**     | Documentation decorator exists in `src/docus`             |
| **Summary**       | Clear, concise, action-oriented                           |
| **Description**   | Explains flow, feature context, business rules            |
| **Request**       | All properties have description + example                 |
| **Response**      | Success response type documented                          |
| **Errors**        | All applicable error codes documented                     |
| **Parameters**    | Route/query params have description + example             |
| **Auth**          | `@ApiBearerAuth()` on protected endpoints                 |
| **Controller**    | Uses documentation decorator, not inline decorators       |

---

## 15. Accessing Documentation

Development:

```bash
http://localhost:3000/docs
```

Production:

```bash
https://api.yourdomain.com/docs
```
