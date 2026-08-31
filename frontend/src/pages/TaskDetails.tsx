import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import Navbar from '../components/Navbar'

import {
  getTaskById,
  updateTask,
  deleteTask,
  type Task,
  type UpdateTaskRequest,
} from '../api/tasksApi'
import {
  generateTaskBreakdown,
  type AiTaskBreakdownResponse
} from '../api/aiApi'
import TaskComments from '../components/TaskComments'


function TaskDetails() {

  const { taskId } = useParams()

  const navigate = useNavigate()

  // =========================
// AI BREAKDOWN STATE
// =========================

const [
  aiBreakdown,
  setAiBreakdown
] =
  useState<
    AiTaskBreakdownResponse | null
  >(null)


const [
  generatingAi,
  setGeneratingAi
] =
  useState(false)


const [
  aiError,
  setAiError
] =
  useState('')


  // =========================
  // TASK STATE
  // =========================

  const [task, setTask] =
    useState<Task | null>(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')


  // =========================
  // EDIT / DELETE STATE
  // =========================

  const [editing, setEditing] =
    useState(false)

  const [saving, setSaving] =
    useState(false)

  const [deleting, setDeleting] =
    useState(false)


  // =========================
  // FORM STATE
  // =========================

  const [title, setTitle] =
    useState('')

  const [description, setDescription] =
    useState('')

  const [status, setStatus] =
    useState('')

  const [priority, setPriority] =
    useState('')

  const [dueDate, setDueDate] =
    useState('')

  // =========================
// GENERATE AI BREAKDOWN
// =========================

const handleGenerateAiBreakdown =
  async () => {

    if (!task) {
      return
    }


    try {

      setGeneratingAi(true)

      setAiError('')


      const taskDescription =
        task.description &&
        task.description.trim() !== ''
          ? `
Title:
${task.title}

Description:
${task.description}
            `.trim()
          : task.title


      const response =
        await generateTaskBreakdown({

          taskDescription

        })


      setAiBreakdown(
        response
      )


    } catch (error) {

      console.error(
        'FAILED TO GENERATE AI BREAKDOWN:',
        error
      )


      setAiError(
        'Failed to generate AI task breakdown.'
      )

    } finally {

      setGeneratingAi(false)

    }

  }


  // =========================
  // LOAD TASK
  // =========================

  useEffect(() => {

    const loadTask = async () => {

      if (!taskId) {

        setError(
          'Task ID is missing'
        )

        setLoading(false)

        return
      }


      try {

        setLoading(true)

        setError('')


        const response =
          await getTaskById(
            Number(taskId)
          )


        console.log(
          'TASK DETAILS:',
          response
        )


        setTask(response)


      } catch (error) {

        console.error(
          'FAILED TO LOAD TASK:',
          error
        )

        setError(
          'Failed to load task.'
        )

      } finally {

        setLoading(false)

      }

    }


    loadTask()

  }, [taskId])


  // =========================
  // START EDITING
  // =========================

  const handleEdit = () => {

    if (!task) {
      return
    }


    setTitle(
      task.title
    )


    setDescription(
      task.description || ''
    )


    setStatus(
      task.status
    )


    setPriority(
      task.priority
    )


    setDueDate(
      task.dueDate || ''
    )


    setEditing(true)

  }


  // =========================
  // CANCEL EDITING
  // =========================

  const handleCancelEdit = () => {

    setEditing(false)

  }


  // =========================
  // SAVE TASK
  // =========================

  const handleSave = async () => {

    if (!task) {
      return
    }


    try {

      setSaving(true)

      setError('')


      const request: UpdateTaskRequest = {

        title: title,

        description: description,

        status: status,

        priority: priority,

        dueDate:
          dueDate === ''
            ? null
            : dueDate,


        // Preserve current assignee

        assigneeId:
          task.assignee
            ? task.assignee.id
            : null,

      }


      const updatedTask =
        await updateTask(
          task.id,
          request
        )


      setTask(
        updatedTask
      )


      setEditing(false)


    } catch (error) {

      console.error(
        'FAILED TO UPDATE TASK:',
        error
      )


      setError(
        'Failed to update task.'
      )

    } finally {

      setSaving(false)

    }

  }


  // =========================
  // DELETE TASK
  // =========================

  const handleDelete = async () => {

    if (!task) {
      return
    }


    const confirmed =
      window.confirm(
        `Delete "${task.title}"?`
      )


    if (!confirmed) {
      return
    }


    try {

      setDeleting(true)


      await deleteTask(
        task.id
      )


      navigate(
        '/tasks'
      )


    } catch (error) {

      console.error(
        'FAILED TO DELETE TASK:',
        error
      )


      setError(
        'Failed to delete task.'
      )

    } finally {

      setDeleting(false)

    }

  }


  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (

      <div className="app">

        <Navbar />

        <main className="main">

          <div className="empty-state">

            <h3>
              Loading task...
            </h3>

          </div>

        </main>

      </div>

    )

  }


  // =========================
  // ERROR
  // =========================

  if (error || !task) {

    return (

      <div className="app">

        <Navbar />

        <main className="main">

          <div className="empty-state">

            <h3>
              {error ||
                'Task not found'}
            </h3>


            <Link
              to="/tasks"
              className="secondary-button"
            >
              ← Back to Tasks
            </Link>

          </div>

        </main>

      </div>

    )

  }


  // =========================
  // PAGE
  // =========================

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
            BACK BUTTON
        ========================= */}

        <Link
          to="/tasks"
          className="secondary-button"
        >
          ← Back to Tasks
        </Link>


        {/* =========================
            PAGE HEADER
        ========================= */}

        <section className="welcome">

          <div>

            <p className="eyebrow">
              TASK DETAILS
            </p>


            <h1>

              {editing
                ? 'Editing Task'
                : task.title}

            </h1>


            <p className="subtitle">

              {editing
                ? 'Update the task information below.'
                : 'View task information and status.'}

            </p>

          </div>

        </section>


        {/* =========================
            TASK DETAILS PANEL
        ========================= */}

        <section className="panel">


          {/* =========================
              PANEL HEADER
          ========================= */}

          <div className="panel-header">


            <div>

              {editing ? (

                <input
                  type="text"
                  value={title}
                  onChange={(event) =>
                    setTitle(
                      event.target.value
                    )
                  }
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '20px',
                  }}
                />

              ) : (

                <h2>
                  {task.title}
                </h2>

              )}


              <p>
                Task #{task.id}
              </p>

            </div>


            <div
              style={{
                display: 'flex',
                gap: '12px',
              }}
            >

            <button
  className="primary-button"
  type="button"
  onClick={
    handleGenerateAiBreakdown
  }
  disabled={
    generatingAi ||
    saving ||
    deleting
  }
