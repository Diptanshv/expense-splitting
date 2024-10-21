const request = require('supertest');
const app = require('../app');  // Assuming `app.js` exports the express instance

describe('Auth Routes', () => {
    test('Signup with valid details', async () => {
        const response = await request(app)
            .post('/api/signup')
            .send({
                name: 'Test User',
                email: 'testuser@example.com',
                mobile: '1234567890',
                password: 'password123'
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.token).toBeDefined();
    });

    test('Login with valid credentials', async () => {
        const response = await request(app)
            .post('/api/login')
            .send({
                email: 'testuser@example.com',
                password: 'password123'
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.token).toBeDefined();
    });
});
