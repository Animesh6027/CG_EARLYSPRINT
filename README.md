# FounderLink Microservices Platform

FounderLink is a **founder–investor matchmaking platform** built on a production-grade microservices architecture. It connects startup founders with investors, enables team building, facilitates investment workflows, and handles secure payment processing — all through a suite of independent, loosely coupled services orchestrated via Spring Cloud.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture & Communication Flow](#architecture--communication-flow)
3. [Services and Ports](#services-and-ports)
4. [API Endpoints](#api-endpoints)
5. [Infrastructure Components](#infrastructure-components)
6. [Monitoring and Logging](#monitoring-and-logging)
7. [Technology Stack](#technology-stack)
8. [Setup and Deployment](#setup-and-deployment)
9. [Common User Flows](#common-user-flows)
10. [Security](#security)
11. [Contributing](#contributing)

---

## Project Overview

### What is FounderLink?

FounderLink provides a centralised space where:

- **Founders** can list their startups, recruit co-founders, and raise investment.
- **Investors** can discover startups, make investments, and track their portfolios.
- **Co-founders** can receive team invitations, collaborate, and communicate.

### Key Features

| Feature | Description |
|---|---|
| JWT Authentication | Secure login/register with access & refresh tokens |
| Startup Management | Create, search, and manage startup profiles |
| Investment Workflow | End-to-end investment creation, approval, and payment |
| Team Building | Invite and manage co-founders for a startup |
| Real-time Messaging | Direct messaging between users |
| Notifications | In-app and email notifications via RabbitMQ events |
| Payment Integration | Razorpay-backed payment orders and confirmations |
| Wallet | Per-user wallet for balance management |
| Distributed Tracing | End-to-end request tracing with Zipkin |
| Observability | Metrics (Prometheus), dashboards (Grafana), logs (Loki) |

---

## Architecture & Communication Flow

```
┌────────────────────────────────────────────────────────────────┐
│                        Angular Frontend                        │
│                   (http://localhost:4200)                       │
└───────────────────────────┬────────────────────────────────────┘
                            │ HTTP / REST
                            ▼
┌────────────────────────────────────────────────────────────────┐
│                  API Gateway  :8090                            │
│          (Spring Cloud Gateway + JWT validation)               │
│          Routes via Eureka service discovery                   │
└──┬──────┬──────┬──────┬──────┬──────┬──────┬──────┬───────────┘
   │      │      │      │      │      │      │      │
   ▼      ▼      ▼      ▼      ▼      ▼      ▼      ▼
:8089  :8081  :8083  :8084  :8085  :8086  :8087  :8088  :8091
Auth   User  Start  Invest  Team  Messag Notif  Pay   Wallet
Svc    Svc    Svc    Svc    Svc    Svc    Svc   Svc    Svc
  │      │      │      │      │      │      │     │      │
  ▼      ▼      ▼      ▼      ▼      ▼      ▼     ▼      ▼
auth-  user- start- invest- team- messag notif pay- wallet
 db     db    db     db     db    -db    -db   db    -db
(MySQL)(MySQL)(MySQL)(MySQL)(MySQL)(MySQL)(MySQL)(MySQL)(MySQL)

                 Async Events (RabbitMQ :5672)
   ┌─────────────────────────────────────────────────┐
   │  startup.created / startup.deleted              │
   │  investment.created / approved / rejected       │
   │  team.invite.sent / member.accepted / rejected  │
   │  message.sent                                   │
   │  payment.completed / payment.failed             │
   └──────────────────────┬──────────────────────────┘
                          │ (all consumed by)
                          ▼
               Notification Service :8087
                 (in-app + email)

        Shared Infrastructure
   ┌──────────────────────────────────┐
   │  Redis          :6379  (cache)   │
   │  RabbitMQ       :5672  (events)  │
   │  RabbitMQ Mgmt  :15672           │
   │  Zipkin         :9411  (tracing) │
   │  Eureka Server  :8761  (registry)│
   │  Config Server  (internal)       │
   └──────────────────────────────────┘

        Monitoring Stack
   ┌──────────────────────────────────┐
   │  Prometheus     :9090            │
   │  Grafana        :3000            │
   │  Loki           (internal)       │
   │  Promtail       (log shipper)    │
   └──────────────────────────────────┘
```

### Synchronous (Feign) Service Calls

| Caller | Callee | Purpose |
|---|---|---|
| auth-service | user-service | Create user profile on registration |
| investment-service | startup-service | Validate startup exists |
| team-service | startup-service | Validate startup membership |
| payment-service | wallet-service | Credit/debit wallet on payment events |

---

## Services and Ports

| Service | Port | Database | Description |
|---|---|---|---|
| **API Gateway** | `8090` | — | Single entry point; routes to all backend services via Eureka |
| **Eureka Server** | `8761` | — | Service registry; all services register and discover each other here |
| **Config Server** | internal | — | Centralised configuration loaded from `config-repo/` at startup |
| **Auth Service** | `8089` | `auth_service_db` | JWT login, register, token refresh, logout, password reset |
| **User Service** | `8081` | `user_db` | User profiles and role-based data |
| **Startup Service** | `8083` | `startup_db` | Startup CRUD, search, and detail pages |
| **Investment Service** | `8084` | `investment_db` | Create and manage investments; status lifecycle |
| **Team Service** | `8085` | `team_db` | Team invitations, membership, and co-founder management |
| **Messaging Service** | `8086` | `messaging_db` | User-to-user direct messaging and conversation history |
| **Notification Service** | `8087` | `notification_db` | In-app and email notifications driven by RabbitMQ events |
| **Payment Service** | `8088` | `payment_db` | Razorpay order creation and payment confirmation |
| **Wallet Service** | `8091` | `wallet_db` | Per-user wallet balances and transaction history |

---

## API Endpoints

All endpoints are accessed via the **API Gateway** at `http://localhost:8090`.

### Authentication (`/auth`)

| Method | Path | Description |
|---|---|---|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Login and receive JWT |
| `POST` | `/auth/refresh` | Refresh access token using cookie |
| `POST` | `/auth/logout` | Invalidate session |
| `POST` | `/auth/forgot-password` | Trigger password reset email |
| `POST` | `/auth/reset-password` | Reset password with token |

### Users (`/users`)

| Method | Path | Description |
|---|---|---|
| `GET` | `/users/{id}` | Get user profile by ID |
| `PUT` | `/users/{id}` | Update user profile |
| `GET` | `/users/role/{role}` | List users by role |

### Startups (`/startup`)

| Method | Path | Description |
|---|---|---|
| `POST` | `/startup` | Create a new startup |
| `GET` | `/startup` | List all startups |
| `GET` | `/startup/details/{id}` | Get startup details |
| `GET` | `/startup/search` | Search startups |
| `PUT` | `/startup/{id}` | Update startup |
| `DELETE` | `/startup/{id}` | Delete startup |

### Investments (`/investments`)

| Method | Path | Description |
|---|---|---|
| `POST` | `/investments` | Create an investment |
| `GET` | `/investments/startup/{id}` | List investments for a startup |
| `GET` | `/investments/investor` | List investments by logged-in investor |
| `PATCH` | `/investments/{id}/status` | Update investment status |

### Teams (`/teams`)

| Method | Path | Description |
|---|---|---|
| `POST` | `/teams/invite` | Send a team invitation |
| `GET` | `/teams/invitations` | List pending invitations |
| `POST` | `/teams/join` | Accept an invitation |
| `DELETE` | `/teams/invitations/{id}` | Reject an invitation |
| `GET` | `/teams/{startupId}/members` | List team members |

### Messaging (`/messages`)

| Method | Path | Description |
|---|---|---|
| `POST` | `/messages` | Send a message |
| `GET` | `/messages/{conversationId}` | Get messages in a conversation |
| `GET` | `/messages/conversations` | List conversations |

### Notifications (`/notifications`)

| Method | Path | Description |
|---|---|---|
| `GET` | `/notifications/{userId}` | Get notifications for a user |
| `PATCH` | `/notifications/{id}/read` | Mark notification as read |

### Payments (`/payments`)

| Method | Path | Description |
|---|---|---|
| `POST` | `/payments/create-order` | Create a Razorpay payment order |
| `POST` | `/payments/confirm` | Confirm payment after Razorpay callback |

### Wallet (`/wallet`)

| Method | Path | Description |
|---|---|---|
| `GET` | `/wallet` | Get wallet balance |
| `GET` | `/wallet/transactions` | List wallet transactions |

---

## Infrastructure Components

### Databases — MySQL 8.0 (one per service)

| Container | Database Name | Used By |
|---|---|---|
| `auth-db` | `auth_service_db` | auth-service |
| `user-db` | `user_db` | user-service |
| `startup-db` | `startup_db` | startup-service |
| `investment-db` | `investment_db` | investment-service |
| `team-db` | `team_db` | team-service |
| `messaging-db` | `messaging_db` | messaging-service |
| `notification-db` | `notification_db` | notification-service |
| `payment-db` | `payment_db` | payment-service |
| `wallet-db` | `wallet_db` | wallet-service |

Each MySQL instance runs inside the `founderlink-internal` Docker network. Credentials are injected via a `.env` file at deploy time.

### Caching — Redis 7

| Detail | Value |
|---|---|
| Container | `redis` |
| Port | `6379` (internal) |
| Use | Session caching, shared lookup data |

### Message Queue — RabbitMQ 3

| Detail | Value |
|---|---|
| Container | `rabbitmq` |
| AMQP Port | `5672` (internal) |
| Management UI | `15672` (internal) |
| Use | Async event delivery between services |

### Distributed Tracing — Zipkin

| Detail | Value |
|---|---|
| Container | `zipkin` |
| Port | `9411` |
| URL | `http://localhost:9411` |
| Use | End-to-end request tracing across all services |

### Service Registry — Eureka Server

| Detail | Value |
|---|---|
| Container | `eureka-server` |
| Port | `8761` |
| URL | `http://localhost:8761` |
| Use | Service registration and discovery |

### Configuration Server

| Detail | Value |
|---|---|
| Container | `config-server` |
| Port | internal |
| Source | `config-repo/` directory |
| Use | Centralised configuration; each service fetches config at startup |

---

## Monitoring and Logging

| Tool | Port | Purpose |
|---|---|---|
| **Prometheus** | `9090` | Scrapes metrics from all services |
| **Grafana** | `3000` | Visualises metrics and log dashboards |
| **Loki** | internal | Aggregates structured log streams |
| **Promtail** | internal | Ships service log files from the shared `service-logs` volume to Loki |

Access Grafana at `http://localhost:3000` (default credentials: `admin` / `admin`).

Prometheus scrape config is in `prometheus.yml`. Promtail config is in `promtail-config.yml`.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Backend | Java 17, Spring Boot 3, Spring Cloud (Gateway, Eureka, Config, Feign, Resilience4j) |
| Frontend | Angular, Tailwind CSS |
| Databases | MySQL 8.0 (one instance per service) |
| Caching | Redis 7 |
| Message Queue | RabbitMQ 3 |
| Payment | Razorpay |
| Tracing | Zipkin |
| Metrics | Prometheus, Grafana |
| Log Aggregation | Loki, Promtail |
| Container Runtime | Docker, Docker Compose |
| CI/CD | Jenkins (Jenkinsfile) |

---

## Setup and Deployment

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) ≥ 24
- [Docker Compose](https://docs.docker.com/compose/) ≥ 2.20
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Animesh6027/CG_EARLYSPRINT.git
cd CG_EARLYSPRINT
```

### 2. Create a `.env` File

Copy the sample and fill in the required values:

```bash
cp .env.example .env   # if provided, otherwise create manually
```

Minimum required variables:

```env
TAG=latest

# Shared DB credentials
DB_ROOT_PASSWORD=your_root_password
DB_USERNAME=founderlink
DB_PASSWORD=your_db_password

# RabbitMQ
RABBITMQ_USERNAME=guest
RABBITMQ_PASSWORD=guest

# Grafana (optional, defaults to admin/admin)
GRAFANA_ADMIN_USER=admin
GRAFANA_ADMIN_PASSWORD=admin
```

### 3. Create the Shared Docker Network

```bash
docker network create proxy-net
```

### 4. Start Infrastructure Services

Starts all MySQL databases, Redis, RabbitMQ, Zipkin, Eureka Server, and Config Server:

```bash
docker compose -f docker-compose.infra.yml up -d
```

Wait for the health checks to pass (≈ 30 s):

```bash
docker compose -f docker-compose.infra.yml ps
```

### 5. Start Application Microservices

```bash
docker compose -f docker-compose.services.yml up -d
```

### 6. Start Monitoring Stack

```bash
docker compose -f docker-compose.monitoring.yml up -d
```

### 7. Verify Everything is Running

| Component | URL |
|---|---|
| API Gateway | `http://localhost:8090` |
| Eureka Dashboard | `http://localhost:8761` |
| Zipkin | `http://localhost:9411` |
| Prometheus | `http://localhost:9090` |
| Grafana | `http://localhost:3000` |
| Angular Frontend | `http://localhost:4200` (if running locally) |

### 8. Run the Angular Frontend Locally (Optional)

```bash
cd frontend
npm install
npm start
```

The app will open at `http://localhost:4200` and point to `https://backend.founderlink.online` by default. Update `frontend/src/environments/environment.ts` to target your local API Gateway if needed.

### Stopping All Services

```bash
docker compose -f docker-compose.services.yml down
docker compose -f docker-compose.infra.yml down
docker compose -f docker-compose.monitoring.yml down
```

---

## Common User Flows

### Login Flow

```
User → Frontend → POST /auth/login → Auth Service
Auth Service → validates credentials → issues JWT + sets refresh cookie
Frontend stores JWT → attaches to all subsequent requests via AuthInterceptor
On 401 → Frontend calls POST /auth/refresh → new JWT → retries original request
```

### Register Flow

```
User → Frontend → POST /auth/register → Auth Service
Auth Service → creates auth record → calls User Service to create profile
Auth Service → publishes user-registered event to RabbitMQ
Notification Service → sends welcome notification/email
```

### Startup Creation Flow

```
Founder → Frontend → POST /startup → Startup Service
Startup Service → saves to startup-db
Startup Service → publishes startup.created event
Notification Service → notifies relevant users
```

### Investment & Payment Flow

```
Investor → POST /investments → Investment Service (creates investment)
Investment Service → publishes investment.created
Payment Service → POST /payments/create-order → Razorpay order
Investor completes payment → POST /payments/confirm
Payment Service → publishes payment.completed or payment.failed
Investment Service → updates investment status
Notification Service → sends status notifications
```

### Team Invite Flow

```
Founder → POST /teams/invite → Team Service
Team Service → publishes team.invite.sent
Notification Service → notifies co-founder via email/in-app
Co-founder → POST /teams/join (accept) or DELETE /teams/invitations/{id} (reject)
Team Service → publishes team.member.accepted or team.member.rejected
```

### Messaging Flow

```
User → POST /messages → Messaging Service
Messaging Service → stores in messaging-db → publishes message.sent
Notification Service → notifies the message recipient
```

---

## Security

- **JWT (Bearer token)**: All protected routes require a valid JWT issued by the Auth Service.
- **Refresh tokens**: Stored in HTTP-only cookies; used to silently renew the access token.
- **Role-based access control (RBAC)**: Enforced at the API Gateway level via `config-repo/api-gateway.yml`.
- **Internal service calls**: Services that call each other directly (e.g., auth → user) use an internal secret header, never the user JWT.
- **HTTPS**: Production deployments should terminate TLS at the reverse proxy in front of the API Gateway.

---

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/my-feature`.
3. Commit your changes following conventional commits.
4. Push and open a Pull Request against `main`.
5. Ensure CI passes before requesting a review.

## Support

For questions or issues, open a GitHub issue or email **support@founderlink.com**.