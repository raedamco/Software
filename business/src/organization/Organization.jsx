import { useState } from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import CardList from "../common/CardList";
import Location from "./facilities/Location";
import LocationList from "./facilities/LocationList";
import SpotMap from "./facilities/SpotMap";
const database = window.firebase.firestore();

const Organization = ({ organization }) => {
	const { path, url, params } = useRouteMatch();
	//const [locationType, setLocationType] = useState("location");

	function getLocation(setList, setPageTitle, params) {
		database
			.collection("Companies")
			.doc(organization)
			.get()
			.then((doc) => {
				setPageTitle(organization);
				return doc.data().Locations;
			})
			.then((temp) => {
				const loComp = temp.map((locationName, index) => (
					<Location
						key={index}
						organization={organization}
						name={locationName}
						locationType="location"
					/>
				));
				setList([...loComp]);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	function getSubLocation(setList, setPageTitle, urlParams) {
		let subLocationName = urlParams.locationName.replaceAll("-", " ");
		database
			.collection("Companies")
			.doc(organization)
			.collection("Data")
			.doc(subLocationName)
			.get()
			.then((doc) => {
				setPageTitle(subLocationName);
				//TODO Fix floor data name in database
				return Object.keys(doc.data()["Floor Data"]);
			})
			.then((temp) => {
				const loComp = temp.map((locationName, index) => (
					<Location
						key={index}
						organization={organization}
						title={subLocationName}
						name={locationName}
						locationType="sublocation"
					/>
				));
				setList([...loComp]);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	return (
		<>
			<Switch>
				<Route path={`${path}/facilities/:locationName/:subLocationName`}>
					<SpotMap organization={organization} />
				</Route>
				<Route path={`${path}/facilities/:locationName`}>
					<CardList getJsx={getSubLocation} />
				</Route>
				<Route path={`${path}/facilities`}>
					<CardList getJsx={getLocation} />
				</Route>
			</Switch>
		</>
	);
};

export default Organization;
