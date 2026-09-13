import { useState } from 'react'
import type { FormEvent } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

import { register } from '../api/authApi'

import './Register.css'

function Register() {

  const navigate = useNavigate()

  const [firstName, setFirstName] =
    useState('')

  const [lastName, setLastName] =
    useState('')

  const [email, setEmail] =
    useState('')

  const [password, setPassword] =
    useState('')

  const [error, setError] =
    useState('')

  const [loading, setLoading] =
    useState(false)

  const [success, setSuccess] =
    useState('')


  // =========================
  // REGISTER
  // =========================

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {

    event.preventDefault()

    setError('')
    setSuccess('')


    // =========================
    // CLIENT VALIDATION
    // =========================

    if (!firstName.trim()) {
      setError('First name is required')
      return
    }

    if (!lastName.trim()) {
      setError('Last name is required')
      return
    }

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


      // =========================
      // REGISTER USER
      // =========================

      await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
      })


      // =========================
      // SUCCESS
      // =========================

      setSuccess(
        'Account created successfully. Redirecting to sign in...'
      )


      setTimeout(() => {

        navigate('/login', {
          replace: true,
        })

      }, 1200)


    } catch (error) {

      console.error(
        'REGISTER ERROR:',
        error
      )


      if (axios.isAxiosError(error)) {

        const status =
          error.response?.status


        if (status === 409) {

          setError(
            'An account with this email already exists.'
          )

        } else if (status === 400) {

          setError(
            'Please check your details and try again.'
          )

        } else if (status === 500) {

          setError(
            'Server error. Please try again later.'
          )

        } else if (!error.response) {

          setError(
            'Unable to connect to the server. Please check your connection.'
          )

        } else {

          setError(
            'Unable to create your account. Please try again.'
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

    <div className="register-page">

      <div className="register-card">

        {/* =========================
            HEADER
        ========================= */}

        <div className="register-header">

          <div className="register-logo">
            D
          </div>

          <h1>
            Create your account
          </h1>

          <p>
            Start managing your development
            workflow with DevFlow AI.
          </p>

        </div>


        {/* =========================
            FORM
        ========================= */}

        <form
          className="register-form"
          onSubmit={handleSubmit}
        >

          <div className="form-group">

            <label htmlFor="firstName">
              First name
            </label>

            <input
              id="firstName"
              type="text"
              placeholder="Yogesh"
              value={firstName}
              autoComplete="given-name"
              onChange={(event) =>
                setFirstName(
                  event.target.value
                )
              }
            />

          </div>


          <div className="form-group">

            <label htmlFor="lastName">
              Last name
            </label>

            <input
              id="lastName"
              type="text"
              placeholder="Kumar"
              value={lastName}
              autoComplete="family-name"
              onChange={(event) =>
                setLastName(
                  event.target.value
                )
              }
            />

          </div>


          <div className="form-group">

            <label htmlFor="register-email">
              Email
            </label>

            <input
              id="register-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              autoComplete="email"
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
            />

          </div>


          <div className="form-group">

            <label htmlFor="register-password">
              Password
            </label>

            <input
              id="register-password"
              type="password"
              placeholder="Create a secure password"
              value={password}
              autoComplete="new-password"
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
            />

            <p className="password-help">
              Use a strong password to keep
              your account secure.
            </p>

          </div>


          {/* ERROR */}

          {error && (

            <p className="register-error">
              {error}
            </p>

          )}


          {/* SUCCESS */}

          {success && (

            <p className="register-success">
              {success}
            </p>

          )}


          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >

            {loading
              ? 'Creating account...'
              : 'Create account'}

          </button>

        </form>


        {/* =========================
            LOGIN LINK
        ========================= */}

        <div className="register-login-link">

          Already have an account?{' '}

          <Link to="/login">
            Sign in
          </Link>

        </div>

      </div>

    </div>

  )
}

export default Register