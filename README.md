# OpenJob API v2

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express"/>
  <img src="https://img.shields.io/badge/PostgreSQL-8.0+-4479A1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/Redis-7.x-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis"/>
  <img src="https://img.shields.io/badge/RabbitMQ-3.x-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white" alt="RabbitMQ"/>
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" alt="MIT License"/>
</p>

A production-ready **RESTful API** for a job board platform built with **Node.js** and **Express**. Features async email notifications via **RabbitMQ**, **Redis** caching, JWT authentication, and database migrations with **node-pg-migrate**.

---

## ✨ Features

- **Authentication** — JWT access & refresh token flow, secure logout
- **Job Listings** — Create, browse, filter by category or company, full CRUD
- **Applications** — Apply to jobs with async email notification via RabbitMQ message queue
- **Companies** — Company profile management linked to job postings
- **Bookmarks** — Save and manage bookmarked jobs per user
- **Documents** — Upload and serve resume/CV files (PDF) via Multer
- **Profile** — View own profile, applications, and bookmarks in one place
- **Categories** — Manage job categories
- **Redis Caching** — Reduces repeated DB queries; API works gracefully when Redis is unavailable
- **Request Validation** — Joi schema validation on all write endpoints
- **Database Migrations** — Version-controlled schema via node-pg-migrate

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 20+ |
| Framework | Express.js 4.x |
| Database | PostgreSQL 8.0+ |
| Caching | Redis 7.x |
| Message Queue | RabbitMQ 3.x (amqplib) |
| Auth | JWT (jsonwebtoken) |
| Validation | Joi |
| File Upload | Multer |
| Email | Nodemailer |
| Migrations | node-pg-migrate |
| Linting | ESLint |

---

## 📁 Project Structure

```
openjob-api/
├── src/
│   ├── app.js                  # Express app setup
│   ├── server.js               # Entry point (starts server + Redis)
│   ├── config/
│   │   ├── database.js         # PostgreSQL pool
│   │   ├── redis.js            # Redis client with reconnect strategy
│   │   └── rabbitmq.js         # RabbitMQ connection & channel
│   ├── consumer/
│   │   └── index.js            # RabbitMQ consumer (email notifications)
│   ├── controllers/            # Route handlers (Auth, User, Job, Company, ...)
│   ├── services/               # Business logic layer
│   ├── repositories/           # Database query layer
│   ├── middlewares/
│   │   ├── authMiddleware.js   # JWT verification
│   │   ├── validationMiddleware.js
│   │   ├── uploadMiddleware.js # Multer config
│   │   └── errorMiddleware.js
│   ├── routes/                 # Express routers per resource
│   ├── validations/            # Joi schemas
│   ├── exceptions/             # Custom error classes
│   ├── utils/                  # Helper functions
│   └── database/
│       └── reset.js            # DB reset script
├── migrations/                 # node-pg-migrate migration files
├── uploads/
│   └── documents/              # Uploaded PDF files
├── database.json               # node-pg-migrate config
├── .env.example
├── .eslintrc.js
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 8.0+
- Redis 7.x
- RabbitMQ 3.x

> **Tip:** Use Docker to spin up PostgreSQL, Redis, and RabbitMQ quickly.
> ```bash
> docker run -d --name postgres -e POSTGRES_PASSWORD=yourpassword -p 5432:5432 postgres:16
> docker run -d --name redis -p 6379:6379 redis:7
> docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
> ```

### 1. Clone & Install

```bash
git clone https://github.com/afifn11/openjob-api.git
cd openjob-api
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# Server
HOST=localhost
PORT=3000

# PostgreSQL
PGUSER=postgres
PGPASSWORD=yourpassword
PGDATABASE=openjob_db
PGHOST=localhost
PGPORT=5432

# JWT — replace with a random string of at least 32 characters
ACCESS_TOKEN_KEY=your_access_token_secret_here
REFRESH_TOKEN_KEY=your_refresh_token_secret_here

# Database URL (for node-pg-migrate)
DATABASE_URL=postgres://postgres:yourpassword@localhost:5432/openjob_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# RabbitMQ
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_USER=guest
RABBITMQ_PASSWORD=guest

