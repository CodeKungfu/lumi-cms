import { Test } from '@nestjs/testing';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { prisma } from '@repo/database';
import { AppModule } from '../src/app.module';

describe('Admin API (e2e)', () => {
  let app: NestFastifyApplication;
  let token: string;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    process.env.DISABLE_CAPTCHA_FOR_TEST = 'true';
    process.env.USE_REAL_REDIS = 'false';

    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it('GET /admin/captchaImage', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/captchaImage',
    });
    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body.code).toBe(200);
    expect(body.data.id).toEqual(expect.any(String));
    expect(body.data.img).toContain('data:image/svg+xml;base64,');
  });

  it('POST /admin/login', async () => {
    const captchaResponse = await app.inject({
      method: 'GET',
      url: '/captchaImage',
    });
    const captchaBody = captchaResponse.json();

    const response = await app.inject({
      method: 'POST',
      url: '/login',
      headers: {
        'user-agent': 'jest-e2e',
      },
      payload: {
        username: 'admin',
        password: '123456',
        captchaId: captchaBody.data.id,
        verifyCode: '0000',
      },
    });
    const body = response.json();

    expect(response.statusCode).toBe(201);
    expect(body.code).toBe(200);
    expect(body.data.token).toEqual(expect.any(String));

    token = body.data.token;
  });

  it('GET /admin/getInfo', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/getInfo',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body.code).toBe(200);
    expect(body.data.permissions).toContain('*:*:*');
    expect(body.data.user.name).toBe('admin');
  });

  it('GET /admin/getRouters', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/getRouters',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body.code).toBe(200);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
  });

  it('GET /admin/system/user/list', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/system/user/list?pageNum=1&pageSize=10',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(body.rows)).toBe(true);
    expect(body.total).toBeGreaterThan(0);
  });
});
