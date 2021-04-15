const NoData = () => {
	return (
		<div className="card-btn panel panel-default mb-2">
			<div className="panel-body container">
				<div className="d-flex justify-content-between row">
					<table className="table" style={{ margin: "0" }}>
						<tbody>
							<tr>
								<td>
									<h3 className="text-success" style={{ margin: "0 0 0 15px" }}>
										No data found
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

export default NoData;
