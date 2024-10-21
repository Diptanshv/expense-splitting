const request = require('supertest');
const app = require('../app'); 

describe('User Routes', () => {
    test('Create user with valid details', async () => {
        const response = await request(app)
            .post('/api/users')
            .send({
                name: 'New User',
                email: 'newuser@example.com',
                mobile: '0987654321'
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.email).toBe('newuser@example.com');
    });

    test('Get user details by ID', async () => {
        const userId = 'someUserId';
        const response = await request(app).get(`/api/users/${userId}`);
        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(userId);
    });
});
