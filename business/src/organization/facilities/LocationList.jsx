import { useEffect, useState } from "react";
import Location from "./Location";
const database = window.firebase.firestore();

const LocationList = ({ organization }) => {
	const [locations, setLocations] = useState([]);
	console.log("organization:", organization);

	function getStructures() {
		database
			.collection("Companies")
			.doc(organization)
			.get()
			.then((doc) => {
				return doc.data().Locations;
			})
			.then((temp) => {
				const loComp = temp.map((locationName, index) => (
					<Location
						key={index}
						organization={organization}
						name={locationName}
					/>
				));
				setLocations([...loComp]);
				console.log("Temp:", temp);
				console.log("loComp:", loComp);
				console.log("Locations:", locations);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	useEffect(() => {
		const abortController = new AbortController();
		getStructures();

		return () => abortController.abort();
	}, []);

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
								{organization}
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
