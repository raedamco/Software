import { useEffect, useState } from "react";
import HeatMap from "./HeapMap";
import LineGraph from "./LineGraph";

const database = window.firebase.firestore();

const Summary = ({ organization }) => {
	const [jsx, setJsx] = useState([]);

	function getJsx() {
		getSubLocations();
	}

	function getSubLocations() {
		let compList = [];
		database
			.collection("Companies")
			.doc(organization)
			.get()
			.then((doc) => {
				return doc.data().Locations;
			})
			.then((locations) => {
				locations.forEach((location) => {
					database
						.collection("Companies")
						.doc(organization)
						.collection("Data")
						.doc(location)
						.get()
						.then((doc) => {
							return Object.keys(doc.data()["Floor Data"]);
						})
						.then((subLocations) => {
							subLocations.forEach((subLocation) => {
								compList.push(
									<div key={`${location}-${subLocation}`}>
										<LineGraph
											organization={organization}
											location={location}
											subLocation={subLocation}
										/>
										<HeatMap
											organization={organization}
											location={location}
											subLocation={subLocation}
										/>
									</div>
								);
							});
							setJsx(compList);
						});
				});
			})
			.catch((error) => console.log(error));
	}

	useEffect(() => {
		const abortController = new AbortController();
		getJsx();
		return () => abortController.abort();
	}, []);

	return <>{jsx}</>;
};

export default Summary;
