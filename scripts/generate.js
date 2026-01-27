#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Helper function to ask questions
function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

// Helper function to create directory if it doesn't exist
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Helper function to convert string to PascalCase
function toPascalCase(str) {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

// Helper function to convert string to camelCase
function toCamelCase(str) {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

// Helper function to log with color
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Template generators
const templates = {
  entity: (name) => `export class ${toPascalCase(name)} {
  private constructor(
    public readonly id: string,
    // Add your properties here
  ) {}

  static create(props: Create${toPascalCase(name)}Props): ${toPascalCase(name)} {
    // Add validation logic here
    return new ${toPascalCase(name)}(
      props.id || crypto.randomUUID(),
      // Add property initialization
    );
  }

  // Add business methods here
}

export interface Create${toPascalCase(name)}Props {
  id?: string;
  // Define creation properties
}
`,

  valueObject: (name) => `export class ${toPascalCase(name)} {
  private constructor(private readonly value: string) {}

  static create(value: string): ${toPascalCase(name)} {
    if (!this.isValid(value)) {
      throw new Error('Invalid ${name}');
    }
    return new ${toPascalCase(name)}(value);
  }

  private static isValid(value: string): boolean {
    // Add validation logic here
    return !!value;
  }

  getValue(): string {
    return this.value;
  }

  equals(other: ${toPascalCase(name)}): boolean {
    return this.value === other.value;
  }
}
`,

  repositoryInterface: (name) => `import { ${toPascalCase(name)} } from '../entities/${name}.entity';

export interface I${toPascalCase(name)}Repository {}
`,

  useCase: (operation, entityName) => {
    const useCaseName = toPascalCase(`${operation}-${entityName}`);
    return `import { Injectable, Inject } from '@nestjs/common';
import { I${toPascalCase(entityName)}Repository } from '@/domain/repositories/${entityName}.repository';
import { ${toPascalCase(entityName)} } from '@/domain/entities/${entityName}.entity';

@Injectable()
export class ${useCaseName}UseCase {
  constructor(
    @Inject('I${toPascalCase(entityName)}Repository')
    private readonly repository: I${toPascalCase(entityName)}Repository,
  ) {}

  async execute(input: any): Promise<any> {
    // Implement ${operation} ${entityName} logic here
    throw new Error('Not implemented');
  }
}
`;
  },

  createDto: (name) => `import { IsString, IsNotEmpty } from 'class-validator';

export class Create${toPascalCase(name)}Dto {
  @IsString()
  @IsNotEmpty()
  name: string;

  // Add more properties with validation decorators
}
`,

  updateDto: (name) => `import { PartialType } from '@nestjs/mapped-types';
import { Create${toPascalCase(name)}Dto } from './create-${name}.dto';

export class Update${toPascalCase(name)}Dto extends PartialType(Create${toPascalCase(name)}Dto) {}
`,

  responseDto: (name) => `export class ${toPascalCase(name)}ResponseDto {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;

  // Add more response properties

  constructor(partial: Partial<${toPascalCase(name)}ResponseDto>) {
    Object.assign(this, partial);
  }
}
`,

  repositoryImpl: (name) => `import { Injectable } from '@nestjs/common';
import { I${toPascalCase(name)}Repository } from '@/domain/repositories/${name}.repository';
import { ${toPascalCase(name)} } from '@/domain/entities/${name}.entity';
import { PrismaService } from '../prisma.service';
import { ${toPascalCase(name)}Mapper } from '../mappers/${name}.mapper';

@Injectable()
export class Prisma${toPascalCase(name)}Repository implements I${toPascalCase(name)}Repository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: ${toPascalCase(name)}Mapper,
  ) {}

  async findById(id: string): Promise<${toPascalCase(name)} | null> {
    const model = await this.prisma.${toCamelCase(name)}.findUnique({ where: { id } });
    return model ? this.mapper.toDomain(model) : null;
  }

  async findAll(): Promise<${toPascalCase(name)}[]> {
    const models = await this.prisma.${toCamelCase(name)}.findMany();
    return models.map((model) => this.mapper.toDomain(model));
  }

  async save(entity: ${toPascalCase(name)}): Promise<${toPascalCase(name)}> {
    const model = this.mapper.toPersistence(entity);
    const saved = await this.prisma.${toCamelCase(name)}.upsert({
      where: { id: model.id },
      update: model,
      create: model,
    });
    return this.mapper.toDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.${toCamelCase(name)}.delete({ where: { id } });
  }
}
`,

  mapper: (name) => `import { Injectable } from '@nestjs/common';
import { ${toPascalCase(name)} } from '@/domain/entities/${name}.entity';

@Injectable()
export class ${toPascalCase(name)}Mapper {
  toDomain(model: any): ${toPascalCase(name)} {
    return ${toPascalCase(name)}.create({
      id: model.id,
      // Add property mapping from Prisma model to domain entity
    });
  }

  toPersistence(entity: ${toPascalCase(name)}): any {
    return {
      id: entity.id,
      // Add property mapping from domain entity to Prisma model
    };
  }
}
`,

  index: (exports) => exports.map((exp) => `export * from './${exp}';`).join('\n') + '\n',
};

// Generator functions
async function generateEntity(name) {
  const entityPath = path.join('src', 'domain', 'entities', `${name}.entity.ts`);
  const repoPath = path.join('src', 'domain', 'repositories', `${name}.repository.ts`);
  const entityIndexPath = path.join('src', 'domain', 'entities', 'index.ts');
  const repoIndexPath = path.join('src', 'domain', 'repositories', 'index.ts');

  ensureDir(path.dirname(entityPath));
  ensureDir(path.dirname(repoPath));

  fs.writeFileSync(entityPath, templates.entity(name));
  fs.writeFileSync(repoPath, templates.repositoryInterface(name));

  // Update index files
  updateIndexFile(entityIndexPath, `${name}.entity`);
  updateIndexFile(repoIndexPath, `${name}.repository`);

  log(`✓ Created entity: ${entityPath}`, 'green');
  log(`✓ Created repository interface: ${repoPath}`, 'green');
}

async function generateValueObject(name) {
  const voPath = path.join('src', 'domain', 'value-objects', `${name}.value-object.ts`);
  const indexPath = path.join('src', 'domain', 'value-objects', 'index.ts');

  ensureDir(path.dirname(voPath));
  fs.writeFileSync(voPath, templates.valueObject(name));
  updateIndexFile(indexPath, `${name}.value-object`);

  log(`✓ Created value object: ${voPath}`, 'green');
}

async function generateUseCase(name, entityName) {
  const useCasePath = path.join('src', 'application', 'use-cases', `${name}-${entityName}.use-case.ts`);
  const indexPath = path.join('src', 'application', 'use-cases', 'index.ts');

  ensureDir(path.dirname(useCasePath));
  fs.writeFileSync(useCasePath, templates.useCase(name, entityName));
  updateIndexFile(indexPath, `${name}-${entityName}.use-case`);

  log(`✓ Created use case: ${useCasePath}`, 'green');
}

async function generateDTOs(name) {
  const createDtoPath = path.join('src', 'application', 'dto', 'request', `create-${name}.dto.ts`);
  const updateDtoPath = path.join('src', 'application', 'dto', 'request', `update-${name}.dto.ts`);
  const responseDtoPath = path.join('src', 'application', 'dto', 'response', `${name}-response.dto.ts`);
  const requestIndexPath = path.join('src', 'application', 'dto', 'request', 'index.ts');
  const responseIndexPath = path.join('src', 'application', 'dto', 'response', 'index.ts');

  ensureDir(path.dirname(createDtoPath));
  ensureDir(path.dirname(responseDtoPath));

  fs.writeFileSync(createDtoPath, templates.createDto(name));
  fs.writeFileSync(updateDtoPath, templates.updateDto(name));
  fs.writeFileSync(responseDtoPath, templates.responseDto(name));

  updateIndexFile(requestIndexPath, `create-${name}.dto`);
  updateIndexFile(requestIndexPath, `update-${name}.dto`);
  updateIndexFile(responseIndexPath, `${name}-response.dto`);

  log('✓ Created DTOs:', 'green');
  log(`  - ${createDtoPath}`, 'gray');
  log(`  - ${updateDtoPath}`, 'gray');
  log(`  - ${responseDtoPath}`, 'gray');
}

async function generateRepository(name) {
  const repoImplPath = path.join(
    'src',
    'infrastructure',
    'persistence',
    'prisma',
    'repositories',
    `prisma-${name}.repository.ts`
  );
  const mapperPath = path.join('src', 'infrastructure', 'persistence', 'prisma', 'mappers', `${name}.mapper.ts`);
  const repoIndexPath = path.join('src', 'infrastructure', 'persistence', 'prisma', 'repositories', 'index.ts');
  const mapperIndexPath = path.join('src', 'infrastructure', 'persistence', 'prisma', 'mappers', 'index.ts');

  ensureDir(path.dirname(repoImplPath));
  ensureDir(path.dirname(mapperPath));

  fs.writeFileSync(repoImplPath, templates.repositoryImpl(name));
  fs.writeFileSync(mapperPath, templates.mapper(name));

  updateIndexFile(repoIndexPath, `prisma-${name}.repository`);
  updateIndexFile(mapperIndexPath, `${name}.mapper`);

  log(`✓ Created repository implementation: ${repoImplPath}`, 'green');
  log(`✓ Created mapper: ${mapperPath}`, 'green');
}

function updateIndexFile(indexPath, exportName) {
  let content = '';
  if (fs.existsSync(indexPath)) {
    content = fs.readFileSync(indexPath, 'utf-8');
  }

  const exportLine = `export * from './${exportName}';\n`;
  if (!content.includes(exportLine)) {
    content += exportLine;
    fs.writeFileSync(indexPath, content);
  }
}

async function generateFeature(name) {
  log('\n' + '='.repeat(60), 'cyan');
  log(`  Generating complete feature: ${name}`, 'bright');
  log('='.repeat(60) + '\n', 'cyan');

  log('📦 Domain Layer', 'blue');
  await generateEntity(name);

  log('\n📦 Application Layer', 'blue');
  await generateDTOs(name);
  await generateUseCase('create', name);
  await generateUseCase('get', name);
  await generateUseCase('update', name);
  await generateUseCase('delete', name);

  log('\n📦 Infrastructure Layer', 'blue');
  await generateRepository(name);

  log('\n' + '='.repeat(60), 'cyan');
  log('✓ Feature generated successfully!', 'green');
  log('='.repeat(60), 'cyan');

  log('\n📝 Next steps:', 'yellow');
  log('  1. Generate module, controller, and service:', 'gray');
  log(`     ${colors.cyan}nest g resource ${name} --project modules --no-spec${colors.reset}`, 'gray');
  log('  2. Update the generated files to use the created use cases', 'gray');
  log('  3. Wire up dependencies in the module file', 'gray');
  log('  4. Add your Prisma schema model', 'gray');
  log('  5. Run prisma migration', 'gray');
}

// Main CLI
async function main() {
  log('\n' + '='.repeat(60), 'cyan');
  log('  Clean Architecture + DDD Generator', 'bright');
  log('='.repeat(60) + '\n', 'cyan');

  log('What would you like to generate?\n', 'yellow');
  log('1. Complete Feature (Recommended)', 'bright');
  log('2. Domain Entity', 'gray');
  log('3. Value Object', 'gray');
  log('4. Use Case', 'gray');
  log('5. DTOs', 'gray');
  log('6. Repository Implementation', 'gray');
  log('0. Exit\n', 'gray');

  const choice = await question('Enter your choice (0-6): ');

  if (choice === '0') {
    log('\nGoodbye! 👋\n', 'yellow');
    rl.close();
    return;
  }

  const name = await question('\nEnter the name (kebab-case, e.g., user-profile): ');

  // Validate name
  if (!/^[a-z][a-z0-9-]*$/.test(name)) {
    log('\n❌ Invalid name! Must be in kebab-case (lowercase with hyphens)', 'yellow');
    rl.close();
    return;
  }

  log(''); // Empty line

  switch (choice) {
    case '1':
      await generateFeature(name);
      break;
    case '2':
      await generateEntity(name);
      break;
    case '3':
      await generateValueObject(name);
      break;
    case '4': {
      const operation = await question('Enter operation (create, get, update, delete): ');
      await generateUseCase(operation, name);
      break;
    }
    case '5':
      await generateDTOs(name);
      break;
    case '6':
      await generateRepository(name);
      break;
    default:
      log('Invalid choice!', 'yellow');
  }

  log(''); // Empty line
  rl.close();
}

main().catch((error) => {
  log(`\n❌ Error: ${error.message}\n`, 'yellow');
  rl.close();
  process.exit(1);
});