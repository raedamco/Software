import { useEffect, useState } from "react";
import { useRouteMatch } from "react-router";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const SwalReact = withReactContent(Swal);
const database = window.firebase.firestore();

const Location = ({ organization, title = "", name, locationType }) => {
	const [free, setFree] = useState(0);
	const [total, setTotal] = useState(0);
	const [enabled, setEnabled] = useState(true);
	const [locationEnabled, setLocationEnabled] = useState(true);
	const { path, url, params } = useRouteMatch();

	function getLocationCapacity() {
		database
			.collection("Companies")
			.doc(organization)
			.collection("Data")
			.doc(name)
			.onSnapshot((snapshot) => {
				const { Available, Capacity } = snapshot.data().Capacity;
				setFree(Available);
				setTotal(Capacity);
			});
	}

	function getSubLocationCapacity() {
		database
			.collection("Companies")
			.doc(organization)
			.collection("Data")
			.doc(title)
			.onSnapshot((snapshot) => {
				const { Occupied, Unoccupied } = snapshot.data()["Floor Data"][name];
				setFree(Unoccupied.length);
				setTotal(Occupied.length + Unoccupied.length);
			});
	}

	function getEnabled() {
		database
			.collection("Companies")
			.doc(organization)
			.collection("Data")
			.doc(title ? title : name)
			.onSnapshot((snapshot) => {
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
			});
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
					className="btn btn-danger"
					onClick={() => {
						updateDatabase(false);
					}}
				>
					Disable
				</button>
				<br />
			</>
		);

		SwalReact.fire({
			title: title,
			html: popupHTML,
			showCancelButton: true,
			focusConfirm: false,
			scrollbarPadding: false,
		});

		// Update database with new selections
		function updateDatabase(enable) {
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

			database
				.collection("Companies")
				.doc(organization)
				.collection("Data")
				.doc(title ? title : name)
				.update(newData)
				.then(() => {
					SwalReact.fire({
						title: "Success",
						text: successMsg,
						icon: "success",
						confirmButtonText: "Close",
					});
					if (!locationEnabled && locationType == "sublocation") {
						SwalReact.fire({
							title: "Error",
							text: `Can't update ${name} while ${title} is disabled`,
							icon: "error",
							confirmButtonText: "Close",
						});
					}
				})
				.catch((error) => {
					console.log("Error:", error);
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
		const abortController = new AbortController();
		if (locationType == "location") {
			getLocationCapacity();
		} else if (locationType == "sublocation") {
			getSubLocationCapacity();
		}
		getEnabled();
		return () => abortController.abort();
	}, [locationType]);

	useEffect(() => {
		const abortController = new AbortController();

		return () => abortController.abort();
	}, [locationType]);

	return (
		<Link to={`${url}/${name.replaceAll(" ", "-")}`}>
			<div className="card-btn panel panel-default mb-2">
				<div
					className={`panel-body container ${
						enabled ? "bg-success" : "bg-danger"
					}`}
					onContextMenu={rightClickHandler}
				>
					<div className="d-flex justify-content-between row">
						<table className="table" style={{ margin: "0" }}>
							<tbody>
								<tr>
									<td>
										<h3
											className="text-success text-left"
											style={{ margin: "0 0 0 15px" }}
										>
											{name}
										</h3>
									</td>
									<td>
										{/* TODO Spots free is spilling over the side. Fixed by adding extra margin */}
										<h3
											className="text-success text-right"
											style={{ margin: "0 45px 0 0" }}
										>
											Spots Free: {free}/{total}
										</h3>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</Link>
	);
};

export default Location;
