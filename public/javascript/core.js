/* eslint-disable */
//
//  core.js
//  Raedam
//
//  Created on 10/25/2019. Modified on 1/30/2021 by Austin Mckee.
//  Copyright © 2020 Raedam. All rights reserved.
//
// DESCRIPTION OF FILE

/**
 * function that redirects a user to the correct sub domain
 * @param {object} user firebase user object representing current user
 */
function subdomain_login(user) {
	var email = user.email;
	var pos = email.search("@pdx.edu");
	if (pos >= 0) {
		if (window.location.hostname != "pdx.raedam.co") {
			window.location.hostname = "pdx.raedam.co";
		} else {
			window.location = "dashboard.html";
		}
	} else {
		pos = email.search("@raedam.co");
		if (pos >= 0) {
			window.location = "dashboard.html";
		} else {
			window.location = "dashboard.html";
		}
	}
}

function loginRedirect() {
	window.location.href = "/";
}

async function signIn() {
	const email = document.getElementById("emailInput").value;
	const password = document.getElementById("passwordInput").value;

	if (email.length <= 0 || password.length <= 0) {
		presentError("Error", "Please enter all fields", "warning", "Ok");
		auth.signOut();
	}
	return await auth
		.signInWithEmailAndPassword(email, password)
		.then((user) => {
			// loginRedirect();
			return user;
		})
		.catch(function (error) {
			var errorCode = error.code;
			var errorMessage = error.message;
			if (errorCode === "auth/wrong-password") {
				presentError("Error", "Password entered is incorrect", "error", "Ok");
			} else {
				presentError("Error", errorMessage, "error", "Ok");
			}
		});
}

function navigate() {
	var emailInput = document.getElementById("emailInput");
	var passwordInput = document.getElementById("passwordInput");

	emailInput.addEventListener("keyup", function (event) {
		if (event.keyCode === 13) {
			event.preventDefault();
			passwordInput.focus();
		}
	});

	passwordInput.addEventListener("keyup", function (event) {
		if (event.keyCode === 13) {
			event.preventDefault();
			document.getElementById("loginButton").click();
		}
	});
}

function signOut() {
	auth.signOut().then(
		function () {},
		function (error) {
			presentError("Error", error, "error", "Ok");
		}
	);
}

function forgotPassword() {
	Swal.fire({
		title: "Enter your email",
		input: "email",
		showCancelButton: true,
	}).then((result) => {
		auth
			.sendPasswordResetEmail(result.value)
			.then(function () {
				presentError("Email Sent", " ", "success", "Ok");
			})
			.catch(function (error) {
				presentError("Error", error, "error", "Ok");
			});
	});
}

function authverification() {
	firebase.auth().onAuthStateChanged(function (user) {
		if (!user) {
			signOut();
		}
	});
}

/**
 *
 * @param {object} user firebase user object representing current user
 */
function getUserData(user) {
	if (user) {
		database
			.collection("Companies")
			.where("Info.CUID", "==", user.uid)
			.get()
			.then(function (querySnapshot) {
				querySnapshot.forEach(function (doc) {
					var CompanyName = doc.data()["Info"].Name;
					var CUID = doc.data()["Info"].CUID;
					var Structures = doc.data()["Info"].Structures;
				});
			})
			.catch(function (error) {
				alert("Error getting documents: " + error);
			});
	} else {
		signOut();
	}
}

function presentError(Title, Text, Icon, Button) {
	Swal.fire({
		title: Title,
		text: Text,
		icon: Icon,
		confirmButtonText: Button,
	});
}

/* small popup success
	const Toast = Swal.mixin({
		toast: true,
		position: 'top-end',
		showConfirmButton: false,
		timer: 3000,
		timerProgressBar: true,
		onOpen: (toast) => {
			toast.addEventListener('mouseenter', Swal.stopTimer)
			toast.addEventListener('mouseleave', Swal.resumeTimer)
		}
	})

	Toast.fire({
		icon: 'success',
		title: 'Signed in successfully'
	})
	*/

// CREATE ACCOUNT  START //
/* Implement once approved entity to use our services
function createAccount() {
	var companyemail = document.getElementById("companyemail").value;
	var password = document.getElementById("companypassword").value;
	var verifypassword = document.getElementById("verifycompanypassword").value;
	
	if (password !== verifypassword) {
			window.alert('Passwords do not match');
	}else if (companyemail.length <= 0 || password.length <= 0 || verifypassword.length <= 0) {
					alert('Please enter all fields.');
	}else{
			firebase.auth().createUserWithEmailAndPassword(companyemail, password).then(function(user){
					alert("Account successfully created.");
					window.location = "join.html";
			}).catch(function(error) {
					var errorMessage = error.message;
					alert(errorMessage);
			});
	}
} 
*/

function join() {
	var cName = document.getElementById("companyName").value;
	var cEmail = document.getElementById("contactEmail").value;
	var cPhone = document.getElementById("contactNumber").value;
	var cType = document.getElementById("organizationType").value;
	var cLocation = document.getElementById("locationParkingStructures").value;
	var cStructures = document.getElementById("parkingStructures").value;
	var cSpots = document.getElementById("parkingSpotsNumber").value;
	var cEmployees = document.getElementById("usersNumber").value;

	if (
		cName.length <= 0 ||
		cEmail.length <= 0 ||
		cPhone.length <= 0 ||
		cType.length <= 0 ||
		cLocation.length <= 0 ||
		cStructures.length <= 0 ||
		cSpots.length <= 0 ||
		cEmployees.length <= 0
	) {
		window.alert("All fields must be filled-out");
	} else {
		database
			.collection("Companies")
			.doc(cName)
			.set({
				Name: cName,
				Email: cEmail,
				Phone: cPhone,
				Headquarters: cLocation,
				//'ID': cUID,
				"Representative Email": cEmail,
				"Representative Phone": cName,
			})
			.then(function () {
				window.alert(
					"Your request has been submitted. We will contact you shortly."
				);
				window.location = "index.html";
			})
			.catch(function (error) {
				window.alert("Error submitting request: " + error);
			});
	}

	/*
	firebase.auth().onAuthStateChanged(function (user) {
			if(user) {
					var cUID = user.uid;
					if (cName.length <= 0 || cEmail.length <= 0 || cPhone.length <= 0 || cType.length <= 0 || cLocation.length <= 0 || cStructures.length <= 0 || cSpots.length <= 0 || cEmployees.length <= 0) {
							window.alert('All fields must be filled-out');
					}else{
							database.collection('Companies').doc(cName).set({
									'Name': cName,
									'Email': cEmail,
									'Phone': cPhone,
									'Headquarters': cLocation,
									'ID': cUID,
									'Representative Email': cEmail,
									'Representative Phone': cName
							}).then(function () {
									window.alert("Your request has been submitted. We will contact you shortly.");
									window.location.href = window.location.href;
							}).catch(function (error) {
									window.alert ("Error submitting request: " + error);
							}); 
					}
			}
	});
	*/
}

// CREATE ACCOUNT  END //
// module.exports = {
// 	forgotPassword,
// 	signIn,
// };
