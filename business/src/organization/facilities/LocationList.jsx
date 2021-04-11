import { useEffect, useState } from "react";
import { useRouteMatch } from "react-router";
import Location from "./Location";
const database = window.firebase.firestore();

const LocationList = ({ organization, locationType }) => {
	const { path, url, params } = useRouteMatch();
	const [locations, setLocations] = useState([]);
	const [title, setTitle] = useState(organization);

	function getLocation() {
		database
			.collection("Companies")
			.doc(organization)
			.get()
			.then((doc) => {
				return doc.data().Locations;
			})
			.then((temp) => {
				console.log("locations:", temp);
				const loComp = temp.map((locationName, index) => (
					<Location
						key={index}
						organization={organization}
						name={locationName}
					/>
				));
				setLocations([...loComp]);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	function getSubLocation() {
		let subLocationName = params.locationName.replaceAll("-", " ");
		database
			.collection("Companies")
			.doc(organization)
			.collection("Data")
			.doc(subLocationName)
			.get()
			.then((doc) => {
				setTitle(subLocationName);
				//TODO Fix floor data name in database
				return Object.keys(doc.data()["Floor Data"]);
			})
			.then((temp) => {
				console.log("temp:", temp);
				const loComp = temp.map((locationName, index) => (
					<Location
						key={index}
						organization={organization}
						name={locationName}
					/>
				));
				setLocations([...loComp]);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	useEffect(() => {
		const abortController = new AbortController();
		if (locationType === "location") {
			getLocation();
		} else if (locationType === "sublocation") {
			getSubLocation();
		}

		return () => abortController.abort();
	}, [locationType]);

	return (
		<div className="tp-services" id="container">
			<div className="container">
				<div className="row">
					{/* TODO animate-box was causing issues with below div */}
					<div className="col-md-12 text-center">
						<div className="main" id="main">
							<h1
								id="structureTitle"
								style={{ paddingTop: "50px", paddingBottom: "50px" }}
							>
								{title}
							</h1>
							<div>{locations}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LocationList;
