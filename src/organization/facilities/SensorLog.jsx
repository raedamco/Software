import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const SensorLog = ({ occupant, occupied, begin, end }) => {
	const [color, setColor] = useState("inherit");
	const [status, setStatus] = useState("");

	function getStatus() {
		if (occupied) {
			setColor("var(--error)");
			setStatus("Occupied");
		} else {
			setColor("var(--success)");
			setStatus("Unoccupied");
		}
	}

	function logAlert() {
		let displayOccupant = occupant;
		if (occupied) {
			if (occupant == "") {
				displayOccupant = "Coming Soon!";
			}
		} else {
			if (occupant == "") {
				displayOccupant = "None";
			}
		}
		Swal.fire({
			title: "Sensor Information",
			html: `
				<div class="sensor-info">
					<p><strong>Status:</strong> ${status}</p>
					<p><strong>Occupant:</strong> ${displayOccupant}</p>
					<p><strong>Start Time:</strong> ${begin.toDate().toLocaleString()}</p>
					<p><strong>End Time:</strong> ${end.toDate().toLocaleString()}</p>
				</div>
			`,
			icon: "info",
			confirmButtonText: "Close",
		});
	}

	useEffect(() => {
		getStatus();
	}, [occupied]);

	return (
		<div className="sensor-log-card" onClick={logAlert}>
			<div className="sensor-log-content">
				<div className="sensor-status">
					<span className="status-indicator" style={{ color: color }}>
						{status}
					</span>
				</div>
				<div className="sensor-times">
					<div className="time-item">
						<span className="time-label">Start:</span>
						<span className="time-value">{begin.toDate().toLocaleString()}</span>
					</div>
					<div className="time-item">
						<span className="time-label">End:</span>
						<span className="time-value">{end.toDate().toLocaleString()}</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SensorLog;