# Mail (Nodemailer) — use Mailtrap for development
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=587
MAIL_USER=your_mailtrap_user
MAIL_PASSWORD=your_mailtrap_password
```

### 3. Database Setup

Create the database and run migrations:

```bash
# Create database (run in psql)
createdb openjob_db

# Run migrations
npm run migrate
```

To reset the database:

```bash
npm run db:reset
```

### 4. Run the Server

```bash
# Development (with auto-reload)
npm run start:dev

# Production
npm start
```

Server runs at: `http://localhost:3000`

### 5. Run the Consumer (separate terminal)

The RabbitMQ consumer handles async email notifications. Run it in a **separate terminal**:

```bash
npm run start:consumer
```

The consumer listens on the `application_notifications` queue. When a user applies for a job, the API publishes a message to the queue, and the consumer sends an email notification to the job owner.

---

## 📡 API Endpoints

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/authentications` | — | Login |
| PUT | `/api/authentications` | — | Refresh access token |
| DELETE | `/api/authentications` | — | Logout |

### Users

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/users` | — | Register |
| GET | `/api/users/:id` | — | Get user by ID |

### Jobs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/jobs` | — | Get all jobs |
| GET | `/api/jobs/:id` | — | Get job by ID |
| GET | `/api/jobs/company/:companyId` | — | Get jobs by company |
| GET | `/api/jobs/category/:categoryId` | — | Get jobs by category |
| POST | `/api/jobs` | ✅ | Create job |
| PUT | `/api/jobs/:id` | ✅ | Update job |
| DELETE | `/api/jobs/:id` | ✅ | Delete job |

### Applications

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/applications` | ✅ | Apply to a job (triggers email notification via RabbitMQ) |
| GET | `/api/applications` | ✅ | Get all applications |
| GET | `/api/applications/:id` | ✅ | Get application by ID |
| GET | `/api/applications/user/:userId` | ✅ | Get applications by user |
| GET | `/api/applications/job/:jobId` | ✅ | Get applications for a job |
| PUT | `/api/applications/:id` | ✅ | Update application |
| DELETE | `/api/applications/:id` | ✅ | Delete application |

### Companies

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/companies` | — | Get all companies |
| GET | `/api/companies/:id` | — | Get company by ID |
| POST | `/api/companies` | ✅ | Create company |
| PUT | `/api/companies/:id` | ✅ | Update company |
| DELETE | `/api/companies/:id` | ✅ | Delete company |

### Bookmarks

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/jobs/:jobId/bookmark` | ✅ | Bookmark a job |
| GET | `/api/jobs/:jobId/bookmark/:id` | ✅ | Get bookmark |
| DELETE | `/api/jobs/:jobId/bookmark` | ✅ | Remove bookmark |

### Documents

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/documents` | — | Get all documents |
| GET | `/api/documents/:id` | — | Serve document file (PDF) |
| POST | `/api/documents` | ✅ | Upload document |
| DELETE | `/api/documents/:id` | ✅ | Delete document |

### Profile

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/profile` | ✅ | Get own profile |
| GET | `/api/profile/applications` | ✅ | Get own applications |
| GET | `/api/profile/bookmarks` | ✅ | Get own bookmarks |

### Categories

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/categories` | — | Get all categories |
| GET | `/api/categories/:id` | — | Get category by ID |
| POST | `/api/categories` | ✅ | Create category |
| PUT | `/api/categories/:id` | ✅ | Update category |
| DELETE | `/api/categories/:id` | ✅ | Delete category |

> ✅ = Requires `Authorization: Bearer <access_token>` header

---

## 🏗 Architecture

```
Request → Route → Middleware (auth, validation) → Controller → Service → Repository → PostgreSQL
                                                                    ↓
                                               Redis Cache (read-through)
                                                                    ↓
                                               RabbitMQ Queue → Consumer → Nodemailer
```

- **Controllers** handle HTTP request/response
- **Services** contain business logic
- **Repositories** contain all database queries (PostgreSQL via `pg`)
- **Redis** caches frequently accessed data; gracefully skipped if unavailable
- **RabbitMQ Consumer** runs as a separate process, consuming the `application_notifications` queue and sending emails asynchronously

---

## 🧹 Linting

```bash
npm run lint
npm run lint:fix
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).