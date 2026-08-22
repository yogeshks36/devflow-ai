import api from './axios'

export interface Project {
  id: number
  name: string
  description: string
}

export const getProjects = async (): Promise<Project[]> => {
  const response = await api.get<Project[]>('/api/projects')

  return response.data
}