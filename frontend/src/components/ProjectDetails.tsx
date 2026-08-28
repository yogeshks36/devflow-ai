import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'

import {
  getProjectById,
  type Project,
} from '../api/projectsApi'

import {
  getProjectTasks,
  type Task,
} from '../api/tasksApi'

import {
  addProjectMember,
  getProjectMembers,
  removeProjectMember,
  type ProjectMember,
} from '../api/projectMembersApi'

import CreateTask from './CreateTask'

function ProjectDetails() {

  const navigate = useNavigate()

  const { projectId } = useParams()

  const numericProjectId =
    Number(projectId)


  // =========================
  // PROJECT STATE
  // =========================

  const [project, setProject] =
    useState<Project | null>(null)

  const [loadingProject, setLoadingProject] =
    useState(true)

  const [projectError, setProjectError] =
    useState('')


  // =========================
  // TASK STATE
  // =========================

  const [tasks, setTasks] =
    useState<Task[]>([])

  const [loadingTasks, setLoadingTasks] =
    useState(true)

  const [taskError, setTaskError] =
    useState('')

  const [showCreateTask, setShowCreateTask] =
    useState(false)


  // =========================
  // MEMBER STATE
  // =========================

  const [members, setMembers] =
    useState<ProjectMember[]>([])

  const [loadingMembers, setLoadingMembers] =
    useState(true)

  const [memberError, setMemberError] =
    useState('')

  const [memberEmail, setMemberEmail] =
    useState('')

  const [addingMember, setAddingMember] =
    useState(false)


  // =========================
  // LOAD PROJECT
  // =========================

  const loadProject = async () => {

    try {

      setLoadingProject(true)

      setProjectError('')

      const response =
        await getProjectById(
          numericProjectId
        )

      console.log(
        'PROJECT DETAILS:',
        response
      )

      setProject(response)

    } catch (error) {

      console.error(
        'PROJECT LOAD ERROR:',
        error
      )

      setProjectError(
        'Failed to load project.'
      )

    } finally {

      setLoadingProject(false)

    }
  }


  // =========================
  // LOAD TASKS
  // =========================

  const loadTasks = async () => {

    try {

      setLoadingTasks(true)

      setTaskError('')

      const response =
        await getProjectTasks(
          numericProjectId,
          0,
          50
        )

      console.log(
        'PROJECT TASKS:',
        response
      )

      setTasks(
        response.content
      )

    } catch (error) {

      console.error(
        'PROJECT TASKS ERROR:',
        error
      )

      setTaskError(
        'Failed to load tasks.'
      )

    } finally {

      setLoadingTasks(false)

    }
  }


  // =========================
  // LOAD MEMBERS
  // =========================

  const loadMembers = async () => {

    try {

      setLoadingMembers(true)

      setMemberError('')

      const response =
        await getProjectMembers(
          numericProjectId
        )

      console.log(
        'PROJECT MEMBERS:',
        response
      )

      setMembers(response)

    } catch (error) {

      console.error(
        'PROJECT MEMBERS ERROR:',
        error
      )

      setMemberError(
        'Failed to load project members.'
      )

    } finally {

      setLoadingMembers(false)

    }
  }


  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {

    if (
      !projectId ||
      Number.isNaN(
        numericProjectId
      )
    ) {

      return

    }

    loadProject()

    loadTasks()

    loadMembers()

  }, [projectId])


  // =========================
  // ADD MEMBER
  // =========================

  const handleAddMember =
    async () => {

      const email =
        memberEmail.trim()

      if (!email) {

        setMemberError(
          'Please enter a user email.'
        )

        return

      }

      try {

        setAddingMember(true)

        setMemberError('')

        await addProjectMember(
          numericProjectId,
          {email}
        )

        setMemberEmail('')

        await loadMembers()

      } catch (error: any) {

        console.error(
          'ADD MEMBER ERROR:',
          error
        )

        setMemberError(
          error?.response?.data?.message ||
          'Failed to add project member.'
        )

      } finally {

        setAddingMember(false)

      }

    }


  // =========================
  // REMOVE MEMBER
  // =========================

  const handleRemoveMember =
    async (
      userId: number,
      name: string
    ) => {

      const confirmed =
        window.confirm(
          `Remove ${name} from this project?`
        )

      if (!confirmed) {

        return

      }

      try {

        setMemberError('')

        await removeProjectMember(
          numericProjectId,
          userId
        )

        await loadMembers()

      } catch (error: any) {

        console.error(
          'REMOVE MEMBER ERROR:',
          error
        )

        setMemberError(
          error?.response?.data?.message ||
          'Failed to remove project member.'
        )

      }

    }


  // =========================
  // INVALID PROJECT ID
  // =========================

  if (
    !projectId ||
    Number.isNaN(
      numericProjectId
    )
  ) {

    return (

      <div className="app">

        <main className="main">

          <section className="panel">

            <div className="empty-state">

              <div className="empty-icon">
                ⚠️
              </div>

              <h3>
                Invalid project
              </h3>

              <button
                className="secondary-button"
                onClick={() =>
                  navigate('/projects')
                }
              >
                ← Back to Projects
              </button>

            </div>

          </section>

        </main>

      </div>

    )

  }


  return (

    <div className="app">


      {/* =========================
          NAVBAR
      ========================= */}

      <Navbar />


      {/* =========================
          MAIN
      ========================= */}

      <main className="main">


        {/* =========================
            PROJECT LOADING
        ========================= */}

        {loadingProject && (

          <section className="panel">

            <div className="empty-state">

              <div className="empty-icon">
                ⏳
              </div>

              <h3>
                Loading project...
              </h3>

            </div>

          </section>

        )}


        {/* =========================
            PROJECT ERROR
        ========================= */}

        {!loadingProject &&
          projectError && (

            <section className="panel">

              <div className="empty-state">

                <div className="empty-icon">
                  ⚠️
                </div>

                <h3>
                  {projectError}
                </h3>

                <button
                  className="primary-button"
                  onClick={loadProject}
                >
                  Try Again
                </button>

              </div>

            </section>

          )}


        {/* =========================
            PROJECT CONTENT
        ========================= */}

        {!loadingProject &&
          !projectError &&
          project && (

            <>


              {/* =========================
                  PROJECT HEADER
              ========================= */}

              <section className="welcome">

                <div>

                  <p className="eyebrow">
                    PROJECT
                  </p>

                  <h1>
                    {project.name}
                  </h1>

                  <p className="subtitle">
                    {project.description ||
                      'No description provided for this project.'}
                  </p>

                </div>


                <div
                  style={{
                    display: 'flex',
                    gap: '12px',
                    flexWrap: 'wrap',
                  }}
                >

                  <button
                    className="secondary-button"
                    onClick={() =>
                      navigate('/projects')
                    }
                  >
                    ← Projects
                  </button>


                  <button
                    className="primary-button"
                    onClick={() =>
                      setShowCreateTask(true)
                    }
                  >
                    + New Task
                  </button>

                </div>

              </section>


              {/* =========================
                  CONTENT GRID
              ========================= */}

              <section className="content-grid">


                {/* =========================
                    TASKS PANEL
                ========================= */}

                <div className="panel">


                  <div className="panel-header">

                    <div>

                      <h2>
                        Tasks
                      </h2>

                      <p>
                        Tasks in this project
                      </p>

                    </div>


                    <button
                      className="secondary-button"
                      onClick={() =>
                        setShowCreateTask(true)
                      }
                    >
                      + Add Task
                    </button>

                  </div>


                  {/* LOADING */}

                  {loadingTasks && (

                    <div className="empty-state">

                      <div className="empty-icon">
                        ⏳
                      </div>

                      <h3>
                        Loading tasks...
                      </h3>

                    </div>

                  )}


                  {/* ERROR */}

                  {!loadingTasks &&
                    taskError && (

                      <div className="empty-state">

                        <div className="empty-icon">
                          ⚠️
                        </div>

                        <h3>
                          {taskError}
                        </h3>

                        <button
                          className="secondary-button"
                          onClick={loadTasks}
                        >
                          Try Again
                        </button>

                      </div>

                    )}


                  {/* EMPTY */}

                  {!loadingTasks &&
                    !taskError &&
                    tasks.length === 0 && (

                      <div className="empty-state">

                        <div className="empty-icon">
                          ✓
                        </div>

                        <h3>
                          No tasks yet
                        </h3>

                        <p>
                          Create your first task for this project.
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

                      <div className="dashboard-tasks">

                        {tasks.map((task) => (

                          <div
                            className="dashboard-task"
                            key={task.id}
                            onClick={() =>
                              navigate(
                                `/tasks/${task.id}`
                              )
                            }
                            style={{
                              cursor: 'pointer',
                            }}
                          >

                            <div className="dashboard-task-info">

                              <h3>
                                {task.title}
                              </h3>

                              <p>
                                {task.description ||
                                  'No description provided.'}
                              </p>


                              {task.assignee && (

                                <p
                                  style={{
                                    marginTop: '8px',
                                    fontSize: '13px',
                                  }}
                                >

                                  Assigned to:{' '}

                                  {task.assignee.firstName}{' '}

                                  {task.assignee.lastName}

                                </p>

                              )}

                            </div>


                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px',
                                alignItems: 'flex-end',
                              }}
                            >

                              <span className="task-status">

                                {task.status}

                              </span>


                              <span className="task-priority">

                                {task.priority}

                              </span>


                              {task.dueDate && (

                                <span
                                  style={{
                                    fontSize: '12px',
                                  }}
                                >

                                  Due:{' '}

                                  {new Date(
                                    task.dueDate
                                  ).toLocaleDateString()}

                                </span>

                              )}

                            </div>

                          </div>

                        ))}

                      </div>

                    )}

                </div>


                {/* =========================
                    TEAM PANEL
                ========================= */}

                <div className="panel">


                  <div className="panel-header">

                    <div>

                      <h2>
                        Team Members
                      </h2>

                      <p>
                        Manage people collaborating on this project
                      </p>

                    </div>

                  </div>


                  {/* =========================
                      ADD MEMBER
                  ========================= */}

                  <div
                    style={{
                      display: 'flex',
                      gap: '10px',
                      marginBottom: '20px',
                      flexWrap: 'wrap',
                    }}
                  >

                    <input
                      type="email"
                      placeholder="Enter user email"
                      value={memberEmail}
                      onChange={(event) =>
                        setMemberEmail(
                          event.target.value
                        )
                      }
                      onKeyDown={(event) => {

                        if (
                          event.key === 'Enter'
                        ) {

                          handleAddMember()

                        }

                      }}
                      disabled={addingMember}
                    />


                    <button
                      className="primary-button"
                      onClick={handleAddMember}
                      disabled={addingMember}
                    >

                      {addingMember
                        ? 'Adding...'
                        : '+ Add Member'}

                    </button>

                  </div>


                  {/* MEMBER ERROR */}

                  {memberError && (

                    <div
                      style={{
                        marginBottom: '16px',
                      }}
                    >

                      <p>

                        ⚠️ {memberError}

                      </p>

                    </div>

                  )}


                  {/* MEMBER LOADING */}

                  {loadingMembers && (

                    <div className="empty-state">

                      <div className="empty-icon">
                        ⏳
                      </div>

                      <h3>
                        Loading members...
                      </h3>

                    </div>

                  )}


                  {/* NO MEMBERS */}

                  {!loadingMembers &&
                    !memberError &&
                    members.length === 0 && (

                      <div className="empty-state">

                        <div className="empty-icon">
                          👥
                        </div>

                        <h3>
                          No team members yet
                        </h3>

                        <p>
                          Add collaborators using their registered email.
                        </p>

                      </div>

                    )}


                  {/* MEMBER LIST */}

                  {!loadingMembers &&
                    members.length > 0 && (

                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                        }}
                      >

                        {members.map((member) => (

                          <div
                            key={member.id}
                            className="dashboard-task"
                            style={{
                              cursor: 'default',
                            }}
                          >

                            <div className="dashboard-task-info">

                              <h3>

                                {member.firstName}{' '}

                                {member.lastName}

                              </h3>


                              <p>

                                {member.email}

                              </p>

                            </div>


                            <button
                              className="secondary-button"
                              onClick={() =>
                                handleRemoveMember(
                                  member.userId,
                                  `${member.firstName} ${member.lastName}`
                                )
                              }
                            >
                              Remove
                            </button>

                          </div>

                        ))}

                      </div>

                    )}

                </div>

              </section>


              {/* =========================
                  CREATE TASK MODAL
              ========================= */}

              {showCreateTask && (

                <CreateTask

                  projectId={
                    numericProjectId
                  }

                  onClose={() => {

                    setShowCreateTask(false)

                  }}

                  onCreated={() => {

                    setShowCreateTask(false)

                    loadTasks()

                  }}

                />

              )}

            </>

          )}

      </main>

    </div>

  )

}

export default ProjectDetails