import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Header from "./common/Header";
import Login from "./login";
import OrganizationRouter from "./organization";

function App() {
	const [organization, setOrganization] = useState(null);
	const [authUser, setAuthUser] = useState(undefined);

	useEffect(() => {
		let auth = JSON.parse(localStorage.getItem("authUser"));
		let org = localStorage.getItem("organization");
		if (auth) {
			setAuthUser(auth);
		} else {
			setAuthUser(null);
		}
		if (org) {
			setOrganization(org);
		} else {
			setOrganization(null);
		}
	}, []);

	return (
		<Router>
			<Switch>
				<Route path="/">
					{/* TODO Move header to OrganizationRouter */}
					{!authUser ? (
						<Login setAuthUser={setAuthUser} />
					) : (
						<>
							<Header organization={organization} setAuthUser={setAuthUser} />
							<OrganizationRouter
								organization={organization}
								setOrganization={setOrganization}
								authUser={authUser}
							/>
						</>
					)}
				</Route>
			</Switch>
		</Router>
	);
}

export default App;
