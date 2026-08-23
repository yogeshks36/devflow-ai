import { useState } from 'react'
import type { FormEvent } from 'react'
import api from '../api/axios'

interface CreateProjectProps {
  onClose: () => void
  onCreated: () => void
}

function CreateProject({
  onClose,
  onCreated,
}: CreateProjectProps) {

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {

    event.preventDefault()

    setError('')

    if (!name.trim()) {
      setError('Project name is required')
      return
    }

    try {

      setLoading(true)

      await api.post('/projects', {
        name: name.trim(),
        description: description.trim(),
      })

      onCreated()

      onClose()

    } catch (error) {

      console.error(
        'CREATE PROJECT ERROR:',
        error
      )

      setError(
        'Failed to create project'
      )

    } finally {

      setLoading(false)

    }
  }

  return (
    <div className="modal-overlay">

      <div className="modal">

        <div className="modal-header">

          <div>
            <h2>
              Create Project
            </h2>

            <p>
              Start a new development project.
            </p>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
          >
            ×
          </button>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label htmlFor="project-name">
              Project name
            </label>

            <input
              id="project-name"
              type="text"
              placeholder="e.g. DevFlow AI"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
            />

          </div>

          <div className="form-group">

            <label htmlFor="project-description">
              Description
            </label>

            <textarea
              id="project-description"
              placeholder="Describe your project..."
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              rows={4}
            />

          </div>

          {error && (
            <p className="login-error">
              {error}
            </p>
          )}

          <div className="modal-actions">

            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
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
                : 'Create Project'}
            </button>

          </div>

        </form>

      </div>

    </div>
  )
}

export default CreateProject