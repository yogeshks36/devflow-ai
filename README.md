# DevFlow AI

DevFlow AI is a backend-focused project management platform built with Spring Boot. It provides secure project, task, team collaboration, comments, and AI-powered task breakdown features through REST APIs.

## Features

- User registration and login
- JWT-based authentication
- BCrypt password hashing
- Role-based authorization
- Project CRUD
- Paginated project listing
- Project member management
- Task CRUD
- Task assignment and project membership validation
- Paginated task listing
- Task comments
- Comment ownership authorization
- AI-powered task breakdown using Gemini
- AI rate limiting
- Global exception handling
- Request validation
- OpenAPI / Swagger documentation
- PostgreSQL persistence

## Tech Stack

- Java 21
- Spring Boot 3.5.4
- Spring Security
- Spring Data JPA
- PostgreSQL
- Maven
- JWT
- BCrypt
- OpenAPI / Swagger
- Gemini API

## Architecture

The backend follows a layered architecture:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
PostgreSQL