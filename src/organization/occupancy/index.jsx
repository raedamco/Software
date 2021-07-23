import { useEffect, useState } from "react";
import HeatMap from "./HeapMap";
import LineGraph from "./LineGraph";
import { database } from "../../FirebaseSetup";

const Occupancy = ({ organization }) => {
	const [jsx, setJsx] = useState([]);

	function getJsx() {
		getSubLocations();
	}

	//TODO fix second location disappearing
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
								console.log(
									"Key:",
									`${location.replaceAll(" ", "")}${subLocation.replaceAll(
										" ",
										""
									)}`
								);
								compList.push(
									<article key={`${location}-${subLocation}`}>
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
									</article>
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

export default Occupancy;
