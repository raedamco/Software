import { useEffect, useState } from "react";
import { database } from "../FirebaseSetup";

//TODO add click to edit price
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
			.get()
			.then((doc) => {
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

	return (
		<div className="card-btn panel panel-default mb-2">
			<div className="panel-body container">
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
