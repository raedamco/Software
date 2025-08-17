import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./common/Header";
import Login from "./login";
import OrganizationRouter from "./organization";

function App() {
	const [organization, setOrganization] = useState(null);
	const [authUser, setAuthUser] = useState(undefined);

	useEffect(() => {
		let auth = JSON.parse(localStorage.getItem("authUser"));
		if (auth) {
			setAuthUser(auth);
		} else {
			setAuthUser(null);
		}
	}, []);

	return (
		<Router>
			<Routes>
				<Route path="/*" element={
					!authUser ? (
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
					)
				} />
			</Routes>
		</Router>
	);
}

export default App;
