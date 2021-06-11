import { useEffect, useState } from "react";
import { matchPath, Route, Switch, useHistory } from "react-router";
import Header from "../common/Header";
import Footer from "../common/Footer";
import OrganizationList from "./OrganizationList";
import Organization from "./Organization";
import { database } from "../FirebaseSetup";

const OrganizationRouter = ({ organization, setOrganization, authUser }) => {
	const history = useHistory();
	let organizations;
	//const [user, setUser] = useState(1);

	async function getOrganizations() {
		// Get Organization from url first
		const match = matchPath(history.location.pathname, {
			path: "/:organization",
		});
		if (match && match.params.organization != "organizations") {
			let name = match.params.organization.replaceAll("-", " ");
			await database
				.collection("Companies")
				.where("Info.Name", "==", name)
				.get()
				.then((querySnapshot) => {
					querySnapshot.forEach((doc) => {
						setOrganization(doc.id);
					});
				});
			// If there's no organization in the url. then try to get the organization from the users company list
		} else if (await authUser) {
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
						//localStorage.setItem("organization", organizations[0]);
						history.push(
							"/" + doc.data().Info.Name.replaceAll(" ", "-") + "/facilities"
						);
					});
			}
		}
	}

	useEffect(() => {
		if (authUser) {
			const abortController = new AbortController();
			getOrganizations();
			return () => abortController.abort();
		}
	}, [authUser]);

	//TODO Switch to firebase react components
	// useEffect(() => {
	// 	window.firebase.auth().onAuthStateChanged(function (userAuth) {
	// 		if (userAuth) {
	// 			setUser(userAuth);
	// 		}
	// 	});
	// }, []);

	if (authUser && authUser.user != 1) {
		return (
			<>
				<main>
					<Switch>
						<Route path="/organizations">
							<OrganizationList organizations={organizations} />
						</Route>
						<Route path="/:organization">
							{organization ? (
								<Organization organization={organization} />
							) : (
								<></>
							)}
						</Route>
					</Switch>
				</main>
				<Footer />
			</>
		);
	} else {
		return null;
	}
};

export default OrganizationRouter;
