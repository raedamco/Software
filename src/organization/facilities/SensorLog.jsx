import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const SwalReact = withReactContent(Swal);

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
		SwalReact.fire({
			title: "Info",
			html: `Occupant: ${occupant}`,
			icon: "info",
			confirmButtonText: "Close",
		});
	}

	useEffect(() => {
		getStatus();
	}, [occupied]);

	return (
		<div className="card-btn panel panel-default mb-2" onClick={logAlert}>
			<div className="panel-body container">
				<div className="d-flex justify-content-between row">
					<table className="table" style={{ margin: "0" }}>
						<tbody>
							<tr>
								<td>
									<h3
										className="text-success text-left"
										style={{ margin: "0 0 0 15px", color: color }}
									>
										{status}
									</h3>
								</td>
								<td>
									{/* TODO Spots free is spilling over the side. Fixed by adding extra margin */}
									<h3
										className="text-success text-right"
										style={{ margin: "0 45px 0 0", color: color }}
									>
										End: {end.toDate().toLocaleString()}
										<br />
										Start: {begin.toDate().toLocaleString()}
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

export default SensorLog;
