import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AdminController } from '@/modules';
import * as UserUseCase from '@/application/use-cases/identity/user';
import { JwtAuthGuard } from '@/shared/guards';
import { ConfigService } from '@nestjs/config';

describe('AdminController (auth integration)', () => {
  let app: INestApplication;
  let jwtService: JwtService;

  const mockUser = {
    id: 'u1',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    phone: null,
    isArchived: false,
  };

  const updatedUser = { ...mockUser, firstName: 'Updated' };

  const getUsersMock = { execute: jest.fn().mockResolvedValue([mockUser]) };
  const updateUserMock = { execute: jest.fn().mockResolvedValue(updatedUser) };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'test-secret',
          signOptions: { expiresIn: '1h' },
        }),
      ],
      controllers: [AdminController],
      providers: [
        { provide: UserUseCase.GetUsersUseCase, useValue: getUsersMock },
        { provide: UserUseCase.UpdateUserUseCase, useValue: updateUserMock },
        JwtAuthGuard,
        {
          provide: ConfigService,
          useValue: {
            get: (k: string) =>
              k === 'JWT_SECRET' ? 'test-secret' : undefined,
          },
        },
      ],
    }).compile();

    jwtService = module.get<JwtService>(JwtService);

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns 401 when no token provided', async () => {
    await request(app.getHttpServer()).get('/admin/users').expect(401);
  });

  it('allows authenticated requests to GET /admin/users', async () => {
    const token = jwtService.sign({ sub: 'u1', email: mockUser.email });
    const res = await request(app.getHttpServer())
      .get('/admin/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body.data).toEqual([mockUser]);
    expect(getUsersMock.execute).toHaveBeenCalled();
  });

  it('allows authenticated requests to PUT /admin/users/:id', async () => {
    const token = jwtService.sign({ sub: 'u1', email: mockUser.email });
    const dto = { firstName: 'Updated' };
    const res = await request(app.getHttpServer())
      .put(`/admin/users/${mockUser.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(dto)
      .expect(200);
    expect(res.body.data).toEqual(updatedUser);
    expect(updateUserMock.execute).toHaveBeenCalledWith(mockUser.id, dto);
  });
});
