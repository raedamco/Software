import { Route, Switch, useRouteMatch } from "react-router";
import CardList from "../common/CardList";
import ComingSoon from "../common/ComingSoon";
import NoData from "../common/NoData";
import Location from "./facilities/Location";
import SensorLog from "./facilities/SensorLog";
import SpotMap from "./facilities/SpotMap";
import Price from "./Price";
import Occupancy from "./occupancy";
import Profile from "../profile";
import { database } from "../FirebaseSetup";
import NewLocation from "./NewLocation";
import SwalForm from "../common/SweetAlert";

const Organization = ({ organization, authUser }) => {
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
				//TODO log to firebase logger
				console.log(error);
			});
	}

	function getLocations(setList, setPageTitle, urlParams) {
		database
			.collection("Companies")
			.doc(organization)
			.get()
			.then((doc) => {
				setPageTitle(doc.data().Info.Name);
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
				//TODO log to firebase logger
				console.log(error);
			});
	}

	function getSubLocations(setList, setPageTitle, urlParams) {
		let locationName = urlParams.locationName.replaceAll("-", " ");
		database
			.collection("Companies")
			.doc(organization)
			.collection("Data")
			.doc(locationName)
			.get()
			.then((doc) => {
				setPageTitle(locationName);
				//TODO Fix floor data name in database
				return Object.keys(doc.data()["Floor Data"]);
			})
			.then((temp) => {
				const loComp = temp.map((subLocationName, index) => (
					<Location
						key={index}
						organization={organization}
						title={locationName}
						name={subLocationName}
						locationType="sublocation"
					/>
				));
				setList([...loComp]);
			})
			.catch((error) => {
				//TODO log to firebase logger
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
				//TODO log to firebase logger
				console.log(error);
			});
	}

	const addLocationHtml = (
		<>
			<label htmlFor="name">Name</label>
			<input
				id="name"
				type="text"
				name="name"
				placeholder="Location Name"
				required
			/>
			<label htmlFor="address">Address</label>
			<input
				id="address"
				type="text"
				name="address"
				placeholder="Street Address"
				required
			/>
		</>
	);

	function createLocation({ name, address }) {
		database
			.collection("Companies")
			.doc(organization.replaceAll("-", " "))
			.collection("Data")
			.doc(name.value)
			.set({ name: name.value, address: address.value });
		//update database with new Location
		// Companies/ organization / new Location
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
				<Route path={`${path}/facilities/new-location`}>
					<NewLocation />
				</Route>
				<Route path={`${path}/facilities/:locationName`}>
					<CardList getJsx={getSubLocations} />
				</Route>
				<Route path={`${path}/facilities`}>
					<CardList
						getJsx={getLocations}
						addFunction={() => {
							SwalForm(addLocationHtml, createLocation);
						}}
					/>
				</Route>
				<Route path={`${path}/occupancy`}>
					<Occupancy organization={organization} />
				</Route>
				<Route path={`${path}/enforcement`}>
					<ComingSoon />
				</Route>
				<Route path={`${path}/organization`}>
					<CardList getJsx={getLocationPrices} />
				</Route>
				<Route path={`${path}/profile`}>
					<Profile organization={organization} authUser={authUser} />
				</Route>
				<Route path={`${path}/messages`}>
					<ComingSoon />
				</Route>
			</Switch>
		</>
	);
};

export default Organization;
