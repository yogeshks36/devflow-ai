import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react'

const TOKEN_KEY = 'devflow_token'

interface JwtPayload {
  sub?: string
}

interface AuthContextType {
  token: string | null
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


// =========================
// GET EMAIL FROM JWT
// =========================

function getUserEmailFromToken(
  token: string | null
): string | null {

  if (!token) {
    return null
  }

  try {

    const payload =
      token.split('.')[1]

    const decodedPayload =
      JSON.parse(
        atob(payload)
      ) as JwtPayload

    return decodedPayload.sub || null

  } catch (error) {

    console.error(
      'FAILED TO DECODE JWT:',
      error
    )

    return null
  }
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


  const userEmail =
    getUserEmailFromToken(
      token
    )


  const loginUser = (
    newToken: string
  ) => {

    localStorage.setItem(
      TOKEN_KEY,
      newToken
    )

    setToken(
      newToken
    )
  }


  const logout = () => {

    localStorage.removeItem(
      TOKEN_KEY
    )

    setToken(null)
  }


  const value: AuthContextType = {
    token,
    userEmail,
    isAuthenticated: !!token,
    loginUser,
    logout,
  }


  return (

    <AuthContext.Provider
      value={value}
    >

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