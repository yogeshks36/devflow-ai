import { useEffect, useState } from 'react'
import { getProjects, type Project } from './api/projectsApi'
import { getProjectTasks, type Task } from './api/tasksApi'
import { useAuth } from './context/AuthContext'


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
import Tasks from './pages/Tasks'
import TaskDetails from './pages/TaskDetails'
import { AuthProvider } from './context/AuthContext'
import AiTaskBreakdown from './components/AiTaskBreakdown'
import ProtectedRoute from './components/ProtectedRoute'

import './App.css'


// =========================
// DASHBOARD
// =========================

function Dashboard() {

  const navigate = useNavigate()

  const { logout } = useAuth()


  // =========================
  // STATE
  // =========================

  const [showCreateProject, setShowCreateProject] =
    useState(false)

  const [projects, setProjects] =
    useState<Project[]>([])

  const [loadingProjects, setLoadingProjects] =
    useState(true)

  const [taskCount, setTaskCount] =
    useState(0)

  const [recentTasks, setRecentTasks] =
    useState<Task[]>([])


  // =========================
  // LOAD PROJECTS
  // =========================

  const loadProjects = async () => {

    try {

      setLoadingProjects(true)

      const response =
        await getProjects(
          0,
          10
        )

      console.log(
        'DASHBOARD PROJECTS:',
        response
      )

      setProjects(
        response.content
      )


      // =========================
      // LOAD RECENT TASKS
      // =========================

      const allTasks: Task[] = []

      for (
        const project
        of response.content
      ) {

        try {

          const taskResponse =
            await getProjectTasks(
              project.id,
              0,
              3
            )

          allTasks.push(
            ...taskResponse.content
          )

        } catch (error) {

          console.error(
            `FAILED TO LOAD TASKS FOR PROJECT ${project.id}:`,
            error
          )

        }

      }


      setRecentTasks(
        allTasks.slice(
          0,
          5
        )
      )


      // =========================
      // LOAD TOTAL TASK COUNT
      // =========================

      let totalTasks = 0

      for (
        const project
        of response.content
      ) {

        try {

          const taskResponse =
            await getProjectTasks(
              project.id,
              0,
              1
            )

          totalTasks +=
            taskResponse.totalElements

        } catch (error) {

          console.error(
            `FAILED TO LOAD TASKS FOR PROJECT ${project.id}:`,
            error
          )

        }

      }


      console.log(
        'TOTAL DASHBOARD TASKS:',
        totalTasks
      )

      setTaskCount(
        totalTasks
      )

    } catch (error) {

      console.error(
        'DASHBOARD PROJECTS ERROR:',
        error
      )

    } finally {

      setLoadingProjects(
        false
      )

    }

  }


  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {

    loadProjects()

  }, [])


  return (

    <div className="app">


      {/* =========================
          NAVBAR
      ========================= */}

      <header className="navbar">


        {/* LOGO */}

        <div className="logo">

          <span className="logo-mark">
            D
          </span>

          <span>
            DevFlow AI
          </span>

        </div>


        {/* NAVIGATION */}

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


        {/* PROFILE */}

        <div className="profile">

          <div className="avatar">
            Y
          </div>

          <span>
            Yogesh
          </span>

          <button
            type="button"
            className="logout-button"
            onClick={() => {

              logout()

              navigate('/login')

            }}
          >
            Logout
          </button>

        </div>

      </header>


      {/* =========================
          MAIN
      ========================= */}

      <main className="main">


        {/* WELCOME */}

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
              setShowCreateProject(
                true
              )
            }
          >
            + New Project
          </button>

        </section>


        {/* STATS */}

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

              {loadingProjects
                ? '...'
                : taskCount}

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


        {/* CONTENT GRID */}

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


              <button
                className="secondary-button"
                onClick={() =>
                  navigate('/projects')
                }
              >
                View all
              </button>

            </div>


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
                      setShowCreateProject(
                        true
                      )
                    }
                  >
                    Create Project
                  </button>

                </div>

              )}


            {!loadingProjects &&
              projects.length > 0 && (

                <div className="dashboard-projects">

                  {projects
                    .slice(0, 3)
                    .map(
                      (project) => (

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

                      )
                    )}


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


          {/* RECENT TASKS */}

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
                onClick={() =>
                  navigate('/tasks')
                }
              >
                View all
              </button>

            </div>


            {recentTasks.length === 0 ? (

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

            ) : (

              <div className="dashboard-tasks">

                {recentTasks.map(
                  (task) => (

                    <div
                      className="dashboard-task"
                      key={task.id}
                      style={{
                        cursor: 'pointer',
                      }}
                      onClick={() =>
                        navigate(
                          `/tasks/${task.id}`
                        )
                      }
                    >

                      <div className="dashboard-task-info">

                        <h3>
                          {task.title}
                        </h3>

                        <p>

                          {task.description ||
                            'No description provided.'}

                        </p>

                      </div>


                      <span className="task-status">

                        {task.status}

                      </span>

                    </div>

                  )
                )}

              </div>

            )}

          </div>

        </section>


        {/* AI PANEL */}

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
  onClick={() => navigate('/ai')}
>
  ✦ Try AI
</button>

        </section>

      </main>


      {/* CREATE PROJECT MODAL */}

      {showCreateProject && (

        <CreateProject

          onClose={() => {

            setShowCreateProject(
              false
            )

          }}

          onCreated={() => {

            console.log(
              'Project created successfully'
            )

            setShowCreateProject(
              false
            )

            loadProjects()

          }}

        />

      )}

    </div>

  )

}


// =========================
// APP
// =========================

function App() {

  return (

    <AuthProvider>

      <BrowserRouter>

        <Routes>


          {/* PUBLIC ROUTE */}

          <Route
            path="/login"
            element={
              <Login />
            }
          />


          {/* PROTECTED ROUTES */}

          <Route
            element={
              <ProtectedRoute />
            }
          >


            {/* DASHBOARD */}

            <Route
              path="/dashboard"
              element={
                <Dashboard />
              }
            />

            <Route
  path="/ai"
  element={<AiTaskBreakdown />}
/>


            {/* PROJECTS */}

            <Route
              path="/projects"
              element={
                <Projects />
              }
            />


            {/* PROJECT DETAILS */}

            <Route
              path="/projects/:projectId"
              element={
                <ProjectDetails />
              }
            />


            {/* TASKS */}

            <Route
              path="/tasks"
              element={
                <Tasks />
              }
            />

            {/* TASK DETAILS */}

<Route
  path="/tasks/:taskId"
  element={
    <TaskDetails />
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

</Route>


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

    </AuthProvider>

  )

}

export default App