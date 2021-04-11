import { useEffect, useState } from "react";
import { useRouteMatch } from "react-router";
import Spot from "./Spot";
const database = window.firebase.firestore();

const SpotMap = ({ organization }) => {
	const { path, url, params } = useRouteMatch();
	const [spotList, setSpotList] = useState();
	const locationName = params.locationName.replaceAll("-", " ");
	const subLocationName = params.subLocationName.replaceAll("-", " ");

	useEffect(() => {
		database
			.collection("Companies")
			.doc(organization)
			.collection("Data")
			.doc(locationName)
			.collection(subLocationName)
			.get()
			.then((collection) => {
				let tempList = [];
				collection.forEach((doc) => {
					tempList.push(<Spot organization={organization} data={doc.data()} />);
				});
				setSpotList(tempList);
			});
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
							<div className="container panel panel-default">{spotList}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SpotMap;
