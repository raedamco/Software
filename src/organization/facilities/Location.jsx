import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { database } from "../../FirebaseSetup";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";

const Location = ({ organization, title = "", name, locationType }) => {
	const [free, setFree] = useState(0);
	const [total, setTotal] = useState(0);
	const [enabled, setEnabled] = useState(true);
	const [locationEnabled, setLocationEnabled] = useState(true);
	const params = useParams();
	const url = `/${params.organization}`;

	function getLocationCapacity() {
		const unsubscribe = onSnapshot(doc(database, "Companies", organization, "Data", name), (snapshot) => {
			if (snapshot.exists()) {
				const { Available, Capacity } = snapshot.data().Capacity;
				setFree(Available);
				setTotal(Capacity);
			}
		});
		return unsubscribe;
	}

	function getSubLocationCapacity() {
		const unsubscribe = onSnapshot(doc(database, "Companies", organization, "Data", title), (snapshot) => {
			if (snapshot.exists()) {
				const { Occupied, Unoccupied } = snapshot.data()["Floor Data"][name];
				setFree(Unoccupied.length);
				setTotal(Occupied.length + Unoccupied.length);
			}
		});
		return unsubscribe;
	}

	function getEnabled() {
		const unsubscribe = onSnapshot(doc(database, "Companies", organization, "Data", title ? title : name), (snapshot) => {
			if (snapshot.exists()) {
				if (locationType == "location") {
					let temp = snapshot.data().Active;
					setEnabled(temp);
					setLocationEnabled(temp);
				} else if (locationType == "sublocation") {
					let temp =
						snapshot.data().Active &&
						snapshot.data()["Floor Data"][name].Active;
					setEnabled(temp);
					setLocationEnabled(snapshot.data().Active);
				}
			}
		});
		return unsubscribe;
	}

	function rightClickHandler(event) {
		event.preventDefault();

		const popupHTML = (
			<>
				<h4>Enable/Disable: </h4>
				<button
					type="button"
					className="btn btn-success"
					onClick={() => {
						updateDatabase(true);
					}}
				>
					Enable
				</button>
				<button
					type="button"
					className="btn btn-error"
					onClick={() => {
						updateDatabase(false);
					}}
				>
					Disable
				</button>
				<br />
			</>
		);

		Swal.fire({
			title: title,
			html: popupHTML,
			showCancelButton: true,
			focusConfirm: false,
			scrollbarPadding: false,
		});

		// Update database with new selections
		async function updateDatabase(enable) {
			let newData;
			let successMsg;
			if (locationType == "location") {
				newData = {
					Active: enable,
				};
				successMsg = `${title} ${enable ? "enabled" : "disabled"} successfully`;
			} else if (locationType == "sublocation") {
				newData = {
					[`Floor Data.${name}.Active`]: enable,
				};
				successMsg = `${name} in ${title} ${
					enable ? "enabled" : "disabled"
				} successfully`;
			}

			try {
				await updateDoc(
					doc(database, "Companies", organization, "Data", title ? title : name),
					newData
				);
				
				Swal.fire({
					title: "Success",
					text: successMsg,
					icon: "success",
					confirmButtonText: "Close",
				});
				
				if (!locationEnabled && locationType == "sublocation") {
					Swal.fire({
						title: "Error",
						text: `Can't update ${name} while ${title} is disabled`,
						icon: "error",
						confirmButtonText: "Close",
					});
				}
			} catch (error) {
				console.error("Error:", error);
				Swal.fire({
					title: "Error",
					text: "Something went wrong while updating the database",
					icon: "error",
					confirmButtonText: "Close",
				});
			}
		}
	}

	useEffect(() => {
		let unsubscribeCapacity;
		let unsubscribeEnabled;

		if (locationType == "location") {
			unsubscribeCapacity = getLocationCapacity();
		} else if (locationType == "sublocation") {
			unsubscribeCapacity = getSubLocationCapacity();
		}
		unsubscribeEnabled = getEnabled();

		return () => {
			if (unsubscribeCapacity) unsubscribeCapacity();
			if (unsubscribeEnabled) unsubscribeEnabled();
		};
	}, [locationType, organization, name, title]);

	return (
		<Link to={`${url}/${name.replaceAll(" ", "-")}`} className="location-card-link">
			<div className={`location-card ${enabled ? 'enabled' : 'disabled'}`}>
				<div className="location-card-content" onContextMenu={rightClickHandler}>
					<div className="location-info">
						<h3 className="location-name">{name}</h3>
						<div className="location-status">
							<span className="spots-free">Spots Free: {free}/{total}</span>
						</div>
					</div>
				</div>
			</div>
		</Link>
	);
};

export default Location;
