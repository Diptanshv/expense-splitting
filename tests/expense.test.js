describe('Expense Routes', () => {
    test('Add a new expense', async () => {
        const response = await request(app)
            .post('/api/expenses')
            .send({
                description: 'Dinner',
                totalAmount: 100,
                splitMethod: 'equal',
                participants: [{ userId: 'someUserId', amountOwed: 50 }],
                createdBy: 'someCreatorId'
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.description).toBe('Dinner');
    });

    test('Get expenses for a user', async () => {
        const userId = 'someUserId';
        const response = await request(app).get(`/api/expenses/user/${userId}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
    });
});
