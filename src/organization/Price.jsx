import { useEffect, useState } from "react";
import { database } from "../FirebaseSetup";
import Swal from "sweetalert2";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";

const Price = ({ organization, locationName }) => {
	const [day, setDay] = useState(0);
	const [hour, setHour] = useState(0);
	const [minute, setMinute] = useState(0);

	function getPrice() {
		const unsubscribe = onSnapshot(doc(database, "Companies", organization, "Data", locationName), (doc) => {
			if (doc.exists()) {
				setDay(doc.data().Pricing.Day);
				setHour(doc.data().Pricing.Hour);
				setMinute(doc.data().Pricing.Minute);
			}
		});
		return unsubscribe;
	}

	useEffect(() => {
		const unsubscribe = getPrice();
		return () => {
			if (unsubscribe) unsubscribe();
		};
	}, [organization, locationName]);

	function priceChanger() {
		Swal.fire({
			title: "Update Pricing",
			html: `
				<div class="price-form">
					<div class="form-group">
						<label class="form-label" for="minute">Minute</label>
						<input
							type="number"
							id="minute"
							min="0.01"
							step="0.01"
							value="${minute}"
							class="form-input"
						/>
					</div>
					<div class="form-group">
						<label class="form-label" for="hour">Hour</label>
						<input
							type="number"
							id="hour"
							min="0.01"
							step="0.05"
							value="${hour}"
							class="form-input"
						/>
					</div>
					<div class="form-group">
						<label class="form-label" for="day">Day</label>
						<input
							type="number"
							id="day"
							min="0.01"
							step="0.25"
							value="${day}"
							class="form-input"
						/>
					</div>
				</div>
			`,
			showCancelButton: true,
			focusConfirm: false,
			preConfirm: () => {
				const minutePrice = document.getElementById("minute").value;
				const hourPrice = document.getElementById("hour").value;
				const dayPrice = document.getElementById("day").value;
				return updateDatabase(minutePrice, hourPrice, dayPrice);
			},
		});
	}

	async function updateDatabase(minutePrice, hourPrice, dayPrice) {
		try {
			await updateDoc(doc(database, "Companies", organization, "Data", locationName), {
				"Pricing.Minute": parseFloat(minutePrice),
				"Pricing.Hour": parseFloat(hourPrice),
				"Pricing.Day": parseFloat(dayPrice),
			});
			
			Swal.fire({
				title: "Success",
				text: `Rates have been updated`,
				icon: "success",
				confirmButtonText: "Close",
			});
		} catch (error) {
			console.error("Error updating pricing:", error);
			Swal.fire({
				title: "Error",
				text: "Failed to update pricing",
				icon: "error",
				confirmButtonText: "Close",
			});
		}
	}

	return (
		<div className="price-card">
			<div className="price-header">
				<h3>{locationName}</h3>
				<button className="btn btn-primary" onClick={priceChanger}>
					Update Pricing
				</button>
			</div>
			<div className="price-details">
				<div className="price-item">
					<span className="price-label">Minute:</span>
					<span className="price-value">${minute}</span>
				</div>
				<div className="price-item">
					<span className="price-label">Hour:</span>
					<span className="price-value">${hour}</span>
				</div>
				<div className="price-item">
					<span className="price-label">Day:</span>
					<span className="price-value">${day}</span>
				</div>
			</div>
		</div>
	);
};

export default Price;
