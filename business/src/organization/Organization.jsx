import { useState } from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import LocationList from "./facilities/LocationList";

const Organization = ({ organization }) => {
	const { path, url, params } = useRouteMatch();
	//const [locationType, setLocationType] = useState("location");

	return (
		<>
			<Switch>
				<Route path={`${path}/facilities/:locationName`}>
					<LocationList
						organization={organization}
						locationType={"sublocation"}
					/>
				</Route>
				<Route path={`${path}/facilities`}>
					<LocationList organization={organization} locationType={"location"} />
				</Route>
			</Switch>
		</>
	);
};

export default Organization;
