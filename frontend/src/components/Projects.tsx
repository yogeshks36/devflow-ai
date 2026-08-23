import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProjects } from '../api/projectsApi'

interface Project {
  id: number
  name: string
  description: string
}

function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true)
        setError('')

        const data = await getProjects()

        console.log('PROJECTS FROM BACKEND:', data)

        setProjects(data)
      } catch (error) {
        console.error('GET PROJECTS ERROR:', error)

        setError('Failed to load projects')
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [])

  return (
    <div className="app">

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


      {/* MAIN */}

      <main className="main">

        <section className="welcome">

          <div>

            <p className="eyebrow">
              DEVFLOW AI
            </p>

            <h1>
              Projects
            </h1>

            <p className="subtitle">
              Manage all your development projects in one place.
            </p>

          </div>

          <Link
            to="/dashboard"
            className="secondary-button"
          >
            ← Back to Dashboard
          </Link>

        </section>


        {/* LOADING */}

        {loading && (

          <div className="panel">

            <div className="empty-state">

              <h3>
                Loading projects...
              </h3>

              <p>
                Fetching your projects from DevFlow AI.
              </p>

            </div>

          </div>

        )}


        {/* ERROR */}

        {!loading && error && (

          <div className="panel">

            <div className="empty-state">

              <h3>
                Unable to load projects
              </h3>

              <p>
                {error}
              </p>

            </div>

          </div>

        )}


        {/* NO PROJECTS */}

        {!loading &&
          !error &&
          projects.length === 0 && (

            <div className="panel">

              <div className="empty-state">

                <div className="empty-icon">
                  📁
                </div>

                <h3>
                  No projects yet
                </h3>

                <p>
                  You haven't created any projects yet.
                </p>

                <Link
                  to="/dashboard"
                  className="primary-button"
                >
                  Create Project
                </Link>

              </div>

            </div>

          )}


        {/* PROJECT LIST */}

        {!loading &&
          !error &&
          projects.length > 0 && (

            <section className="content-grid">

              {projects.map((project) => (

                <div
                  className="panel"
                  key={project.id}
                >

                  <div className="empty-icon">
                    📁
                  </div>

                  <h2>
                    {project.name}
                  </h2>

                  <p className="subtitle">
                    {project.description || 'No description provided.'}
                  </p>

                  <p>
                    Project ID: {project.id}
                  </p>

                </div>

              ))}

            </section>

          )}

      </main>

    </div>
  )
}

export default Projects