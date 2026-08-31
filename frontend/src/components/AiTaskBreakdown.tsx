import {
  useState,
  type FormEvent,
} from 'react'

import {
  generateTaskBreakdown,
} from '../api/aiApi'


function AiTaskBreakdown() {

  // =========================
  // STATE
  // =========================

  const [
    taskDescription,
    setTaskDescription
  ] = useState('')

  const [
    subtasks,
    setSubtasks
  ] = useState<string[]>([])

  const [
    loading,
    setLoading
  ] = useState(false)

  const [
    error,
    setError
  ] = useState('')


  // =========================
  // GENERATE AI BREAKDOWN
  // =========================

  const handleGenerate =
    async (
      event:
        FormEvent<HTMLFormElement>
    ) => {

      event.preventDefault()

      setError('')

      setSubtasks([])


      if (
        taskDescription
          .trim() === ''
      ) {

        setError(
          'Please enter a task description.'
        )

        return
      }


      try {

        setLoading(true)


        const response =
          await generateTaskBreakdown({
            taskDescription:
              taskDescription.trim(),
          })


        setSubtasks(
          response.subtasks
        )


      } catch (error) {

        console.error(
          'AI TASK BREAKDOWN ERROR:',
          error
        )


        setError(
          'Failed to generate AI task breakdown. Please try again.'
        )

      } finally {

        setLoading(false)

      }

    }


  // =========================
  // RENDER
  // =========================

  return (

    <section className="panel">


      {/* =========================
          HEADER
      ========================= */}

      <div className="panel-header">

        <div>

          <p className="eyebrow">
            AI ASSISTANT
          </p>

          <h2>
            Break down your task
          </h2>

          <p>
            Describe a task and let AI generate
            smaller actionable subtasks.
          </p>

        </div>

      </div>


      {/* =========================
          FORM
      ========================= */}

      <form
        onSubmit={
          handleGenerate
        }
      >


        <div className="form-group">

          <label
            htmlFor="ai-task-description"
          >
            Task description
          </label>


          <textarea
            id="ai-task-description"
            value={
              taskDescription
            }
            onChange={
              (event) =>
                setTaskDescription(
                  event.target.value
                )
            }
            placeholder={
              'Example: Build a user authentication system with registration, login and JWT authentication.'
            }
            rows={6}
            disabled={loading}
          />

        </div>


        {/* ERROR */}

        {error && (

          <p
            className="login-error"
          >
            {error}
          </p>

        )}


        {/* BUTTON */}

        <button
          type="submit"
          className="primary-button"
          disabled={
            loading
          }
        >

          {loading
            ? 'Generating...'
            : '✦ Generate with AI'}

        </button>

      </form>


      {/* =========================
          AI RESULTS
      ========================= */}

      {subtasks.length > 0 && (

        <div
          style={{
            marginTop: '28px',
          }}
        >

          <h3>
            AI-generated subtasks
          </h3>


          <div
            className="dashboard-tasks"
            style={{
              marginTop: '16px',
            }}
          >

            {subtasks.map(
              (
                subtask,
                index
              ) => (

                <div
                  className="dashboard-task"
                  key={index}
                >

                  <div
                    className="dashboard-task-info"
                  >

                    <h3>

                      {index + 1}.
                      {' '}
                      {subtask}

                    </h3>

                  </div>

                </div>

              )
            )}

          </div>

        </div>

      )}

    </section>

  )

}


export default AiTaskBreakdown