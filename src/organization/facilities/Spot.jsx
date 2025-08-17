//TODO clean up code later
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { database } from "../../FirebaseSetup";
import Swal from "sweetalert2";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";

const Spot = ({ organization, data }) => {
	const params = useParams();
	const navigate = useNavigate();

	const [statusColor, setStatusColor] = useState("");
	const [xPos, setXPos] = useState(0);
	const [yPos, setYPos] = useState(0);
	const [spotTypes, setSpotTypes] = useState({}); // On submit
	const [formData, setFormData] = useState({}); // On change

	const locationName = params.locationName.replaceAll("-", " ");
	const subLocationName = params.subLocationName.replaceAll("-", " ");

	function updateSpot() {
		const unsubscribe = onSnapshot(
			doc(database, "Companies", organization, "Data", locationName, subLocationName, `${data.Info["Spot ID"]}`),
			(doc) => {
				if (doc.exists()) {
					const types = doc.data()["Spot Type"];
					setSpotTypes(types);
					setFormData(types);
					setXPos(doc.data().Layout.x);
					setYPos(doc.data().Layout.y);
					if (doc.data().Occupancy.Occupied) {
						setStatusColor("var(--error)");
					} else {
						setStatusColor("var(--success)");
					}
				}
			}
		);
		return unsubscribe;
	}

	const handleChange = ({ target }) => {
		setFormData(prev => ({
			...prev,
			[target.name]: target.checked
		}));
	};

	function spotAlert() {
		// Display spot alert
		Swal.fire({
			title: "Settings for spot " + data.Info["Spot ID"],
			html: `
				<div class="spot-settings-form">
					<div class="form-group">
						<label class="checkbox-label">
							<input
								type="checkbox"
								id="Hourly"
								name="Hourly"
								${spotTypes.Hourly ? 'checked' : ''}
								onChange="this.dispatchEvent(new Event('change', { bubbles: true }))"
							/>
							<span class="checkmark"></span>
							Hourly
						</label>
					</div>
					<div class="form-group">
						<label class="checkbox-label">
							<input
								type="checkbox"
								id="Permit"
								name="Permit"
								${spotTypes.Permit ? 'checked' : ''}
								onChange="this.dispatchEvent(new Event('change', { bubbles: true }))"
							/>
							<span class="checkmark"></span>
							Permit
						</label>
					</div>
					<div class="form-group">
						<label class="checkbox-label">
							<input
								type="checkbox"
								id="ADA"
								name="ADA"
								${spotTypes.ADA ? 'checked' : ''}
								onChange="this.dispatchEvent(new Event('change', { bubbles: true }))"
							/>
							<span class="checkmark"></span>
							ADA
						</label>
					</div>
					<div class="form-group">
						<label class="checkbox-label">
							<input
								type="checkbox"
								id="EV"
								name="EV"
								${spotTypes.EV ? 'checked' : ''}
								onChange="this.dispatchEvent(new Event('change', { bubbles: true }))"
							/>
							<span class="checkmark"></span>
							EV
						</label>
					</div>
					<div class="form-group">
						<label class="checkbox-label">
							<input
								type="checkbox"
								id="Leased"
								name="Leased"
								${spotTypes.Leased ? 'checked' : ''}
								onChange="this.dispatchEvent(new Event('change', { bubbles: true }))"
							/>
							<span class="checkmark"></span>
							Leased
						</label>
					</div>
				</div>
			`,
			footer: `
				<button class="btn btn-secondary" onclick="window.spotSensorLog()">
					Sensor Log
				</button>
			`,
			showCancelButton: true,
			focusConfirm: false,
			preConfirm: () => {
				return updateDatabase();
			},
			didOpen: () => {
				// Add event listeners for checkboxes
				document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
					checkbox.addEventListener('change', handleChange);
				});
				
				// Add global function for sensor log button
				window.spotSensorLog = () => {
					Swal.close();
					navigate(`${params.organization}/facilities/${params.locationName}/${params.subLocationName}/${data.Info["Spot ID"]}`);
				};
			}
		});
	}

	// Update database with new selections
	async function updateDatabase() {
		try {
			await updateDoc(
				doc(database, "Companies", organization, "Data", locationName, subLocationName, `${data.Info["Spot ID"]}`),
				{
					"Spot Type.Hourly": formData.Hourly,
					"Spot Type.Permit": formData.Permit,
					"Spot Type.ADA": formData.ADA,
					"Spot Type.EV": formData.EV,
					"Spot Type.Leased": formData.Leased,
				}
			);
			
			setSpotTypes(formData);

			Swal.fire({
				title: "Success",
				text: `Spot ${data.Info["Spot ID"]} type has been updated`,
				icon: "success",
				confirmButtonText: "Close",
			});
		} catch (error) {
			console.error("Error updating spot:", error);
			Swal.fire({
				title: "Error",
				text: "Something went wrong while updating the database",
				icon: "error",
				confirmButtonText: "Close",
			});
		}
	}

	useEffect(() => {
		const unsubscribe = updateSpot();
		return () => {
			if (unsubscribe) unsubscribe();
		};
	}, [organization, locationName, subLocationName, data.Info["Spot ID"]]);

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
