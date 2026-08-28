import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

import {
  getAllTasks,
  type Task,
  type TaskPage,
} from '../api/tasksApi'

function Tasks() {

  const navigate = useNavigate()


  // =========================
  // STATE
  // =========================

  const [tasks, setTasks] =
    useState<Task[]>([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  const [page, setPage] =
    useState(0)

  const [taskPage, setTaskPage] =
    useState<TaskPage | null>(null)


  // =========================
  // FILTERS
  // =========================

  const [statusFilter, setStatusFilter] =
    useState('')

  const [priorityFilter, setPriorityFilter] =
    useState('')


  // =========================
  // LOAD TASKS
  // =========================

  const loadTasks = async () => {

    try {

      setLoading(true)

      setError('')

      const response =
        await getAllTasks(
          page,
          10,
          statusFilter || undefined,
          priorityFilter || undefined
        )

      console.log(
        'ALL TASKS:',
        response
      )

      setTasks(
        response.content
      )

      setTaskPage(
        response
      )

    } catch (error) {

      console.error(
        'TASKS LOAD ERROR:',
        error
      )

      setError(
        'Failed to load tasks.'
      )

    } finally {

      setLoading(false)

    }
  }


  // =========================
  // LOAD WHEN FILTER/PAGE CHANGES
  // =========================

  useEffect(() => {

    loadTasks()

  }, [
    page,
    statusFilter,
    priorityFilter,
  ])


  // =========================
  // STATUS FILTER CHANGE
  // =========================

  const handleStatusChange = (
    value: string
  ) => {

    setPage(0)

    setStatusFilter(value)

  }


  // =========================
  // PRIORITY FILTER CHANGE
  // =========================

  const handlePriorityChange = (
    value: string
  ) => {

    setPage(0)

    setPriorityFilter(value)

  }


  return (

    <div className="app">


    <Navbar />  


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
              TASK MANAGEMENT
            </p>

            <h1>
              All Tasks
            </h1>

            <p className="subtitle">
              Manage tasks across all your projects.
            </p>

          </div>


          <button
            className="secondary-button"
            onClick={() =>
              navigate('/dashboard')
            }
          >
            ← Dashboard
          </button>

        </section>


        {/* =========================
            FILTERS
        ========================= */}

        <section className="panel">

          <div className="panel-header">

            <div>

              <h2>
                Filters
              </h2>

              <p>
                Filter tasks by status and priority
              </p>

            </div>

          </div>


          <div
            style={{
              display: 'flex',
              gap: '16px',
              flexWrap: 'wrap',
            }}
          >


            {/* STATUS FILTER */}

            <div>

              <label
                htmlFor="status"
              >
                Status
              </label>

              <select
                id="status"
                value={statusFilter}
                onChange={(event) =>
                  handleStatusChange(
                    event.target.value
                  )
                }
              >

                <option value="">
                  All Statuses
                </option>

                <option value="TODO">
                  TODO
                </option>

                <option value="IN_PROGRESS">
                  IN PROGRESS
                </option>

                <option value="DONE">
                  DONE
                </option>

              </select>

            </div>


            {/* PRIORITY FILTER */}

            <div>

              <label
                htmlFor="priority"
              >
                Priority
              </label>

              <select
                id="priority"
                value={priorityFilter}
                onChange={(event) =>
                  handlePriorityChange(
                    event.target.value
                  )
                }
              >

                <option value="">
                  All Priorities
                </option>

                <option value="LOW">
                  LOW
                </option>

                <option value="MEDIUM">
                  MEDIUM
                </option>

                <option value="HIGH">
                  HIGH
                </option>

              </select>

            </div>


            {/* CLEAR FILTERS */}

            {(statusFilter ||
              priorityFilter) && (

              <div
                style={{
                  display: 'flex',
                  alignItems: 'end',
                }}
              >

                <button
                  className="secondary-button"
                  onClick={() => {

                    setStatusFilter('')

                    setPriorityFilter('')

                    setPage(0)

                  }}
                >
                  Clear Filters
                </button>

              </div>

            )}

          </div>

        </section>


        {/* =========================
            LOADING
        ========================= */}

        {loading && (

          <section className="panel">

            <div className="empty-state">

              <div className="empty-icon">
                ⏳
              </div>

              <h3>
                Loading tasks...
              </h3>

            </div>

          </section>

        )}


        {/* =========================
            ERROR
        ========================= */}

        {!loading &&
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
                  onClick={
                    loadTasks
                  }
                >
                  Try Again
                </button>

              </div>

            </section>

          )}


        {/* =========================
            EMPTY STATE
        ========================= */}

        {!loading &&
          !error &&
          tasks.length === 0 && (

            <section className="panel">

              <div className="empty-state">

                <div className="empty-icon">
                  ✓
                </div>

                <h3>
                  No tasks found
                </h3>

                <p>
                  No tasks match your current filters.
                </p>

              </div>

            </section>

          )}


        {/* =========================
            TASK LIST
        ========================= */}

        {!loading &&
          !error &&
          tasks.length > 0 && (

            <section className="panel">


              <div className="panel-header">

                <div>

                  <h2>
                    Tasks
                  </h2>

                  <p>
                    {taskPage?.totalElements ?? 0}
                    {' '}
                    task(s) found
                  </p>

                </div>

              </div>


              <div
                className="dashboard-tasks"
              >

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


                    {/* TASK INFO */}

                    <div
                      className="dashboard-task-info"
                    >

                      <h3>
                        {task.title}
                      </h3>


                      <p>

                        {task.description ||
                          'No description provided.'}

                      </p>


                      {/* ASSIGNEE */}

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


                    {/* TASK META */}

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        alignItems: 'flex-end',
                      }}
                    >


                      {/* STATUS */}

                      <span
                        className="task-status"
                      >
                        {task.status}
                      </span>


                      {/* PRIORITY */}

                      <span
                        className="task-priority"
                      >
                        {task.priority}
                      </span>


                      {/* DUE DATE */}

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

            </section>

          )}


        {/* =========================
            PAGINATION
        ========================= */}

        {!loading &&
          !error &&
          taskPage &&
          taskPage.totalPages > 1 && (

            <section
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '16px',
                marginTop: '24px',
              }}
            >


              {/* PREVIOUS */}

              <button
                className="secondary-button"
                disabled={
                  taskPage.first
                }
                onClick={() =>
                  setPage(
                    page - 1
                  )
                }
              >
                ← Previous
              </button>


              {/* PAGE INFO */}

              <span>

                Page{' '}

                {taskPage.number + 1}

                {' '}of{' '}

                {taskPage.totalPages}

              </span>


              {/* NEXT */}

              <button
                className="secondary-button"
                disabled={
                  taskPage.last
                }
                onClick={() =>
                  setPage(
                    page + 1
                  )
                }
              >
                Next →
              </button>

            </section>

          )}


      </main>

    </div>

  )

}

export default Tasks