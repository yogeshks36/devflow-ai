import { useState } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
} from 'react-router-dom'

import Login from './components/Login'
import CreateProject from './components/CreateProject'
import Projects from './components/Projects'

import './App.css'

function Dashboard() {
  const [showCreateProject, setShowCreateProject] =
    useState(false)

  const [projectCount, setProjectCount] = useState(0)

  return (
    <div className="app">

      {/* =========================
          NAVBAR
      ========================= */}

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
            Yogesh
          </span>

        </div>

      </header>


      {/* =========================
          MAIN
      ========================= */}

      <main className="main">

        {/* =========================
            WELCOME
        ========================= */}

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


          <button
            className="primary-button"
            onClick={() =>
              setShowCreateProject(true)
            }
          >
            + New Project
          </button>

        </section>


        {/* =========================
            STATS
        ========================= */}

        <section className="stats">

          <div className="stat-card">

            <span className="stat-label">
              Projects
            </span>

            <strong>
              {projectCount}
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


        {/* =========================
            CONTENT GRID
        ========================= */}

        <section className="content-grid">

          {/* PROJECTS */}

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


              <Link
                to="/projects"
                className="secondary-button"
              >
                View all
              </Link>

            </div>


            <div className="empty-state">

              <div className="empty-icon">
                📁
              </div>


              {projectCount === 0 ? (

                <>
                  <h3>
                    No projects yet
                  </h3>

                  <p>
                    Create your first project to
                    start managing your development
                    workflow.
                  </p>
                </>

              ) : (

                <>
                  <h3>
                    {projectCount} project
                    {projectCount !== 1 ? 's' : ''} created
                  </h3>

                  <p>
                    Your projects are ready to manage.
                  </p>
                </>

              )}


              <button
                className="primary-button"
                onClick={() =>
                  setShowCreateProject(true)
                }
              >
                {projectCount === 0
                  ? 'Create Project'
                  : 'Create Another Project'}
              </button>

            </div>

          </div>


          {/* TASKS */}

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


              <Link
                to="/tasks"
                className="secondary-button"
              >
                View all
              </Link>

            </div>


            <div className="empty-state">

              <div className="empty-icon">
                ✓
              </div>

              <h3>
                No tasks yet
              </h3>

              <p>
                Tasks from your projects
                will appear here.
              </p>

            </div>

          </div>

        </section>


        {/* =========================
            AI PANEL
        ========================= */}

        <section className="ai-panel">

          <div className="ai-icon">
            ✦
          </div>


          <div>

            <p className="eyebrow">
              AI ASSISTANT
            </p>

            <h2>
              Let AI help you break down
              your tasks
            </h2>

            <p>
              DevFlow AI can analyze a task
              and generate smaller,
              actionable subtasks.
            </p>

          </div>


          <button
            className="secondary-button"
            type="button"
          >
            Try AI
          </button>

        </section>

      </main>


      {/* =========================
          CREATE PROJECT MODAL
      ========================= */}

      {showCreateProject && (

        <CreateProject

          onClose={() =>
            setShowCreateProject(false)
          }

          onCreated={() => {

            console.log(
              'Project created successfully'
            )

            setProjectCount(
              previous => previous + 1
            )

            setShowCreateProject(false)

          }}

        />

      )}

    </div>
  )
}


/* =========================
    APP
========================= */

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* LOGIN */}

        <Route
          path="/login"
          element={<Login />}
        />


        {/* DASHBOARD */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />


        {/* PROJECTS */}

        <Route
          path="/projects"
          element={<Projects />}
        />


        {/* TASKS */}

        <Route
          path="/tasks"
          element={
            <div className="app">

              <main className="main">

                <h1>
                  Tasks
                </h1>

                <p className="subtitle">
                  Task management will be added next.
                </p>

                <Link
                  to="/dashboard"
                  className="secondary-button"
                >
                  ← Back to Dashboard
                </Link>

              </main>

            </div>
          }
        />


        {/* TEAM */}

        <Route
          path="/team"
          element={
            <div className="app">

              <main className="main">

                <h1>
                  Team
                </h1>

                <p className="subtitle">
                  Team management will be added next.
                </p>

                <Link
                  to="/dashboard"
                  className="secondary-button"
                >
                  ← Back to Dashboard
                </Link>

              </main>

            </div>
          }
        />


        {/* ROOT */}

        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />


        {/* UNKNOWN ROUTES */}

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