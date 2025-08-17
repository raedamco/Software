import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Location from "./Location";
import { database } from "../FirebaseSetup";
import { doc, getDoc } from "firebase/firestore";

const LocationList = ({ organization, locationType }) => {
	const params = useParams();
	const [locations, setLocations] = useState([]);
	const [title, setTitle] = useState(organization);

	async function getLocation() {
		try {
			const companyDoc = await getDoc(doc(database, "Companies", organization));
			if (companyDoc.exists()) {
				const locationNames = companyDoc.data().Locations;
				const loComp = locationNames.map((locationName, index) => (
					<Location
						key={index}
						organization={organization}
						name={locationName}
					/>
				));
				setLocations([...loComp]);
			}
		} catch (error) {
			console.error("Error fetching locations:", error);
		}
	}

	async function getSubLocation() {
		try {
			let subLocationName = params.locationName.replaceAll("-", " ");
			const locationDoc = await getDoc(
				doc(database, "Companies", organization, "Data", subLocationName)
			);
			if (locationDoc.exists()) {
				setTitle(subLocationName);
				//TODO Fix floor data name in database
				const subLocationNames = Object.keys(locationDoc.data()["Floor Data"]);
				const loComp = subLocationNames.map((locationName, index) => (
					<Location
						key={index}
						organization={organization}
						name={locationName}
					/>
				));
				setLocations([...loComp]);
			}
		} catch (error) {
			console.error("Error fetching sub-locations:", error);
		}
	}

	useEffect(() => {
		if (locationType === "location") {
			getLocation();
		} else if (locationType === "sublocation") {
			getSubLocation();
		}
	}, [locationType, organization, params.locationName]);

	return (
		<div className="location-list-container">
			<div className="container">
				<div className="main" id="main">
					<h1 className="page-title" id="structureTitle">
						{title}
					</h1>
					<div className="location-grid">{locations}</div>
				</div>
			</div>
		</div>
	);
};

export default LocationList;
