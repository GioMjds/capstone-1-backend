# **Nest.js Backend Folder Structure Guide**

This documentation serves as contributors guide in maintaining the design architecture in NestJS backend with the tools, packages and libraries being used (see **`package.json`**). After you read the **`CONTRIBUTING.md`** and before working in this project.

## **Why This Folder Structure and it's Purpose?**

*This focuses in maintainable, scalable, readable, and production-ready backend mainly for separation of concerns and layered architecture.*

## **NestJS CLI**

The NestJS CLI is configured to generate files directly into the `src/modules/` directory following feature-based architecture. The `nest-cli.json` is already optimized for this structure.

### **Installation**

Install NestJS CLI globally if you haven't already:

```bash
npm install -g @nestjs/cli
```

Verify installation:

```bash
nest --version
```

### **Generating Feature Modules**

Use the following commands to generate feature-based modules:

#### **Generate a Complete Resource (Recommended) for your feature**

Generates module, controller, service, and DTOs in one command:

```bash
nest generate resource feature-name --no-spec
```

It prompts you into:

```bash
? Which project would you like to generate to?
❯ src [ Default ]
  modules

↑↓ navigate • ⏎ select
```

**Example:**

```bash
nest generate resource user --no-spec
```

This creates:

```folder
src/modules/user/
├── dto/
│   ├── create-user.dto.ts
│   └── update-user.dto.ts
├── entities/
│   └── user.entity.ts
├── user.controller.ts
├── user.module.ts
└── user.service.ts
```

#### **Generate Individual Components**

If you need to generate specific files:

```bash
# Generate just a module
nest generate module feature-name

# Generate just a service
nest generate service feature-name

# Generate just a controller
nest generate controller feature-name
```

### **Configuration & Best Practices**

The `nest-cli.json` is pre-configured with:

- **`generateOptions.spec: false`** - Disables `.spec` file generation by default
- **`generateOptions.flat: false`** - Creates nested folder structures (recommended)
- **`projects.modules`** - Directs generation to `src/modules/` directory

### **Post-Generation Steps**

After generating a resource:

1. ✅ Update the DTO with validation decorators (`class-validator`)
2. ✅ Add barrel exports in `index.ts`:

   ```ts
   export * from './feature-name.service';
   export * from './feature-name.controller';
   export * from './feature-name.module';
   export * from './dto';
   ```

3. ✅ Import the module in `app.module.ts`
4. ✅ Add exception handling and error handling in controller
5. ✅ Follow naming conventions from `AI_ASSISTED_CODING.md`
6. ✅ Ensure code adheres to `code_standards.instructions.md`

## **Folder Structure**

```folder
project-root/
├──__tests__/                           -> Jest test files for Jest testing of components
├── prisma/
|   ├── schema.prisma                   -> Database schemas
|   ├── scripts/                        -> Custom scripts to run
├── src/
|   ├── configs/                        -> Configuration files
|   |   ├── example.config.ts
|   ├── decorators/                     -> Custom decorators to follow
|   |   ├── example.decorator.ts
|   ├── guards/                         -> Library files
|   |   ├── example.guard.ts
|   ├── interfaces/                     -> Global interfaces
|   |   ├── example.interface.ts
|   ├── modules/                        -> Feature-based modules to work with.
|   |   ├── example/                    -> Your feature
|   |   |   dto/                        -> Your features DTO
|   |   |   ├── example.dto.ts
|   |   |   ├── example.module.ts       -> Module entry, to mainly imports array in `app.module.ts`
|   |   |   ├── example.controller.ts   -> HTTP endpoints
|   |   |   ├── example.service.ts      -> Business logic
|   |   |   ├── example.gateway.ts      -> WebSocket gateway
|   |   |   ├── example.resolver.ts     -> GraphQL resolver instead of controller (this may be optional)
|   ├── shared/                         -> Shared constants and utility functions
|   |   ├── constants/
|   |   ├── utils/
|   ├── .env                            -> Create your own one
|   ├── .env.example                    -> environment variables example file template
```

**Each subfolders has an `index.ts` for barrel exporting and `types.ts` for it's type usage if applicable.**

## **How Barrel Exporting Works?**

`index.ts`

```ts
export * from './feature';
```

`component/feature.ts`

```ts
export function Feature() {
    return
}
```

```ts
export function Module() {
    return
}
```

So when importing, it must goes:

`page.tsx`

```tsx
import { Feature, Module } from "@/component";
```

---

# **Layered Architecture Guide (`src` folder)**

## `configs/`

Centralized application configuration.

## **Purpose**

- Environment-based configuration loading
- Strongly typed config objects for dependency injection

## **Typical Contents**

- Database configuration
- JWT / authentication configuration
- Application-level constants sourced from environment variables

## **Best Practices**

- Use `@nestjs/config` with schema validation (Joi or Zod)
- Expose configs via injectable providers
- Avoid direct `process.env` access outside config layer

---

## `decorators/`

Custom metadata and syntactic sugar.

**Purpose**:

- Extend NestJS behavior cleanly
- Improve controller and service readability
- Enforce conventions declaratively

## **Typical Contents**

- `@CurrentUser()`
- `@Roles()`
- `@Public()`

## **Best Practices**

- Decorators should only define metadata
- Business logic belongs in guards or interceptors

---

## `guards/`

Request-level authorization and access control.

## **Purpose**

- Determine whether a request is allowed to proceed
- Enforce authentication and authorization rules

## **Typical Contents**

- JWT authentication guard
- Role-based access guard
- Permission-based guard

## **Best Practices**

- Keep guards thin and focused
- Read metadata defined by decorators
- Avoid embedding business logic

---

## `interfaces/`

Type contracts and structural definitions.

## **Purpose**

- Define data shapes across layers
- Decouple implementations from consumers

## **Typical Contents**

- JWT payload interfaces
- Service contracts
- External API response shapes

## **Best Practices**

- Use interfaces for cross-layer contracts
- Use DTOs for request and response validation instead of interfaces

---

## `modules/` (Feature-based)

Encapsulated application features and business domains.

## **Purpose**

- Organize business logic by domain
- Promote modularity and maintainability

## **Typical Structure**

```text
modules/
  auth/
    auth.module.ts
    auth.controller.ts
    auth.service.ts
```

## **Best Practices**

- Feature modules should be self-contained
- Expose functionality via module exports
- Avoid tight coupling between modules
- Supports clean monolith to microservice transitions

---

## `shared/`

Reusable utilities and constants.

## **Purpose**

- Provide common functionality across modules
- Avoid code duplication
- Provide common helpers across features

## **Typical Contents**

- Utility functions
- Application-wide constants
- Base helpers or abstractions

## **Best Practices**

- No feature-specific logic
- No dependencies on feature modules
- Treat as a low-level library layer

---

# **Mental Model**

- **`modules/`** define what the application does
- **`guards/`** and **`decorators/`** define who can do it
- **`configs/`** define how the application runs
- **`interfaces/`** define how components communicate
- **`shared/`** defines what can be reused globally

### **Feel free to contact the maintainers for questions or clarifications!**
