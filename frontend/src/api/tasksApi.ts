import api from './axios'

export interface Task {
  id: number
  title: string
  description: string
  status: string
  priority: string
  dueDate: string | null
  assignee: {
    id: number
    firstName: string
    lastName: string
    email: string
  } | null
}

export interface TaskPage {
  content: Task[]
  totalPages: number
  totalElements: number
  number: number
  size: number
  first: boolean
  last: boolean
}

export interface CreateTaskRequest {
  title: string
  description: string
  status?: string
  priority?: string
  dueDate?: string | null
  assigneeId?: number | null
}

export const getProjectTasks = async (
  projectId: number,
  page: number = 0,
  size: number = 10
): Promise<TaskPage> => {

  const response = await api.get<TaskPage>(
    `/projects/${projectId}/tasks`,
    {
      params: {
        page,
        size,
      },
    }
  )

  return response.data
}

export const createTask = async (
  projectId: number,
  data: CreateTaskRequest
): Promise<Task> => {

  const response = await api.post<Task>(
    `/projects/${projectId}/tasks`,
    data
  )

  return response.data
}

export const getAllTasks = async (
  page: number = 0,
  size: number = 10
): Promise<TaskPage> => {

  const response = await api.get<TaskPage>(
    '/tasks',
    {
      params: {
        page,
        size,
      },
    }
  )

  return response.data
}
export const getTaskById = async (
  taskId: number
): Promise<Task> => {

  const response = await api.get<Task>(
    `/tasks/${taskId}`
  )

  return response.data
}