import { Route, Switch, useRouteMatch } from "react-router";
import CardList from "../common/CardList";
import CommingSoon from "../common/CommingSoon";
import NoData from "../common/NoData";
import Location from "./facilities/Location";
import SensorLog from "./facilities/SensorLog";
import SpotMap from "./facilities/SpotMap";
import Price from "./Price";
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
			.doc(`${urlParams.spotId}`)
			.collection("Data")
			.get()
			.then((collection) => {
				setPageTitle(`Data log for spot ${urlParams.spotId}`);
				let temp = [];
				console.log("collectin: ", collection);
				if (!collection.size) {
					temp.push(<NoData />);
					setList(temp);
					return;
				}
				let index = 0;
				collection.forEach((doc) => {
					temp.push(
						<SensorLog
							key={index}
							occupant={doc.data().Occupant}
							occupied={doc.data().Occupied}
							begin={doc.data().Time.Begin}
							end={doc.data().Time.End}
						/>
					);
					index += 1;
				});
				setList(temp);
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

	function getLocationPrices(setList, setPageTitle, urlParams) {
		database
			.collection("Companies")
			.doc(organization)
			.get()
			.then((doc) => {
				setPageTitle("Organization Settings");
				return doc.data().Locations;
			})
			.then((temp) => {
				const loComp = temp.map((locationName, index) => (
					<Price
						key={index}
						organization={organization}
						locationName={locationName}
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
				<Route path={`${path}/summary`}></Route>
				<Route path={`${path}/enforcement`}>
					<CommingSoon />
				</Route>
				<Route path={`${path}/organization`}>
					<CardList getJsx={getLocationPrices} />
				</Route>
				<Route path={`${path}/profile`}>
					<CommingSoon />
				</Route>
				<Route path={`${path}/messages`}>
					<CommingSoon />
				</Route>
			</Switch>
		</>
	);
};

export default Organization;