>
  {generatingAi
    ? 'Generating...'
    : '✨ Generate AI Breakdown'}
</button>


              {/* EDIT BUTTON */}

              <button
                className="secondary-button"
                type="button"
                onClick={
                  editing
                    ? handleCancelEdit
                    : handleEdit
                }
                disabled={saving}
              >

                {editing
                  ? 'Cancel'
                  : 'Edit Task'}

              </button>


              {/* DELETE BUTTON */}

              <button
                className="secondary-button"
                type="button"
                onClick={handleDelete}
                disabled={
                  deleting ||
                  saving
                }
              >

                {deleting
                  ? 'Deleting...'
                  : 'Delete'}

              </button>


            </div>

          </div>


          {/* =========================
              ERROR MESSAGE
          ========================= */}

          {error && (

            <p
              style={{
                marginBottom: '16px',
              }}
            >
              {error}
            </p>

          )}


          {/* =========================
              TASK DETAILS
          ========================= */}

          <div className="task-details">


            {/* =========================
                DESCRIPTION
            ========================= */}

            <div className="task-detail-item">

              <span className="stat-label">
                Description
              </span>


              {editing ? (

                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                  rows={5}
                  style={{
                    width: '100%',
                    marginTop: '8px',
                    padding: '12px',
                  }}
                />

              ) : (

                <p>

                  {task.description ||
                    'No description provided.'}

                </p>

              )}

            </div>


            {/* =========================
                STATUS
            ========================= */}

            <div className="task-detail-item">

              <span className="stat-label">
                Status
              </span>


              {editing ? (

                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target.value
                    )
                  }
                >

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

              ) : (

                <span className="task-status">
                  {task.status}
                </span>

              )}

            </div>


            {/* =========================
                PRIORITY
            ========================= */}

            <div className="task-detail-item">

              <span className="stat-label">
                Priority
              </span>


              {editing ? (

                <select
                  value={priority}
                  onChange={(event) =>
                    setPriority(
                      event.target.value
                    )
                  }
                >

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

              ) : (

                <span className="task-status">
                  {task.priority}
                </span>

              )}

            </div>


            {/* =========================
                DUE DATE
            ========================= */}

            <div className="task-detail-item">

              <span className="stat-label">
                Due Date
              </span>


              {editing ? (

                <input
                  type="date"
                  value={dueDate}
                  onChange={(event) =>
                    setDueDate(
                      event.target.value
                    )
                  }
                />

              ) : (

                <p>

                  {task.dueDate
                    ? new Date(
                        task.dueDate
                      ).toLocaleDateString()
                    : 'No due date'}

                </p>

              )}

            </div>


            {/* =========================
                ASSIGNEE
            ========================= */}

            <div className="task-detail-item">

              <span className="stat-label">
                Assignee
              </span>


              {task.assignee ? (

                <p>

                  {task.assignee.firstName}{' '}

                  {task.assignee.lastName}

                  <br />

                  {task.assignee.email}

                </p>

              ) : (

                <p>
                  Unassigned
                </p>

              )}

            </div>


          </div>


          {/* =========================
              SAVE BUTTONS
          ========================= */}

          {editing && (

            <div
              style={{
                marginTop: '24px',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
              }}
            >


              <button
                className="secondary-button"
                type="button"
                onClick={handleCancelEdit}
                disabled={saving}
              >
                Cancel
              </button>


              <button
                className="primary-button"
                type="button"
                onClick={handleSave}
                disabled={
                  saving ||
                  title.trim() === ''
                }
              >

                {saving
                  ? 'Saving...'
                  : 'Save Changes'}

              </button>


            </div>

          )}


        </section>

        {/* =========================
    AI TASK BREAKDOWN
========================= */}

