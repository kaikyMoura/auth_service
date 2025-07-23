import { PrismaService } from '@/shared/prisma/prisma.service';
import { SessionService } from '@/sessions/session.service';
import { LoggerService } from '@/shared/loggers/logger.service';
import { UsersService } from '@/users/users.service';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';

const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  session: {
    create: jest.fn(),
    update: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
  },
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        TokenService,
        UsersService,
        SessionService,
        LoggerService,
        ConfigService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call prisma.user.findUnique when finding a user', async () => {
    mockPrismaService.user.findUnique.mockResolvedValue({ id: '1', email: 'test@example.com' });
    await service.login({ email: 'test@example.com', password: 'password' });
    expect(mockPrismaService.user.findUnique).toHaveBeenCalled();
  });

  it('should call prisma.session.create when creating a session', async () => {
    mockPrismaService.session.create.mockResolvedValue({ id: '1', userId: '1' });
    await service.login({ email: 'test@example.com', password: 'password' });
    expect(mockPrismaService.session.create).toHaveBeenCalled();
  });
});
