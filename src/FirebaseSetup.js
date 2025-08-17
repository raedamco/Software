/*eslint-disable */
//
//  FirebaseSetup.js
//  Raedam
//
//  Created on 5/1/2021. Modified on 5/1/2021 by Ryan Kirkpatrick.
//  Copyright © 2021 Raedam. All rights reserved.
//
// Setup firebase and common firebase related functions

import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut as firebaseSignOut, sendPasswordResetEmail } from "firebase/auth";
import { getFirestore, collection, doc, getDoc } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";
import Swal from "sweetalert2";

const firebaseConfig = {
	apiKey: "AIzaSyCKghNDOPOufY-8SYVGW4xpOeZC3fDVZko",
	authDomain: "theory-parking.firebaseapp.com",
	databaseURL: "https://theory-parking.firebaseio.com",
	projectId: "theory-parking",
	storageBucket: "theory-parking.appspot.com",
	messagingSenderId: "192548003681",
	appId: "1:192548003681:web:1f092e58a62891359caf20",
	measurementId: "G-D9YWC0BFVD",
};

// Initialize Firebase with error handling
let app, analytics, auth, database;

try {
	app = initializeApp(firebaseConfig);
	
	// Initialize analytics only if supported
	isSupported().then(yes => yes ? getAnalytics(app) : null);
	
	auth = getAuth(app);
	database = getFirestore(app);
} catch (error) {
	console.error("Firebase initialization error:", error);
	
	// Show user-friendly error message
	Swal.fire({
		title: "Configuration Error",
		text: "Unable to initialize the application. Please contact support.",
		icon: "error",
		confirmButtonText: "OK"
	});
}

// Functions
async function signIn() {
	const email = document.getElementById("emailInput")?.value;
	const password = document.getElementById("passwordInput")?.value;

	if (!email || !password) {
		presentError("Error", "Please enter all fields", "warning", "Ok");
		return null;
	}
	
	try {
		const userCredential = await signInWithEmailAndPassword(auth, email, password);
		const user = userCredential.user;
		localStorage.setItem("authUser", JSON.stringify(user));
		return user;
	} catch (error) {
		console.error("Sign in error:", error);
		
		let errorMessage = "Something went wrong while signing in";
		
		if (error.code === "auth/wrong-password") {
			errorMessage = "Password entered is incorrect";
		} else if (error.code === "auth/user-not-found") {
			errorMessage = "User account not found";
		} else if (error.code === "auth/invalid-email") {
			errorMessage = "Invalid email address";
		} else if (error.code === "auth/too-many-requests") {
			errorMessage = "Too many failed attempts. Please try again later";
		} else if (error.code === "auth/network-request-failed") {
			errorMessage = "Network error. Please check your connection";
		}
		
		presentError("Error", errorMessage, "error", "Ok");
		return null;
	}
}

function signOut(navigate) {
	if (!auth) {
		console.error("Auth not initialized");
		return;
	}
	
	firebaseSignOut(auth).then(
		() => {
			localStorage.removeItem("authUser");
			if (navigate) {
				navigate("/");
			}
		},
		(error) => {
			console.error("Sign out error:", error);
			presentError(
				"Error",
				"Something went wrong while signing out",
				"error",
				"Ok"
			);
		}
	);
}

function forgotPassword() {
	if (!auth) {
		presentError("Error", "Authentication not available", "error", "Ok");
		return;
	}
	
	Swal.fire({
		title: "Enter your email",
		input: "email",
		showCancelButton: true,
		inputValidator: (value) => {
			if (!value) {
				return "Please enter an email address";
			}
		}
	}).then((result) => {
		if (result.isConfirmed && result.value) {
			sendPasswordResetEmail(auth, result.value)
				.then(function () {
					presentError("Email Sent", "Password reset email has been sent to your inbox", "success", "Ok");
				})
				.catch(function (error) {
					console.error("Password reset error:", error);
					let errorMessage = "Something went wrong while sending email";
					
					if (error.code === "auth/user-not-found") {
						errorMessage = "No account found with this email address";
					} else if (error.code === "auth/invalid-email") {
						errorMessage = "Invalid email address";
					}
					
					presentError("Error", errorMessage, "error", "Ok");
				});
		}
	});
}

function presentError(Title, Text, Icon, Button) {
	Swal.fire({
		title: Title,
		text: Text,
		icon: Icon,
		confirmButtonText: Button,
	});
}

// Export with null checks
export default app;
export { auth, database, signIn, signOut, forgotPassword };
