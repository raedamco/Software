import { Link } from "react-router-dom";

const Header = () => {
	return (
		<nav className="tp-nav" role="navigation">
			<div className="top-menu">
				<div className="container">
					<div className="row">
						<div className="col-md-2">
							<div id="tp-logo">
								<Link to="/dashboard">Raedam</Link>
							</div>
						</div>
						<div className="col-md-10 text-right menu-1">
							<ul>
								<li className="active">
									<Link to="/dashboard">Facilities</Link>
								</li>
								<li>
									<Link to="/predictions">Summary</Link>
								</li>
								<li>
									<Link to="/enforcement">Enforcement</Link>
								</li>
								<li className="has-dropdown">
									<a>Account</a>
									<ul className="dropdown">
										<li>
											<Link to="/organization">Organization</Link>
										</li>
										<li>
											<Link to="/profile">Profile</Link>
										</li>
										<li>
											<Link to="/messages">Messages</Link>
										</li>
										<li onClick={window.signOut}>
											<a>Logout</a>
										</li>
									</ul>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Header;
