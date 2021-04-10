import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import * as firebase from "firebase";

var firebaseConfig = {
	apiKey: "AIzaSyCKghNDOPOufY-8SYVGW4xpOeZC3fDVZko",
	authDomain: "theory-parking.firebaseapp.com",
	databaseURL: "https://theory-parking.firebaseio.com",
	projectId: "theory-parking",
	storageBucket: "theory-parking.appspot.com",
	messagingSenderId: "192548003681",
	appId: "1:192548003681:web:1f092e58a62891359caf20",
	measurementId: "G-D9YWC0BFVD",
};

firebase.initializeApp(firebaseConfig);

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
