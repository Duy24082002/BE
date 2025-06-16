# Health Care Backend

This is the backend service for the Health Care mobile application built with Node.js, Express, and TypeScript.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add the following variables:
   ```
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/health_care
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=7d
   ```

## Available Scripts

- `npm run dev`: Start the development server with hot-reload
- `npm run build`: Build the TypeScript code
- `npm start`: Start the production server
- `npm run lint`: Run ESLint
- `npm test`: Run tests

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── middleware/     # Custom middleware
├── models/        # Database models
├── routes/        # API routes
├── services/      # Business logic
├── types/         # TypeScript type definitions
└── index.ts       # Application entry point
```

## API Documentation

The API documentation will be available at `/api-docs` when running the server.

## Security

- All endpoints are protected with JWT authentication
- CORS is enabled for mobile app access
- Helmet is configured for security headers
- Input validation using express-validator
- Password hashing using bcrypt 