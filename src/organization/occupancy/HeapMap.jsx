import { useEffect, useState } from "react";
import Apex from "react-apexcharts";
import { database } from "../../FirebaseSetup";

const HeatMap = ({ organization, location, subLocation }) => {
	const [options, setOptions] = useState({});
	const [series, setSeries] = useState([]);

	function getSpotData() {
		database
			.collection("Companies")
			.doc(organization)
			.collection("Data")
			.doc(location)
			.collection(subLocation)
			.orderBy("Info.Spot ID")
			.get()
			.then((collection) => {
				let spotUtilizationList = [];
				let spotIds = [];
				collection.forEach((doc) => {
					spotIds.push(doc.data().Info["Spot ID"]);
					spotUtilizationList.push(doc.data().Utilization);
				});
				setSeries([
					{
						name: "Percent Utilization",
						data: spotUtilizationList,
					},
				]);
				setOptions({
					plotOptions: {
						heatmap: {
							enableShades: true,
							shadeIntensity: 0.9,
							radius: 0,
							useFillColorAsStroke: true,
							colorScale: {
								ranges: [
									{
										from: 0,
										to: 25,
										name: "0-25%",
										color: "#abadb0",
									},
									{
										from: 26,
										to: 50,
										name: "26-50%",
										color: "#afff5e",
									},
									{
										from: 51,
										to: 75,
										name: "51%-75%",
										color: "#FFFF00",
									},
									{
										from: 76,
										to: 100,
										name: "76%-100%",
										color: "#FF0000",
									},
								],
							},
						},
					},
					dataLabels: {
						enabled: false,
					},
					legend: {
						show: true,
						showForSingleSeries: true,
					},
					stroke: {
						width: 1,
					},
					xaxis: {
						categories: spotIds,
						title: {
							text: "Spots",
						},
					},
					yaxis: {
						show: false,
					},
					title: {
						text: `HeatMap - ${location}, ${subLocation}`,
					},
				});
			});
	}

	useEffect(() => {
		const abortController = new AbortController();
		getSpotData();
		return () => abortController.abort();
	}, []);

	return (
		<div className="chart aligncenter">
			<Apex type="heatmap" options={options} series={series} />
		</div>
	);
};

export default HeatMap;
