import { useState } from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import CardList from "../common/CardList";
import Location from "./facilities/Location";
import LocationList from "./facilities/LocationList";
import SensorLog from "./facilities/SensorLog";
import SpotMap from "./facilities/SpotMap";
const database = window.firebase.firestore();

const Organization = ({ organization }) => {
	const { path, url, params } = useRouteMatch();

	function getLogs(setList, setPageTitle, urlParams) {
		const locationName = urlParams.locationName.replaceAll("-", " ");
		const subLocationName = urlParams.subLocationName.replaceAll("-", " ");

		database
			.collection("Companies")
			.doc(organization)
			.collection("Data")
			.doc(locationName)
			.collection(subLocationName)
			.doc(`${params.spotId}`)
			.collection("Data")
			.get()
			.then((collection) => {
				setPageTitle(`Data log for spot ${params.spotId}`);
				return collection.data();
			})
			.then((temp) => {
				const loComp = temp.map((log, index) => (
					<SensorLog
						key={index}
						occupant={log.Occupant}
						occupied={log.Occupied}
						begin={log.Time.Begin}
						end={log.Time.End}
					/>
				));
				setList([...loComp]);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	function getLocation(setList, setPageTitle, urlParams) {
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
				<Route
					path={`${path}/facilities/:locationName/:subLocationName/:spotId`}
				>
					<CardList getJsx={getLogs} />
				</Route>
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
