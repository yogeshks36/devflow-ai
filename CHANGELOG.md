# Changelog

All notable changes and verified progress for DevFlow AI are documented here.

## 2026-09-06

### Verified
- Frontend production build passes successfully with `npm run build`.
- TypeScript compilation passes as part of the production build.
- Protected routes verified:
  - `/dashboard`
  - `/projects`
  - `/tasks`
  - `/team`
- Logged-out users are redirected to the Login page for all protected routes.
- Login failure state verified with invalid credentials:
  - `Wrong email or password`
- Empty task validation verified:
  - `Task title is required`
- Non-existent project error state verified:
  - `Failed to load project.`
  - `Try Again` action is displayed.
- Backend/network failure state verified:
  - `Failed to load project.`
- `TaskComments.tsx` is the single comment implementation used by `TaskDetails.tsx`; no duplicate inline comment implementation remains.
- Frontend currently contains no known production-blocking TypeScript/build errors.
- Removed all frontend `console.log` debug statements from `src`.
- Retained `console.error` statements for runtime error diagnostics.
- Frontend production build verified successfully with `npm run build`.
- TypeScript compilation and Vite production build pass successfully.

### Testing
- Backend automated test suite: 29 tests passing, 0 failures, 0 errors, 0 skipped.
- Added `JwtServiceTest` with 4 tests.
- Added `UserServiceImplTest` with 8 tests.
- Task authorization tests cover:
  - Project owner can delete a task.
  - Project member cannot delete a task.
  - Outsider cannot delete a task.
- Backend tests use an isolated H2 test database.
- Backend security integration tests: 4 tests passing, 0 failures, 0 errors.
- Full backend test suite: 33 tests passing, 0 failures, 0 errors, 0 skipped.
- Security integration coverage verifies:
  - Protected endpoint without JWT returns 401.
  - Invalid JWT returns 401.
  - Valid USER JWT can access protected user endpoint.
  - Normal USER cannot access ADMIN-only endpoint and receives 403.
- Enabled method-level authorization with `@EnableMethodSecurity`.

### Deferred
- Frontend `console.log` cleanup is intentionally deferred.
- JWT/token-related debug logs should be removed before production deployment.
- Remaining frontend debug logs should be cleaned up during final production polish.

### Next
- Complete authorization test audit based on the actual existing test classes.
- Continue frontend final audit.
- Clean demo/test data after test coverage is confirmed.
- Review production configuration and CORS.
- Deploy backend, database, and frontend.
- Complete README and GitHub polish.

### Milestone
Production deployment completed
- Backend deployed to Render
- Frontend deployed to Render
- PostgreSQL production database configured
- JWT authentication verified in production
- Project creation verified
- Project membership verified
- Task CRUD/authorization verified
- Comment CRUD/ownership authorization verified
- AI task breakdown generation verified
- AI-generated subtasks saved successfully
- React Router SPA rewrite configured
- Production smoke tests passed