# Expense Tracker API Documentation

## Authentication Endpoints

### Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123",
    "firstName": "Admin",
    "lastName": "User"
  }'
```

Response (201 Created):

```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "67f38bb7641b12a7a974d1cc",
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@example.com"
  }
}
```

### Login User

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

Response (200 OK):

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZjM4YmI3NjQxYjEyYTdhOTc0ZDFjYyIsImlhdCI6MTc0NDAxNDM4MywiZXhwIjoxNzQ0NjE5MTgzfQ.VWIYQnaZdfui-sem46FeI1i38ggo3Z_yfd3fuV0rZys",
  "user": {
    "id": "67f38bb7641b12a7a974d1cc",
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@example.com"
  }
}
```

### Forgot Password

```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com"
  }'
```

Response (200 OK):

```json
{
  "message": "Password reset link sent to your email"
}
```

> **Note:** The password reset email now includes both:
>
> - A mobile deep link (format: `expensetracker://reset-password?token=RESET_TOKEN`) for users on mobile devices
> - A web link (format: `http://example.com/reset-password?token=RESET_TOKEN`) for users on desktop computers
>
> This allows users to reset their password on the same device they're viewing the email without needing to switch devices.

### Reset Password

```bash
curl -X POST http://localhost:5000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "reset-token-here",
    "password": "newpassword123"
  }'
```

Response (200 OK):

```json
{
  "message": "Password reset successful"
}
```

## User Profile Endpoints

### Get User Profile

```bash
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Response (200 OK):

```json
{
  "id": "65f1a2b3c4d5e6f7g8h9i0j1",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "createdAt": "2024-03-13T12:00:00.000Z",
  "updatedAt": "2024-03-13T12:00:00.000Z"
}
```

### Update User Profile

```bash
curl -X PUT http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Johnny",
    "lastName": "Doe",
    "email": "johnny@example.com"
  }'
```

Response (200 OK):

```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "firstName": "Johnny",
    "lastName": "Doe",
    "email": "johnny@example.com"
  }
}
```

## Admin Endpoints

### Get All Users

```bash
curl -X GET http://localhost:5000/api/users/all \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Response (200 OK):

```json
[
  {
    "resetPasswordToken": null,
    "resetPasswordExpires": null,
    "_id": "67ebb203d29f8364580b9496",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "role": "admin",
    "currency": "ETB",
    "isActive": true,
    "createdAt": "2025-04-01T09:29:39.707Z",
    "updatedAt": "2025-04-07T06:56:23.553Z",
    "__v": 0
  },
  {
    "resetPasswordToken": null,
    "resetPasswordExpires": null,
    "_id": "67ebb2b5d29f8364580b94a2",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "user",
    "currency": "ETB",
    "isActive": true,
    "createdAt": "2025-04-01T09:32:37.925Z",
    "updatedAt": "2025-04-07T06:56:43.389Z",
    "__v": 0
  }
]
```

### Delete User

```bash
curl -X DELETE http://localhost:5000/api/admin/users/USER_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Response (200 OK):

```json
{
  "message": "User deleted successfully"
}
```

### Update User Role

```bash
curl -X PUT http://localhost:5000/api/users/USER_ID/role \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "admin"
  }'
```

Response (200 OK):

```json
{
  "message": "User role updated to admin",
  "user": {
    "id": "67f38ae4641b12a7a974d1a5",
    "role": "admin"
  }
}
```

### Deactivate User

```bash
curl -X PUT http://localhost:5000/api/users/USER_ID/deactivate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Response (200 OK):

```json
{
  "message": "User account deactivated"
}
```

### Activate User

```bash
curl -X PUT http://localhost:5000/api/admin/users/USER_ID/activate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Response (200 OK):

```json
{
  "message": "User account activated"
}
```

## Budget Management Endpoints

### Create Budget

```bash
curl -X POST http://localhost:5000/api/budgets \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "category": "Food",
    "limit": 500,
    "startDate": "2024-03-01",
    "endDate": "2024-03-31"
  }'
```

Response (201 Created):

```json
{
  "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
  "user": "65f1a2b3c4d5e6f7g8h9i0j1",
  "category": "Food",
  "limit": 500,
  "startDate": "2024-03-01T00:00:00.000Z",
  "endDate": "2024-03-31T00:00:00.000Z",
  "createdAt": "2024-03-13T12:00:00.000Z",
  "updatedAt": "2024-03-13T12:00:00.000Z"
}
```

### Get All Budgets

```bash
curl -X GET http://localhost:5000/api/budgets \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Response (200 OK):

