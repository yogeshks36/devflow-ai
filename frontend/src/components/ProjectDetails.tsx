import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CreateTask from './CreateTask'
import {
  getProjectById,
  type Project,
} from '../api/projectsApi'

import {
  getProjectTasks,
  type Task,
} from '../api/tasksApi'

import './ProjectDetails.css'

function ProjectDetails() {

  const navigate = useNavigate()
  const { projectId } = useParams()

  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])

  const [loadingProject, setLoadingProject] = useState(true)
  const [loadingTasks, setLoadingTasks] = useState(true)

  const [projectError, setProjectError] = useState('')
  const [taskError, setTaskError] = useState('')

  const [showCreateTask, setShowCreateTask] =
      useState(false)

  // =========================
  // LOAD PROJECT
  // =========================

  const loadProject = async () => {

    if (!projectId) {
      setProjectError('Project ID is missing')
      setLoadingProject(false)
      return
    }

    try {

      setLoadingProject(true)
      setProjectError('')

      const response = await getProjectById(
        Number(projectId)
      )

      console.log(
        'PROJECT FROM BACKEND:',
        response
      )

      setProject(response)

    } catch (error) {

      console.error(
        'LOAD PROJECT ERROR:',
        error
      )

      setProjectError(
        'Failed to load project'
      )

    } finally {

      setLoadingProject(false)

    }
  }

  // =========================
  // LOAD TASKS
  // =========================

  const loadTasks = async () => {

    if (!projectId) {
      setTaskError('Project ID is missing')
      setLoadingTasks(false)
      return
    }

    try {

      setLoadingTasks(true)
      setTaskError('')

      const response = await getProjectTasks(
        Number(projectId),
        0,
        10
      )

      console.log(
        'TASKS FROM BACKEND:',
        response
      )

      setTasks(response.content)

    } catch (error) {

      console.error(
        'LOAD TASKS ERROR:',
        error
      )

      setTaskError(
        'Failed to load tasks'
      )

    } finally {

      setLoadingTasks(false)

    }
  }

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {

    loadProject()
    loadTasks()

  }, [projectId])

  // =========================
  // INVALID PROJECT ID
  // =========================

  if (!projectId) {

    return (
      <div className="project-details-page">

        <main className="main">

          <div className="projects-message error">

            <h2>
              Project ID is missing
            </h2>

            <button
              className="secondary-button"
              onClick={() =>
                navigate('/projects')
              }
            >
              ← Back to Projects
            </button>

          </div>

        </main>

      </div>
    )
  }

  return (

    <div className="project-details-page">

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
            className="nav-link"
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
            PROJECT HEADER
        ========================= */}

        <section className="project-details-header">

          <div>

            <p className="eyebrow">
              DEVFLOW AI
            </p>

            {loadingProject ? (

              <h1>
                Loading project...
              </h1>

            ) : projectError ? (

              <h1>
                Project unavailable
              </h1>

            ) : (

              <>
                <h1>
                  {project?.name}
                </h1>

                <p className="subtitle">
                  {project?.description ||
                    'No description provided.'}
                </p>
              </>

            )}

          </div>

          <button
            className="secondary-button"
            onClick={() =>
              navigate('/projects')
            }
          >
            ← Back to Projects
          </button>

        </section>


        {/* =========================
            PROJECT ERROR
        ========================= */}

        {!loadingProject &&
          projectError && (

          <div className="projects-message error">

            <div className="empty-icon">
              ⚠️
            </div>

            <h2>
              {projectError}
            </h2>

            <button
              className="primary-button"
              onClick={loadProject}
            >
              Try Again
            </button>

          </div>

        )}


        {/* =========================
            TASKS
        ========================= */}

        {!projectError && (

          <section className="tasks-section">

            <div className="section-header">

              <div>

                <p className="eyebrow">
                  PROJECT TASKS
                </p>

                <h2>
                  Tasks
                </h2>

              </div>

              <button
                className="primary-button"
                onClick={() =>
                  setShowCreateTask(true)
                }
              >
                + New Task
              </button>

            </div>

            {showCreateTask && projectId && (

              <CreateTask

                projectId={Number(projectId)}

                onClose={() =>
                  setShowCreateTask(false)
                }

                onCreated={() => {

                  setShowCreateTask(false)

                  loadTasks()

                }}

              />

            )}


            {/* LOADING */}

            {loadingTasks && (

              <div className="projects-message">

                <div className="empty-icon">
                  ⏳
                </div>

                <h2>
                  Loading tasks...
                </h2>

              </div>

            )}


            {/* TASK ERROR */}

            {!loadingTasks &&
              taskError && (

              <div className="projects-message error">

                <div className="empty-icon">
                  ⚠️
                </div>

                <h2>
                  {taskError}
                </h2>

                <button
                  className="primary-button"
                  onClick={loadTasks}
                >
                  Try Again
                </button>

              </div>

            )}


            {/* NO TASKS */}

            {!loadingTasks &&
              !taskError &&
              tasks.length === 0 && (

              <div className="projects-message">

                <div className="empty-icon">
                  ✓
                </div>

                <h2>
                  No tasks yet
                </h2>

                <p>
                  Create a task to start working
                  on this project.
                </p>

                <button
                  className="primary-button"
                  onClick={() =>
                    setShowCreateTask(true)
                  }
                >
                  Create Task
                </button>

              </div>

            )}


            {/* TASK LIST */}

            {!loadingTasks &&
              !taskError &&
              tasks.length > 0 && (

              <div className="tasks-grid">

                {tasks.map((task) => (

                  <div
                    className="task-card"
                    key={task.id}
                  >

                    <div className="task-card-top">

                      <span className="task-id">
                        #{task.id}
                      </span>

                      <span className="task-status">
                        {task.status}
                      </span>

                    </div>

                    <h3>
                      {task.title}
                    </h3>

                    <p>
                      {task.description ||
                        'No description provided.'}
                    </p>

                    <div className="task-card-bottom">

                      <span>
                        Priority: {task.priority}
                      </span>

                      <span>
                        {task.dueDate
                          ? `Due: ${task.dueDate}`
                          : 'No due date'}
                      </span>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </section>

        )}

      </main>

    </div>
  )
}

export default ProjectDetails