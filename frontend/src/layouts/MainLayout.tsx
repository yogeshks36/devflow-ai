import { Link, Outlet } from "react-router-dom";

function MainLayout() {
    return (
        <div>
            <aside>
                <h2>DevFlow AI</h2>

                <nav>
                    <ul>
                        <li>
                            <Link to="/">Dashboard</Link>
                        </li>

                        <li>
                            <Link to="/projects">Projects</Link>
                        </li>

                        <li>
                            <Link to="/tasks">Tasks</Link>
                        </li>
                    </ul>
                </nav>
            </aside>

            <main>
                <Outlet />
            </main>
        </div>
    );
}

export default MainLayout;