```json
[
  {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "user": "65f1a2b3c4d5e6f7g8h9i0j1",
    "category": "Food",
    "limit": 500,
    "startDate": "2024-03-01T00:00:00.000Z",
    "endDate": "2024-03-31T00:00:00.000Z",
    "createdAt": "2024-03-13T12:00:00.000Z",
    "updatedAt": "2024-03-13T12:00:00.000Z"
  }
]
```

### Update Budget

```bash
curl -X PUT http://localhost:5000/api/budgets/BUDGET_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "limit": 600,
    "endDate": "2024-04-30"
  }'
```

Response (200 OK):

```json
{
  "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
  "user": "65f1a2b3c4d5e6f7g8h9i0j1",
  "category": "Food",
  "limit": 600,
  "startDate": "2024-03-01T00:00:00.000Z",
  "endDate": "2024-04-30T00:00:00.000Z",
  "createdAt": "2024-03-13T12:00:00.000Z",
  "updatedAt": "2024-03-13T12:00:00.000Z"
}
```

### Delete Budget

```bash
curl -X DELETE http://localhost:5000/api/budgets/BUDGET_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Response (200 OK):

```json
{
  "message": "Budget deleted successfully"
}
```

### Get All Budgets (Admin)

```bash
curl -X GET http://localhost:5000/api/budgets/admin/all \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Response (200 OK):

```json
[
  {
    "_id": "67ebc0e0d29f8364580b951a",
    "user": {
      "_id": "67ebb203d29f8364580b9496",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com"
    },
    "category": "Food",
    "limit": 500,
    "startDate": "2025-04-01T00:00:00.000Z",
    "endDate": "2025-04-30T23:59:59.000Z",
    "createdAt": "2025-04-01T10:33:04.877Z",
    "updatedAt": "2025-04-01T10:33:04.877Z",
    "__v": 0
  }
]
```

### Delete Budget (Admin)

```bash
curl -X DELETE http://localhost:5000/api/budgets/admin/BUDGET_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Response (200 OK):

```json
{
  "message": "Budget deleted successfully by admin"
}
```

## Expense Management Endpoints

### Create Expense

```bash
curl -X POST http://localhost:5000/api/expenses \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 50.00,
    "category": "Groceries",
    "description": "Weekly groceries",
    "date": "2024-03-13",
    "receipt": "optional-receipt-url"
  }'
```

Response (201 Created):

```json
{
  "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
  "user": "65f1a2b3c4d5e6f7g8h9i0j1",
  "amount": 50.0,
  "category": "Groceries",
  "description": "Weekly groceries",
  "date": "2024-03-13T00:00:00.000Z",
  "receipt": "optional-receipt-url",
  "createdAt": "2024-03-13T12:00:00.000Z",
  "updatedAt": "2024-03-13T12:00:00.000Z"
}
```

### Get All Expenses

```bash
curl -X GET http://localhost:5000/api/expenses \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Response (200 OK):

```json
[
  {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "user": "65f1a2b3c4d5e6f7g8h9i0j1",
    "amount": 50.0,
    "category": "Groceries",
    "description": "Weekly groceries",
    "date": "2024-03-13T00:00:00.000Z",
    "receipt": "optional-receipt-url",
    "createdAt": "2024-03-13T12:00:00.000Z",
    "updatedAt": "2024-03-13T12:00:00.000Z"
  }
]
```

### Update Expense

```bash
curl -X PUT http://localhost:5000/api/expenses/EXPENSE_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 55.00,
    "description": "Updated description"
  }'
```

Response (200 OK):

```json
{
  "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
  "user": "65f1a2b3c4d5e6f7g8h9i0j1",
  "amount": 55.0,
  "category": "Groceries",
  "description": "Updated description",
  "date": "2024-03-13T00:00:00.000Z",
  "receipt": "optional-receipt-url",
  "createdAt": "2024-03-13T12:00:00.000Z",
  "updatedAt": "2024-03-13T12:00:00.000Z"
}
```

### Delete Expense

```bash
curl -X DELETE http://localhost:5000/api/expenses/EXPENSE_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Response (200 OK):

```json
{
  "message": "Expense deleted successfully"
}
```

### Get All Expenses (Admin)

```bash
curl -X GET http://localhost:5000/api/expenses/admin/all \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Response (200 OK):

