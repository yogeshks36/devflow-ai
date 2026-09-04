import {
  useState,
  type FormEvent,
} from 'react'

import {
  generateTaskBreakdown,
} from '../api/aiApi'

import {
  createTask,
} from '../api/tasksApi'


// =========================
// GENERATED SUBTASK TYPE
// =========================

interface GeneratedSubtask {

  text:
    string

  selected:
    boolean

}


function AiTaskBreakdown() {


  // =========================
  // STATE
  // =========================

  const [
    projectId,
    setProjectId,
  ] = useState('')


  const [
    taskDescription,
    setTaskDescription,
  ] = useState('')


  const [
    subtasks,
    setSubtasks,
  ] = useState<
    GeneratedSubtask[]
  >([])


  const [
    loading,
    setLoading,
  ] = useState(false)


  const [
    saving,
    setSaving,
  ] = useState(false)


  const [
    error,
    setError,
  ] = useState('')


  const [
    successMessage,
    setSuccessMessage,
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

      setSuccessMessage('')

      setSubtasks([])


      // =========================
      // VALIDATION
      // =========================

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


        // =========================
        // CONVERT AI STRINGS
        // TO SELECTABLE TASKS
        // =========================

        setSubtasks(

          response.subtasks.map(

            (
              subtask
            ) => ({

              text:
                subtask,

              selected:
                true,

            })

          )

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
  // TOGGLE SINGLE TASK
  // =========================

  const handleToggleTask =
    (
      index:
        number
    ) => {

      setSubtasks(

        subtasks.map(

          (
            subtask,
            taskIndex
          ) => {

            if (
              taskIndex === index
            ) {

              return {

                ...subtask,

                selected:
                  !subtask.selected,

              }

            }


            return subtask

          }

        )

      )

    }


  // =========================
  // SELECT / DESELECT ALL
  // =========================

  const handleToggleAll =
    () => {

      const allSelected =
        subtasks.every(

          (
            subtask
          ) =>
            subtask.selected
        )


      setSubtasks(

        subtasks.map(

          (
            subtask
          ) => ({

            ...subtask,

            selected:
              !allSelected,

          })

        )

      )

    }


  // =========================
  // SELECTED TASKS
  // =========================

  const selectedSubtasks =
    subtasks.filter(

      (
        subtask
      ) =>
        subtask.selected

    )


  // =========================
  // SAVE SELECTED AI SUBTASKS
  // =========================

  const handleSaveTasks =
    async () => {


      setError('')

      setSuccessMessage('')


      // =========================
      // VALIDATION
      // =========================

      if (
        projectId.trim() === ''
      ) {

        setError(
          'Please enter a project ID before saving tasks.'
        )

        return

      }


      const numericProjectId =
        Number(projectId)


      if (
        Number.isNaN(
          numericProjectId
        )
      ) {

        setError(
          'Project ID must be a valid number.'
        )

        return

      }


      if (
        selectedSubtasks.length === 0
      ) {

        setError(
          'Please select at least one task to save.'
        )

        return

      }


      try {

        setSaving(true)


        // =========================
        // CREATE SELECTED TASKS
        // =========================

        await Promise.all(

          selectedSubtasks.map(

            (
              subtask
            ) =>

              createTask(

                numericProjectId,

                {

                  title:
                    subtask.text,

                  description:
                    `AI-generated subtask for: ${taskDescription}`,

                  status:
                    'TODO',

                  priority:
                    'MEDIUM',

                  dueDate:
                    null,

                  assigneeId:
                    null,

                }

              )

          )

        )


        setSuccessMessage(

          `${selectedSubtasks.length} selected task(s) successfully added to project ${numericProjectId}.`

        )


      } catch (error: any) {

        console.error(
          'SAVE AI TASKS ERROR:',
          error
        )


        console.error(
          'STATUS:',
          error.response?.status
        )


        console.error(
          'URL:',
          error.config?.baseURL +
          error.config?.url
        )


        console.error(
          'RESPONSE:',
          error.response?.data
        )


        setError(

          `Failed to save AI-generated tasks. Status: ${
            error.response?.status ??
            'Unknown'
          }`

        )


      } finally {

        setSaving(false)

      }

    }


  // =========================
  // CHECK IF ALL SELECTED
  // =========================

  const allSelected =
    subtasks.length > 0 &&
    subtasks.every(

      (
        subtask
      ) =>
        subtask.selected

    )


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
            placeholder="Example: 1"
            disabled={
              loading ||
              saving
            }
          />

        </div>


        {/* TASK DESCRIPTION */}

        <div
          className="form-group"
        >

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
            disabled={
              loading ||
              saving
            }
          />

        </div>


        {/* ERROR */}

        {
          error && (

            <p
              className="login-error"
            >
              {error}
            </p>

          )
        }


        {/* SUCCESS */}

        {
          successMessage && (

            <p
              style={{
                marginTop:
                  '12px',

                fontWeight:
                  '600',
              }}
            >

              {successMessage}

            </p>

          )
        }


        {/* GENERATE BUTTON */}

        <button
          type="submit"
          className="primary-button"
          disabled={
            loading ||
            saving
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
        subtasks.length > 0 && (

          <div
            style={{
              marginTop:
                '28px',
            }}
          >


            {/* HEADER */}

            <div
              style={{
                display:
                  'flex',

                justifyContent:
                  'space-between',

                alignItems:
                  'center',

                marginBottom:
                  '16px',
              }}
            >

              <div>

                <h3>
                  AI-generated subtasks
                </h3>


                <p
                  style={{
                    marginTop:
                      '6px',
                  }}
                >

                  {
                    selectedSubtasks.length
                  }

                  {' '}

                  of

                  {' '}

                  {
                    subtasks.length
                  }

                  {' '}

                  selected

                </p>

              </div>


              {/* SELECT ALL */}

              <button
                type="button"
                onClick={
                  handleToggleAll
                }
                disabled={
                  saving ||
                  loading
                }
              >

                {
                  allSelected

                    ? 'Deselect All'

                    : 'Select All'

                }

              </button>

            </div>


            {/* TASK LIST */}

            <div
              className="dashboard-tasks"
            >

              {
                subtasks.map(

                  (
                    subtask,
                    index
                  ) => (

                    <div
                      className="dashboard-task"
                      key={index}
                    >

                      <input
                        type="checkbox"
                        checked={
                          subtask.selected
                        }
                        onChange={
                          () =>
                            handleToggleTask(
                              index
                            )
                        }
                        disabled={
                          saving ||
                          loading
                        }
                        style={{
                          marginRight:
                            '12px',

                          cursor:
                            'pointer',
                        }}
                      />


                      <div
                        className="dashboard-task-info"
                      >

                        <h3>

                          {index + 1}.

                          {' '}

                          {subtask.text}

                        </h3>

                      </div>

                    </div>

                  )

                )
              }

            </div>


            {/* =========================
                SAVE BUTTON
            ========================= */}

            <button
              type="button"
              className="primary-button"
              onClick={
                handleSaveTasks
              }
              disabled={
                saving ||
                loading ||
                selectedSubtasks.length === 0
              }
              style={{
                marginTop:
                  '20px',
              }}
            >

              {
                saving

                  ? 'Saving tasks...'

                  : `Save ${selectedSubtasks.length} selected task(s)`

              }

            </button>

          </div>

        )
      }

    </section>

  )

}


export default AiTaskBreakdown