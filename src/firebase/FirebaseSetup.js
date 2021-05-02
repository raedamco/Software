/*eslint-disable */
//
//  FirebaseSetup.js
//  Raedam
//
//  Created on 10/25/2019. Modified on 6/30/2020 by Omar Waked.
//  Copyright © 2020 Raedam. All rights reserved.
//
// DESCRIPTION OF FILE

import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/analytics";

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

const devConfig = {};

class Firebase {
	constructor() {
		app.initializeApp(firebaseConfig);
		app.analytics();
		this.auth = app.auth();
		this.database = app.firestore();
	}
}

// export const auth = Firebase.auth();
// export const database = Firebase.firestore();
// export const storage = Firebase.storage();
export default Firebase;
