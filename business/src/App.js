import React from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import Header from "./common/Header";
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
					{/* TODO Move header to OrganizationRouter */}
					<Header />
					<OrganizationRouter />
				</Route>
			</Switch>
		</>
	);
}

export default App;
