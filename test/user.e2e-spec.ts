import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '@/modules';
import * as UserUseCase from '@/application/use-cases/identity/user';
import * as UserDto from '@/application/dto/identity/user';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/infrastructure/persistence';
import { UserMapper } from '@/infrastructure/persistence/prisma/mappers';
import { PrismaUserRepository } from '@/infrastructure/persistence/prisma/repositories';
import { NotFoundException } from '@nestjs/common';

describe('UsersController (unit)', () => {
  let controller: UsersController;

  const mockUser = {
    id: 'sh24osu2j8',
    email: 'user@example.com',
    firstName: 'John',
    lastName: 'Doe',
    phone: null,
    isArchived: false,
  };

  const createUserUseMock = { execute: jest.fn().mockResolvedValue(mockUser) };
  const getUsersUseMock = { execute: jest.fn().mockResolvedValue([mockUser]) };
  const getUserByIdUseMock = { execute: jest.fn().mockResolvedValue(mockUser) };
  const updateUserUseMock = {
    execute: jest.fn().mockResolvedValue({ ...mockUser, firstName: 'James' }),
  };
  const archiveUserUseMock = {
    execute: jest.fn().mockResolvedValue({ ...mockUser, isArchived: true }),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      controllers: [UsersController],
      providers: [
        JwtService,
        PrismaService,
        UserMapper,
        { provide: 'IUserRepository', useClass: PrismaUserRepository },
        { provide: UserUseCase.CreateUserUseCase, useValue: createUserUseMock },
        { provide: UserUseCase.GetUsersUseCase, useValue: getUsersUseMock },
        {
          provide: UserUseCase.GetUserByIdUseCase,
          useValue: getUserByIdUseMock,
        },
        { provide: UserUseCase.UpdateUserUseCase, useValue: updateUserUseMock },
        {
          provide: UserUseCase.ArchiveUserUseCase,
          useValue: archiveUserUseMock,
        },
      ],
      exports: [],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterEach(() => jest.clearAllMocks());

  it('getUsers should return an array of users', async () => {
    const result = await controller.getUsers();
    expect(result).toEqual([mockUser]);
    expect(getUsersUseMock.execute).toHaveBeenCalled();
  });

  it('getUsers should return empty array when no users', async () => {
    getUsersUseMock.execute.mockResolvedValueOnce([]);
    const result = await controller.getUsers();
    expect(result).toEqual([]);
    expect(getUsersUseMock.execute).toHaveBeenCalled();
  });

  it('getUserById should return a user by ID', async () => {
    const dto: UserDto.GetUserByIdDto = { id: mockUser.id };
    const result = await controller.getUserById(dto);
    expect(result).toEqual(mockUser);
    expect(getUserByIdUseMock.execute).toHaveBeenCalledWith(dto);
  });

  it('getUserById should throw NotFoundException when user not found', async () => {
    const dto: UserDto.GetUserByIdDto = { id: 'missing' };
    getUserByIdUseMock.execute.mockRejectedValueOnce(
      new NotFoundException('User not found'),
    );
    await expect(controller.getUserById(dto)).rejects.toThrow(
      NotFoundException,
    );
    expect(getUserByIdUseMock.execute).toHaveBeenCalledWith(dto);
  });

  it('createUser should create and return a user', async () => {
    const dto: UserDto.CreateUserDto = {
      email: mockUser.email,
      firstName: mockUser.firstName,
      lastName: mockUser.lastName,
    };
    const result = await controller.createUser(dto);
    expect(result).toEqual(mockUser);
    expect(createUserUseMock.execute).toHaveBeenCalledWith(dto);
  });

  it('createUser should propagate errors from use case', async () => {
    const dto: UserDto.CreateUserDto = {
      email: mockUser.email,
      firstName: mockUser.firstName,
      lastName: mockUser.lastName,
    };
    createUserUseMock.execute.mockRejectedValueOnce(new Error('Conflict'));
    await expect(controller.createUser(dto)).rejects.toThrow('Conflict');
    expect(createUserUseMock.execute).toHaveBeenCalledWith(dto);
  });

  it('updateUser should update and return the updated user', async () => {
    const dto: UserDto.UpdateUserDto = {
      firstName: 'James',
      lastName: '',
      email: mockUser.email,
    };
    const result = await controller.updateUser(mockUser.id, dto);
    expect(result).toEqual({ ...mockUser, firstName: 'James' });
    expect(updateUserUseMock.execute).toHaveBeenCalledWith(mockUser.id, dto);
  });

  it('updateUser should propagate errors from use case', async () => {
    const dto: UserDto.UpdateUserDto = {
      firstName: 'X',
      lastName: '',
      email: mockUser.email,
    };
    updateUserUseMock.execute.mockRejectedValueOnce(new Error('Invalid'));
    await expect(controller.updateUser(mockUser.id, dto)).rejects.toThrow(
      'Invalid',
    );
    expect(updateUserUseMock.execute).toHaveBeenCalledWith(mockUser.id, dto);
  });

  it('archiveUser should archive and return result with isArchived true', async () => {
    const dto: UserDto.ArchiveUserDto = { id: mockUser.id };
    const result = await controller.archiveUser(dto);
    expect(result).toEqual({ ...mockUser, isArchived: true });
    expect(archiveUserUseMock.execute).toHaveBeenCalledWith(dto);
  });

  it('archiveUser should throw NotFoundException when archiving missing user', async () => {
    const dto: UserDto.ArchiveUserDto = { id: 'missing' };
    archiveUserUseMock.execute.mockRejectedValueOnce(
      new NotFoundException('Archived user not found.'),
    );
    await expect(controller.archiveUser(dto)).rejects.toThrow(
      NotFoundException,
    );
    expect(archiveUserUseMock.execute).toHaveBeenCalledWith(dto);
  });
});
