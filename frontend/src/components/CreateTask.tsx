import { useState } from 'react'
import type { FormEvent } from 'react'

import {
  createTask,
  type CreateTaskRequest,
} from '../api/tasksApi'

interface CreateTaskProps {
  projectId: number
  onClose: () => void
  onCreated: () => void
}

function CreateTask({
  projectId,
  onClose,
  onCreated,
}: CreateTaskProps) {

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const [status, setStatus] =
    useState('TODO')

  const [priority, setPriority] =
    useState('MEDIUM')

  const [dueDate, setDueDate] =
    useState('')

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState('')


  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {

    event.preventDefault()

    setError('')

    if (!title.trim()) {
      setError('Task title is required')
      return
    }

    try {

      setLoading(true)

      const data: CreateTaskRequest = {
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        dueDate: dueDate
          ? `${dueDate}T00:00:00`
          : null,
      }

      console.log(
        'CREATING TASK:',
        data
      )

      const response = await createTask(
        projectId,
        data
      )

      console.log(
        'TASK CREATED:',
        response
      )

      onCreated()

    } catch (error) {

      console.error(
        'CREATE TASK ERROR:',
        error
      )

      setError(
        'Failed to create task'
      )

    } finally {

      setLoading(false)

    }
  }


  return (

    <div className="modal-overlay">

      <div className="modal-card">

        {/* HEADER */}

        <div className="modal-header">

          <div>

            <p className="eyebrow">
              PROJECT TASK
            </p>

            <h2>
              Create Task
            </h2>

          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
          >
            ×
          </button>

        </div>


        {/* FORM */}

        <form
          className="modal-form"
          onSubmit={handleSubmit}
        >

          {/* TITLE */}

          <div className="form-group">

            <label htmlFor="task-title">
              Title
            </label>

            <input
              id="task-title"
              type="text"
              placeholder="Enter task title"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
            />

          </div>


          {/* DESCRIPTION */}

          <div className="form-group">

            <label htmlFor="task-description">
              Description
            </label>

            <textarea
              id="task-description"
              placeholder="Describe the task..."
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              rows={4}
            />

          </div>


          {/* STATUS */}

          <div className="form-row">

            <div className="form-group">

              <label htmlFor="task-status">
                Status
              </label>

              <select
                id="task-status"
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value)
                }
              >

                <option value="TODO">
                  To Do
                </option>

                <option value="IN_PROGRESS">
                  In Progress
                </option>

                <option value="DONE">
                  Done
                </option>

              </select>

            </div>


            {/* PRIORITY */}

            <div className="form-group">

              <label htmlFor="task-priority">
                Priority
              </label>

              <select
                id="task-priority"
                value={priority}
                onChange={(event) =>
                  setPriority(event.target.value)
                }
              >

                <option value="LOW">
                  Low
                </option>

                <option value="MEDIUM">
                  Medium
                </option>

                <option value="HIGH">
                  High
                </option>

              </select>

            </div>

          </div>


          {/* DUE DATE */}

          <div className="form-group">

            <label htmlFor="task-due-date">
              Due Date
            </label>

            <input
              id="task-due-date"
              type="date"
              value={dueDate}
              onChange={(event) =>
                setDueDate(event.target.value)
              }
            />

          </div>


          {/* ERROR */}

          {error && (

            <p className="login-error">
              {error}
            </p>

          )}


          {/* ACTIONS */}

          <div className="modal-actions">

            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading
                ? 'Creating...'
                : 'Create Task'}
            </button>

          </div>

        </form>

      </div>

    </div>
  )
}

export default CreateTask