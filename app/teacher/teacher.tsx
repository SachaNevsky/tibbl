import { Link } from "react-router";
import "./teacher.css"

export default function Teacher() {
    return (
        <div className="teacher-container">
            <header className="teacher-header">
                <Link to="/" aria-label="Button to go back to home page">
                    <img
                        src="https://armbennett.github.io/tangible-11ty/assets/img/tibbl-logo.png"
                        alt="TIBBL logo"
                        className="teacher-header-logo"
                    />
                </Link>
            </header>
            <main className="teacher-main">
                <h1 className="teacher-title">Teacher Resources</h1>
                <p className="teacher-wip">Work in progress...</p>
            </main>
        </div>
    )
}