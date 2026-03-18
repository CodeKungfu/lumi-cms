import { Test } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { Service as MenuService } from './service';

describe('MenuService', () => {
  let service: MenuService;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    process.env.USE_REAL_REDIS = 'false';

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = moduleRef.get(MenuService);
  });

  it('returns wildcard permissions for admin', async () => {
    const perms = await service.getPerms(1);

    expect(perms).toEqual(['*:*:*']);
  });

  it('returns a non-empty menu tree for admin', async () => {
    const menus = await service.getMenus(1);

    expect(menus.length).toBeGreaterThan(0);
  });
});
