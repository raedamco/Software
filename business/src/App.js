import React from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import Login from "./login";
import OrganizationRouter from "./organization";

function App() {
	return (
		<>
			<Switch>
				<Route path="/login">
					<Login />
				</Route>
				<Route path="/">
					<OrganizationRouter />
				</Route>
			</Switch>
		</>
	);
}

export default App;
