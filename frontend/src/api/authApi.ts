import axios from './axios'

export interface LoginRequest {
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

export const login = async (
  data: LoginRequest
): Promise<AuthResponse> => {

  const response = await axios.post<AuthResponse>(
    '/auth/login',
    data
  )

  return response.data
}