import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should return a user with a valid email', () => {
    const user = service.findByEmail('test@test.com');
    expect(user).toBeDefined();
    expect(user.email).toBe('test@test.com');
  });
});
