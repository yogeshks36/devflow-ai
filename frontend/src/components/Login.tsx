import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

import { login } from '../api/authApi'
import { useAuth } from '../context/AuthContext'

function Login() {

  const navigate = useNavigate()

  const { loginUser } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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

      console.log('Attempting login...')

      const response = await login({
        email,
        password,
      })

      console.log(
        'LOGIN SUCCESS:',
        response
      )

      console.log(
        'TOKEN FROM LOGIN:',
        response.token
      )

      // Make sure backend actually returned a token
      if (!response.token) {
        throw new Error(
          'Login response does not contain a token'
        )
      }

      // Save JWT
      loginUser(response.token)

      console.log(
        'TOKEN AFTER loginUser:',
        localStorage.getItem('devflow_token')
      )

      // Redirect
      navigate('/', {
        replace: true,
      })

    } catch (error) {

      console.error(
        'LOGIN ERROR:',
        error
      )

      setError(
        'Invalid email or password'
      )

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