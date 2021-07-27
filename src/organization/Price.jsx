import { useEffect, useState } from "react";
import { database } from "../FirebaseSetup";
import { SwalFail, SwalForm, SwalSuccess } from "../common/SweetAlert";
import Card from "../common/Card";
import { useHistory } from "react-router-dom";

const Price = ({ organization, locationName }) => {
	const [day, setDay] = useState(0);
	const [hour, setHour] = useState(0);
	const [minute, setMinute] = useState(0);
	const history = useHistory();

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

	const alertHtml = (
		<>
			<label class="price-label" htmlFor="day">
				Day
			</label>
			<input type="number" id="day" min="0.01" step="0.25" defaultValue={day} />
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
		</>
	);

	function updateDatabase({ minute, hour, day }) {
		database
			.collection("Companies")
			.doc(organization)
			.collection("Data")
			.doc(locationName)
			.update({
				"Pricing.Minute": parseFloat(minute.value),
				"Pricing.Hour": parseFloat(hour.value),
				"Pricing.Day": parseFloat(day.value),
			})
			.then(() => {
				SwalSuccess("Rates have been updated");
			})
			.catch(() => {
				SwalFail("Something went wrong while updating the database");
			});
	}

	return (
		<Card
			leftClickHandler={() => {
				history.push(`/${locationName.replaceAll(" ", "-")}/facilities`);
			}}
			rightClickHandler={(e) => {
				e.preventDefault();
				SwalForm(alertHtml, updateDatabase);
			}}
		>
			<h3 className="text-success text-left">{locationName}</h3>
			<h3 className="text-success text-right">
				Day: ${day}
				<br />
				Hour: ${hour}
				<br />
				Minute: ${minute}
			</h3>
		</Card>
	);
};

export default Price;
