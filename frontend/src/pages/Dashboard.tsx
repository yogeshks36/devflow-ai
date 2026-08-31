import { useNavigate } from 'react-router-dom'

import Navbar from '../components/Navbar'


function Dashboard() {

  const navigate =
    useNavigate()


  const handleTryAi = () => {

    navigate(
      '/ai/task-breakdown'
    )

  }


  return (

    <div className="app">

      <Navbar />


      <main className="main">


        <section className="welcome">

          <div>

            <p className="eyebrow">
              DEVFLOW AI
            </p>


            <h1>
              Welcome to your developer workspace
            </h1>


            <p className="subtitle">

              Manage your projects, tasks,
              team members, comments, and
              AI-powered workflows.

            </p>

          </div>


          <button
            className="primary-button"
            onClick={handleTryAi}
          >

            ✦ Try AI

          </button>

        </section>


        <section className="panel">

          <h2>
            Dashboard
          </h2>


          <p>

            Manage your projects, tasks,
            team members, comments, and
            AI-powered workflows.

          </p>

        </section>


      </main>

    </div>

  )

}


export default Dashboard