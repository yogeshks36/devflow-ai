import { useState } from 'react'
import './Login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    console.log({
      email,
      password,
    })
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <span className="logo-mark">D</span>
          <span>DevFlow AI</span>
        </div>

        <div className="login-header">
          <p className="eyebrow">WELCOME BACK</p>
          <h1>Sign in</h1>
          <p>Sign in to continue to your DevFlow workspace.</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <button type="submit" className="login-button">
            Sign in
          </button>
        </form>

        <p className="login-footer">
          DevFlow AI · Developer productivity platform
        </p>
      </div>
    </div>
  )
}

export default Login