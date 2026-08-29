import api from './axios'


// =========================
// COMMENT RESPONSE
// =========================

export interface Comment {

  id: number

  content: string

  taskId: number

  userId: number

  userFirstName: string

  userLastName: string

  userEmail: string

  createdAt: string

  updatedAt: string | null
}


// =========================
// COMMENT REQUEST
// =========================

export interface CommentRequest {

  content: string
}


// =========================
// PAGINATED COMMENTS
// =========================

export interface CommentPage {

  content: Comment[]

  totalPages: number

  totalElements: number

  number: number

  size: number
}


// =========================
// GET TASK COMMENTS
// =========================

export const getTaskComments = async (

  taskId: number,

  page: number = 0,

  size: number = 10

): Promise<CommentPage> => {

  const response =
    await api.get<CommentPage>(

      `/tasks/${taskId}/comments`,

      {
        params: {
          page,
          size,
        },
      }

    )

  return response.data
}


// =========================
// CREATE COMMENT
// =========================

export const createComment = async (

  taskId: number,

  request: CommentRequest

): Promise<Comment> => {

  const response =
    await api.post<Comment>(

      `/tasks/${taskId}/comments`,

      request

    )

  return response.data
}


// =========================
// UPDATE COMMENT
// =========================

export const updateComment = async (

  commentId: number,

  request: CommentRequest

): Promise<Comment> => {

  const response =
    await api.put<Comment>(

      `/comments/${commentId}`,

      request

    )

  return response.data
}


// =========================
// DELETE COMMENT
// =========================

export const deleteComment = async (

  commentId: number

): Promise<void> => {

  await api.delete(

    `/comments/${commentId}`

  )
}