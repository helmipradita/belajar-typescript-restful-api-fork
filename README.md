# Belajar TypeScript RESTful API

RESTful API dengan Express.js, TypeScript, Prisma ORM, dan MySQL.

## Tech Stack

- **Runtime:** Node.js 22 LTS (Jod) via nvm
- **Language:** TypeScript
- **Framework:** Express.js
- **ORM:** Prisma
- **Database:** MySQL 8.0 (Docker Compose)
- **Process Manager:** PM2
- **Testing:** Jest

## Prasyarat

| Requirement | Versi | Wajib |
|-------------|-------|-------|
| [nvm](https://github.com/nvm-sh/nvm) | >= 0.39 | Ya |
| Node.js | **22.x LTS (Jod)** | Ya |
| npm | **>= 10.x** (bundled with Node 22) | Ya |
| [Docker](https://docs.docker.com/engine/install/) | >= 20.x | Ya |
| Docker Compose | v2.x (plugin) | Ya |
| PM2 | latest (install via npm) | Ya |

### Install nvm (kalau belum ada)

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# Load nvm ke current shell
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install dan gunakan Node.js 22 LTS (Jod)
nvm install 22
nvm use 22
nvm alias default 22

# Verifikasi
node --version   # Harus: v22.x.x
npm --version    # Harus: 10.x.x
```

### Install PM2

```bash
npm install -g pm2
```

## Setup

### 1. Clone Repository

```bash
git clone https://github.com/helmipradita/belajar-typescript-restful-api-fork.git
cd belajar-typescript-restful-api-fork
```

### 2. Setup Database (Docker Compose)

```bash
# Start MySQL container
docker compose up -d

# Verifikasi MySQL running
docker ps | grep belajar-api-mysql
```

MySQL akan jalan di `localhost:3306` dengan:
- User: `root`
- Password: `root`
- Database: `belajar_typescript_restful_api`

### 3. Install Dependencies

```bash
npm install
```

### 4. Database Migration

```bash
npx prisma migrate deploy
npx prisma generate
```

### 5. Build

```bash
npm run build
```

### 6. Test

```bash
npm test
```

### 7. Run dengan PM2

```bash
# Start
pm2 start ecosystem.config.js

# Stop
pm2 stop belajar-api

# Restart
pm2 restart belajar-api

# Lihat logs
pm2 logs belajar-api

# Lihat status
pm2 status
```

App berjalan di `http://localhost:8888`

## Health Check

```bash
curl http://localhost:8888/api/health
```

Response:
```json
{
    "app": "belajar-typescript-restful-api",
    "status": "running",
    "port": "8888",
    "database": "ok",
    "version": "1.0.0",
    "timestamp": "2026-05-03T10:12:16.009Z"
}
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | No | Health check |
| POST | `/api/users` | No | Register |
| POST | `/api/users/login` | No | Login |
| GET | `/api/users/current` | Yes | Get current user |
| PATCH | `/api/users/current` | Yes | Update current user |
| DELETE | `/api/users/current` | Yes | Logout |
| POST | `/api/contacts` | Yes | Create contact |
| GET | `/api/contacts` | Yes | Search contacts |
| GET | `/api/contacts/:id` | Yes | Get contact |
| PUT | `/api/contacts/:id` | Yes | Update contact |
| DELETE | `/api/contacts/:id` | Yes | Delete contact |
| POST | `/api/contacts/:id/addresses` | Yes | Create address |
| GET | `/api/contacts/:id/addresses` | Yes | List addresses |
| GET | `/api/contacts/:id/addresses/:addrId` | Yes | Get address |
| PUT | `/api/contacts/:id/addresses/:addrId` | Yes | Update address |
| DELETE | `/api/contacts/:id/addresses/:addrId` | Yes | Delete address |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `8888` | Application port |
| `DATABASE_URL` | `mysql://root:root@localhost:3306/belajar_typescript_restful_api` | Prisma database URL |
| `NODE_ENV` | `development` | Environment mode |

## Project Structure

```
belajar-typescript-restful-api-fork/
├── src/
│   ├── main.ts                 # Entry point
│   ├── application/
│   │   ├── web.ts              # Express app setup
│   │   └── logging.ts          # Winston logger
│   ├── route/
│   │   ├── public-api.ts       # Public routes (health, register, login)
│   │   └── api.ts              # Protected routes (auth required)
│   ├── controller/
│   │   ├── user-controller.ts
│   │   ├── contact-controller.ts
│   │   └── address-controller.ts
│   ├── service/
│   │   ├── user-service.ts
│   │   ├── contact-service.ts
│   │   └── address-service.ts
│   ├── middleware/
│   │   ├── auth-middleware.ts
│   │   └── error-middleware.ts
│   ├── model/
│   │   └── user-model.ts
│   ├── validation/
│   │   ├── user-validation.ts
│   │   ├── contact-validation.ts
│   │   └── address-validation.ts
│   ├── error/
│   │   └── api-error.ts
│   └── type/
│       └── type.ts
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Migration files
├── test/
│   ├── user.test.ts
│   ├── contact.test.ts
│   └── address.test.ts
├── docker-compose.yml          # MySQL service
├── ecosystem.config.js         # PM2 config
├── .env                        # Environment variables
├── package.json
├── tsconfig.json
└── babel.config.json
```

### Architecture Flow

```mermaid
graph TD
    Client([Client / Browser]) -->|HTTP Request| Express[Express.js :8888]

    subgraph Route Layer
        Public[public-api.ts<br/>/api/health<br/>/api/users<br/>/api/users/login]
        Protected[api.ts<br/>+ auth middleware<br/>/api/users/current<br/>/api/contacts<br/>/api/addresses]
    end

    Express --> Public
    Express --> Protected
    Protected --> AuthMiddleware[auth-middleware.ts<br/>Token Validation]

    subgraph Controller Layer
        UC[user-controller.ts]
        CC[contact-controller.ts]
        AC[address-controller.ts]
    end

    Public --> UC
    Protected --> UC
    Protected --> CC
    Protected --> AC

    subgraph Service Layer
        US[user-service.ts]
        CS[contact-service.ts]
        AS[address-service.ts]
    end

    UC --> US
    CC --> CS
    AC --> AS

    subgraph Validation Layer
        Zod[Zod Schema Validation]
    end

    US --> Zod
    CS --> Zod
    AS --> Zod

    subgraph Data Layer
        Prisma[Prisma Client]
        MySQL[(MySQL 8.0<br/>Docker :3306)]
    end

    US --> Prisma
    CS --> Prisma
    AS --> Prisma
    Prisma --> MySQL

    style Client fill:#e1f5fe
    style Express fill:#fff3e0
    style MySQL fill:#e8f5e9
    style Prisma fill:#f3e5f5
```

### Request Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant E as Express :8888
    participant M as Middleware
    participant Ctrl as Controller
    participant Svc as Service
    participant V as Validation (Zod)
    participant P as Prisma
    participant DB as MySQL

    C->>E: HTTP Request
    E->>M: Auth check (if protected route)
    M->>Ctrl: Forward to controller
    Ctrl->>Svc: Call service
    Svc->>V: Validate input
    V-->>Svc: Validation result
    Svc->>P: Prisma query
    P->>DB: SQL Query
    DB-->>P: Result
    P-->>Svc: Typed result
    Svc-->>Ctrl: Business result
    Ctrl-->>E: HTTP Response
    E-->>C: JSON Response
```
