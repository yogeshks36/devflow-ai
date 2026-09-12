# DevFlow AI

DevFlow AI is a full-stack project management platform designed for software development teams.

It provides secure project, task, team collaboration, comments, and AI-powered task breakdown features through a Spring Boot REST API and React + TypeScript frontend.

The project focuses on production-oriented backend engineering practices including JWT authentication, role-based authorization, project-level access control, validation, exception handling, automated testing, PostgreSQL persistence, and cloud deployment.

---

## 🚀 Live Demo

**Frontend:**  
https://devflow-ai-frontend.onrender.com

**Backend API:**  
https://devflow-ai-60l6.onrender.com

**Swagger / OpenAPI:**  
https://devflow-ai-60l6.onrender.com/swagger-ui/index.html

---

## ✨ Features

### Authentication & Security

- User registration and login
- BCrypt password hashing
- JWT-based authentication
- JWT request authentication filter
- Role-based authorization
- USER and ADMIN roles
- Protected REST endpoints
- Authentication entry point for unauthorized requests
- Method-level authorization
- Project-level access control

### Project Management

- Create projects
- View projects
- Update projects
- Delete projects
- Paginated project listing
- Project ownership authorization

### Team Collaboration

- Add members to projects
- View project members
- Remove project members
- Project membership validation
- Member-based project access

### Task Management

- Create tasks
- View tasks
- Update tasks
- Delete tasks
- Task assignment
- Task status management
- Task priority management
- Due dates
- Paginated task listing
- Task filtering
- Assignee validation
- Project membership validation

### Comments

- Add comments to tasks
- View task comments
- Edit comments
- Delete comments
- Comment ownership authorization
- Project-level access validation

### AI Assistant

- AI-powered task breakdown using Gemini
- Generate actionable subtasks from a task description
- Save generated subtasks directly as project tasks
- Uses the existing authorized task creation workflow
- AI rate-limit handling

### API & Backend Engineering

- RESTful API architecture
- DTO-based request and response handling
- Request validation
- Global exception handling
- Consistent HTTP error responses
- PostgreSQL persistence
- Spring Data JPA
- OpenAPI / Swagger documentation
- Layered architecture
- Environment-based configuration

### Testing

- Unit tests using JUnit 5
- Mockito-based service testing
- JWT service tests
- AI service tests
- Project service tests
- Task service tests
- User service tests
- Spring Security integration tests
- Protected endpoint testing
- Authorization testing

---

## 🏗️ Architecture

DevFlow AI follows a layered backend architecture.

```text
                    React + TypeScript
                           │
                           │ HTTP / JSON
                           ▼
                    Spring Boot REST API
                           │
             ┌─────────────┴─────────────┐
             │                           │
             ▼                           ▼
       Spring Security              Controllers
             │                           │
             │ JWT                      ▼
             │                       Services
             │                           │
             │                           ▼
             │                      Repositories
             │                           │
             └───────────────┬───────────┘
                             │
                             ▼
                         PostgreSQL
```

### Backend Layers

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
PostgreSQL
```

Security is applied through Spring Security and JWT authentication.

---

## 🔐 Security Architecture

Authentication uses JWT tokens.

```text
User
 │
 ├── Register
 │      ↓
 │   BCrypt password hashing
 │      ↓
 │   PostgreSQL
 │
 └── Login
        ↓
     Credentials verified
        ↓
     JWT generated
        ↓
     Client stores token
        ↓
     Authorization: Bearer <JWT>
        ↓
     JwtAuthenticationFilter
        ↓
     Protected endpoint
```

### Authorization Model

DevFlow AI uses both role-based and resource-level authorization.

```text
ADMIN
 ├── User administration
 └── Normal application access

USER
 └── Normal application access
```

Project-level authorization further controls access to resources.

```text
Project Owner
 ├── View project
 ├── Update project
 ├── Delete project
 ├── Manage members
 ├── Create tasks
 ├── Update tasks
 └── Delete tasks

