import { useEffect, useState } from "react";
import { matchPath, Route, Routes, useNavigate, useLocation } from "react-router";
import Header from "../common/Header";
import Footer from "../common/Footer";
import OrganizationList from "./OrganizationList";
import Organization from "./Organization";
import { database } from "../FirebaseSetup";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";

const OrganizationRouter = ({ organization, setOrganization, authUser }) => {
	const navigate = useNavigate();
	const location = useLocation();
	let organizations;

	async function getOrganizations() {
		// Get Organization from url first
		const match = matchPath(location.pathname, {
			path: "/:organization",
		});
		if (match && match.params.organization != "organizations") {
			let name = match.params.organization.replaceAll("-", " ");
			try {
				const q = query(collection(database, "Companies"), where("Info.Name", "==", name));
				const querySnapshot = await getDocs(q);
				querySnapshot.forEach((doc) => {
					setOrganization(doc.id);
				});
			} catch (error) {
				console.error("Error fetching organization:", error);
			}
			// If there's no organization in the url. then try to get the organization from the users company list
		} else if (await authUser) {
			try {
				const userDoc = await getDoc(doc(database, "Users", "Companies", "Users", authUser.user.uid));
				if (userDoc.exists()) {
					organizations = userDoc.data().Companies;
					if (organizations.length > 1) {
						navigate("/organizations");
					} else if (organizations.length == 1) {
						const companyDoc = await getDoc(doc(database, "Companies", organizations[0]));
						if (companyDoc.exists()) {
							setOrganization(organizations[0]);
							navigate(
								"/" + companyDoc.data().Info.Name.replaceAll(" ", "-") + "/facilities"
							);
						}
					}
				}
			} catch (error) {
				console.error("Error fetching user organizations:", error);
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

	if (authUser && authUser.user != 1) {
		return (
			<>
				<main>
					<Routes>
						<Route path="/organizations" element={<OrganizationList organizations={organizations} />} />
						<Route path="/:organization" element={
							organization ? (
								<Organization organization={organization} authUser={authUser} />
							) : (
								<></>
							)
						} />
					</Routes>
				</main>
				<Footer />
			</>
		);
	} else {
		return null;
	}
};

export default OrganizationRouter;
