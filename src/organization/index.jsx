import { useEffect, useState } from "react";
import { Route, Switch, useHistory, useRouteMatch } from "react-router";
import Header from "../common/Header";
import Footer from "../common/Footer";
import OrganizationList from "./OrganizationList";
import Organization from "./Organization";
const database = window.firebase.firestore();

const OrganizationRouter = ({ organization, setOrganization, authUser }) => {
  const history = useHistory();
  let organizations;
  //const [user, setUser] = useState(1);

  async function getOrganizations() {
    if (await authUser) {
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
            history.push("/" + doc.data().Info.Subdomain + "/facilities");
            // }
            // if (window.location.pathname === "/") {
            // 	window.location =
            // 		"https://" +
            // 		doc.data().Info.Url +
            // 		"/" +
            // 		doc.data().Info.Subdomain +
            // 		"/facilities";
            // 	//history.push("/" + doc.data().Info.Subdomain + "/facilities");
            // }
          });
      }
    }
  }

  useEffect(() => {
    const abortController = new AbortController();
    if (authUser) {
      getOrganizations();
    }
    return () => abortController.abort();
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
              <Organization organization={organization} />
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