Project Member
 ├── View project
 ├── Create tasks
 ├── Update tasks
 ├── View comments
 ├── Create comments
 ├── Update own comments
 └── Delete own comments
```

Sensitive operations such as deleting a task or modifying another user's comment are protected by ownership checks.

---

## 🤖 AI Task Breakdown

DevFlow AI integrates Gemini to convert a high-level task description into smaller actionable subtasks.

```text
Task Description
       │
       ▼
Gemini AI
       │
       ▼
Generated Subtasks
       │
       ▼
User reviews subtasks
       │
       ▼
Save
       │
       ▼
Normal Task Creation API
       │
       ▼
PostgreSQL
```

The AI generation endpoint works with user-provided text.

Saving the generated subtasks uses the normal authorized project task-creation workflow, ensuring that project membership and authorization rules still apply.

---

## 🧪 Testing

The backend has a comprehensive automated test suite covering services, authentication, JWT handling, AI integration, and authorization.

Current backend test suite:

```text
Tests run: 33
Failures: 0
Errors: 0
Skipped: 0
```

### Test Coverage

- Application context
- JWT generation and validation
- JWT expiration handling
- User registration
- User login
- Password handling
- User profile operations
- Project authorization
- Project CRUD
- Task operations
- AI task breakdown
- Protected endpoints
- Invalid JWT handling
- Role-based authorization
- USER vs ADMIN access
- Authentication without JWT

Production smoke testing was also performed for:

- User registration
- User login
- JWT-protected endpoints
- Project creation
- Project membership
- Task creation
- Task editing
- Task authorization
- Comment CRUD
- Comment ownership authorization
- AI task generation
- AI-generated task saving

---

## 🛠️ Tech Stack

### Backend

- Java 21
- Spring Boot 3.5.4
- Spring Security
- Spring Data JPA
- Maven
- JWT
- BCrypt
- Hibernate
- PostgreSQL

### Frontend

- React
- TypeScript
- Vite
- Axios
- React Router
- CSS

### AI

- Google Gemini API

### API Documentation

- OpenAPI
- Swagger UI

### Testing

- JUnit 5
- Mockito
- Spring Boot Test

### Deployment

- Render
- Docker
- PostgreSQL

---

## 📁 Project Structure

```text
devflow-ai/
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── yogesh/
│   │   │           └── devflow/
│   │   │               ├── config/
│   │   │               ├── controller/
│   │   │               ├── dto/
│   │   │               │   ├── request/
│   │   │               │   └── response/
│   │   │               ├── entity/
│   │   │               ├── exception/
│   │   │               ├── repository/
│   │   │               ├── security/
│   │   │               ├── service/
│   │   │               └── service/
│   │   │                   └── impl/
│   │   │
│   │   └── resources/
│   │       └── application.properties
│   │
│   └── test/
│       └── java/
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── ...
│   │
│   ├── package.json
│   └── vite.config.ts
│
├── Dockerfile
├── .dockerignore
├── pom.xml
├── CHANGELOG.md
└── README.md
```

---

## ⚙️ Running Locally

### Prerequisites

Make sure the following are installed:

- Java 21
- Maven
- Node.js
- npm
- PostgreSQL
- Git

---

## 1. Clone the Repository

```bash
git clone https://github.com/yogeshks36/devflow-ai.git

cd devflow-ai
```

---

## 2. Configure PostgreSQL

Create a PostgreSQL database:

```text
devflow_ai
```

The application expects PostgreSQL to be available locally.

Example configuration:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/devflow_ai
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
```

Do not commit database credentials to Git.

---

## 3. Configure Environment Variables

The application uses environment variables for sensitive configuration.

### Backend

```text
DB_URL
DB_USERNAME
DB_PASSWORD
JWT_SECRET
GEMINI_API_KEY
```

Example:

```properties
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}

jwt.secret=${JWT_SECRET}

gemini.api.key=${GEMINI_API_KEY}
```

Never commit real API keys, passwords, or JWT secrets to the repository.

---

## 4. Start the Backend

