import { useEffect, useState } from "react";
import { useRouteMatch } from "react-router";
const database = window.firebase.firestore();

const Spot = ({ organization, data }) => {
	const { path, url, params } = useRouteMatch();
	const [statusColor, setStatusColor] = useState();
	const locationName = params.locationName.replaceAll("-", " ");
	const subLocationName = params.subLocationName.replaceAll("-", " ");

	function updateSpot() {
		console.log("SubLocation:", subLocationName);
		database
			.collection("Companies")
			.doc(organization)
			.collection("Data")
			.doc(locationName)
			.collection(subLocationName)
			.doc(`${data.Info["Spot ID"]}`)
			.onSnapshot((doc) => {
				if (doc.data().Occupancy.Occupied) {
					setStatusColor("red");
				} else {
					setStatusColor("green");
				}
			});
	}

	useEffect(() => {
		updateSpot();
	}, []);

	return (
		<div style={{ backgroundColor: statusColor, color: "white" }}>
			{data.Info["Spot ID"]}
		</div>
	);
};

export default Spot;
