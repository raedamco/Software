import { useEffect, useState } from "react";
import { useRouteMatch } from "react-router";
import { Link } from "react-router-dom";
const database = window.firebase.firestore();

const Location = ({ organization, title = "", name, locationType }) => {
	const [free, setFree] = useState(0);
	const [total, setTotal] = useState(0);
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

	useEffect(() => {
		if (locationType == "location") {
			getLocationCapacity();
		} else if (locationType == "sublocation") {
			getSubLocationCapacity();
		}
	}, [locationType]);

	return (
		<Link to={`${url}/${name.replaceAll(" ", "-")}`}>
			<div className="panel panel-default mb-2">
				<div className="panel-body container">
					<div className="d-flex justify-content-between row">
						<table className="table" style={{ margin: "0" }}>
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
						</table>
						{/* <h3 className="text-left text-success col">{name}</h3>
						<h3 className="text-right text-success col">
							Spots Free: {free}/{total}
						</h3> */}
					</div>
				</div>
			</div>
		</Link>

		// <tr>
		// 	<td id={name} style={{ color: "green" }}>
		// 		{name}
		// 		<br />
		// 		Spots Free: {free}/{total}
		// 	</td>
		// </tr>
	);
};

export default Location;
