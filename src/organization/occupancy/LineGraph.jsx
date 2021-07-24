import { useEffect, useState } from "react";
import Apex from "react-apexcharts";
import { database } from "../../FirebaseSetup";

const LineGraph = ({ organization, location, subLocation }) => {
	const [options, setOptions] = useState({});
	const [series, setSeries] = useState([]);
	const [selection, setSelection] = useState("one_month");

	//TODO average data points for each zoom button
	// 1M: every day
	// 6M: every week
	// 1Y: every two weeks

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
			.limit(800)
			.get()
			.then((collection) => {
				let data = [];
				let time = [];
				let datetime = [];
				collection.forEach((doc) => {
					data.push(doc.data().Average);
					time.push(doc.data().Time);
					// datetime.push([doc.data().Time.seconds * 1000, doc.data().Average]);
					let tempTime = doc.data().Time.toDate();
					datetime.push([
						tempTime.getTime() - 2.52 * Math.pow(10, 7),
						doc.data().Average,
					]);
				});
				setSeries([
					{
						name: "Spots Occupied",
						data: datetime,
					},
				]);

				setOptions({
					chart: {
						id: "area-datatime",
						type: "area",
						height: 350,
						zoom: {
							autoScaleYaxis: true,
						},
					},
					dataLabels: {
						enabled: false,
					},
					markers: {
						size: 0,
						style: "hollow",
					},
					stroke: {
						curve: "smooth",
					},
					xaxis: {
						type: "datetime",
						min: firstOfCurrentMonth.getTime(),
						max: currentDate.getTime(),
						tickAmount: 6,
						labels: {
							//TODO add time to tooltip
							formatter: function (timestamp) {
								return new Date(timestamp).toLocaleDateString("en-us");
							},
							// datetimeFormatter: {
							// 	year: "yyy",
							// 	month: "MMM 'yy",
							// 	day: "dd MMM",
							// 	hour: "HH:mm",
							// },
						},
					},
					tooltip: {
						x: {
							format: "dd/MM/yy HH:mm",
						},
					},
					fill: {
						type: "gradient",
						gradient: {
							type: "vertical",
							opacityFrom: 0.7,
							opacityTo: 0,
							stops: [0, 100],
						},
					},
					title: {
						text: `Average Occupancy - ${location}, ${subLocation}`,
						style: {
							color: "black",
						},
					},
				});
			});
	}
	//////////////////////// Times ////////////////////////////////
	const currentDate = new Date(); // current time

	const firstOfCurrentMonth = new Date(); // first of current month
	firstOfCurrentMonth.setDate(1);

	const aYearAgo = new Date(); // exactly a year ago from now
	aYearAgo.setYear(aYearAgo.getFullYear() - 1);

	const sixMonthsAgo = new Date(); // 6months ago starting at 1st of month
	sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6, 1);

	const currentYearStart = new Date(); // set to jan 1st of current year
	currentYearStart.setMonth(0, 1);

	///////////////////////////////////////////////////////////////////////
	function updateData(timeline) {
		setSelection(timeline);
		switch (timeline) {
			case "one_month":
				setOptions({
					...options,
					xaxis: {
						...options.xaxis,
						min: firstOfCurrentMonth.getTime(),
						max: currentDate.getTime(),
					},
				});
				break;
			case "six_months":
				setOptions({
					...options,
					xaxis: {
						...options.xaxis,
						min: sixMonthsAgo.getTime(),
						max: currentDate.getTime(),
					},
				});
				break;
			case "one_year":
				setOptions({
					...options,
					xaxis: {
						...options.xaxis,
						min: aYearAgo.getTime(),
						max: currentDate.getTime(),
					},
				});
				break;
			case "ytd":
				setOptions({
					...options,
					xaxis: {
						...options.xaxis,
						min: currentYearStart.getTime(),
						max: currentDate.getTime(),
					},
				});
				break;
			case "all":
				setOptions({
					...options,
					xaxis: {
						...options.xaxis,
						min: undefined,
						max: currentDate.getTime(),
					},
				});
				break;
			default:
		}
	}

	useEffect(() => {
		const abortController = new AbortController();
		getAverageData();
		return () => abortController.abort();
	}, []);

	return (
		<div className="chart aligncenter">
			<div className="toolbar">
				<button
					onClick={() => updateData("one_month")}
					id="one_month"
					className={selection === "one_month" ? "active" : ""}
				>
					1M
				</button>
				<button
					onClick={() => updateData("six_months")}
					id="six_months"
					className={selection === "six_months" ? "active" : ""}
				>
					6M
				</button>
				<button
					onClick={() => updateData("one_year")}
					id="one_year"
					className={selection === "one_year" ? "active" : ""}
				>
					1Y
				</button>
				<button
					onClick={() => updateData("ytd")}
					id="ytd"
					className={selection === "ytd" ? "active" : ""}
				>
					YTD
				</button>
				<button
					hidden
					onClick={() => updateData("all")}
					id="all"
					className={selection === "all" ? "active" : ""}
				>
					ALL
				</button>
			</div>
			<Apex type="area" options={options} series={series} />
		</div>
	);
};

export default LineGraph;
