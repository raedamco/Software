import { useEffect, useState } from "react";
import Card from "../../common/Card";
import { SwalInfo } from "../../common/SweetAlert";

const SensorLog = ({ occupant, occupied, begin, end }) => {
	const [color, setColor] = useState("inherit");
	const [status, setStatus] = useState("");

	function getStatus() {
		if (occupied) {
			setColor("red");
			setStatus("Occupied");
		} else {
			setColor("green");
			setStatus("Unoccupied");
		}
	}

	function logAlert() {
		if (occupied) {
			if (occupant == "") {
				occupant = "Coming Soon!";
			}
		} else {
			if (occupied == "") {
				occupant = "None";
			}
		}
		SwalInfo(`Occupant: ${occupant}`);
	}

	useEffect(() => {
		getStatus();
	}, [occupied]);

	return (
		<Card leftClickHandler={logAlert}>
			<h3 className="text-success text-left">{status}</h3>
			<h3 className="text-success text-right">
				End: {end.toDate().toLocaleString()}
				<br />
				Start: {begin.toDate().toLocaleString()}
			</h3>
		</Card>
	);
};

export default SensorLog;
