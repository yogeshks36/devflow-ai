import {
  useEffect,
  useState,
} from 'react'

import {
  getTaskComments,
  createComment,
  updateComment,
  deleteComment,
  type Comment,
} from '../api/commentsApi'

import {
  useAuth,
} from '../context/AuthContext'


interface TaskCommentsProps {

  taskId: number

}


function TaskComments({
  taskId,
}: TaskCommentsProps) {


  // =========================
  // AUTH
  // =========================

  const {
    userEmail,
  } = useAuth()


  // =========================
  // COMMENTS STATE
  // =========================

  const [comments, setComments] =
    useState<Comment[]>([])


  const [loading, setLoading] =
    useState(true)


  const [error, setError] =
    useState('')


  // =========================
  // CREATE COMMENT STATE
  // =========================

  const [newComment, setNewComment] =
    useState('')


  const [creating, setCreating] =
    useState(false)


  // =========================
  // EDIT COMMENT STATE
  // =========================

  const [editingCommentId, setEditingCommentId] =
    useState<number | null>(null)


  const [editingContent, setEditingContent] =
    useState('')


  const [savingEdit, setSavingEdit] =
    useState(false)


  // =========================
  // DELETE STATE
  // =========================

  const [deletingCommentId, setDeletingCommentId] =
    useState<number | null>(null)


  // =========================
  // LOAD COMMENTS
  // =========================

  const loadComments = async () => {

    try {

      setLoading(true)

      setError('')


      const response =
        await getTaskComments(
          taskId,
          0,
          20
        )


      console.log(
        'TASK COMMENTS:',
        response
      )


      setComments(
        response.content
      )


    } catch (error) {

      console.error(
        'FAILED TO LOAD COMMENTS:',
        error
      )


      setError(
        'Failed to load comments.'
      )


    } finally {

      setLoading(false)

    }

  }


  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {

    loadComments()

  }, [taskId])


  // =========================
  // CREATE COMMENT
  // =========================

  const handleCreateComment =
    async () => {

      if (
        newComment.trim() === ''
      ) {
        return
      }


      try {

        setCreating(true)

        setError('')


        const createdComment =
          await createComment(
            taskId,
            {
              content:
                newComment.trim(),
            }
          )


        setComments(
          (currentComments) => [

            createdComment,

            ...currentComments,

          ]
        )


        setNewComment('')


      } catch (error) {

        console.error(
          'FAILED TO CREATE COMMENT:',
          error
        )


        setError(
          'Failed to create comment.'
        )


      } finally {

        setCreating(false)

      }

    }


  // =========================
  // START EDITING
  // =========================

  const handleStartEdit =
    (comment: Comment) => {

      setEditingCommentId(
        comment.id
      )


      setEditingContent(
        comment.content
      )

    }


  // =========================
  // CANCEL EDIT
  // =========================

  const handleCancelEdit =
    () => {

      setEditingCommentId(
        null
      )


      setEditingContent('')

    }


  // =========================
  // SAVE EDIT
  // =========================

  const handleSaveEdit =
    async (
      commentId: number
    ) => {

      if (
        editingContent.trim() === ''
      ) {
        return
      }


      try {

        setSavingEdit(true)

        setError('')


        const updatedComment =
          await updateComment(
            commentId,
            {
              content:
                editingContent.trim(),
            }
          )


        setComments(
          (currentComments) =>

            currentComments.map(
              (comment) =>

                comment.id ===
                commentId

                  ? updatedComment

                  : comment
            )
        )


        setEditingCommentId(
          null
        )


        setEditingContent('')


      } catch (error) {

        console.error(
          'FAILED TO UPDATE COMMENT:',
          error
        )


        setError(
          'Failed to update comment.'
        )


      } finally {

        setSavingEdit(false)

      }

    }


  // =========================
  // DELETE COMMENT
  // =========================

  const handleDeleteComment =
    async (
      comment: Comment
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
          comment.id
        )


        setError('')


        await deleteComment(
          comment.id
        )


        setComments(
          (currentComments) =>

            currentComments.filter(
              (currentComment) =>

                currentComment.id !==
                comment.id
            )
        )


      } catch (error) {

        console.error(
          'FAILED TO DELETE COMMENT:',
          error
        )


        setError(
          'Failed to delete comment.'
        )


      } finally {

        setDeletingCommentId(
          null
        )

      }

    }


  // =========================
  // FORMAT DATE
  // =========================

  const formatDate =
    (
      date: string
    ) => {

      return new Date(
        date
      ).toLocaleString()

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

          <h2>
            Comments
          </h2>

          <p>
            Discuss this task with your
            project members.
          </p>

        </div>

      </div>


      {/* =========================
          ERROR
      ========================= */}

      {error && (

        <p
          className="login-error"
          style={{
            marginBottom: '16px',
          }}
        >
          {error}
        </p>

      )}


      {/* =========================
          ADD COMMENT
      ========================= */}

      <div
        className="comment-form"
        style={{
          marginBottom: '24px',
        }}
      >

        <textarea
          value={newComment}
          onChange={(event) =>
            setNewComment(
              event.target.value
            )
          }
          placeholder="Write a comment..."
          rows={4}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '12px',
          }}
        />


        <div
          style={{
            display: 'flex',
            justifyContent:
              'flex-end',
          }}
        >

          <button
            className="primary-button"
            type="button"
            onClick={
              handleCreateComment
            }
            disabled={
              creating ||
              newComment.trim() === ''
            }
          >

            {creating
              ? 'Posting...'
              : 'Post Comment'}

          </button>

        </div>

      </div>


      {/* =========================
          LOADING
      ========================= */}

      {loading && (

        <div className="empty-state">

          <h3>
            Loading comments...
          </h3>

        </div>

      )}


      {/* =========================
          EMPTY COMMENTS
      ========================= */}

      {!loading &&
        comments.length === 0 && (

          <div className="empty-state">

            <div className="empty-icon">
              💬
            </div>

            <h3>
              No comments yet
            </h3>

            <p>
              Start the discussion by
              adding the first comment.
            </p>

          </div>

        )}


      {/* =========================
          COMMENTS
      ========================= */}

      {!loading &&
        comments.length > 0 && (

          <div
            className="comments-list"
          >

            {comments.map(
              (comment) => {

                const isMyComment =
                  userEmail ===
                  comment.userEmail


                const isEditing =
                  editingCommentId ===
                  comment.id


                return (

                  <div
                    key={comment.id}
                    className="comment-item"
                    style={{
                      padding: '18px',
                      marginBottom: '12px',
                      border:
                        '1px solid #e5e7eb',
                      borderRadius:
                        '10px',
                    }}
                  >


                    {/* =========================
                        COMMENT HEADER
                    ========================= */}

                    <div
                      style={{
                        display: 'flex',
                        justifyContent:
                          'space-between',
                        gap: '16px',
                        marginBottom:
                          '12px',
                      }}
                    >

                      <div>

                        <strong>

                          {
                            comment.userFirstName
                          }{' '}

                          {
                            comment.userLastName
                          }

                        </strong>


                        <p
                          className="stat-label"
                          style={{
                            marginTop:
                              '4px',
                          }}
                        >

                          {
                            comment.userEmail
                          }

                        </p>

                      </div>


                      <div
                        style={{
                          textAlign:
                            'right',
                        }}
                      >

                        <span
                          className="stat-label"
                        >

                          {
                            formatDate(
                              comment.createdAt
                            )
                          }

                        </span>


                        {comment.updatedAt && (

                          <p
                            className="stat-label"
                            style={{
                              marginTop:
                                '4px',
                            }}
                          >
                            Edited
                          </p>

                        )}

                      </div>

                    </div>


                    {/* =========================
                        CONTENT
                    ========================= */}

                    {isEditing ? (

                      <textarea
                        value={
                          editingContent
                        }
                        onChange={(
                          event
                        ) =>
                          setEditingContent(
                            event.target
                              .value
                          )
                        }
                        rows={4}
                        style={{
                          width: '100%',
                          padding:
                            '12px',
                        }}
                      />

                    ) : (

                      <p
                        style={{
                          whiteSpace:
                            'pre-wrap',
                        }}
                      >

                        {
                          comment.content
                        }

                      </p>

                    )}


                    {/* =========================
                        ACTIONS
                    ========================= */}

                    {isMyComment && (

                      <div
                        style={{
                          display:
                            'flex',
                          justifyContent:
                            'flex-end',
                          gap:
                            '10px',
                          marginTop:
                            '16px',
                        }}
                      >

                        {isEditing ? (

                          <>

                            <button
                              type="button"
                              className="secondary-button"
                              onClick={
                                handleCancelEdit
                              }
                              disabled={
                                savingEdit
                              }
                            >
                              Cancel
                            </button>


                            <button
                              type="button"
                              className="primary-button"
                              onClick={() =>
                                handleSaveEdit(
                                  comment.id
                                )
                              }
                              disabled={
                                savingEdit ||
                                editingContent
                                  .trim() ===
                                  ''
                              }
                            >

                              {savingEdit
                                ? 'Saving...'
                                : 'Save'}

                            </button>

                          </>

                        ) : (

                          <>

                            <button
                              type="button"
                              className="secondary-button"
                              onClick={() =>
                                handleStartEdit(
                                  comment
                                )
                              }
                              disabled={
                                deletingCommentId ===
                                comment.id
                              }
                            >
                              Edit
                            </button>


                            <button
                              type="button"
                              className="secondary-button"
                              onClick={() =>
                                handleDeleteComment(
                                  comment
                                )
                              }
                              disabled={
                                deletingCommentId ===
                                comment.id
                              }
                            >

                              {
                                deletingCommentId ===
                                comment.id

                                  ? 'Deleting...'

                                  : 'Delete'
                              }

                            </button>

                          </>

                        )}

                      </div>

                    )}

                  </div>

                )

              }
            )}

          </div>

        )}

    </section>

  )

}


export default TaskComments