import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react'

const TOKEN_KEY = 'devflow_token'

interface AuthContextType {
  token: string | null
  isAuthenticated: boolean
  loginUser: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({
  children,
}: AuthProviderProps) {

  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem(TOKEN_KEY)
  )

  const loginUser = (newToken: string) => {

    localStorage.setItem(
      TOKEN_KEY,
      newToken
    )

    setToken(newToken)
  }

  const logout = () => {

    localStorage.removeItem(
      TOKEN_KEY
    )

    setToken(null)
  }

  const value: AuthContextType = {
    token,
    isAuthenticated: !!token,
    loginUser,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {

  const context = useContext(AuthContext)

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider'
    )
  }

  return context
}