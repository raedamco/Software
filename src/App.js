import React, { useState } from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import Header from "./common/Header";
import Login from "./login";
import OrganizationRouter from "./organization";

function App() {
  const [organization, setOrganization] = useState(null);
  return (
    <>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/">
          {/* TODO Move header to OrganizationRouter */}
          <Header organization={organization} />
          <OrganizationRouter
            organization={organization}
            setOrganization={setOrganization}
          />
        </Route>
      </Switch>
    </>
  );
}

export default App;
