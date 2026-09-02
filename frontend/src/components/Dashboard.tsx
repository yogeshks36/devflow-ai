import { useNavigate } from 'react-router-dom'

import '../App.css'


function Dashboard() {

  const navigate = useNavigate()


  return (

    <div className="app">

      <section className="ai-assistant-card">

        <div className="ai-assistant-content">

          <div className="ai-icon">
            ✦
          </div>


          <div>

            <p className="eyebrow">
              AI ASSISTANT
            </p>


            <h2>
              Let AI help you break down your tasks
            </h2>


            <p>
              DevFlow AI can analyze a task and generate
              smaller, actionable subtasks.
            </p>

          </div>

        </div>


        <button
          className="secondary-button"
          onClick={() => navigate('/ai')}
        >
          Try AI
        </button>

      </section>

    </div>

  )

}


export default Dashboard