<section className="panel">

  <div className="panel-header">

    <div>

      <p className="eyebrow">
        AI ASSISTANT
      </p>

      <h2>
        AI Task Breakdown
      </h2>

      <p>
        Generate smaller actionable steps
        for this task.
      </p>

    </div>

  </div>


  {/* AI ERROR */}

  {aiError && (

    <div className="empty-state">

      <h3>
        AI request failed
      </h3>

      <p>
        {aiError}
      </p>

    </div>

  )}


  {/* NO AI RESULT */}

  {!aiBreakdown &&
    !generatingAi &&
    !aiError && (

      <div className="empty-state">

        <div className="empty-icon">
          ✨
        </div>

        <h3>
          Need help breaking this down?
        </h3>

        <p>
          DevFlow AI can turn this task
          into smaller actionable steps.
        </p>

        <button
          className="primary-button"
          type="button"
          onClick={
            handleGenerateAiBreakdown
          }
        >
          ✨ Generate AI Breakdown
        </button>

      </div>

    )}


  {/* GENERATING */}

  {generatingAi && (

    <div className="empty-state">

      <div className="empty-icon">
        ✨
      </div>

      <h3>
        DevFlow AI is thinking...
      </h3>

      <p>
        Generating actionable subtasks.
      </p>

    </div>

  )}


  {/* AI RESULT */}

  {aiBreakdown &&
    !generatingAi && (

      <div className="dashboard-tasks">

        {aiBreakdown.subtasks.map(
          (
            subtask,
            index
          ) => (

            <div
              className="dashboard-task"
              key={index}
            >

              <div className="dashboard-task-info">

                <h3>

                  Step {index + 1}

                </h3>

                <p>

                  {subtask}

                </p>

              </div>

            </div>

          )
        )}

      </div>

    )}

</section>


        {/* =========================
            TASK COMMENTS
        ========================= */}

        <TaskComments
          taskId={task.id}
        />


      </main>

    </div>

  )

}


export default TaskDetails