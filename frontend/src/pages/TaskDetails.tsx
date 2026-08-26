import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getTaskById, type Task } from '../api/tasksApi'

function TaskDetails() {

    const { taskId } = useParams()
    const navigate = useNavigate()

    const [task, setTask] = useState<Task | null>(null)

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {

        const loadTask = async () => {

            if (!taskId) {

                setError('Task ID is missing')
                setLoading(false)

                return
            }

            try {

                setLoading(true)
                setError('')

                const response =
                    await getTaskById(
                        Number(taskId)
                    )

                setTask(response)

            } catch (error) {

                console.error(
                    'FAILED TO LOAD TASK:',
                    error
                )

                setError(
                    'Failed to load task.'
                )

            } finally {

                setLoading(false)

            }
        }

        loadTask()

    }, [taskId])


    if (loading) {

        return (

            <div className="app">

                <main className="main">

                    <div className="empty-state">

                        <h3>
                            Loading task...
                        </h3>

                    </div>

                </main>

            </div>

        )
    }


    if (error || !task) {

        return (

            <div className="app">

                <main className="main">

                    <div className="empty-state">

                        <h3>
                            {error || 'Task not found'}
                        </h3>

                        <Link
                            to="/tasks"
                            className="secondary-button"
                        >
                            ← Back to Tasks
                        </Link>

                    </div>

                </main>

            </div>

        )
    }


    return (

        <div className="app">

            {/* =========================
                NAVBAR
            ========================= */}

            <header className="navbar">

                <div className="logo">

                    <span className="logo-mark">
                        D
                    </span>

                    <span>
                        DevFlow AI
                    </span>

                </div>


                <nav>

                    <button
                        className="nav-link"
                        onClick={() =>
                            navigate('/dashboard')
                        }
                    >
                        Dashboard
                    </button>

                    <button
                        className="nav-link"
                        onClick={() =>
                            navigate('/projects')
                        }
                    >
                        Projects
                    </button>

                    <button
                        className="nav-link active"
                        onClick={() =>
                            navigate('/tasks')
                        }
                    >
                        Tasks
                    </button>

                    <button
                        className="nav-link"
                        onClick={() =>
                            navigate('/team')
                        }
                    >
                        Team
                    </button>

                </nav>


                <div className="profile">

                    <div className="avatar">
                        Y
                    </div>

                    <span>
                        Yogesh
                    </span>

                </div>

            </header>


            {/* =========================
                MAIN
            ========================= */}

            <main className="main">

                <Link
                    to="/tasks"
                    className="secondary-button"
                >
                    ← Back to Tasks
                </Link>


                <section className="welcome">

                    <div>

                        <p className="eyebrow">
                            TASK DETAILS
                        </p>

                        <h1>
                            {task.title}
                        </h1>

                        <p className="subtitle">
                            View task information and status.
                        </p>

                    </div>

                </section>


                {/* =========================
                    TASK DETAILS
                ========================= */}

                <section className="panel">

                    <div className="panel-header">

                        <div>

                            <h2>
                                {task.title}
                            </h2>

                            <p>
                                Task #{task.id}
                            </p>

                        </div>

                    </div>


                    <div className="task-details">

                        {/* DESCRIPTION */}

                        <div className="task-detail-item">

                            <span className="stat-label">
                                Description
                            </span>

                            <p>
                                {task.description ||
                                    'No description provided.'}
                            </p>

                        </div>


                        {/* STATUS */}

                        <div className="task-detail-item">

                            <span className="stat-label">
                                Status
                            </span>

                            <span className="task-status">
                                {task.status}
                            </span>

                        </div>


                        {/* PRIORITY */}

                        <div className="task-detail-item">

                            <span className="stat-label">
                                Priority
                            </span>

                            <span className="task-status">
                                {task.priority}
                            </span>

                        </div>


                        {/* DUE DATE */}

                        <div className="task-detail-item">

                            <span className="stat-label">
                                Due Date
                            </span>

                            <p>
                                {task.dueDate
                                    ? new Date(
                                        task.dueDate
                                      ).toLocaleDateString()
                                    : 'No due date'}
                            </p>

                        </div>


                        {/* ASSIGNEE */}

                        <div className="task-detail-item">

                            <span className="stat-label">
                                Assignee
                            </span>

                            {task.assignee ? (

                                <p>
                                    {task.assignee.firstName}{' '}
                                    {task.assignee.lastName}
                                    <br />
                                    {task.assignee.email}
                                </p>

                            ) : (

                                <p>
                                    Unassigned
                                </p>

                            )}

                        </div>

                    </div>

                </section>

            </main>

        </div>

    )
}

export default TaskDetails