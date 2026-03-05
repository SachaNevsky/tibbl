import type { Route } from "./+types/home";
import "./home.css"

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "TIBBL" },
		{ name: "description", content: "TIBBL web application" },
	];
}

export default function Home() {
	return (
		<div className="home-container">
			<header className="site-header">
				<div className="header-col-left">
					<img
						src="https://armbennett.github.io/tangible-11ty/assets/img/tibbl-logo.png"
						alt="TIBBL logo"
						className="header-logo-left"
					/>
				</div>
				<div className="header-col-center">
					<h1 className="header-title">Tangible Inclusive Coding</h1>
				</div>
				<div className="header-col-right">
					<img
						src="KCL_logo.png"
						alt="King's College London logo"
						className="header-logo-right"
					/>
				</div>
			</header>

			<main className="main-content">
				<div className="hero-and-buttons">
					<div className="hero-container">
						<img src="hero.png" alt="TIBBL hero image" className="hero-image" />
					</div>
					<div className="button-container">
						<a className="tibbl-button" href="/tibbl/tibbl-app" aria-label="Launch TIBBL">
							Launch TIBBL
						</a>
						<a className="tibbl-button tibbl-button--secondary" href="/tibbl/teacher" aria-label="Teacher Resources">
							Teacher Resources
						</a>
					</div>
				</div>

				<div className="two-column">
					<div className="team-container">
						<h2>Project Team:</h2>
						<p><a href="https://www.kcl.ac.uk/people/alex-hadwen-bennett" target="_blank">Alex Hadwen-Bennett</a> (Principal Investigator)</p>
						<p><a href="https://www.kcl.ac.uk/people/timothy-neate" target="_blank">Timothy Neate</a> (Co-Investigator)</p>
						<p><a href="https://kdl.kcl.ac.uk/about/people/samantha-callaghan/" target="_blank">Samantha Callaghan</a> (Research Software Analyst)</p>
						<p><a href="https://kdl.kcl.ac.uk/about/people/elliott-hall/" target="_blank">Elliott Hall</a> (Senior Research Software Engineer)</p>
						<p><a href="https://www.kcl.ac.uk/people/xinyun-he" target="_blank">Xinyun He</a> (Research Assistant - Inclusive Education)</p>
						<p><a href="https://kdl.kcl.ac.uk/about/people/zihao-lu/" target="_blank">Zihao Lu</a> (Research Software UI/UX Designer)</p>
						<p><a href="https://www.kcl.ac.uk/people/alexandre-nevsky" target="_blank">Alexandre Nevsky</a> (Research Assistant - Inclusive HCI)</p>
						<p><a href="https://kdl.kcl.ac.uk/about/people/tiffany-ong/" target="_blank">Tiffany Ong</a> (Senior Research Software UI/UX Designer)</p>
					</div>

					<div className="ack-container">
						<h2>Acknowledgments:</h2>
						<p>This project was made possible through funding from a <a href="https://www.kcl.ac.uk/digital-futures" target="_black">Digital Futures Institute</a> Fellowship, the <a href="https://www.kcl.ac.uk/ecs" target="_black">School of Education, Communication and Society</a> at King's College London and through the support of the <a href="https://kdl.kcl.ac.uk/" target="_blank">King's Digital Lab</a>.</p>
						<p>We are also incredibly grateful for the invaluable contributions made by the research participants as well as Carlos De La Puente Cuya, Ying Lau and Bryn Roberts.</p>
						<div className="ack-logos">
							<img className="logo" src="DFI_logo.png" alt="Digital Futures Institute Logo" />
							<img className="logo" src="KDL_logo.png" alt="King's Digital Lab logo" />
						</div>
					</div>
				</div>
			</main>
		</div>
	)
}