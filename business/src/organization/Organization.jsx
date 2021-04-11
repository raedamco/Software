import { Route, Switch, useRouteMatch } from "react-router";
import LocationList from "./facilities/LocationList";

const Organization = ({ organization }) => {
	const { path, url, params } = useRouteMatch();
	return (
		<>
			<Switch>
				<Route path={`${path}/facilities`}>
					<LocationList organization={organization} />
				</Route>
			</Switch>
		</>
	);
};

export default Organization;
