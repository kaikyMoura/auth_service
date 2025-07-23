import { SessionService } from '../sessions/session.service';
import { UserClientService } from '../users-client/user-client.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, SessionService, TokenService, UserClientService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('it should login a user', async () => {
    const user = {
      email: 'test@test.com',
      password: '123456',
    };
    const result = await service.login(user);
    expect(result).toEqual(
      expect.objectContaining({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        accessToken: expect.any(String),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        refreshToken: expect.any(String),
      }),
    );
  });
});
