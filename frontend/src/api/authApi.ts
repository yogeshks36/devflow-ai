import axios from './axios'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  tokenType: string
  userId: number
  email: string
  role: string
}

export interface RegisterResponse {
  id: number
  firstName: string
  lastName: string
  email: string
  role: string
  verified: boolean
}

export const login = async (
  data: LoginRequest
): Promise<AuthResponse> => {

  const response =
    await axios.post<AuthResponse>(
      '/auth/login',
      data
    )

  return response.data
}

export const register = async (
  data: RegisterRequest
): Promise<RegisterResponse> => {

  const response =
    await axios.post<RegisterResponse>(
      '/auth/register',
      data
    )

  return response.data
}