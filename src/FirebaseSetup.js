/*eslint-disable */
//
//  FirebaseSetup.js
//  Raedam
//
//  Created on 10/25/2019. Modified on 6/30/2020 by Omar Waked.
//  Copyright © 2020 Raedam. All rights reserved.
//
// DESCRIPTION OF FILE

import * as firebase from 'firebase';

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

const devConfig = {

};

if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
}
firebase.analytics();

export const auth = firebase.auth();
export const database = firebase.firestore();
export const storage = firebase.storage();
export default firebase;