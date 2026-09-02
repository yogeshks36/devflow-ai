import {
  useState,
  type FormEvent,
} from 'react'

import {
  generateTaskBreakdown,
  type AiTaskStep,
} from '../api/aiApi'


function AiTaskBreakdown() {


  // =========================
  // STATE
  // =========================

  const [
    projectId,
    setProjectId,
  ] = useState('')


  const [
    title,
    setTitle,
  ] = useState('')


  const [
    description,
    setDescription,
  ] = useState('')


  const [
    steps,
    setSteps,
  ] = useState<
    AiTaskStep[]
  >([])


  const [
    loading,
    setLoading,
  ] = useState(false)


  const [
    error,
    setError,
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

      setSteps([])


      // =========================
      // VALIDATION
      // =========================

      if (
        projectId.trim() === ''
      ) {

        setError(
          'Please enter a project ID.'
        )

        return

      }


      if (
        title.trim() === ''
      ) {

        setError(
          'Please enter a task title.'
        )

        return

      }


      if (
        description.trim() === ''
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

            projectId:
              Number(projectId),

            title:
              title.trim(),

            description:
              description.trim(),

          })


        setSteps(
          response.steps
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

    <section
      className="panel"
    >


      {/* =========================
          HEADER
      ========================= */}

      <div
        className="panel-header"
      >

        <div>

          <p
            className="eyebrow"
          >
            AI ASSISTANT
          </p>


          <h2>
            Break down your task
          </h2>


          <p>
            Describe a task and let AI generate
            smaller actionable steps.
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


        {/* PROJECT ID */}

        <div
          className="form-group"
        >

          <label
            htmlFor="project-id"
          >
            Project ID
          </label>


          <input
            id="project-id"
            type="number"
            value={
              projectId
            }
            onChange={
              (event) =>
                setProjectId(
                  event.target.value
                )
            }
            placeholder="Example: 4"
            disabled={
              loading
            }
          />

        </div>


        {/* TASK TITLE */}

        <div
          className="form-group"
        >

          <label
            htmlFor="task-title"
          >
            Task title
          </label>


          <input
            id="task-title"
            type="text"
            value={
              title
            }
            onChange={
              (event) =>
                setTitle(
                  event.target.value
                )
            }
            placeholder="Example: Build login page"
            disabled={
              loading
            }
          />

        </div>


        {/* TASK DESCRIPTION */}

        <div
          className="form-group"
        >

          <label
            htmlFor="task-description"
          >
            Task description
          </label>


          <textarea
            id="task-description"
            value={
              description
            }
            onChange={
              (event) =>
                setDescription(
                  event.target.value
                )
            }
            placeholder={
              'Example: Create an email/password login page with JWT authentication.'
            }
            rows={6}
            disabled={
              loading
            }
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

          {
            loading
              ? 'Generating...'
              : '✦ Generate with AI'
          }

        </button>

      </form>


      {/* =========================
          AI RESULTS
      ========================= */}

      {
        steps.length > 0 && (

          <div
            style={{
              marginTop: '28px',
            }}
          >

            <h3>
              AI-generated steps
            </h3>


            <div
              className="dashboard-tasks"
              style={{
                marginTop: '16px',
              }}
            >

              {
                steps.map(
                  (
                    step,
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
                          {step.title}

                        </h3>


                        <p>

                          {
                            step.description
                          }

                        </p>

                      </div>

                    </div>

                  )
                )
              }

            </div>

          </div>

        )
      }

    </section>

  )

}


export default AiTaskBreakdown