import { useEffect, useState } from "react";
const database = window.firebase.firestore();

const Location = ({ organization, name }) => {
	const [free, setFree] = useState(0);
	const [total, setTotal] = useState(0);

	useEffect(() => {
		database
			.collection("Companies")
			.doc(organization)
			.collection("Data")
			.doc(name)
			.get()
			.then((doc) => {
				const { Available, Capacity } = doc.data().Capacity;
				setFree(Available);
				setTotal(Capacity);
			});
	}, []);

	return (
		<div className="panel panel-default mb-2">
			<div className="panel-body container">
				<div className="d-flex justify-content-between row">
					<table className="table" style={{ margin: "0" }}>
						<tr>
							<td>
								<h3 className="text-success text-left" style={{ margin: "0" }}>
									{name}
								</h3>
							</td>
							<td>
								<h3 className="text-success text-right" style={{ margin: "0" }}>
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
