//TODO clean up code later
import { useEffect } from "react";
import useState from "react-usestateref";
import { useHistory, useRouteMatch } from "react-router";
import { database } from "../../FirebaseSetup";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const SwalReact = withReactContent(Swal);

const Spot = ({ organization, data }) => {
	const { path, url, params } = useRouteMatch();
	const history = useHistory();

	//const initialFormState = {}

	const [statusColor, setStatusColor] = useState("");
	const [xPos, setXPos] = useState(0);
	const [yPos, setYPos] = useState(0);
	const [spotTypes, setSpotTypes] = useState({}); // On submit
	const [formData, setFormData, formDataRef] = useState({}); // On change

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
		const changeObj = { ...formDataRef.current };
		changeObj[target.name] = target.checked;

		setFormData(changeObj);
	};

	function spotAlert() {
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
	}

	// Update database with new selections
	async function updateDatabase() {
		database
			.collection("Companies")
			.doc(organization)
			.collection("Data")
			.doc(locationName)
			.collection(subLocationName)
			.doc(`${data.Info["Spot ID"]}`)
			.update({
				"Spot Type.Hourly": formDataRef.current.Hourly,
				"Spot Type.Permit": formDataRef.current.Permit,
				"Spot Type.ADA": formDataRef.current.ADA,
				"Spot Type.EV": formDataRef.current.EV,
				"Spot Type.Leased": formDataRef.current.Leased,
			})
			.then(() => {
				setSpotTypes(formDataRef.current);

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
