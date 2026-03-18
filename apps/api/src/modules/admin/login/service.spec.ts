import { Test } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import { ApiException } from '../../../common/exceptions/api.exception';
import { Service as LoginService } from './service';

describe('LoginService', () => {
  let service: LoginService;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    process.env.DISABLE_CAPTCHA_FOR_TEST = 'true';
    process.env.USE_REAL_REDIS = 'false';

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = moduleRef.get(LoginService);
  });

  it('logs in admin with seeded sqlite data', async () => {
    const token = await service.getLoginSign('admin', '123456', '127.0.0.1', 'jest-unit');

    expect(token).toEqual(expect.any(String));
  });

  it('rejects invalid password', async () => {
    await expect(service.getLoginSign('admin', 'bad-password', '127.0.0.1', 'jest-unit')).rejects.toBeInstanceOf(ApiException);
  });
});