```json
[
  {
    "_id": "67ebbeafd29f8364580b94f8",
    "user": {
      "_id": "67ebb203d29f8364580b9496",
      "email": "john.doe@example.com"
    },
    "amount": 100,
    "category": "Transport",
    "description": "Bus fare to work",
    "date": "2025-04-01T00:00:00.000Z",
    "createdAt": "2025-04-01T10:23:43.336Z",
    "updatedAt": "2025-04-01T10:23:43.336Z"
  }
]
```

### Admin: Delete Any Expense

```bash
curl -X DELETE http://localhost:5000/api/expenses/admin/EXPENSE_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Response (200 OK):

```json
{
  "message": "Expense deleted successfully by admin"
}
```

## Transaction Management Endpoints

### Create Transaction

```bash
curl -X POST http://localhost:5000/api/transactions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "expense",
    "amount": 50.00,
    "category": "Groceries",
    "description": "Weekly groceries",
    "date": "2024-03-13"
  }'
```

Response (201 Created):

```json
{
  "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
  "user": "65f1a2b3c4d5e6f7g8h9i0j1",
  "type": "expense",
  "amount": 50.0,
  "category": "Groceries",
  "description": "Weekly groceries",
  "date": "2024-03-13T00:00:00.000Z",
  "createdAt": "2024-03-13T12:00:00.000Z",
  "updatedAt": "2024-03-13T12:00:00.000Z"
}
```

### Get All Transactions

```bash
curl -X GET http://localhost:5000/api/transactions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Response (200 OK):

```json
[
  {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "user": "65f1a2b3c4d5e6f7g8h9i0j1",
    "type": "expense",
    "amount": 50.0,
    "category": "Groceries",
    "description": "Weekly groceries",
    "date": "2024-03-13T00:00:00.000Z",
    "createdAt": "2024-03-13T12:00:00.000Z",
    "updatedAt": "2024-03-13T12:00:00.000Z"
  }
]
```

### Update Transaction

```bash
curl -X PUT http://localhost:5000/api/transactions/TRANSACTION_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 55.00,
    "description": "Updated description"
  }'
```

Response (200 OK):

```json
{
  "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
  "user": "65f1a2b3c4d5e6f7g8h9i0j1",
  "type": "expense",
  "amount": 55.0,
  "category": "Groceries",
  "description": "Updated description",
  "date": "2024-03-13T00:00:00.000Z",
  "createdAt": "2024-03-13T12:00:00.000Z",
  "updatedAt": "2024-03-13T12:00:00.000Z"
}
```

### Delete Transaction

```bash
curl -X DELETE http://localhost:5000/api/transactions/TRANSACTION_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Response (200 OK):

```json
{
  "message": "Transaction deleted successfully"
}
```

### Get All Transactions (Admin)

```bash
curl -X GET http://localhost:5000/api/transactions/admin \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Response (200 OK):

```json
[
  {
    "_id": "67f38b89641b12a7a974d1c6",
    "user": "67f38ae4641b12a7a974d1a5",
    "type": "Income",
    "amount": 1000,
    "category": "Salary",
    "description": "Monthly salary",
    "date": "2024-03-01T00:00:00.000Z",
    "createdAt": "2025-04-07T08:23:37.664Z",
    "updatedAt": "2025-04-07T08:23:37.664Z",
    "__v": 0
  }
]
```

### Admin: Delete Any Transaction

```bash
curl -X DELETE http://localhost:5000/api/transactions/admin/TRANSACTION_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Response (200 OK):

```json
{
  "message": "Transaction deleted successfully by admin"
}
```

## Error Responses

### User Already Exists

```json
{
  "message": "User already exists"
}
```

### Access Denied

```json
{
  "message": "Access denied, admin only"
}
```

### Not Found

```json
{
  "message": "Resource not found"
}
```

### Invalid Credentials

```json
{
  "message": "Invalid email or password"
}
```

### Server Error

```json
{
  "message": "Server error",
  "error": "Error details"
}
```

## Category Management Endpoints

### Create Category

```bash
curl -X POST http://localhost:5000/api/categories \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Food",
    "description": "Food and dining expenses",
    "icon": "food",
    "color": "#FF5733"
  }'
