import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

import {
  getCurrentUser,
  type CurrentUser,
} from '../api/userApi'

const TOKEN_KEY = 'devflow_token'

interface AuthContextType {
  token: string | null
  user: CurrentUser | null
  userEmail: string | null
  isAuthenticated: boolean
  loginUser: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<
  AuthContextType | undefined
>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({
  children,
}: AuthProviderProps) {

  const [token, setToken] =
    useState<string | null>(
      () =>
        localStorage.getItem(
          TOKEN_KEY
        )
    )

  const [user, setUser] =
    useState<CurrentUser | null>(null)

  useEffect(() => {

    if (!token) {
      setUser(null)
      return
    }

    const loadCurrentUser = async () => {

      try {

        const currentUser =
          await getCurrentUser()

        setUser(currentUser)

      } catch (error) {

        console.error(
          'FAILED TO LOAD CURRENT USER:',
          error
        )

      }

    }

    loadCurrentUser()

  }, [token])


  const loginUser = (
    newToken: string
  ) => {

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
    setUser(null)
  }


  const value: AuthContextType = {
    token,
    user,
    userEmail: user?.email ?? null,
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

  const context =
    useContext(AuthContext)

  if (!context) {

    throw new Error(
      'useAuth must be used inside AuthProvider'
    )

  }

  return context
}