From the project root:

```bash
mvn spring-boot:run
```

The backend runs on:

```text
http://localhost:8080
```

---

## 5. Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

The frontend API URL can be configured using:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## 🧪 Running Tests

Run all backend tests:

```bash
mvn test
```

Build the frontend:

```bash
cd frontend
npm run build
```

---

## 📚 API Documentation

Once the backend is running, Swagger UI is available at:

```text
http://localhost:8080/swagger-ui/index.html
```

The production Swagger UI is available at:

```text
https://devflow-ai-60l6.onrender.com/swagger-ui/index.html
```

Swagger can be used to explore and test the REST API.

Protected endpoints require a valid JWT using the Swagger **Authorize** button.

---

## 🔑 Main API Endpoints

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

### Users

```text
GET  /api/users/me
PUT  /api/users/me
PUT  /api/users/me/password
GET  /api/users
PUT  /api/users/{userId}/role
```

### Projects

```text
GET    /api/projects
GET    /api/projects/{projectId}
POST   /api/projects
PUT    /api/projects/{projectId}
DELETE /api/projects/{projectId}
```

### Project Members

```text
GET    /api/projects/{projectId}/members
POST   /api/projects/{projectId}/members
DELETE /api/projects/{projectId}/members/{userId}
```

### Tasks

```text
GET    /api/tasks
GET    /api/tasks/{taskId}

POST   /api/projects/{projectId}/tasks
GET    /api/projects/{projectId}/tasks

PUT    /api/tasks/{taskId}
DELETE /api/tasks/{taskId}
```

### AI

```text
POST /api/ai/task-breakdown
```

---

## 🚀 Deployment

DevFlow AI is deployed using Render.

```text
                    GitHub
                       │
                       ▼
                 Render
              ┌─────────────┐
              │   Backend   │
              │ Spring Boot │
              │   Docker    │
              └──────┬──────┘
                     │
                     ▼
                PostgreSQL

                     ▲
                     │
              REST API / JWT
                     │
                     │
              ┌──────┴──────┐
              │   Frontend  │
              │ React + TS  │
              │ Static Site │
              └─────────────┘
```

### Production Services

- Spring Boot backend deployed as a Docker Web Service
- React frontend deployed as a Render Static Site
- PostgreSQL hosted on Render
- Environment variables used for production secrets
- SPA rewrite configured for React Router

---

## 📌 Engineering Highlights

DevFlow AI was designed with production-oriented backend practices rather than only basic CRUD functionality.

Key engineering decisions include:

- Stateless JWT authentication
- BCrypt password hashing
- Role-based authorization
- Resource-level ownership checks
- Project membership authorization
- DTO-based API contracts
- Validation at the API boundary
- Centralized exception handling
- Pagination and filtering
- Automated unit and integration testing
- AI integration isolated behind a service layer
- Environment-based secret management
- Dockerized backend deployment
- OpenAPI documentation
- Production smoke testing

---

## 🔮 Future Improvements

Potential future improvements include:

- CI/CD pipeline with GitHub Actions
- Refresh token authentication
- Advanced project analytics
- Improved AI task prioritization
- Email notifications
- File attachments
- OAuth authentication

These are outside the current MVP scope.

---

## 📈 Project Status

**Status: Production MVP deployed and verified**

```text
Authentication          ✅
JWT Security            ✅
Role Authorization      ✅
Project Management      ✅
Project Membership      ✅
Task Management         ✅
Task Authorization      ✅
Comments                ✅
Comment Authorization   ✅
AI Task Breakdown       ✅
Validation              ✅
Exception Handling      ✅
Swagger Documentation   ✅
Automated Tests         ✅
Frontend                ✅
PostgreSQL              ✅
Docker                  ✅
Render Deployment       ✅
Production Smoke Tests  ✅
```

---

## 👨‍💻 Author

**Yogesh Kumar Sheoran**

GitHub:

https://github.com/yogeshks36

---

## 📄 License

This project is currently intended as a personal portfolio and learning project.