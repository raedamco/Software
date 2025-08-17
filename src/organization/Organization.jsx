import { Routes, Route, useParams } from "react-router";
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
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

const Organization = ({ organization, authUser }) => {
	const params = useParams();
	const path = `/${params.organization}`;

	async function getLogs(setList, setPageTitle, urlParams) {
		const locationName = urlParams.locationName.replaceAll("-", " ");
		const subLocationName = urlParams.subLocationName.replaceAll("-", " ");

		try {
			const logsCollection = collection(
				database,
				"Companies",
				organization,
				"Data",
				locationName,
				subLocationName,
				`${urlParams.spotId}`,
				"Data"
			);
			const querySnapshot = await getDocs(logsCollection);
			
			setPageTitle(`Data log for spot ${urlParams.spotId}`);
			let temp = [];
			if (!querySnapshot.size) {
				temp.push(<NoData />);
				setList(temp);
				return;
			}
			let index = 0;
			querySnapshot.forEach((doc) => {
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
		} catch (error) {
			console.error("Error fetching logs:", error);
		}
	}

	async function getLocations(setList, setPageTitle, urlParams) {
		try {
			const companyDoc = await getDoc(doc(database, "Companies", organization));
			if (companyDoc.exists()) {
				setPageTitle(companyDoc.data().Info.Name);
				const locations = companyDoc.data().Locations;
				const loComp = locations.map((locationName, index) => (
					<Location
						key={index}
						organization={organization}
						name={locationName}
						locationType="location"
					/>
				));
				setList([...loComp]);
			}
		} catch (error) {
			console.error("Error fetching locations:", error);
		}
	}

	async function getSubLocations(setList, setPageTitle, urlParams) {
		let locationName = urlParams.locationName.replaceAll("-", " ");
		try {
			const locationDoc = await getDoc(
				doc(database, "Companies", organization, "Data", locationName)
			);
			if (locationDoc.exists()) {
				setPageTitle(locationName);
				//TODO Fix floor data name in database
				const subLocations = Object.keys(locationDoc.data()["Floor Data"]);
				const loComp = subLocations.map((subLocationName, index) => (
					<Location
						key={index}
						organization={organization}
						title={locationName}
						name={subLocationName}
						locationType="sublocation"
					/>
				));
				setList([...loComp]);
			}
		} catch (error) {
			console.error("Error fetching sub-locations:", error);
		}
	}

	async function getLocationPrices(setList, setPageTitle, urlParams) {
		try {
			const companyDoc = await getDoc(doc(database, "Companies", organization));
			if (companyDoc.exists()) {
				setPageTitle("Organization Settings");
				const locations = companyDoc.data().Locations;
				const loComp = locations.map((locationName, index) => (
					<Price
						key={index}
						organization={organization}
						locationName={locationName}
					/>
				));
				setList([...loComp]);
			}
		} catch (error) {
			console.error("Error fetching location prices:", error);
		}
	}

	return (
		<>
			<Routes>
				<Route
					path={`${path}/facilities/:locationName/:subLocationName/:spotId`}
					element={<CardList getJsx={getLogs} />}
				/>
				<Route 
					path={`${path}/facilities/:locationName/:subLocationName`}
					element={<SpotMap organization={organization} />}
				/>
				<Route 
					path={`${path}/facilities/:locationName`}
					element={<CardList getJsx={getSubLocations} />}
				/>
				<Route 
					path={`${path}/facilities`}
					element={<CardList getJsx={getLocations} />}
				/>
				<Route 
					path={`${path}/occupancy`}
					element={<Occupancy organization={organization} />}
				/>
				<Route 
					path={`${path}/enforcement`}
					element={<ComingSoon />}
				/>
				<Route 
					path={`${path}/organization`}
					element={<CardList getJsx={getLocationPrices} />}
				/>
				<Route 
					path={`${path}/profile`}
					element={<Profile organization={organization} authUser={authUser} />}
				/>
				<Route 
					path={`${path}/messages`}
					element={<ComingSoon />}
				/>
			</Routes>
		</>
	);
};

export default Organization;
