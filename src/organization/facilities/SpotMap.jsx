import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Spot from "./Spot";
import { database } from "../../FirebaseSetup";
import { collection, getDocs } from "firebase/firestore";

const SpotMap = ({ organization }) => {
	const params = useParams();
	const [spotList, setSpotList] = useState([]);
	const locationName = params.locationName.replaceAll("-", " ");
	const subLocationName = params.subLocationName.replaceAll("-", " ");

	useEffect(() => {
		const fetchSpots = async () => {
			try {
				const spotsCollection = collection(
					database,
					"Companies",
					organization,
					"Data",
					locationName,
					subLocationName
				);
				const querySnapshot = await getDocs(spotsCollection);
				
				let tempList = [];
				let index = 0;
				querySnapshot.forEach((doc) => {
					tempList.push(
						<Spot key={index} organization={organization} data={doc.data()} />
					);
					index += 1;
				});
				setSpotList(tempList);
			} catch (error) {
				console.error("Error fetching spots:", error);
			}
		};

		fetchSpots();
	}, [organization, locationName, subLocationName]);

	return (
		<div className="spot-map-container">
			<div className="container">
				<div className="main" id="main">
					<h1 className="page-title" id="structureTitle">
						{locationName} - {subLocationName}
					</h1>
					<div className="spot-map">{spotList}</div>
				</div>
			</div>
		</div>
	);
};

export default SpotMap;
