import { useEffect, useState } from "react";
import { Route, Switch, useHistory, useRouteMatch } from "react-router";
import Header from "../common/Header";
import Footer from "../common/Footer";
import OrganizationList from "./OrganizationList";
import Organization from "./Organization";
const database = window.firebase.firestore();

const OrganizationRouter = ({ organization, setOrganization, authUser }) => {
	const history = useHistory();
	const { path, url, params } = useRouteMatch();
	let organizations;
	//const [user, setUser] = useState(1);

	async function getOrganizations() {
		if (await authUser.user) {
			organizations = await database
				.collection("Users")
				.doc("Companies")
				.collection("Users")
				.doc(authUser.user.uid)
				.get()
				.then((doc) => {
					return doc.data().Companies;
				});
			if (organizations.length > 1) {
				history.push("/organizations");
			} else if (organizations.length == 1) {
				await database
					.collection("Companies")
					.doc(organizations[0])
					.get()
					.then((doc) => {
						setOrganization(organizations[0]);
						localStorage.setItem("organization", organizations[0]);
						if (window.location.pathname === "/") {
							history.push("/" + doc.data().Info.Subdomain + "/facilities");
						}
						// window.location =
						// 	"https://" +
						// 	doc.data().Info.Url +
						// 	"/" +
						// 	doc.data().Info.Subdomain;
					});
			}
		}
	}

	useEffect(() => {
		const abortController = new AbortController();
		if (authUser.user) {
			getOrganizations();
		}
		return () => abortController.abort();
	}, [authUser.user]);

	//TODO Switch to firebase react components
	// useEffect(() => {
	// 	window.firebase.auth().onAuthStateChanged(function (userAuth) {
	// 		if (userAuth) {
	// 			setUser(userAuth);
	// 		}
	// 	});
	// }, []);

	if (authUser.user && authUser.user != 1) {
		return (
			<>
				<main>
					<Switch>
						<Route path="/organizations">
							<OrganizationList organizations={organizations} />
						</Route>
						<Route path="/:organization">
							<Organization organization={organization} />
						</Route>
					</Switch>
				</main>
				<Footer />
			</>
		);
	} else if (authUser.user === null) {
		//TODO fix redirect
		//history.push("/login");
		return null;
	} else {
		return null;
	}
};

export default OrganizationRouter;
