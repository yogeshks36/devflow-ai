import api from './axios'

export interface CurrentUser {
  id: number
  firstName: string
  lastName: string
  email: string
  role: string
  verified: boolean
}

export const getCurrentUser = async (): Promise<CurrentUser> => {
  const response = await api.get<CurrentUser>('/users/me')

  return response.data
}