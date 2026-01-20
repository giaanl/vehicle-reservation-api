import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import cookieParser from 'cookie-parser';

describe('Vehicle Reservation API (e2e)', () => {
  let app: INestApplication<App>;
  let authCookie: string;
  let createdVehicleId: string;
  let createdReservationId: string;

  const testUser = {
    name: 'Test User',
    email: `test-${Date.now()}@example.com`,
    password: 'password123',
  };

  const testVehicle = {
    name: 'Honda Civic',
    year: '2023',
    type: 'Sedan médio',
    engine: '2.0',
    size: '5',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );
    app.use(cookieParser());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth Module', () => {
    describe('POST /auth/register', () => {
      it('should register a new user', () => {
        return request(app.getHttpServer())
          .post('/auth/register')
          .send(testUser)
          .expect(201)
          .expect((res) => {
            expect(res.body).toHaveProperty('message');
            expect(res.body).toHaveProperty('user');
            expect(res.body.user).toHaveProperty('id');
            expect(res.body.user.email).toBe(testUser.email);
            expect(res.body.user.name).toBe(testUser.name);
            expect(res.body.user).not.toHaveProperty('passwordHash');
          });
      });

      it('should fail with duplicate email', () => {
        return request(app.getHttpServer())
          .post('/auth/register')
          .send(testUser)
          .expect(409);
      });

      it('should fail with invalid email', () => {
        return request(app.getHttpServer())
          .post('/auth/register')
          .send({ ...testUser, email: 'invalid-email' })
          .expect(400);
      });

      it('should fail with short password', () => {
        return request(app.getHttpServer())
          .post('/auth/register')
          .send({ ...testUser, email: 'new@example.com', password: '123' })
          .expect(400);
      });
    });

    describe('POST /auth/login', () => {
      it('should login successfully and return cookie', async () => {
        const res = await request(app.getHttpServer())
          .post('/auth/login')
          .send({ email: testUser.email, password: testUser.password })
          .expect(200);

        expect(res.headers['set-cookie']).toBeDefined();
        authCookie = res.headers['set-cookie'][0];
      });

      it('should fail with wrong password', () => {
        return request(app.getHttpServer())
          .post('/auth/login')
          .send({ email: testUser.email, password: 'wrongpassword' })
          .expect(401);
      });

      it('should fail with non-existent email', () => {
        return request(app.getHttpServer())
          .post('/auth/login')
          .send({ email: 'nonexistent@example.com', password: 'password123' })
          .expect(401);
      });
    });

    describe('GET /auth/me', () => {
      it('should return current user when authenticated', () => {
        return request(app.getHttpServer())
          .get('/auth/me')
          .set('Cookie', authCookie)
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('user');
            expect(res.body.user.email).toBe(testUser.email);
            expect(res.body.user.name).toBe(testUser.name);
          });
      });

      it('should fail without authentication', () => {
        return request(app.getHttpServer()).get('/auth/me').expect(401);
      });
    });
  });

  describe('Vehicles Module', () => {
    describe('POST /vehicles', () => {
      it('should create a new vehicle', async () => {
        const res = await request(app.getHttpServer())
          .post('/vehicles')
          .set('Cookie', authCookie)
          .send(testVehicle)
          .expect(201);

        expect(res.body).toHaveProperty('id');
        expect(res.body.name).toBe(testVehicle.name);
        createdVehicleId = res.body.id;
      });

      it('should fail without authentication', () => {
        return request(app.getHttpServer())
          .post('/vehicles')
          .send(testVehicle)
          .expect(401);
      });

      it('should fail with missing required fields', () => {
        return request(app.getHttpServer())
          .post('/vehicles')
          .set('Cookie', authCookie)
          .send({ name: 'Test' })
          .expect(400);
      });
    });

    describe('GET /vehicles', () => {
      it('should list vehicles', () => {
        return request(app.getHttpServer())
          .get('/vehicles')
          .set('Cookie', authCookie)
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('data');
            expect(Array.isArray(res.body.data)).toBe(true);
          });
      });

      it('should support pagination', () => {
        return request(app.getHttpServer())
          .get('/vehicles?page=1&limit=10')
          .set('Cookie', authCookie)
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('data');
            expect(res.body).toHaveProperty('total');
          });
      });
    });

    describe('PATCH /vehicles/:id', () => {
      it('should update a vehicle', () => {
        return request(app.getHttpServer())
          .patch(`/vehicles/${createdVehicleId}`)
          .set('Cookie', authCookie)
          .send({ name: 'Honda Civic Updated' })
          .expect(200)
          .expect((res) => {
            expect(res.body.name).toBe('Honda Civic Updated');
          });
      });

      it('should fail with invalid id', () => {
        return request(app.getHttpServer())
          .patch('/vehicles/invalid-id')
          .set('Cookie', authCookie)
          .send({ name: 'Test' })
          .expect(404);
      });
    });
  });

  describe('Reservations Module', () => {
    describe('POST /reservations', () => {
      it('should create a new reservation (ACTIVE when startDate is today)', async () => {
        const res = await request(app.getHttpServer())
          .post('/reservations')
          .set('Cookie', authCookie)
          .send({
            vehicleId: createdVehicleId,
            startDate: new Date().toISOString(),
          })
          .expect(201);

        expect(res.body).toHaveProperty('id');
        expect(res.body.vehicleId).toBe(createdVehicleId);
        expect(res.body.status).toBe('ACTIVE');
        createdReservationId = res.body.id;
      });

      it('should fail when user already has active reservation', () => {
        return request(app.getHttpServer())
          .post('/reservations')
          .set('Cookie', authCookie)
          .send({
            vehicleId: createdVehicleId,
            startDate: new Date().toISOString(),
          })
          .expect(409);
      });

      it('should fail without authentication', () => {
        return request(app.getHttpServer())
          .post('/reservations')
          .send({
            vehicleId: createdVehicleId,
            startDate: new Date().toISOString(),
          })
          .expect(401);
      });
    });

    describe('GET /reservations', () => {
      it('should list user reservations', () => {
        return request(app.getHttpServer())
          .get('/reservations')
          .set('Cookie', authCookie)
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('data');
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data.length).toBeGreaterThan(0);
          });
      });
    });

    describe('PATCH /reservations/:id/complete', () => {
      it('should complete an ACTIVE reservation', () => {
        return request(app.getHttpServer())
          .patch(`/reservations/${createdReservationId}/complete`)
          .set('Cookie', authCookie)
          .expect(200)
          .expect((res) => {
            expect(res.body.status).toBe('COMPLETED');
          });
      });
    });

    describe('PATCH /reservations/:id/cancel (PENDING reservation)', () => {
      let pendingReservationId: string;
      let secondVehicleId: string;

      beforeAll(async () => {
        const vehicleRes = await request(app.getHttpServer())
          .post('/vehicles')
          .set('Cookie', authCookie)
          .send({
            name: 'Toyota Corolla',
            year: '2024',
            type: 'Sedan',
            engine: '2.0',
            size: '5',
          });
        secondVehicleId = vehicleRes.body.id;

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const res = await request(app.getHttpServer())
          .post('/reservations')
          .set('Cookie', authCookie)
          .send({
            vehicleId: secondVehicleId,
            startDate: tomorrow.toISOString(),
          });
        pendingReservationId = res.body.id;
      });

      it('should cancel a PENDING reservation', () => {
        return request(app.getHttpServer())
          .patch(`/reservations/${pendingReservationId}/cancel`)
          .set('Cookie', authCookie)
          .expect(200)
          .expect((res) => {
            expect(res.body.status).toBe('CANCELLED');
          });
      });

      afterAll(async () => {
        await request(app.getHttpServer())
          .delete(`/vehicles/${secondVehicleId}`)
          .set('Cookie', authCookie);
      });
    });
  });

  describe('Users Module', () => {
    describe('PATCH /users', () => {
      it('should update user profile', () => {
        return request(app.getHttpServer())
          .patch('/users')
          .set('Cookie', authCookie)
          .send({ name: 'Updated Name' })
          .expect(200)
          .expect((res) => {
            expect(res.body.name).toBe('Updated Name');
          });
      });

      it('should fail without authentication', () => {
        return request(app.getHttpServer())
          .patch('/users')
          .send({ name: 'Test' })
          .expect(401);
      });
    });
  });

  describe('Cleanup', () => {
    describe('DELETE /vehicles/:id', () => {
      it('should delete a vehicle', () => {
        return request(app.getHttpServer())
          .delete(`/vehicles/${createdVehicleId}`)
          .set('Cookie', authCookie)
          .expect(204);
      });
    });

    describe('POST /auth/logout', () => {
      it('should logout successfully', () => {
        return request(app.getHttpServer())
          .post('/auth/logout')
          .set('Cookie', authCookie)
          .expect(200);
      });
    });

    describe('DELETE /users', () => {
      it('should delete user account', async () => {
        const loginRes = await request(app.getHttpServer())
          .post('/auth/login')
          .send({ email: testUser.email, password: testUser.password });

        const newCookie = loginRes.headers['set-cookie'][0];

        return request(app.getHttpServer())
          .delete('/users')
          .set('Cookie', newCookie)
          .expect(204);
      });
    });
  });
});
