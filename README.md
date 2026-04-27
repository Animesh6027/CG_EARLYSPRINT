🚀 FounderLink – Microservices Platform for Founders & Investors
📌 Overview

FounderLink is a scalable microservices-based platform designed to connect startup founders and investors. It enables collaboration, investment management, secure communication, and seamless payments.

Built using:

Backend: Spring Boot (Microservices Architecture)
Frontend: Angular
Infrastructure: Docker, Kubernetes-ready
Observability: Prometheus, Grafana, Zipkin, Loki
🏗️ Architecture
Angular Frontend (Port 4200)
            │
            ▼
API Gateway (Spring Cloud Gateway - Port 8090)
(Routing, RBAC, CORS)
            │
   ┌────────┼────────┐
   ▼        ▼        ▼
Eureka   Config   Microservices (9)
Server   Server

Shared Infrastructure
MySQL (Database per service)
Redis (Caching)
RabbitMQ (Event-driven messaging)
Zipkin (Distributed tracing)
Prometheus + Grafana (Monitoring)
Loki + Promtail (Logging)
🔧 Microservices
Core Services
Service	Port	Description
Auth Service	8089	JWT authentication & security
User Service	8081	User profiles & roles
Startup Service	8083	Startup management
Investment Service	8084	Investment lifecycle
Team Service	8085	Team collaboration
Messaging Service	8086	Chat system
Notification Service	8087	Notifications & emails
Payment Service	8088	Razorpay integration
Wallet Service	8091	Wallet & transactions
Infrastructure Services
Service	Port	Purpose
Eureka Server	8761	Service discovery
Config Server	8888	Centralized configuration
🔄 Service Communication
🔹 Synchronous (Feign Client + Circuit Breaker)
Investment → Startup Service
Team → Startup Service
Payment → Wallet Service
🔹 Asynchronous (RabbitMQ Events)
startup.created
investment.created
investment.approved / rejected
team.invite.sent
message.sent
payment.completed / failed

📢 Notification Service listens to all events

🎯 Key Features
🔐 JWT Authentication with refresh tokens
👥 Role-Based Access Control (Founder / Investor / Admin)
💬 Real-time messaging system
💸 Investment & payment tracking
🤝 Team collaboration system
🔔 Event-driven notifications
📊 Full observability (metrics, logs, tracing)
🔁 User Flows
🔐 Authentication
User → Auth Service → JWT Token → Frontend stores token
🚀 Startup Creation
Founder → Startup Service → DB → Event → Notification Service
💰 Investment & Payment
Investor → Investment Service → Payment Service → Razorpay → Event → Notification
👥 Team Collaboration
Invite → Notification → Accept/Reject → Team Update
⚙️ Getting Started
✅ Prerequisites
Docker & Docker Compose
Java 17+
Node.js 18+
Maven
🔧 Setup
1. Clone Repo
git clone https://github.com/Animesh6027/CG_EARLYSPRINT.git
cd CG_EARLYSPRINT
2. Start Infrastructure
docker compose -f docker-compose.infra.yml up -d
3. Start Backend Services
mvn clean package -DskipTests

docker compose -f docker-compose.services.yml up -d
4. Start Frontend
cd frontend
npm install
npm start
🌐 URLs
Service	URL
Frontend	http://localhost:4200

API Gateway	http://localhost:8090

Eureka Dashboard	http://localhost:8761

Grafana	http://localhost:3000

Prometheus	http://localhost:9090

Zipkin	http://localhost:9411
🐳 Environment Configuration

Create .env file:

MYSQL_ROOT_PASSWORD=your_password
MYSQL_USER=founderlink
MYSQL_PASSWORD=your_password

RABBITMQ_DEFAULT_USER=guest
RABBITMQ_DEFAULT_PASS=guest

REDIS_PASSWORD=your_password

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=3600000
📊 Monitoring & Observability
Tool	Purpose
Grafana	Metrics visualization
Prometheus	Metrics collection
Zipkin	Distributed tracing
Loki	Log aggregation
🧩 Frontend (Angular)
Tech Stack
Angular 16+
Tailwind CSS
HttpClient + Interceptors
Key Modules
Authentication
Dashboard (Investor / Founder)
Messaging
Teams
Notifications
🔐 Security
JWT Authentication
RBAC (Role-based access control)
API Gateway protection (CORS, rate limiting)
Bcrypt password hashing
🚀 CI/CD Pipeline (Jenkins)
Features
Smart service build detection
Parallel builds & tests
Docker caching
Auto deployment
Rollback support
Pipeline Flow
Code Push → Build → Test → Dockerize → Deploy → Health Check
📁 Project Structure
CG_EARLYSPRINT/
├── auth-service/
├── user-service/
├── startup-service/
├── investment-service/
├── team-service/
├── messaging-service/
├── notification-service/
├── payment-service/
├── wallet-service/
├── api-gateway/
├── config-server/
├── eureka-server/
├── frontend/
├── docker-compose.*
├── Jenkinsfile
🐛 Troubleshooting
Service Issues
docker compose logs <service-name>
Database Issues
docker compose logs mysql
RabbitMQ Issues
URL: http://localhost:15672
Username/Password: guest/guest
🤝 Contribution
Create a feature branch
Make changes
Commit & push
Create Pull Request
📌 Future Improvements
Kubernetes deployment
AI-based startup-investor matching
Real-time chat using WebSockets
Advanced analytics dashboard
📞 Support
Open GitHub Issues
Submit Pull Requests
Add logs & reproduction steps
