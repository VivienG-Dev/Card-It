# Card-It

A full-stack web application for creating and managing decks of cards. This project consists of two main components: the backend and the frontend.

## Table of Contents

- [Backend](#backend)
  - [Controllers](#controllers)
  - [Models](#models)
  - [Routes](#routes)
- [Frontend](#frontend)
  - [Pages](#pages)
  - [Components](#components)
  - [Composables](#composables)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Servers](#running-the-servers)
  - [Configuration](#configuration)
    - [Environment Variables](#environment-variables)
- [License](#license)

## Backend

The backend is built with Node.js and Express.js, using Sequelize as an ORM for the PostgreSQL database. It provides RESTful APIs for authentication and CRUD operations on users, decks, and cards. The backend code is located in the `backend/` directory.

### Controllers

Controllers handle the business logic for different routes and are located in the `backend/controllers/` directory:

- `auth.js`
- `card.js`
- `deck.js`
- `user.js`

### Models

Data models define the structure of the database tables and their relationships. They are located in the `backend/models/` directory.

### Routes

Routes define the endpoints of the API and are located in the `backend/routes/` directory.

## Frontend

The frontend is built with Vue.js and Nuxt.js, using Vue Router for routing. The frontend code is located in the `frontend/` directory.

### Pages

The `pages` directory contains Vue components mapped to routes, located in the `frontend/pages/` directory.

### Components

The `components` directory contains reusable Vue components, located in the `frontend/components/` directory.

### Composables

The `composables` directory contains reusable Vue composition API functions, located in the `frontend/composables/` directory.

## Getting Started

Follow these steps to set up the project locally.

### Prerequisites

Ensure you have the following installed on your machine:

- Node.js
- npm
- PostgreSQL

### Installation

1. Clone the repository and navigate to the project directory:

   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. Install dependencies for both backend and frontend:

   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

### Running the Servers

1. Start the backend server:

   ```bash
   cd backend
   npm start or npm run dev
   ```

2. Start the frontend server:
   ```bash
   cd frontend
   npm run dev
   ```

### Configuration

Set up a PostgreSQL database and update the `.env` files in both the backend and frontend directories with your database and API credentials.

#### Environment Variables

Here is a list of the environment variables you need to set up in the `.env` file:

```env
# Server Configuration
SERVER_PORT=3001
APP_URL=http://localhost:3000
NODE_ENV=production

# Database Configuration
DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=

# Security Configuration
BCRYPT_SALT_ROUNDS=

# JWT Configuration
JWT_SECRET=
JWT_EXPIRES_IN=
REFRESH_TOKEN_EXPIRES_IN=
JWT_DEMO_ACCOUNT_EXPIRES_IN=
REFRESH_TOKEN_DEMO_ACCOUNT_EXPIRES_IN=
REFRESH_TOKEN_SECRET=

# Email Service Configuration
MAILJET_API_KEY=
MAILJET_SECRET_KEY=
```

## License

This project is licensed under the MIT License.
