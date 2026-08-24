import api from './axios'

export interface Project {
  id: number
  name: string
  description: string
}

export interface ProjectPage {
  content: Project[]
  totalPages: number
  totalElements: number
}

export const getProjects = async (
  page: number = 0,
  size: number = 10
): Promise<ProjectPage> => {

  const response = await api.get<ProjectPage>(
    `/projects?page=${page}&size=${size}`
  )

  return response.data
}


export const getProjectById = async (
  id: number
): Promise<Project> => {

  const response = await api.get<Project>(
    `/projects/${id}`
  )

  return response.data
}