import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { database, signOut } from "../FirebaseSetup";
import { doc, getDoc } from "firebase/firestore";

const Header = ({ organization, setAuthUser }) => {
	const navigate = useNavigate();
	const [organizationUrl, setOrganizationUrl] = useState(null);

	useEffect(() => {
		const abortController = new AbortController();
		if (organization) {
			const fetchOrganization = async () => {
				try {
					const docRef = doc(database, "Companies", organization);
					const docSnap = await getDoc(docRef);
					if (docSnap.exists()) {
						setOrganizationUrl(docSnap.data().Info.Name.replaceAll(" ", "-"));
					}
				} catch (error) {
					console.error("Error fetching organization:", error);
				}
			};
			fetchOrganization();
		}
		return () => abortController.abort();
	}, [organization]);

	const handleLogout = () => {
		signOut(navigate);
		setAuthUser(null);
	};

	return (
		<nav className="tp-nav" role="navigation">
			<div className="top-menu">
				<div className="container">
					<div className="row">
						<div className="col-md-2">
							<div id="tp-logo">
								<Link to={`/${organizationUrl}/facilities`}>Raedam</Link>
							</div>
						</div>
						<div className="col-md-10 text-right menu-1">
							<ul>
								<li className="active">
									<Link to={`/${organizationUrl}/facilities`}>Facilities</Link>
								</li>
								<li>
									<Link to={`/${organizationUrl}/occupancy`}>Occupancy</Link>
								</li>
								<li>
									<Link to={`/${organizationUrl}/enforcement`}>
										Enforcement
									</Link>
								</li>
								<li className="has-dropdown-custom">
									<a>Account</a>
									<ul className="dropdown-custom">
										<li>
											<Link to={`/${organizationUrl}/organization`}>
												Organization
											</Link>
										</li>
										<li>
											<Link to={`/${organizationUrl}/profile`}>Profile</Link>
										</li>
										<li>
											<Link to={`/${organizationUrl}/messages`}>Messages</Link>
										</li>
										<li>
											<button onClick={handleLogout} className="dropdown-logout-btn">
												Logout
											</button>
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
