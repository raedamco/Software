import { useEffect, useState } from "react";
import Apex from "react-apexcharts";

const database = window.firebase.firestore();

const LineGraph = ({ organization, location, subLocation }) => {
	const [options, setOptions] = useState({});
	const [series, setSeries] = useState([]);

	function getAverageData() {
		database
			.collection("Companies")
			.doc(organization)
			.collection("Data")
			.doc(location)
			.collection("Averages")
			.doc("Floors")
			.collection(subLocation)
			.orderBy("Time", "desc")
			.limit(100)
			.get()
			.then((collection) => {
				let data = [];
				let time = [];
				collection.forEach((doc) => {
					data.push(doc.data().Average);
					time.push(doc.data().Time.toDate().toLocaleString());
				});
				if (data) {
					console.log("Data:", data);
					console.log("Time:", time);
				}
				setSeries([
					{
						data: data,
					},
				]);
				var dropdown = false;
				var dropdown_array = [];
				setOptions({
					chart: {
						toolbar: {
							offsetX: -100,
							show: true,
							tools: {
								customIcons: [
									{
										icon: '<i class="glyphicon glyphicon-home"></i>',

										title: "time selection",
										class: "custom-icon",
										click: function (chart, options) {
											function dropdown_create() {
												var chartDiv = document.getElementById("average_chart");
												var chartDiv2 = chartDiv.getElementsByTagName("div")[0];
												var toolbar = chartDiv2.getElementsByClassName(
													"apexcharts-toolbar"
												);

												var first_item = document.createElement("div");
												dropdown_array[0] = first_item;
												first_item.id = "item1";
												first_item.style.paddingLeft = "5px";
												first_item.innerHTML = "week";
												first_item.style.cursor = "pointer";
												first_item.onclick = function () {
													Apex.zoomX(time[167], time[0]);
													dropdown = false;
												};

												var second_item = document.createElement("div");
												dropdown_array.push(second_item);
												second_item.id = "item2";
												second_item.style.paddingLeft = "5px";
												second_item.innerHTML = "month";
												second_item.style.cursor = "pointer";
												second_item.onclick = function () {
													Apex.zoomX(time[743], time[0]);
													dropdown = false;
												};

												var third_item = document.createElement("div");
												dropdown_array.push(third_item);
												third_item.id = "item3";
												third_item.style.paddingLeft = "5px";
												third_item.innerHTML = "day";
												third_item.style.cursor = "pointer";
												third_item.onclick = function () {
													Apex.zoomX(time[23], time[0]);
													dropdown = false;
												};
												toolbar[0].appendChild(first_item);
												toolbar[0].appendChild(second_item);
												toolbar[0].appendChild(third_item);

												var fourth_item = document.createElement("div");
												dropdown_array.push(fourth_item);
												fourth_item.id = "item4";
												fourth_item.style.paddingLeft = "5px";
												fourth_item.innerHTML = "12hr";
												fourth_item.style.cursor = "pointer";
												fourth_item.onclick = function () {
													Apex.zoomX(time[11], time[0]);
													dropdown = false;
												};

												toolbar[0].appendChild(first_item);
												toolbar[0].appendChild(second_item);
												toolbar[0].appendChild(third_item);
												toolbar[0].appendChild(fourth_item);
											}

											if (dropdown == false) {
												//the_averagechart.offsetX = -100;
												dropdown_create();

												dropdown = true;
											} else {
												function dropdown_remove(item, index, array) {
													item.remove();
												}
												console.log(dropdown_array);
												dropdown_array.forEach(dropdown_remove);
												dropdown_array = [];
												dropdown = false;
												//document.getElementBy
												console.log("error things");
											}
										},
									},
								],
								zoom: false,
								zoomin: false,
								zoomout: false,
								reset: false,
							},
						},
						height: 600,
						type: "area",
					},
					dataLabels: {
						enabled: false,
					},
					stroke: {
						curve: "smooth",
					},
					series: [
						{
							data: data,
						},
					],
					xaxis: {
						type: "datetime",
						categories: time,
					},
					legend: {
						show: true,
					},
					tooltip: {
						x: {
							format: "dd/MM/yy HH:mm",
						},
					},
					title: {
						text: `Average Occupancy - ${location}, ${subLocation}`,
						style: {
							color: "black",
						},
					},
				});

				// setOptions({
				// 	chart: {
				// 		toolbar: {
				// 			offsetX: -100,
				// 			show: true,
				// 			tools: {
				// 				zoom: false,
				// 				zoomin: false,
				// 				zoomout: false,
				// 				reset: false,
				// 			},
				// 		},
				// 		height: 600,
				// 		type: "area",
				// 	},
				// 	dataLabels: {
				// 		enabled: false,
				// 	},
				// 	stroke: {
				// 		curve: "smooth",
				// 	},
				// 	xaxis: {
				// 		type: "datetime",
				// 		categories: time,
				// 	},
				// 	legend: {
				// 		show: true,
				// 	},
				// 	tooltip: {
				// 		x: {
				// 			format: "dd/MM/yy HH:mm",
				// 		},
				// 	},
				// 	title: {
				// 		text: `Average Occupancy - ${location}, ${subLocation}`,
				// 		style: {
				// 			color: "black",
				// 		},
				// 	},
				// });
			});
	}

	useEffect(() => {
		const abortController = new AbortController();
		getAverageData();
		return () => abortController.abort();
	}, []);

	return (
		<>
			<Apex options={options} series={series} type="line" width="500" />
		</>
	);
};

export default LineGraph;
