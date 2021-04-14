import { useEffect, useState } from "react";
import { Route, Switch, useHistory } from "react-router";
import Header from "../common/Header";
import Footer from "../common/Footer";
import OrganizationList from "./OrganizationList";
import Organization from "./Organization";
const database = window.firebase.firestore();

const OrganizationRouter = ({ organization, setOrganization }) => {
	const history = useHistory();
	let organizations;
	const [user, setUser] = useState(1);

	async function getOrganiztions() {
		if (await user) {
			organizations = await database
				.collection("Users")
				.doc("Companies")
				.collection("Users")
				.doc(user.uid)
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
						history.push("/" + doc.data().Info.Subdomain + "/facilities");
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
		getOrganiztions();
		return () => abortController.abort();
	}, [user]);

	useEffect(() => {
		window.firebase.auth().onAuthStateChanged(function (userAuth) {
			if (userAuth) {
				setUser(userAuth);
			}
		});
	}, []);

	if (user && user != 1) {
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
	} else if (user == null) {
		//TODO fix redirect
		history.push("/login");
		return null;
	} else {
		return null;
	}
};

export default OrganizationRouter;
