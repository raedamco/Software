//TODO Add xaxis label for spots on heat map		done
//TODO Percent Utilization for heatmap label		done
//TODO Spots Occupied for line graph label			done extra
//TODO Change summary header label: Occupancy		done
//TODO Fix refresh showing blank page						done
//TODO Redirect to login page when user isn't authenticated	done

//TODO dev config
//TODO Use firebase react component: https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial
//TODO Capacity dynamicaly changing
//TODO Account
//TODO Top button
//TODO Summary
//TODO Update Chart
//TODO Global database variable
//TODO Delete extra bootstrap files
//TODO Update some database data dynamically
//TODO Fix csv download for charts
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
	<React.StrictMode>
		<Router>
			<App />
		</Router>
	</React.StrictMode>,
	document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
