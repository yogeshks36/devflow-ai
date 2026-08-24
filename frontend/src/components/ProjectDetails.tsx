import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  getProjectById,
  type Project,
} from '../api/projectsApi'

function ProjectDetails() {

  const navigate = useNavigate()

  const { id } = useParams()

  const [project, setProject] =
    useState<Project | null>(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')


  const loadProject = async () => {

    try {

      setLoading(true)

      setError('')

      if (!id) {
        setError('Project ID is missing')
        return
      }

      const projectId = Number(id)

      const response =
        await getProjectById(projectId)

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

      setError(
        'Failed to load project'
      )

    } finally {

      setLoading(false)

    }
  }


  useEffect(() => {

    loadProject()

  }, [id])


  return (

    <div className="projects-page">

      {/* NAVBAR */}

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


      {/* MAIN */}

      <main className="main">

        <section className="projects-header">

          <div>

            <p className="eyebrow">
              DEVFLOW AI
            </p>

            <h1>
              {project
                ? project.name
                : 'Project'}
            </h1>

            <p className="subtitle">
              {project?.description ||
                'Project details'}
            </p>

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


        {/* LOADING */}

        {loading && (

          <div className="panel">

            <div className="empty-state">

              <div className="empty-icon">
                ⏳
              </div>

              <h2>
                Loading project...
              </h2>

            </div>

          </div>

        )}


        {/* ERROR */}

        {!loading && error && (

          <div className="panel">

            <div className="empty-state">

              <div className="empty-icon">
                ⚠️
              </div>

              <h2>
                {error}
              </h2>

              <button
                className="primary-button"
                onClick={loadProject}
              >
                Try Again
              </button>

            </div>

          </div>

        )}


        {/* PROJECT */}

        {!loading &&
          !error &&
          project && (

            <section className="panel">

              <div className="empty-state">

                <div className="empty-icon">
                  📁
                </div>


                <h2>
                  {project.name}
                </h2>


                <p>
                  {project.description ||
                    'No description provided.'}
                </p>


                <p>
                  Project ID: #{project.id}
                </p>

              </div>

            </section>

          )}

      </main>

    </div>
  )
}

export default ProjectDetails