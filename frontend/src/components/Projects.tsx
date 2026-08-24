import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  getProjects,
  type Project,
} from '../api/projectsApi'
import './Projects.css'

function Projects() {

  const navigate = useNavigate()

  const [projects, setProjects] = useState<Project[]>([])

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState('')

  const [page, setPage] = useState(0)

  const [totalPages, setTotalPages] = useState(0)

  const loadProjects = async () => {

    try {

      setLoading(true)

      setError('')

      const response = await getProjects(page, 10)

      console.log(
        'PROJECTS FROM BACKEND:',
        response
      )

      setProjects(response.content)

      setTotalPages(response.totalPages)

    } catch (error) {

      console.error(
        'LOAD PROJECTS ERROR:',
        error
      )

      setError(
        'Failed to load projects'
      )

    } finally {

      setLoading(false)

    }
  }

  useEffect(() => {

    loadProjects()

  }, [page])

  return (

    <div className="projects-page">

      {/* =========================
          HEADER
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
            className="nav-link active"
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

        <section className="projects-header">

          <div>

            <p className="eyebrow">
              DEVFLOW AI
            </p>

            <h1>
              Projects
            </h1>

            <p className="subtitle">
              Manage all your development
              projects in one place.
            </p>

          </div>


          <div className="header-actions">

            <button
              className="secondary-button"
              onClick={() =>
                navigate('/dashboard')
              }
            >
              ← Back to Dashboard
            </button>

          </div>

        </section>


        {/* =========================
            LOADING
        ========================= */}

        {loading && (

          <div className="projects-message">

            <div className="empty-icon">
              ⏳
            </div>

            <h2>
              Loading projects...
            </h2>

          </div>

        )}


        {/* =========================
            ERROR
        ========================= */}

        {!loading && error && (

          <div className="projects-message error">

            <div className="empty-icon">
              ⚠️
            </div>

            <h2>
              {error}
            </h2>

            <button
              className="primary-button"
              onClick={loadProjects}
            >
              Try Again
            </button>

          </div>

        )}


        {/* =========================
            NO PROJECTS
        ========================= */}

        {!loading &&
          !error &&
          projects.length === 0 && (

            <div className="projects-message">

              <div className="empty-icon">
                📁
              </div>

              <h2>
                No projects yet
              </h2>

              <p>
                Create your first project
                to get started.
              </p>

              <button
                className="primary-button"
                onClick={() =>
                  navigate('/dashboard')
                }
              >
                Create Project
              </button>

            </div>

          )}


        {/* =========================
            PROJECT GRID
        ========================= */}

        {!loading &&
          !error &&
          projects.length > 0 && (

            <>

              <section className="projects-grid">

                {projects.map((project) => (

                  <div
                    className="project-card"
                    key={project.id}
                  >

                    <div className="project-card-top">

                      <div className="project-icon">
                        📁
                      </div>

                      <span className="project-id">
                        #{project.id}
                      </span>

                    </div>


                    <h2>
                      {project.name}
                    </h2>


                    <p>
                      {project.description ||
                        'No description provided.'}
                    </p>


                    <div className="project-card-footer">

                      <button
                        className="secondary-button"
                        onClick={() =>
                           navigate(`/projects/${project.id}`)
                        }
                      >
                        Open Project
                      </button>

                    </div>

                  </div>

                ))}

              </section>


              {/* =========================
                  PAGINATION
              ========================= */}

              {totalPages > 1 && (

                <div className="pagination">

                  <button
                    className="secondary-button"
                    disabled={page === 0}
                    onClick={() =>
                      setPage(
                        previous =>
                          previous - 1
                      )
                    }
                  >
                    ← Previous
                  </button>


                  <span>
                    Page {page + 1} of {totalPages}
                  </span>


                  <button
                    className="secondary-button"
                    disabled={
                      page >= totalPages - 1
                    }
                    onClick={() =>
                      setPage(
                        previous =>
                          previous + 1
                      )
                    }
                  >
                    Next →
                  </button>

                </div>

              )}

            </>

          )}

      </main>

    </div>
  )
}

export default Projects