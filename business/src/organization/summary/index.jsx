import { useEffect, useState } from "react";
import HeatMap from "./HeapMap";
import LineGraph from "./LineGraph";

const database = window.firebase.firestore();

const Summary = ({ organization }) => {
	const [jsx, setJsx] = useState([]);

	function getJsx() {
		getSubLocations();
	}

	//TODO fix second location disappearing
	function getSubLocations() {
		let start = Date.now();
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
								console.log(
									"Key:",
									`${location.replaceAll(" ", "")}${subLocation.replaceAll(
										" ",
										""
									)}`
								);
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
							let delta = Date.now() - start;
							let seconds = Math.floor(delta / 1000);
							console.log("GetSublocations seconds:", seconds);
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
