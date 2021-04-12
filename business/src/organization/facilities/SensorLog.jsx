const SensorLog = ({ occupant, occupied, begin, end }) => {
	function getStatus() {
		if (occupied) {
			return "Occupied";
		} else {
			return "Unoccupied";
		}
	}

	return (
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
									{getStatus()}
								</h3>
							</td>
							<td>
								{/* TODO Spots free is spilling over the side. Fixed by adding extra margin */}
								<h3
									className="text-success text-right"
									style={{ margin: "0 45px 0 0" }}
								>
									End: {end.toDate().toLocaleString()}
									<br />
									Start: {begin.toDate().toLocaleString()}
								</h3>
							</td>
						</tr>
					</table>
				</div>
			</div>
		</div>
	);
};

export default SensorLog;
