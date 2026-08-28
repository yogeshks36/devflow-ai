import { useNavigate, useLocation } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'

function Navbar() {

  const navigate = useNavigate()

  const location = useLocation()

  const { logout } = useAuth()


  const handleLogout = () => {

    logout()

    navigate('/login')

  }


  return (

    <header className="navbar">


      {/* =========================
          LOGO
      ========================= */}

      <div
        className="logo"
        onClick={() =>
          navigate('/dashboard')
        }
        style={{
          cursor: 'pointer',
        }}
      >

        <span className="logo-mark">
          D
        </span>

        <span>
          DevFlow AI
        </span>

      </div>


      {/* =========================
          NAVIGATION
      ========================= */}

      <nav>

        <button
          className={
            location.pathname === '/dashboard'
              ? 'nav-link active'
              : 'nav-link'
          }
          onClick={() =>
            navigate('/dashboard')
          }
        >
          Dashboard
        </button>


        <button
          className={
            location.pathname.startsWith('/projects')
              ? 'nav-link active'
              : 'nav-link'
          }
          onClick={() =>
            navigate('/projects')
          }
        >
          Projects
        </button>


        <button
          className={
            location.pathname.startsWith('/tasks')
              ? 'nav-link active'
              : 'nav-link'
          }
          onClick={() =>
            navigate('/tasks')
          }
        >
          Tasks
        </button>


        <button
          className={
            location.pathname.startsWith('/team')
              ? 'nav-link active'
              : 'nav-link'
          }
          onClick={() =>
            navigate('/team')
          }
        >
          Team
        </button>

      </nav>


      {/* =========================
          PROFILE
      ========================= */}

      <div className="profile">

        <div className="avatar">
          Y
        </div>

        <span>
          Yogesh
        </span>


        <button
          type="button"
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

    </header>

  )

}

export default Navbar