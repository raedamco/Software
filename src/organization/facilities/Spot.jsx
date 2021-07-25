//TODO clean up code later
import { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router";
import { database } from "../../FirebaseSetup";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import SwalForm, { SwalFail, SwalSuccess } from "../../common/SweetAlert";
const SwalReact = withReactContent(Swal);

const Spot = ({ organization, data }) => {
	const { path, url, params } = useRouteMatch();
	const history = useHistory();

	const [statusColor, setStatusColor] = useState("");
	const [xPos, setXPos] = useState(0);
	const [yPos, setYPos] = useState(0);
	const [spotTypes, setSpotTypes] = useState({}); // On submit

	const locationName = params.locationName.replaceAll("-", " ");
	const subLocationName = params.subLocationName.replaceAll("-", " ");

	function updateSpot() {
		database
			.collection("Companies")
			.doc(organization)
			.collection("Data")
			.doc(locationName)
			.collection(subLocationName)
			.doc(`${data.Info["Spot ID"]}`)
			.onSnapshot((doc) => {
				const types = doc.data()["Spot Type"];
				setSpotTypes(types);
				setXPos(doc.data().Layout.x);
				setYPos(doc.data().Layout.y);
				if (doc.data().Occupancy.Occupied) {
					setStatusColor("red");
				} else {
					setStatusColor("green");
				}
			});
	}

	function spotAlert() {
		// Spot alert checklist
		let popupHtml = (
			<>
				<h4>Spot Type(s): </h4>
				<input
					type="checkbox"
					id="Hourly"
					name="Hourly"
					defaultChecked={spotTypes.Hourly}
				/>
				<label htmlFor="Hourly">Hourly</label>
				<br />

				<input
					type="checkbox"
					id="Permit"
					name="Permit"
					defaultChecked={spotTypes.Permit}
				/>
				<label htmlFor="Permit">Permit</label>
				<br />

				<input
					type="checkbox"
					id="ADA"
					name="ADA"
					defaultChecked={spotTypes.ADA}
				/>
				<label htmlFor="ADA">ADA</label>
				<br />

				<input
					type="checkbox"
					id="EV"
					name="EV"
					defaultChecked={spotTypes.EV}
				/>
				<label htmlFor="EV">EV</label>
				<br />

				<input
					type="checkbox"
					id="Leased"
					name="Leased"
					defaultChecked={spotTypes.Leased}
				/>
				<label htmlFor="Leased">Leased</label>
				<br />
			</>
		);

		const footerHtml = (
			<button
				onClick={() => {
					SwalReact.close();
					history.push(`${url}/${data.Info["Spot ID"]}`);
				}}
			>
				Sensor Log
			</button>
		);

		// Display spot alert
		SwalForm(popupHtml, updateDatabase, footerHtml);
	}

	// Update database with new selections
	async function updateDatabase({ Hourly, Permit, ADA, EV, Leased }) {
		console.log(
			"FormData:",
			Hourly.value,
			Permit.value,
			ADA.value,
			EV.value,
			Leased.value
		);
		const abortController = new AbortController();
		database
			.collection("Companies")
			.doc(organization)
			.collection("Data")
			.doc(locationName)
			.collection(subLocationName)
			.doc(`${data.Info["Spot ID"]}`)
			.update({
				"Spot Type.Hourly": Hourly.checked,
				"Spot Type.Permit": Permit.checked,
				"Spot Type.ADA": ADA.checked,
				"Spot Type.EV": EV.checked,
				"Spot Type.Leased": Leased.checked,
			})
			.then(() => {
				SwalSuccess(`Spot ${data.Info["Spot ID"]} type has been updated`);
			})
			.catch((error) => {
				SwalFail("Something went wrong while updating the database", error);
			});
		return () => abortController.abort();
	}

	useEffect(() => {
		const abortController = new AbortController();
		updateSpot();
		return () => abortController.abort();
	}, []);

	return (
		<div
			className="parking-spot"
			style={{
				backgroundColor: statusColor,
				top: `${yPos}%`,
				left: `${xPos}%`,
			}}
			onClick={() => {
				const abortController = new AbortController();
				spotAlert();
				return () => abortController.abort();
			}}
		>
			{data.Info["Spot ID"]}
		</div>
	);
};

export default Spot;
