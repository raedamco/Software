import { useEffect, useState } from "react";
import { database } from "../FirebaseSetup";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const SwalReact = withReactContent(Swal);

const Price = ({ organization, locationName }) => {
	const [day, setDay] = useState(0);
	const [hour, setHour] = useState(0);
	const [minute, setMinute] = useState(0);

	function getPrice() {
		database
			.collection("Companies")
			.doc(organization)
			.collection("Data")
			.doc(locationName)
			.onSnapshot((doc) => {
				setDay(doc.data().Pricing.Day);
				setHour(doc.data().Pricing.Hour);
				setMinute(doc.data().Pricing.Minute);
			});
	}

	useEffect(() => {
		const abortController = new AbortController();
		getPrice();
		return () => abortController.abort();
	}, []);

	function priceChanger() {
		const alertHtml = (
			<>
				<label class="price-label" htmlFor="minute">
					Minute
				</label>
				<input
					type="number"
					id="minute"
					min="0.01"
					step="0.01"
					defaultValue={minute}
				/>
				<br />
				<label class="price-label" htmlFor="hour">
					Hour
				</label>
				<input
					type="number"
					id="hour"
					min="0.01"
					step="0.05"
					defaultValue={hour}
				/>
				<br />
				<label class="price-label" htmlFor="day">
					Day
				</label>
				<input
					type="number"
					id="day"
					min="0.01"
					step="0.25"
					defaultValue={day}
				/>
				<br />
			</>
		);
		SwalReact.fire({
			html: alertHtml,
			focusConfirm: false,
			preConfirm: () => {
				const minutePrice = SwalReact.getPopup().querySelector("#minute").value;
				const hourPrice = SwalReact.getPopup().querySelector("#hour").value;
				const dayPrice = SwalReact.getPopup().querySelector("#day").value;
				updateDatabase(minutePrice, hourPrice, dayPrice);
			},
		});
	}

	function updateDatabase(minutePrice, hourPrice, dayPrice) {
		database
			.collection("Companies")
			.doc(organization)
			.collection("Data")
			.doc(locationName)
			.update({
				"Pricing.Minute": minutePrice,
				"Pricing.Hour": hourPrice,
				"Pricing.Day": dayPrice,
			})
			.then(() => {
				SwalReact.fire({
					title: "Success",
					text: `Rates have been updated`,
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

	return (
		<div className="card-btn panel panel-default mb-2">
			<div className="panel-body container" onClick={priceChanger}>
				<div className="d-flex justify-content-between row">
					<table className="table" style={{ margin: "0" }}>
						<tbody>
							<tr>
								<td>
									<h3
										className="text-success text-left"
										style={{ margin: "0 0 0 15px" }}
									>
										{locationName}
									</h3>
								</td>
								<td>
									{/* TODO Spots free is spilling over the side. Fixed by adding extra margin */}
									<h3
										className="text-success text-right"
										style={{ margin: "0 45px 0 0" }}
									>
										Day: ${day}
										<br />
										Hour: ${hour}
										<br />
										Minute: ${minute}
									</h3>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default Price;
