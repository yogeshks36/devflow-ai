import {
  useEffect,
  useState,
} from 'react'

import {
  useNavigate,
} from 'react-router-dom'

import {
  getProjects,
  type Project,
} from '../api/projectsApi'

import {
  getProjectMembers,
  type ProjectMember,
} from '../api/membersApi'


function Team() {

  const navigate = useNavigate()


  // =========================
  // STATE
  // =========================

  const [projects, setProjects] =
    useState<Project[]>([])

  const [selectedProjectId, setSelectedProjectId] =
    useState<number | null>(null)

  const [members, setMembers] =
    useState<ProjectMember[]>([])

  const [loadingProjects, setLoadingProjects] =
    useState(true)

  const [loadingMembers, setLoadingMembers] =
    useState(false)

  const [error, setError] =
    useState('')


  // =========================
  // LOAD PROJECTS
  // =========================

  const loadProjects = async () => {

    try {

      setLoadingProjects(true)

      setError('')

      const response =
        await getProjects(
          0,
          100
        )

      console.log(
        'TEAM PROJECTS:',
        response
      )

      setProjects(
        response.content
      )


      // Automatically select
      // the first project

      if (
        response.content.length > 0
      ) {

        setSelectedProjectId(
          response.content[0].id
        )

      }

    } catch (error) {

      console.error(
        'FAILED TO LOAD TEAM PROJECTS:',
        error
      )

      setError(
        'Failed to load projects.'
      )

    } finally {

      setLoadingProjects(
        false
      )

    }

  }


  // =========================
  // LOAD MEMBERS
  // =========================

  const loadMembers = async (
    projectId: number
  ) => {

    try {

      setLoadingMembers(true)

      setError('')

      const response =
        await getProjectMembers(
          projectId
        )

      console.log(
        'PROJECT MEMBERS:',
        response
      )

      setMembers(
        response
      )

    } catch (error) {

      console.error(
        'FAILED TO LOAD PROJECT MEMBERS:',
        error
      )

      setError(
        'Failed to load team members.'
      )

      setMembers([])

    } finally {

      setLoadingMembers(
        false
      )

    }

  }


  // =========================
  // INITIAL PROJECT LOAD
  // =========================

  useEffect(() => {

    loadProjects()

  }, [])


  // =========================
  // LOAD MEMBERS WHEN
  // PROJECT CHANGES
  // =========================

  useEffect(() => {

    if (
      selectedProjectId !== null
    ) {

      loadMembers(
        selectedProjectId
      )

    }

  }, [
    selectedProjectId,
  ])


  // =========================
  // SELECTED PROJECT
  // =========================

  const selectedProject =
    projects.find(
      (project) =>
        project.id ===
        selectedProjectId
    )


  // =========================
  // RENDER
  // =========================

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
            className="nav-link active"
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

        </div>

      </header>


      {/* =========================
          MAIN
      ========================= */}

      <main className="main">


        {/* =========================
            HEADER
        ========================= */}

        <section className="welcome">

          <div>

            <p className="eyebrow">
              TEAM MANAGEMENT
            </p>

            <h1>
              Your Team
            </h1>

            <p className="subtitle">
              View collaborators across
              your projects.
            </p>

          </div>


          <button
            className="secondary-button"
            onClick={() =>
              navigate('/projects')
            }
          >
            ← Projects
          </button>

        </section>


        {/* =========================
            LOADING PROJECTS
        ========================= */}

        {loadingProjects && (

          <section className="panel">

            <div className="empty-state">

              <div className="empty-icon">
                ⏳
              </div>

              <h3>
                Loading projects...
              </h3>

            </div>

          </section>

        )}


        {/* =========================
            ERROR
        ========================= */}

        {!loadingProjects &&
          error && (

            <section className="panel">

              <div className="empty-state">

                <div className="empty-icon">
                  ⚠️
                </div>

                <h3>
                  {error}
                </h3>


                <button
                  className="primary-button"
                  onClick={() => {

                    loadProjects()

                    if (
                      selectedProjectId
                    ) {

                      loadMembers(
                        selectedProjectId
                      )

                    }

                  }}
                >
                  Try Again
                </button>

              </div>

            </section>

          )}


        {/* =========================
            NO PROJECTS
        ========================= */}

        {!loadingProjects &&
          !error &&
          projects.length === 0 && (

            <section className="panel">

              <div className="empty-state">

                <div className="empty-icon">
                  👥
                </div>

                <h3>
                  No projects yet
                </h3>

                <p>
                  Create a project and add
                  members to start collaborating.
                </p>


                <button
                  className="primary-button"
                  onClick={() =>
                    navigate('/projects')
                  }
                >
                  Go to Projects
                </button>

              </div>

            </section>

          )}


        {/* =========================
            TEAM CONTENT
        ========================= */}

        {!loadingProjects &&
          !error &&
          projects.length > 0 && (

            <>


              {/* =========================
                  PROJECT SELECTOR
              ========================= */}

              <section className="panel">

                <div className="panel-header">

                  <div>

                    <h2>
                      Select Project
                    </h2>

                    <p>
                      Choose a project to view
                      its team members.
                    </p>

                  </div>

                </div>


                <select
                  value={
                    selectedProjectId ??
                    ''
                  }
                  onChange={(event) => {

                    setSelectedProjectId(
                      Number(
                        event.target.value
                      )
                    )

                  }}
                  style={{
                    width: '100%',
                    maxWidth: '500px',
                  }}
                >

                  {projects.map(
                    (project) => (

                      <option
                        key={project.id}
                        value={project.id}
                      >

                        {project.name}

                      </option>

                    )
                  )}

                </select>

              </section>


              {/* =========================
                  TEAM SUMMARY
              ========================= */}

              <section className="stats">

                <div className="stat-card">

                  <span className="stat-label">
                    Selected Project
                  </span>

                  <strong
                    style={{
                      fontSize: '22px',
                    }}
                  >

                    {selectedProject?.name ??
                      '-'}

                  </strong>

                  <span className="stat-description">
                    Current project
                  </span>

                </div>


                <div className="stat-card">

                  <span className="stat-label">
                    Team Members
                  </span>

                  <strong>

                    {loadingMembers
                      ? '...'
                      : members.length}

                  </strong>

                  <span className="stat-description">
                    Collaborators
                  </span>

                </div>

              </section>


              {/* =========================
                  MEMBERS LIST
              ========================= */}

              <section className="panel">


                <div className="panel-header">

                  <div>

                    <h2>
                      Team Members
                    </h2>

                    <p>

                      {selectedProject
                        ? `Members of ${selectedProject.name}`
                        : 'Project members'}

                    </p>

                  </div>


                  {selectedProjectId && (

                    <button
                      className="secondary-button"
                      onClick={() =>
                        navigate(
                          `/projects/${selectedProjectId}`
                        )
                      }
                    >
                      Manage Members
                    </button>

                  )}

                </div>


                {/* LOADING */}

                {loadingMembers && (

                  <div className="empty-state">

                    <div className="empty-icon">
                      ⏳
                    </div>

                    <h3>
                      Loading team members...
                    </h3>

                  </div>

                )}


                {/* NO MEMBERS */}

                {!loadingMembers &&
                  members.length === 0 && (

                    <div className="empty-state">

                      <div className="empty-icon">
                        👤
                      </div>

                      <h3>
                        No team members yet
                      </h3>

                      <p>
                        Add members from the
                        project details page.
                      </p>


                      {selectedProjectId && (

                        <button
                          className="primary-button"
                          onClick={() =>
                            navigate(
                              `/projects/${selectedProjectId}`
                            )
                          }
                        >
                          Manage Project Members
                        </button>

                      )}

                    </div>

                  )}


                {/* MEMBERS */}

                {!loadingMembers &&
                  members.length > 0 && (

                    <div
                      className="dashboard-tasks"
                    >

                      {members.map(
                        (member) => (

                          <div
                            className="dashboard-task"
                            key={member.id}
                          >


                            {/* AVATAR */}

                            <div
                              className="avatar"
                              style={{
                                minWidth: '42px',
                                minHeight: '42px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >

                              {member.firstName
                                ?.charAt(0)
                                .toUpperCase()}

                            </div>


                            {/* MEMBER INFO */}

                            <div
                              className="dashboard-task-info"
                            >

                              <h3>

                                {member.firstName}{' '}

                                {member.lastName}

                              </h3>

                              <p>
                                {member.email}
                              </p>

                            </div>


                            {/* MEMBER STATUS */}

                            <span
                              className="task-status"
                            >
                              MEMBER
                            </span>

                          </div>

                        )
                      )}

                    </div>

                  )}

              </section>

            </>

          )}

      </main>

    </div>

  )

}


export default Team