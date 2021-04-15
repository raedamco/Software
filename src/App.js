import React, { useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import Header from "./common/Header";
import Login from "./login";
import OrganizationRouter from "./organization";

function App() {
	const [organization, setOrganization] = useState(null);
	const [authUser, setAuthUser] = useState({ user: undefined });

	useEffect(() => {
		let auth = JSON.parse(localStorage.getItem("authUser"));
		let org = localStorage.getItem("organization");
		if (auth) {
			setAuthUser(auth);
		} else {
			setAuthUser({
				user: null,
			});
		}
		if (org) {
			setOrganization(org);
		} else {
			setOrganization(null);
		}
	}, []);

	useEffect(() => {
		console.log("authUser:", authUser);
	}, [authUser]);

	return (
		<>
			<Switch>
				<Route path="/">
					{/* TODO Move header to OrganizationRouter */}
					{!authUser.user ? (
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
		</>
	);
}

export default App;
