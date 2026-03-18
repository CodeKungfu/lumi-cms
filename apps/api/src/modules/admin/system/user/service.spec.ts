import { Test } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { Service as UserService } from './service';

describe('UserService', () => {
  let service: UserService;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    process.env.USE_REAL_REDIS = 'false';

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = moduleRef.get(UserService);
  });

  it('finds the seeded admin user', async () => {
    const user = await service.findUserByUserName('admin');

    expect(user).toBeTruthy();
    expect(user?.userName).toBe('admin');
  });
});