```

Response (201 Created):

```json
{
  "_id": "67fd1b014f288bf717c323e8",
  "name": "Food",
  "description": "Food and dining expenses",
  "icon": "food",
  "color": "#FF5733",
  "isDefault": false,
  "createdAt": "2024-03-13T12:00:00.000Z",
  "updatedAt": "2024-03-13T12:00:00.000Z",
  "__v": 0
}
```

Error Response (400 Bad Request):

```json
{
  "message": "Name is required"
}
```

Error Response (409 Conflict):

```json
{
  "message": "Server error",
  "error": "E11000 duplicate key error collection: expense-tracker-db.categories index: name_1 dup key: { name: \"Food\" }"
}
```

### Get All Categories

```bash
curl -X GET http://localhost:5000/api/categories \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Response (200 OK):

```json
[
  {
    "_id": "67fd1b014f288bf717c323e8",
    "name": "Food",
    "description": "Food and dining expenses",
    "icon": "food",
    "color": "#FF5733",
    "isDefault": false,
    "createdAt": "2024-03-13T12:00:00.000Z",
    "updatedAt": "2024-03-13T12:00:00.000Z",
    "__v": 0
  },
  {
    "_id": "67fd1b014f288bf717c323e9",
    "name": "Transport",
    "description": "Transportation expenses",
    "icon": "transport",
    "color": "#33FF57",
    "isDefault": false,
    "createdAt": "2024-03-13T12:00:00.000Z",
    "updatedAt": "2024-03-13T12:00:00.000Z",
    "__v": 0
  }
]
```

### Get Category by ID

```bash
curl -X GET http://localhost:5000/api/categories/67fd1b014f288bf717c323e8 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Response (200 OK):

```json
{
  "_id": "67fd1b014f288bf717c323e8",
  "name": "Food",
  "description": "Food and dining expenses",
  "icon": "food",
  "color": "#FF5733",
  "isDefault": false,
  "createdAt": "2024-03-13T12:00:00.000Z",
  "updatedAt": "2024-03-13T12:00:00.000Z",
  "__v": 0
}
```

Error Response (404 Not Found):

```json
{
  "message": "Category not found"
}
```

### Update Category

```bash
curl -X PUT http://localhost:5000/api/categories/67fd1b014f288bf717c323e8 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Food & Dining",
    "description": "Updated food category description",
    "icon": "food",
    "color": "#FF5733"
  }'
```

Response (200 OK):

```json
{
  "_id": "67fd1b014f288bf717c323e8",
  "name": "Food & Dining",
  "description": "Updated food category description",
  "icon": "food",
  "color": "#FF5733",
  "isDefault": false,
  "createdAt": "2024-03-13T12:00:00.000Z",
  "updatedAt": "2024-03-13T12:00:00.000Z",
  "__v": 0
}
```

Error Response (404 Not Found):

```json
{
  "message": "Category not found"
}
```

### Delete Category

```bash
curl -X DELETE http://localhost:5000/api/categories/67fd1b014f288bf717c323e8 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Response (200 OK):

```json
{
  "message": "Category deleted successfully"
}
```

Error Response (404 Not Found):

```json
{
  "message": "Category not found"
}
```

### Get All Categories (Admin)

```bash
curl -X GET http://localhost:5000/api/categories/admin?page=0&size=10&query=trans \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Response (200 OK):

```json
{
  "content": [
    {
      "_id": "67fd1b014f288bf717c323e9",
      "name": "Transport",
      "description": "Transportation expenses",
      "icon": "transport",
      "color": "#33FF57",
      "isDefault": false,
      "createdAt": "2024-03-13T12:00:00.000Z",
      "updatedAt": "2024-03-13T12:00:00.000Z",
      "__v": 0
    }
  ],
  "page": {
    "size": 10,
    "number": 0,
    "totalElements": 1,
    "totalPages": 1
  }
}
```

Error Response (500 Server Error):

```json
{
  "message": "Server error",
  "error": "Cast to ObjectId failed for value \"admin\" (type string) at path \"_id\" for model \"Category\""
}
```

### Delete Any Category (Admin)

```bash
curl -X DELETE http://localhost:5000/api/categories/admin/67fd1b014f288bf717c323e8 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Response (200 OK):

```json
{
  "message": "Category deleted successfully by admin"
}
```

Error Response (404 Not Found):

```json
{
  "message": "Category not found"
}
```

Error Response (403 Forbidden):

```json
{
  "message": "Access denied, admin only"
}
```
