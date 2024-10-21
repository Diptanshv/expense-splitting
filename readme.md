# Daily Expenses Sharing Application

## Description
This project is a Node.js-based backend application that allows users to add expenses and split them based on exact amounts, percentages, or equally. Users can also generate and download balance sheets.

## Features
- User Management: Create and retrieve users.
- Expense Management: Add expenses with three different split methods (equal, exact, percentage).
- Balance Sheet Generation: Download a CSV balance sheet.
- JWT Authentication for secured routes.
- Input validation for email, mobile numbers, and percentage splits.
- Error handling and data validation.

## Prerequisites
- Node.js
- MongoDB

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Diptanshv/expense-splitting.git
   cd daily-expenses-app


2. Install the dependencies:
    ```bash
    npm install


3. Set up your MongoDB database:

Ensure you have MongoDB installed and running.
    Create a new database (e.g., expense-store) or modify the connection string in your project to connect to your existing database.
    Create a .env file in the root of the project to store your environment variables. Include the following variables:


    PORT=3000
    MONGODB_URI=<Your MongoDB connection string>
    JWT_SECRET=<Your JWT secret>


4. Start the server:
    ```bash
    npm start
    The server will run on http://localhost:3000.

## API Endpoints

1. User Management

    POST /api/users: Create a new user
    GET /api/users/:userId: Get user details


2. Expense Management

    POST /api/expenses: Add a new expense
    GET /api/expenses: Get all expenses
    GET /api/expenses/user/:userId: Get expenses for a specific user

3. Balance Sheet Generation

    GET /api/balance-sheet: Download the balance sheet as a CSV file

## Testing
You can test the API using tools like Postman or cURL.