//TODO fix async memory leak in spot/spotmap
//TODO dev config
//TODO Capacity dynamically changing
//TODO Account
//TODO Top button
//TODO Summary
//TODO Update Chart
//TODO Global database variable
//TODO Delete extra bootstrap files
//TODO Update some database data dynamically
//TODO Fix csv download for charts
import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
