# Prisma Database Management Guide

This document provides comprehensive guidelines for using Prisma ORM in the backend API project.

## Table of Contents

- [Setup](#setup)
- [Database Schema Management](#database-schema-management)
- [Migrations](#migrations)
- [Prisma Client Usage](#prisma-client-usage)
- [Best Practices](#best-practices)
- [Common Commands](#common-commands)
- [Troubleshooting](#troubleshooting)

## Setup

### Prerequisites

- PostgreSQL database running
- `.env` file with `DATABASE_URL` configured
- Prisma CLI installed (included in project dependencies)

### Initial Configuration

The project uses Prisma with PostgreSQL adapter configured in `prisma.service.ts`:

```typescript
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL as string,
});
```

## Database Schema Management

### Schema Location

The Prisma schema is located at: `prisma/schema.prisma`

### Schema Structure

```prisma
datasource db {
  provider = "postgresql"
}

generator client {
  provider = "prisma-client-js"
}
```

### Models

The schema includes the following models:

- **User**: Authentication and user management

### Enums

- `UserRole`: ADMIN, DOCTOR, RECEPTIONIST, NURSE
- `AppointmentStatus`: SCHEDULED, CHECKED_IN, COMPLETED, CANCELLED
- `EncounterStatus`: OPEN, CLOSED
- `AuditAction`: CREATE, UPDATE, DELETE, LOGIN, LOGOUT

## Migrations

### Creating a New Migration

When you modify the schema, create a migration:

```bash
pnpm prisma migrate dev --name descriptive_migration_name
```

**Example:**

```bash
pnpm prisma migrate dev --name add_user_profile_fields
```

### Migration Naming Convention

Use descriptive snake_case names that clearly indicate the change:

- `add_user_profile_fields`
- `create_appointments_table`
- `update_patient_contact_info`
- `remove_deprecated_columns`

### Applying Migrations

Migrations are automatically applied during development with `migrate dev`.

For production:

```bash
pnpm prisma migrate deploy
```

### Resetting Database (Development Only)

⚠️ **Warning**: This will delete all data

```bash
pnpm prisma migrate reset
```

This command:

1. Drops the database
2. Creates a new database
3. Applies all migrations
4. Runs seed scripts (if configured)

### Checking Migration Status

```bash
pnpm prisma migrate status
```

## Prisma Client Usage

### Accessing Prisma Client

Prisma is available as a NestJS service through `PrismaService`:

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/configs';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }
}
```

### CRUD Operations

#### Create

```typescript
const user = await this.prisma.user.create({
  data: {
    email: 'doctor@example.com',
    firstName: 'John',
    lastName: 'Doe',
    password: hashedPassword,
    role: 'DOCTOR',
  },
});
```

#### Read

```typescript
const user = await this.prisma.user.findUnique({
  where: { id: userId },
});

const users = await this.prisma.user.findMany({
  where: { 
    role: 'DOCTOR',
    isActive: true,
  },
  orderBy: { createdAt: 'desc' },
});
```

#### Update

```typescript
const updatedUser = await this.prisma.user.update({
  where: { id: userId },
  data: { 
    firstName: 'Jane',
    updatedAt: new Date(),
  },
});
```

#### Delete

```typescript
const deletedUser = await this.prisma.user.delete({
  where: { id: userId },
});
```

### Relations

#### Including Related Data

```typescript
const appointment = await this.prisma.appointment.findUnique({
  where: { id: appointmentId },
  include: {
    Patient: true,
    User: true,
    Encounter: true,
  },
});
```

#### Creating with Relations

```typescript
const appointment = await this.prisma.appointment.create({
  data: {
    scheduledAt: new Date('2026-01-20'),
    status: 'SCHEDULED',
    reason: 'Annual checkup',
    Patient: {
      connect: { id: patientId },
    },
    User: {
      connect: { id: doctorId },
    },
  },
});
```

### Transactions

For operations that must succeed or fail together:

```typescript
const result = await this.prisma.$transaction(async (tx) => {
  const appointment = await tx.appointment.update({
    where: { id: appointmentId },
    data: { status: 'COMPLETED' },
  });

  const encounter = await tx.encounter.create({
    data: {
      appointmentId: appointmentId,
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      chiefComplaint: 'Follow-up',
      diagnosis: 'Stable',
      clinicalNotes: 'Patient doing well',
      status: 'CLOSED',
    },
  });

  return { appointment, encounter };
});
```

### Aggregations

```typescript
const appointmentCount = await this.prisma.appointment.count({
  where: {
    doctorId: doctorId,
    status: 'SCHEDULED',
  },
});

const stats = await this.prisma.appointment.groupBy({
  by: ['status'],
  _count: true,
  where: {
    scheduledAt: {
      gte: new Date('2026-01-01'),
    },
  },
});
```

## Best Practices

### 1. Type Safety

Always use generated Prisma types:

```typescript
import { User, Prisma } from '@prisma/client';

async createUser(data: Prisma.UserCreateInput): Promise<User> {
  return this.prisma.user.create({ data });
}
```

### 2. Error Handling

Handle Prisma-specific errors:

```typescript
import { Prisma } from '@prisma/client';
import { BadRequestException, NotFoundException } from '@nestjs/common';

async findUser(id: string) {
  try {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    return user;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Record not found');
      }
    }
    throw error;
  }
}
```

### 3. Select Only Required Fields

Optimize queries by selecting only needed fields:

```typescript
const user = await this.prisma.user.findUnique({
  where: { id: userId },
  select: {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
    role: true,
  },
});
```

### 4. Use Indexes

The schema includes indexes for frequently queried fields:

```prisma
@@index([scheduledAt])
@@index([entity, entityId])
@@index([lastName, firstName])
```

### 5. Soft Deletes

Use `isDeleted` flag instead of hard deletes where applicable:

```typescript
await this.prisma.patient.update({
  where: { id: patientId },
  data: { isDeleted: true },
});
```

### 6. Pagination

Implement cursor-based or offset pagination:

```typescript
const users = await this.prisma.user.findMany({
  take: 10,
  skip: pageNumber * 10,
  where: { isActive: true },
  orderBy: { createdAt: 'desc' },
});
```

### 7. Connection Lifecycle

The `PrismaService` handles connections automatically:

- Connects on module initialization
- Disconnects on module destruction
- No manual connection management needed

## Common Commands

### Development

```bash
pnpm prisma migrate dev                # Create and apply migration
pnpm prisma migrate dev --name <name>  # Create named migration
pnpm prisma migrate reset              # Reset database (dev only)
pnpm prisma migrate status             # Check migration status
pnpm prisma db push                    # Push schema without migration (prototyping)
```

### Production

```bash
pnpm prisma migrate deploy      # Apply pending migrations
pnpm prisma migrate status      # Verify migration state
```

### Client Management

```bash
pnpm prisma generate            # Regenerate Prisma Client
```

### Database Inspection

```bash
pnpm prisma studio              # Open Prisma Studio (GUI)
pnpm prisma db pull             # Pull schema from database
pnpm prisma validate            # Validate schema file
```

### Seeding (if configured)

```bash
pnpm prisma db seed             # Run seed scripts
```

## Troubleshooting

### Issue: Prisma Client Out of Sync

**Problem**: Types don't match database schema

**Solution**:

```bash
pnpm prisma generate
```

### Issue: Migration Conflicts

**Problem**: Migration history diverged between environments

**Solution**:

```bash
pnpm prisma migrate resolve --applied <migration_name>
# or
pnpm prisma migrate resolve --rolled-back <migration_name>
```

### Issue: Connection Errors

**Problem**: Cannot connect to database

**Solution**:

1. Verify `DATABASE_URL` in `.env`
2. Check database is running
3. Verify network connectivity
4. Check database credentials

### Issue: Schema Validation Errors

**Problem**: Schema has syntax errors

**Solution**:

```bash
pnpm prisma validate
```

### Issue: Migration Failed Halfway

**Problem**: Migration partially applied

**Solution**:

```bash
pnpm prisma migrate resolve --rolled-back <migration_name>
pnpm prisma migrate deploy
```

## Schema Modification Workflow

1. **Modify Schema**: Edit `prisma/schema.prisma`
2. **Validate**: Run `pnpm prisma validate`
3. **Create Migration**: Run `pnpm prisma migrate dev --name <descriptive_name>`
4. **Review Migration**: Check generated SQL in `prisma/migrations/`
5. **Test**: Verify changes work as expected
6. **Commit**: Commit schema and migration files together
7. **Deploy**: Apply migrations to other environments

## Environment-Specific Considerations

- Use `migrate dev` for automatic migration creation
- `migrate reset` is safe to use
- Frequent schema iterations expected

### Staging

- Use `migrate deploy` to apply tested migrations
- Test migrations before production deployment
- Maintain data consistency with production

### In Production

- Always use `migrate deploy`
- Never use `migrate reset`
- Backup database before migrations
- Plan migrations during maintenance windows
- Test migrations on staging first
- Monitor migration application
- Have rollback plan ready

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [NestJS Prisma Integration](https://docs.nestjs.com/recipes/prisma)
