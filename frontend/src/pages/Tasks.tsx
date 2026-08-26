import { useEffect, useState } from 'react'
import { getAllTasks, type Task } from '../api/tasksApi'
import { useNavigate } from 'react-router-dom'

function Tasks() {

    const [tasks, setTasks] = useState<Task[]>([])
    const [page, setPage] = useState(0)

    const [totalPages, setTotalPages] = useState(0)
    const [totalElements, setTotalElements] = useState(0)

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const pageSize = 10
    const navigate = useNavigate()

    const loadTasks = async () => {

        try {

            setLoading(true)
            setError('')

            const response = await getAllTasks(
                page,
                pageSize
            )

            setTasks(response.content)
            setTotalPages(response.totalPages)
            setTotalElements(response.totalElements)

        } catch (error) {

            console.error(
                'FAILED TO LOAD TASKS:',
                error
            )

            setError(
                'Failed to load tasks.'
            )

        } finally {

            setLoading(false)

        }
    }

    useEffect(() => {

        loadTasks()

    }, [page])


    return (

        <div className="app">

            <main className="main">

                <p className="eyebrow">
                    DEVFLOW AI
                </p>

                <h1>
                    Tasks
                </h1>

                <p className="subtitle">
                    Manage all tasks across your projects.
                </p>


                <div className="panel">

                    <div className="panel-header">

                        <div>

                            <h2>
                                All Tasks
                            </h2>

                            <p>
                                {totalElements} tasks total
                            </p>

                        </div>

                    </div>


                    {/* LOADING */}

                    {loading && (

                        <div className="empty-state">

                            <h3>
                                Loading tasks...
                            </h3>

                        </div>

                    )}


                    {/* ERROR */}

                    {!loading && error && (

                        <div className="empty-state">

                            <h3>
                                {error}
                            </h3>

                        </div>

                    )}


                    {/* NO TASKS */}

                    {!loading &&
                        !error &&
                        tasks.length === 0 && (

                            <div className="empty-state">

                                <div className="empty-icon">
                                    ✓
                                </div>

                                <h3>
                                    No tasks yet
                                </h3>

                                <p>
                                    Create a task inside a project
                                    to see it here.
                                </p>

                            </div>

                        )}


                    {/* TASK LIST */}

                    {!loading &&
                        !error &&
                        tasks.length > 0 && (

                            <div className="dashboard-tasks">

                                {tasks.map((task) => (

                                    <div
                                        className="dashboard-task"
                                        key={task.id}
                                        onClick={() =>
            navigate(`/tasks/${task.id}`)
        }
        style={{
            cursor: 'pointer'
        }}
                                    >

                                        <div className="dashboard-task-info">

                                            <h3>
                                                {task.title}
                                            </h3>

                                            <p>
                                                {task.description ||
                                                    'No description provided.'}
                                            </p>

                                        </div>


                                        <div>

                                            <span className="task-status">
                                                {task.status}
                                            </span>

                                            <span className="task-status">
                                                {task.priority}
                                            </span>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        )}


                    {/* PAGINATION */}

                    {!loading &&
                        !error &&
                        totalPages > 1 && (

                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '16px',
                                    marginTop: '24px'
                                }}
                            >

                                <button
                                    className="secondary-button"
                                    disabled={page === 0}
                                    onClick={() =>
                                        setPage(page - 1)
                                    }
                                >
                                    ← Previous
                                </button>


                                <span>
                                    Page {page + 1} of {totalPages}
                                </span>


                                <button
                                    className="secondary-button"
                                    disabled={
                                        page === totalPages - 1
                                    }
                                    onClick={() =>
                                        setPage(page + 1)
                                    }
                                >
                                    Next →
                                </button>

                            </div>

                        )}

                </div>

            </main>

        </div>

    )
}

export default Tasks