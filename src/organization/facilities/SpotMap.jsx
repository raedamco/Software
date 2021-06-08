import { useEffect, useState } from "react";
import { useRouteMatch } from "react-router";
import Spot from "./Spot";
import { database } from "../../FirebaseSetup";

const SpotMap = ({ organization }) => {
	const { path, url, params } = useRouteMatch();
	const [spotList, setSpotList] = useState();
	const locationName = params.locationName.replaceAll("-", " ");
	const subLocationName = params.subLocationName.replaceAll("-", " ");

	useEffect(() => {
		const abortController = new AbortController();
		database
			.collection("Companies")
			.doc(organization)
			.collection("Data")
			.doc(locationName)
			.collection(subLocationName)
			.get()
			.then((collection) => {
				let tempList = [];
				let index = 0;
				collection.forEach((doc) => {
					tempList.push(
						<Spot key={index} organization={organization} data={doc.data()} />
					);
					index += 1;
				});
				setSpotList(tempList);
			});
		return () => abortController.abort();
	}, []);

	return (
		<div className="tp-services" id="container">
			<div className="container">
				<div className="row">
					{/* TODO animate-box was causing issues with below div */}
					<div className="col-md-12 text-center">
						<div className="main" id="main">
							<h1
								id="structureTitle"
								style={{ paddingTop: "50px", paddingBottom: "50px" }}
							>
								{locationName} - {subLocationName}
							</h1>
							<div className="panel panel-default map">{spotList}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SpotMap;
