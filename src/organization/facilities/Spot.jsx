import { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const SwalReact = withReactContent(Swal);
const database = window.firebase.firestore();

const Spot = ({ organization, data }) => {
	const { path, url, params } = useRouteMatch();
	const history = useHistory();

	//const initialFormState = {}

	const [statusColor, setStatusColor] = useState("");
	const [xPos, setXPos] = useState(0);
	const [yPos, setYPos] = useState(0);
	const [spotTypes, setSpotTypes] = useState({}); // On submit
	const [formData, setFormData] = useState({}); // On change

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
				setFormData(types);
				setXPos(doc.data().Layout.x);
				setYPos(doc.data().Layout.y);
				if (doc.data().Occupancy.Occupied) {
					setStatusColor("red");
				} else {
					setStatusColor("green");
				}
			});
	}

	const handleChange = ({ target }) => {
		console.log("Name:", target.name);
		console.log("Checked:", target.checked);
		setFormData({
			...formData,
			[target.name]: target.checked,
		});
	};

	async function spotAlert() {
		// Spot alert checklist
		let popupHTML = (
			<>
				<h4>Spot Type(s): </h4>
				<input
					type="checkbox"
					id="Hourly"
					name="Hourly"
					defaultChecked={spotTypes.Hourly}
					onChange={handleChange}
				/>
				<label htmlFor="Hourly">Hourly</label>
				<br />

				<input
					type="checkbox"
					id="Permit"
					name="Permit"
					defaultChecked={spotTypes.Permit}
					onChange={handleChange}
				/>
				<label htmlFor="Permit">Permit</label>
				<br />

				<input
					type="checkbox"
					id="ADA"
					name="ADA"
					defaultChecked={spotTypes.ADA}
					onChange={handleChange}
				/>
				<label htmlFor="ADA">ADA</label>
				<br />

				<input
					type="checkbox"
					id="EV"
					name="EV"
					defaultChecked={spotTypes.EV}
					onChange={handleChange}
				/>
				<label htmlFor="EV">EV</label>
				<br />

				<input
					type="checkbox"
					id="Leased"
					name="Leased"
					defaultChecked={spotTypes.Leased}
					onChange={handleChange}
				/>
				<label htmlFor="Leased">Leased</label>
				<br />
			</>
		);

		// Display spot alert
		SwalReact.fire({
			title: "Settings for spot " + data.Info["Spot ID"],
			html: popupHTML,
			footer: (
				<button
					onClick={() => {
						SwalReact.close();
						history.push(`${url}/${data.Info["Spot ID"]}`);
					}}
				>
					Sensor Log
				</button>
			),
			showCancelButton: true,
			focusConfirm: false,
			preConfirm: () => {
				updateDatabase();
			},
		});

		// Update database with new selections
		function updateDatabase() {
			database
				.collection("Companies")
				.doc(organization)
				.collection("Data")
				.doc(locationName)
				.collection(subLocationName)
				.doc(`${data.Info["Spot ID"]}`)
				.update({
					"Spot Type.Hourly": formData.Hourly,
					"Spot Type.Permit": formData.Permit,
					"Spot Type.ADA": formData.ADA,
					"Spot Type.EV": formData.EV,
					"Spot Type.Leased": formData.Leased,
				})
				.then(() => {
					setSpotTypes(formData);

					SwalReact.fire({
						title: "Success",
						text: `Spot ${data.Info["Spot ID"]} type has been updated`,
						icon: "success",
						confirmButtonText: "Close",
					});
				})
				.catch(() => {
					//TODO log to firebase logger
					SwalReact.fire({
						title: "Error",
						text: "Something went wrong while updating the database",
						icon: "error",
						confirmButtonText: "Close",
					});
				});
		}
	}

	useEffect(() => {
		updateSpot();
	}, []);

	useEffect(() => {
		console.log("Form data:", formData);
	}, [formData]);

	useEffect(() => {
		console.log("Spot Types:", spotTypes);
	}, [spotTypes]);

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
