# Backend API for Transactions Management

This is a backend server built with Node.js and Express.js for handling authentication, user management, and transaction operations. It also supports Google OAuth authentication, cron job management, and reporting features.

Frontend deployed Link: [https://vrv-client-git-main-kartikeyshivams-projects.vercel.app](https://vrv-client-git-main-kartikeyshivams-projects.vercel.app/)

Backend deployed Link: [https://vrv-server-production.up.railway.app](https://vrv-server-production.up.railway.app/)

Postman Collection Link: []()

Frontend Repository Link: [https://github.com/kartikey-shivam/VRV-client](https://github.com/kartikey-shivam/VRV-client/)

---

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Scripts](#scripts)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Folder Structure](#folder-structure)

---

## Features
- **Authentication**: Register, Login, Logout with JWT-based cookie sessions.
- **Google OAuth**: Integrates with Google for third-party authentication.
- **Email Verification**: Integrates with ejs-template. email-nodemailer .
- **User role**: Integrates with Api calling also added permission based access.

- **Transaction Management**: CRUD operations for transactions.
- **Cron Jobs**: Enable/disable and check status of scheduled tasks.
- **Reporting**: Generate and download various reports (e.g., CSV, transaction types).
- **Localization**: Multi-language support with `i18n`.

---

## Technologies Used
- **Backend Framework**: [Express.js](https://expressjs.com/)
- **Authentication**: [Passport.js](http://www.passportjs.org/) with Google OAuth
- **Database**: [MongoDB](https://www.mongodb.com/).
- **Language Support**: `i18n` for multi-language responses.
- **Error Handling**: Centralized exception handling.

---

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/
   cd vrv-server
   ```

2. **Install Dependencies**
  ```bash
  npm install
  ```
3. Configure Environment Variables Create a ```.env``` file in the root directory and configure the following variables from ```.env.example```

4. **Start the Server**
### Development mode:
 ```bash
  npm run dev
  ```
### Production mode:
```bash
npm run build
npm start
```
5. **Run tests**
  ```bash
   npm run test
   ```

## Scripts

|Script|Description|
| :-------- | :------- |
|npm run dev| Runs the server in development mode with nodemon.
|npm run build|	Compiles the TypeScript files for production.
|npm start|	Starts the production server.
|npm run test	|Runs the test suite with jest.
|npm run format	|Formats the code using Prettier.

## Environment Variables

|Variable|Description|
| :-------- | :------- |
|PORT|	The port for the server to listen on.|
|FRONTEND_URL|	The base URL of the frontend application.|
|MONGODB_URI|	The connection string for the MongoDB database.|
|TOKEN_SECRET|	The secret key for signing JWT tokens.|
|NODE_ENV|	The application environment (development/production).|
|APPLICATION_NAME|	The name of the application.|
|SMTP_EMAIL|	The email address used for sending SMTP emails.|
|APP_URL|	The base URL of the application.|
|GOOGLE_CLIENT_ID|	The client ID for Google OAuth.|
|GOOGLE_CLIENT_SECRET|	The client secret for Google OAuth.|
|SMTP_GOOGLE_EMAIL|	The Google email address used for SMTP authentication.|
|SMTP_GOOGLE_PASSWORD|	The password for the SMTP Google email address.|

## API Endpoints
### Authentication Routes


|Method|Endpoint|	Description|
| :-------- | :------- | :------- |
|POST|	/api/auth/login|	Logs in a user.|
|POST|	/api/auth/register|	Registers a new user.|
|POST|	/api/auth/logout|	Logs out the user.|
|GET|	/api/auth/google/login|	Initiates Google OAuth login.|
|GET|	/api/auth/google/callback|	Handles Google OAuth callback.|

### Transaction Routes
|Method|Endpoint|	Description|
| :-------- | :------- | :------- |
|GET|	/api/transaction/|	Lists all transactions.|
|GET|	/api/transaction/:id|	Fetches details of a transaction.|
|POST|	/api/transaction/create|	Creates a new transaction.|
|POST|	/api/transaction/cron/toggle|	Toggles a cron job.|
|GET|	/api/transaction/cron/status|	Fetches the cron job status.|
|POST|	/api/transaction/download-csv|	Downloads transactions as CSV.|

### Reporting Routes
|Method|Endpoint|	Description|
| :-------- | :------- | :------- |
|GET|	/api/transaction/report/get|	Generates a generic report.|
|GET|	/api/transaction/report/amounts|	Generates a report on transaction amounts.|
|GET|	/api/transaction/report/number-of-transactions|	Generates a report on transaction count.|
|GET|	/api/transaction/report/transaction-type|	Generates a report by transaction type.

## Folder Structure
```bash
src/
├── __tests__/        # Tests files
├── configs/          # Configuration files (e.g., DB, environment)
├── controllers/      # Route logic for each feature
├── middlewares/      # Middleware functions (e.g., auth, error handling)
├── models/           # Database models
├── routes/           # API routes
├── services/         # Business logic and helpers
├── utils/            # Utility functions
└── index.ts          # Entry point for the application
```
# VRV-server
