# Expense Tracker and Budget Management System Backend

## Overview
The **Expense Tracker and Budget Management System Backend** is a Node.js-based backend service for managing users, expenses, budgets, and authentication. It provides RESTful APIs for the **Expense Tracking and Budget Management System**.

## Features
- **User Authentication**: JWT-based authentication (signup, login, logout, password reset).
- **Expense Management**: Add, edit, delete, and retrieve expenses.
- **Budget Management**: Create, update, and manage budgets.
- **Security**: Encrypted passwords, secure token generation, and role-based access.
- **Email Notifications**: Password reset and account-related emails.
- **Data Storage**: Uses MongoDB as the database.

## Contributors
| Name           | Student ID      |
|---------------|----------------|
| Sena Alemu    | Uget/237/13     |
| Lemi Gutu     | Uget/220/13     |
| Genet Tsegaye | Uget/352/13     |
| Samuel Girma  | Uget/236/13     |
| Girma Desta   | Uget/202/13     |

## Technologies Used
- **Node.js & Express.js**: Backend framework
- **MongoDB & Mongoose**: NoSQL database
- **JSON Web Token (JWT)**: Authentication & authorization
- **Bcrypt.js**: Password hashing
- **Nodemailer**: Email notifications
- **Dotenv**: Environment variable management

## Installation

### Prerequisites
- Node.js (v14 or later)
- MongoDB (local or cloud-based, e.g., MongoDB Atlas)

### Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/EtanaAlemu/expense-tracker-backend.git
   cd expense-tracker-backend
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Create a **.env** file in the root directory and configure the following environment variables:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/expense-tracker-db
   JWT_SECRET=your_jwt_secret_key
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   CLIENT_URL=http://localhost:3000
   ```
   > **Note**: If using Gmail, enable "Less Secure Apps" or use an App Password.

4. Start the server:
   ```sh
   npm start
   ```
   The server runs at **http://localhost:5000**.

## API Endpoints

### Authentication
| Method | Endpoint               | Description        |
|--------|------------------------|--------------------|
| POST   | `/api/auth/register`   | User registration |
| POST   | `/api/auth/login`      | User login        |
| POST   | `/api/auth/forgot-password` | Request password reset |
| POST   | `/api/auth/reset-password`  | Reset password |

### Expenses
| Method | Endpoint              | Description |
|--------|----------------------|-------------|
| GET    | `/api/expenses`      | Get all expenses for the user |
| POST   | `/api/expenses`      | Add a new expense |
| PUT    | `/api/expenses/:id`  | Update an expense |
| DELETE | `/api/expenses/:id`  | Delete an expense |

### Budgets
| Method | Endpoint          | Description |
|--------|------------------|-------------|
| GET    | `/api/budgets`    | Get all budgets for the user |
| POST   | `/api/budgets`    | Add a new budget |
| PUT    | `/api/budgets/:id` | Update a budget |
| DELETE | `/api/budgets/:id` | Delete a budget |

### Transactions
| Method | Endpoint              | Description |
|--------|----------------------|-------------|
| GET    | `/api/transactions`  | Get user transactions |
| POST   | `/api/transactions`  | Add a new transaction |
| PUT    | `/api/transactions/:id`  | Update transaction |
| DELETE | `/api/transactions/:id`  | Delete transaction |

### User Management
| Method | Endpoint              | Description |
|--------|----------------------|-------------|
| GET    | `/api/users/profile` | Get user profile |
| PUT    | `/api/users/profile` | Update user profile |
| GET    | `/api/users/all` (Admin) | Get all users |
| DELETE | `/api/users/:id` (Admin) | Delete a user |
| PUT    | `/api/users/:id/role` (Admin) | Update user role |
| PUT    | `/api/users/:id/deactivate` (Admin) | Deactivate user |
| PUT    | `/api/users/:id/activate` (Admin) | Activate user |

## Authentication & Security
- **JWT-based Authentication**: Users must authenticate via JWT to access protected routes.
- **Password Hashing**: Uses `bcrypt.js` to securely hash passwords.
- **Role-based Access Control**: Admin users can manage budgets, expenses, transactions, and user accounts.

## Deployment
To deploy, configure environment variables and deploy using:
- **Vercel**
- **Docker** (Dockerfile setup required)

## License
This project is licensed under the MIT License.
