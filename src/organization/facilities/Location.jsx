import { useEffect, useState } from "react";
import { useRouteMatch } from "react-router";
import { useHistory } from "react-router-dom";
import Card from "../../common/Card";
import SwalForm, { SwalFail, SwalSuccess } from "../../common/SweetAlert";
import { database } from "../../FirebaseSetup";

const Location = ({ organization, title = "", name, locationType }) => {
	const [free, setFree] = useState(0);
	const [total, setTotal] = useState(0);
	const [enabled, setEnabled] = useState(true);
	const [locationEnabled, setLocationEnabled] = useState(true);
	const { path, url, params } = useRouteMatch();
	const history = useHistory();

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
		if (locationType == "location") {
			event.preventDefault();

			const popupHTML = (
				<>
					<label class="free-label" htmlFor="free">
						Spots Free
					</label>
					<input
						type="number"
						id="free"
						min="0"
						max={total}
						defaultValue={free}
					/>
					<br />
					<label class="total-label" htmlFor="total">
						Capacity
					</label>
					<input type="number" id="total" min="0" defaultValue={total} />
					<br />
				</>
			);

			SwalForm(popupHTML, updateDatabase);
		}

		function updateDatabase({ free, total }) {
			let newData;
			let successMsg;
			if (locationType == "location") {
				newData = {
					[`Capacity.Available`]: parseInt(free.value),
					[`Capacity.Capacity`]: parseInt(total.value),
				};
				successMsg = `${title} updated successfully`;

				const abortController = new AbortController();
				database
					.collection("Companies")
					.doc(organization)
					.collection("Data")
					.doc(title ? title : name)
					.update(newData)
					.then(() => {
						SwalSuccess(successMsg);
						if (!locationEnabled && locationType == "sublocation") {
							SwalFail(`Can't update ${name} while ${title} is disabled`);
						}
					})
					.catch((error) => {
						SwalFail("Something went wrong while updating the database", error);
					});
				return () => abortController.abort();
			}
		}
	}

	// Update database with new selections
	function toggleHandler(enable) {
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

		const abortController = new AbortController();
		database
			.collection("Companies")
			.doc(organization)
			.collection("Data")
			.doc(title ? title : name)
			.update(newData)
			.then(() => {
				// SwalSuccess(successMsg);
				if (!locationEnabled && locationType == "sublocation") {
					SwalFail(`Can't update ${name} while ${title} is disabled`);
				}
			})
			.catch((error) => {
				SwalFail("Something went wrong while updating the database", error);
			});
		return () => abortController.abort();
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

	return (
		<Card
			leftClickHandler={() => {
				history.push(`${url}/${name.replaceAll(" ", "-")}`);
			}}
			toggleHandler={toggleHandler}
			enabled={enabled}
			rightClickHandler={rightClickHandler}
		>
			<h3 className="text-success">{name}</h3>
			<h3 className="text-success">
				Spots Free: {free}/{total}
			</h3>
		</Card>
	);
};

export default Location;
