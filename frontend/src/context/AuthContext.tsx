import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import type { ReactNode } from 'react'

interface AuthContextType {
  token: string | null
  isAuthenticated: boolean
  loginUser: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
)

export const AuthProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('devflow_token')
  )

  const loginUser = (newToken: string) => {
    localStorage.setItem('devflow_token', newToken)
    setToken(newToken)
  }

  const logout = () => {
    localStorage.removeItem('devflow_token')
    setToken(null)
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        loginUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider'
    )
  }

  return context
}