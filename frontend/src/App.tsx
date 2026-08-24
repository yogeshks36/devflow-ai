import { useEffect, useState } from 'react'
import { getProjects, type Project } from './api/projectsApi'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  Link,
} from 'react-router-dom'

import Login from './components/Login'
import CreateProject from './components/CreateProject'
import Projects from './components/Projects'
import ProjectDetails from './components/ProjectDetails'
import './App.css'

function Dashboard() {

  const navigate = useNavigate()

  const [showCreateProject, setShowCreateProject] =
    useState(false)

  const [projects, setProjects] =
    useState<Project[]>([])

  const [loadingProjects, setLoadingProjects] =
    useState(true)

  const loadProjects = async () => {

    try {

      setLoadingProjects(true)

      const response = await getProjects(0, 10)

      console.log(
        'DASHBOARD PROJECTS:',
        response
      )

      setProjects(response.content)

    } catch (error) {

      console.error(
        'DASHBOARD PROJECTS ERROR:',
        error
      )

    } finally {

      setLoadingProjects(false)

    }
  }


  useEffect(() => {

    loadProjects()

  }, [])


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

          <button
            className="nav-link active"
            onClick={() =>
              navigate('/dashboard')
            }
          >
            Dashboard
          </button>

          <button
            className="nav-link"
            onClick={() =>
              navigate('/projects')
            }
          >
            Projects
          </button>

          <button
            className="nav-link"
            onClick={() =>
              navigate('/tasks')
            }
          >
            Tasks
          </button>

          <button
            className="nav-link"
            onClick={() =>
              navigate('/team')
            }
          >
            Team
          </button>

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
              {loadingProjects
                ? '...'
                : projects.length}
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


          {/* =========================
              PROJECTS
          ========================= */}

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


              <button
                className="secondary-button"
                onClick={() =>
                  navigate('/projects')
                }
              >
                View all
              </button>

            </div>


            {/* LOADING */}

            {loadingProjects && (

              <div className="empty-state">

                <div className="empty-icon">
                  ⏳
                </div>

                <h3>
                  Loading projects...
                </h3>

              </div>

            )}


            {/* NO PROJECTS */}

            {!loadingProjects &&
              projects.length === 0 && (

                <div className="empty-state">

                  <div className="empty-icon">
                    📁
                  </div>

                  <h3>
                    No projects yet
                  </h3>

                  <p>
                    Create your first project to
                    start managing your development
                    workflow.
                  </p>

                  <button
                    className="primary-button"
                    onClick={() =>
                      setShowCreateProject(true)
                    }
                  >
                    Create Project
                  </button>

                </div>

              )}


            {/* PROJECTS EXIST */}

            {!loadingProjects &&
              projects.length > 0 && (

                <div className="dashboard-projects">

                  {projects
                    .slice(0, 3)
                    .map((project) => (

                      <div
                        className="dashboard-project"
                        key={project.id}
                      >

                        <div className="dashboard-project-icon">
                          📁
                        </div>


                        <div className="dashboard-project-info">

                          <h3>
                            {project.name}
                          </h3>

                          <p>
                            {project.description ||
                              'No description provided.'}
                          </p>

                        </div>


                        <button
                          className="secondary-button"
                          onClick={() =>
                            navigate(
                              `/projects/${project.id}`
                            )
                          }
                        >
                          Open
                        </button>

                      </div>

                    ))}


                  {projects.length > 3 && (

                    <button
                      className="secondary-button"
                      onClick={() =>
                        navigate('/projects')
                      }
                    >
                      View all {projects.length} projects
                    </button>

                  )}

                </div>

              )}

          </div>


          {/* =========================
              TASKS
          ========================= */}

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


              <button
                className="secondary-button"
                type="button"
              >
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

          onClose={() => {

            setShowCreateProject(false)

          }}

          onCreated={() => {

            console.log(
              'Project created successfully'
            )

            setShowCreateProject(false)

            loadProjects()

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

        <Route
          path="/projects/:id"
          element={<ProjectDetails />}
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