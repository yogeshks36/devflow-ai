import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
} from 'react-router-dom'

import Login from './components/Login'
import ProtectedRoute from './components/ProtectedRoute'

import './App.css'

function Dashboard() {

  const userData =
    localStorage.getItem('devflow_user')

  const user = userData
    ? JSON.parse(userData)
    : null

  return (
    <div className="app">

      <header className="navbar">

        <div className="logo">

          <span className="logo-mark">
            D
          </span>

          <span>
            DevFlow AI
          </span>

        </div>

        <nav>

          <Link to="/dashboard">
            Dashboard
          </Link>

          <Link to="/projects">
            Projects
          </Link>

          <Link to="/tasks">
            Tasks
          </Link>

          <Link to="/team">
            Team
          </Link>

        </nav>

        <div className="profile">

          <div className="avatar">
            Y
          </div>

          <span>
            {user?.email || 'Yogesh'}
          </span>

        </div>

      </header>

      <main className="main">

        <section className="welcome">

          <div>

            <p className="eyebrow">
              DEVFLOW AI
            </p>

            <h1>
              Welcome back, Yogesh 👋
            </h1>

            <p className="subtitle">
              Manage your projects, tasks and
              development workflow in one place.
            </p>

          </div>

          <button className="primary-button">
            + New Project
          </button>

        </section>

        <section className="stats">

          <div className="stat-card">

            <span className="stat-label">
              Projects
            </span>

            <strong>
              0
            </strong>

            <span className="stat-description">
              Active projects
            </span>

          </div>

          <div className="stat-card">

            <span className="stat-label">
              Tasks
            </span>

            <strong>
              0
            </strong>

            <span className="stat-description">
              Tasks assigned
            </span>

          </div>

          <div className="stat-card">

            <span className="stat-label">
              Completed
            </span>

            <strong>
              0
            </strong>

            <span className="stat-description">
              Tasks completed
            </span>

          </div>

          <div className="stat-card">

            <span className="stat-label">
              Team members
            </span>

            <strong>
              0
            </strong>

            <span className="stat-description">
              People collaborating
            </span>

          </div>

        </section>

        <section className="content-grid">

          <div className="panel">

            <div className="panel-header">

              <div>

                <h2>
                  Projects
                </h2>

                <p>
                  Your recent projects
                </p>

              </div>

              <button className="secondary-button">
                View all
              </button>

            </div>

            <div className="empty-state">

              <div className="empty-icon">
                📁
              </div>

              <h3>
                No projects yet
              </h3>

              <p>
                Create your first project to start
                managing your development workflow.
              </p>

              <button className="primary-button">
                Create Project
              </button>

            </div>

          </div>

          <div className="panel">

            <div className="panel-header">

              <div>

                <h2>
                  Recent Tasks
                </h2>

                <p>
                  Your latest tasks
                </p>

              </div>

              <button className="secondary-button">
                View all
              </button>

            </div>

            <div className="empty-state">

              <div className="empty-icon">
                ✓
              </div>

              <h3>
                No tasks yet
              </h3>

              <p>
                Tasks from your projects will
                appear here.
              </p>

            </div>

          </div>

        </section>

        <section className="ai-panel">

          <div className="ai-icon">
            ✦
          </div>

          <div>

            <p className="eyebrow">
              AI ASSISTANT
            </p>

            <h2>
              Let AI help you break down your tasks
            </h2>

            <p>
              DevFlow AI can analyze a task and
              generate smaller, actionable subtasks.
            </p>

          </div>

          <button className="secondary-button">
            Try AI
          </button>

        </section>

      </main>

    </div>
  )
}

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* =========================
            LOGIN
        ========================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* =========================
            DASHBOARD
        ========================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* =========================
            DEFAULT
        ========================= */}

        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        {/* =========================
            UNKNOWN ROUTES
        ========================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  )
}

export default App