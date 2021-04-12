import { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router";
import ReactDOMServer from "react-dom/server";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Link } from "react-router-dom";

const SwalReact = withReactContent(Swal);
const database = window.firebase.firestore();

const Spot = ({ organization, data }) => {
	const { path, url, params } = useRouteMatch();
	const history = useHistory();

	const [statusColor, setStatusColor] = useState("");
	const [xPos, setXPos] = useState(0);
	const [yPos, setYPos] = useState(0);
	const [spotTypes, setSpotTypes] = useState([]);

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
				setSpotTypes(doc.data()["Spot Type"]);
				setXPos(doc.data().Layout.x);
				setYPos(doc.data().Layout.y);
				if (doc.data().Occupancy.Occupied) {
					setStatusColor("red");
				} else {
					setStatusColor("green");
				}
			});
	}

	async function spotAlert() {
		// Spot alert checklist
		let popupHTML = (
			<>
				<h4>Spot Type(s): </h4>
				<input
					type="checkbox"
					id="Hourly"
					name="Hourly"
					value={spotTypes.Hourly}
					checked={spotTypes.Hourly}
				/>
				<label for="Hourly">Hourly</label>
				<br />

				<input
					type="checkbox"
					id="Permit"
					name="Permit"
					value={spotTypes.Permit}
					checked={spotTypes.Permit}
				/>
				<label for="Permit">Permit</label>
				<br />

				<input
					type="checkbox"
					id="ADA"
					name="ADA"
					value={spotTypes.ADA}
					checked={spotTypes.ADA}
				/>
				<label for="ADA">ADA</label>
				<br />

				<input
					type="checkbox"
					id="EV"
					name="EV"
					value={spotTypes.EV}
					checked={spotTypes.EV}
				/>
				<label for="EV">EV</label>
				<br />

				<input
					type="checkbox"
					id="Leased"
					name="Leased"
					value={spotTypes.Leased}
					checked={spotTypes.Leased}
				/>
				<label for="Leased">Leased</label>
				<br />
			</>
		);

		// Display spot alert
		const { value: checkList } = await SwalReact.fire({
			title: "Settings for spot " + data.Info["Spot ID"],
			html: popupHTML,
			footer: (
				<button onClick={() => history.push(`${url}/${data.Info["Spot ID"]}`)}>
					Sensor Log
				</button>
			),
			showCancelButton: true,
			focusConfirm: false,
			preConfirm: () => {
				return [
					document.getElementById("Hourly").checked,
					document.getElementById("Permit").checked,
					document.getElementById("ADA").checked,
					document.getElementById("EV").checked,
					document.getElementById("Leased").checked,
				];
			},
		});

		// Update database with new selections
		if (checkList) {
			database
				.collection("Companies")
				.doc(organization)
				.collection("Data")
				.doc(locationName)
				.collection(subLocationName)
				.doc(`${data.Info["Spot ID"]}`)
				.update({
					"Spot Type.Hourly": checkList[0],
					"Spot Type.Permit": checkList[1],
					"Spot Type.ADA": checkList[2],
					"Spot Type.EV": checkList[3],
					"Spot Type.Leased": checkList[4],
				});
			//TODO check if there is an error before displaying success message
			SwalReact.fire({
				title: "Success",
				text: `Spot ${data.Info["Spot ID"]} type has been updated`,
				icon: "success",
				confirmButtonText: "Close",
			});
		}
	}

	useEffect(() => {
		updateSpot();
	}, []);

	return (
		<div
			className="parking-spot"
			style={{
				backgroundColor: statusColor,
				top: `${yPos}%`,
				left: `${xPos}%`,
			}}
			onClick={spotAlert}
		>
			{data.Info["Spot ID"]}
		</div>
	);
};

export default Spot;
