import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

import { login } from '../api/authApi'
import { useAuth } from '../context/AuthContext'

function Login() {

  const navigate = useNavigate()

  const {
    loginUser,
    isAuthenticated,
  } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // =========================
  // REDIRECT IF ALREADY LOGGED IN
  // =========================

  useEffect(() => {

    if (isAuthenticated) {
      navigate('/dashboard', {
        replace: true,
      })
    }

  }, [
    isAuthenticated,
    navigate,
  ])


  // =========================
  // LOGIN
  // =========================

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {

    event.preventDefault()

    setError('')

    if (!email.trim()) {
      setError('Email is required')
      return
    }

    if (!password) {
      setError('Password is required')
      return
    }

    try {

      setLoading(true)

      const response = await login({
        email: email.trim(),
        password,
      })

      // =========================
      // VALIDATE TOKEN
      // =========================

      if (!response.token) {

        throw new Error(
          'Login response does not contain a token'
        )

      }

      // =========================
      // SAVE JWT
      // =========================

      loginUser(response.token)

      // =========================
      // REDIRECT
      // =========================

      navigate('/dashboard', {
        replace: true,
      })

    } catch (error) {

      console.error(
        'LOGIN ERROR:',
        error
      )

      // =========================
      // HTTP ERROR
      // =========================

      if (axios.isAxiosError(error)) {

        const status =
          error.response?.status

        if (status === 401) {

          setError(
            'Invalid email or password'
          )

        } else if (status === 403) {

          setError(
            'You do not have permission to sign in.'
          )

        } else if (status === 500) {

          setError(
            'Server error. Please try again later.'
          )

        } else if (!error.response) {

          setError(
            'Unable to connect to the server. Please check your connection and try again.'
          )

        } else {

          setError(
            'Unable to sign in. Please try again.'
          )

        }

      } else {

        setError(
          'Something went wrong. Please try again.'
        )

      }

    } finally {

      setLoading(false)

    }

  }


  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-header">

          <div className="logo-mark">
            D
          </div>

          <h1>
            Welcome back
          </h1>

          <p>
            Sign in to your DevFlow AI account
          </p>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
            />

          </div>

          <div className="form-group">

            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
            />

          </div>

          {error && (
            <p className="login-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading
              ? 'Signing in...'
              : 'Sign in'}
          </button>

        </form>

      </div>

    </div>
  )
}

export default Login