import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import {
  getTaskById,
  updateTask,
  deleteTask,
  type Task,
  type UpdateTaskRequest
} from '../api/tasksApi'

import {
  getTaskComments,
  createComment,
  updateComment,
  deleteComment,
  type Comment
} from '../api/commentsApi'


function TaskDetails() {

  const { taskId } = useParams()

  const navigate = useNavigate()

  const { userEmail } = useAuth()

  const isCommentOwner = (
  comment: Comment
) => {

  if (!userEmail) {
    return false
  }

  return (
    comment.userEmail.toLowerCase() ===
    userEmail.toLowerCase()
  )
}


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
  // COMMENTS STATE
  // =========================

  const [comments, setComments] =
    useState<Comment[]>([])

  const [loadingComments, setLoadingComments] =
    useState(false)

  const [commentError, setCommentError] =
    useState('')

  const [newComment, setNewComment] =
    useState('')

  const [creatingComment, setCreatingComment] =
    useState(false)


  // =========================
  // COMMENT EDIT STATE
  // =========================

  const [editingCommentId, setEditingCommentId] =
    useState<number | null>(null)

  const [editingCommentContent, setEditingCommentContent] =
    useState('')

  const [savingComment, setSavingComment] =
    useState(false)

  const [deletingCommentId, setDeletingCommentId] =
    useState<number | null>(null)


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
  // LOAD COMMENTS
  // =========================

  const loadComments = async () => {

    if (!taskId) {
      return
    }


    try {

      setLoadingComments(true)

      setCommentError('')


      const response =
        await getTaskComments(
          Number(taskId),
          0,
          50
        )


      setComments(
        response.content
      )


    } catch (error) {

      console.error(
        'FAILED TO LOAD COMMENTS:',
        error
      )

      setCommentError(
        'Failed to load comments.'
      )

    } finally {

      setLoadingComments(false)

    }

  }


  // =========================
  // INITIAL COMMENTS LOAD
  // =========================

  useEffect(() => {

    loadComments()

  }, [taskId])


  // =========================
  // START EDITING TASK
  // =========================

  const handleEdit = () => {

    if (!task) {
      return
    }


    setTitle(task.title)

    setDescription(
      task.description || ''
    )

    setStatus(task.status)

    setPriority(task.priority)

    setDueDate(
      task.dueDate || ''
    )

    setEditing(true)

  }


  // =========================
  // CANCEL TASK EDIT
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

        assigneeId:
          task.assignee
            ? task.assignee.id
            : null

      }


      const updatedTask =
        await updateTask(
          task.id,
          request
        )


      setTask(updatedTask)

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


      navigate('/tasks')


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
  // CREATE COMMENT
  // =========================

  const handleCreateComment = async () => {

    if (!taskId) {
      return
    }


    if (
      newComment.trim() === ''
    ) {
      return
    }


    try {

      setCreatingComment(true)

      setCommentError('')


      const createdComment =
        await createComment(
          Number(taskId),
          {
            content:
              newComment.trim()
          }
        )


      setComments(
        (previousComments) => [
          ...previousComments,
          createdComment
        ]
      )


      setNewComment('')


    } catch (error) {

      console.error(
        'FAILED TO CREATE COMMENT:',
        error
      )

      setCommentError(
        'Failed to create comment.'
      )

    } finally {

      setCreatingComment(false)

    }

  }


  // =========================
  // START COMMENT EDIT
  // =========================

  const handleStartEditComment = (
    comment: Comment
  ) => {

    setEditingCommentId(
      comment.id
    )

    setEditingCommentContent(
      comment.content
    )

  }


  // =========================
  // CANCEL COMMENT EDIT
  // =========================

  const handleCancelEditComment = () => {

    setEditingCommentId(null)

    setEditingCommentContent('')

  }


  // =========================
  // SAVE COMMENT
  // =========================

  const handleSaveComment = async (
    commentId: number
  ) => {

    if (
      editingCommentContent.trim() === ''
    ) {
      return
    }


    try {

      setSavingComment(true)

      setCommentError('')


      const updatedComment =
        await updateComment(
          commentId,
          {
            content:
              editingCommentContent.trim()
          }
        )


      setComments(
        (previousComments) =>
          previousComments.map(
            (comment) =>

              comment.id === commentId
                ? updatedComment
                : comment

          )
      )


      setEditingCommentId(null)

      setEditingCommentContent('')


    } catch (error) {

      console.error(
        'FAILED TO UPDATE COMMENT:',
        error
      )

      setCommentError(
        'Failed to update comment.'
      )

    } finally {

      setSavingComment(false)

    }

  }


  // =========================
  // DELETE COMMENT
  // =========================

  const handleDeleteComment = async (
    commentId: number
  ) => {

    const confirmed =
      window.confirm(
        'Delete this comment?'
      )


    if (!confirmed) {
      return
    }


    try {

      setDeletingCommentId(
        commentId
      )

      setCommentError('')


      await deleteComment(
        commentId
      )


      setComments(
        (previousComments) =>
          previousComments.filter(
            (comment) =>
              comment.id !== commentId
          )
      )


    } catch (error) {

      console.error(
        'FAILED TO DELETE COMMENT:',
        error
      )

      setCommentError(
        'Failed to delete comment.'
      )

    } finally {

      setDeletingCommentId(null)

    }

  }


  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (

      <div className="app">

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


      <Navbar />


      <main className="main">


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
                : 'View task information and collaborate with your team.'}

            </p>

          </div>

        </section>


        {/* =========================
            TASK DETAILS
        ========================= */}

        <section className="panel">


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
                    fontSize: '20px'
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
                gap: '12px'
              }}
            >


              <button
                className="secondary-button"
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


              <button
                className="secondary-button"
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


          {error && (

            <p
              style={{
                marginBottom: '16px'
              }}
            >
              {error}
            </p>

          )}


          <div className="task-details">


            {/* DESCRIPTION */}

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
                    padding: '12px'
                  }}
                />

              ) : (

                <p>

                  {task.description ||
                    'No description provided.'}

                </p>

              )}

            </div>


            {/* STATUS */}

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


            {/* PRIORITY */}

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


            {/* DUE DATE */}

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


            {/* ASSIGNEE */}

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


          {editing && (

            <div
              style={{
                marginTop: '24px',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px'
              }}
            >


              <button
                className="secondary-button"
                onClick={handleCancelEdit}
                disabled={saving}
              >
                Cancel
              </button>


              <button
                className="primary-button"
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
            COMMENTS
        ========================= */}

        <section
          className="panel"
          style={{
            marginTop: '24px'
          }}
        >


          <div className="panel-header">

            <div>

              <h2>
                Comments
              </h2>

              <p>
                Collaborate and discuss this task.
              </p>

            </div>


            <button
              className="secondary-button"
              onClick={loadComments}
              disabled={loadingComments}
            >
              {loadingComments
                ? 'Loading...'
                : 'Refresh'}
            </button>

          </div>


          {/* COMMENT ERROR */}

          {commentError && (

            <p
              style={{
                marginBottom: '16px'
              }}
            >
              {commentError}
            </p>

          )}


          {/* =========================
              CREATE COMMENT
          ========================= */}

          <div
            style={{
              marginBottom: '24px'
            }}
          >


            <textarea
              value={newComment}
              onChange={(event) =>
                setNewComment(
                  event.target.value
                )
              }
              rows={4}
              placeholder="Write a comment..."
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '12px'
              }}
            />


            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end'
              }}
            >

              <button
                className="primary-button"
                onClick={handleCreateComment}
                disabled={
                  creatingComment ||
                  newComment.trim() === ''
                }
              >

                {creatingComment
                  ? 'Posting...'
                  : 'Post Comment'}

              </button>

            </div>


          </div>


          {/* =========================
              COMMENTS LIST
          ========================= */}

          {loadingComments ? (

            <div className="empty-state">

              <h3>
                Loading comments...
              </h3>

            </div>

          ) : comments.length === 0 ? (

            <div className="empty-state">

              <div className="empty-icon">
                💬
              </div>

              <h3>
                No comments yet
              </h3>

              <p>
                Start the conversation by
                adding the first comment.
              </p>

            </div>

          ) : (

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}
            >

              {comments.map(
                (comment) => (

                  <div
                    key={comment.id}
                    className="task-detail-item"
                    style={{
                      padding: '16px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  >


                    {/* COMMENT HEADER */}

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '16px',
                        marginBottom: '12px'
                      }}
                    >


                      <div>

                        <strong>

                          {comment.userFirstName}{' '}

                          {comment.userLastName}

                        </strong>


                        <p
                          style={{
                            margin: '4px 0 0'
                          }}
                        >

                          {comment.userEmail}

                        </p>

                      </div>


                      <small>

                        {comment.createdAt
                          ? new Date(
                              comment.createdAt
                            ).toLocaleString()
                          : ''}

                      </small>


                    </div>


                    {/* COMMENT CONTENT */}

                    {editingCommentId ===
                    comment.id ? (

                      <textarea
                        value={
                          editingCommentContent
                        }
                        onChange={(event) =>
                          setEditingCommentContent(
                            event.target.value
                          )
                        }
                        rows={4}
                        style={{
                          width: '100%',
                          padding: '12px'
                        }}
                      />

                    ) : (

                      <p>

                        {comment.content}

                      </p>

                    )}


                    {/* COMMENT ACTIONS */}

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '12px',
                        marginTop: '12px'
                      }}
                    >


                      {editingCommentId ===
                      comment.id ? (

                        <>

                          <button
                            className="secondary-button"
                            onClick={
                              handleCancelEditComment
                            }
                            disabled={
                              savingComment
                            }
                          >
                            Cancel
                          </button>


                          <button
                            className="primary-button"
                            onClick={() =>
                              handleSaveComment(
                                comment.id
                              )
                            }
                            disabled={
                              savingComment ||
                              editingCommentContent
                                .trim() === ''
                            }
                          >

                            {savingComment
                              ? 'Saving...'
                              : 'Save'}

                          </button>

                        </>

                      ) : (

                        <>

                          <button
                            className="secondary-button"
                            onClick={() =>
                              handleStartEditComment(
                                comment
                              )
                            }
                          >
                            Edit
                          </button>


                          <button
                            className="secondary-button"
                            onClick={() =>
                              handleDeleteComment(
                                comment.id
                              )
                            }
                            disabled={
                              deletingCommentId ===
                              comment.id
                            }
                          >

                            {deletingCommentId ===
                            comment.id
                              ? 'Deleting...'
                              : 'Delete'}

                          </button>

                        </>

                      )}


                    </div>


                  </div>

                )
              )}

            </div>

          )}


        </section>


      </main>

    </div>

  )

}


export default TaskDetails