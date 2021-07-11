import { useState, useEffect } from "react";
import { database } from "../FirebaseSetup";
import "./profile.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const SwalReact = withReactContent(Swal);

const Profile = ({ organization, authUser }) => {
	const [picture, setPicture] = useState("/images/profile.svg");
	const [username, setUsername] = useState("");
	const [role, setRole] = useState("");
	const [isCompanyUser, setIsCompanyUser] = useState(false);
	const [isCommuterUser, setIsCommuteUser] = useState(false);

	useEffect(async () => {
		const abortController = new AbortController();
		// Store promise in variable to let both database queries run asynchronously
		//TODO try to find a way to reduce this to one database call
		let companyInfo = getCompanyUserInfo(authUser);
		let commuterInfo = getCommuterUserInfo(authUser);
		if (await companyInfo) {
			setUsername((await companyInfo).Name);
			setRole((await companyInfo).Role);
			setIsCompanyUser(true);
		} else if (await commuterInfo) {
			setUsername((await commuterInfo).Name);
			setRole((await commuterInfo).Role);
			setIsCommuteUser(true);
		}
		return () => abortController.abort();
	}, [authUser]);

	//TODO switch to onSnapshot
	function getCompanyUserInfo(authUser) {
		return database
			.collection("Users")
			.doc("Companies")
			.collection(organization)
			.where("UUID", "==", authUser.user.uid)
			.get()
			.then((querySnapshot) => {
				let result = null;
				querySnapshot.forEach((doc) => {
					if (doc.data().Name && doc.data().Role) {
						result = doc.data();
					}
				});
				return result;
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	}

	//TODO switch to onSnapshot
	function getCommuterUserInfo(authUser) {
		return database
			.collection("Users")
			.doc("Commuters")
			.collection("Users")
			.where("UUID", "==", authUser.user.uid)
			.get()
			.then((querySnapshot) => {
				let result = null;
				querySnapshot.forEach((doc) => {
					if (doc.data().Name && doc.data().Role) {
						result = doc.data();
					}
				});
				return result;
			});
	}

	function editProfilePopup() {
		SwalReact.fire({
			title: "Edit Profile",
			input: "text",
			inputPlaceholder: "Enter your Name",
			showCancelButton: true,
			inputValidator: (value) => {
				if (!value) {
					return "Please enter a name";
				} else {
					setUsername(value);
					updateUsername(value);
				}
			},
		});
	}

	function updateUsername(newUsername) {
		const abortController = new AbortController();
		if (authUser) {
			if (isCompanyUser) {
				database
					.collection("Users")
					.doc("Companies")
					.collection(organization)
					.doc(authUser.user.uid)
					.update({
						Name: newUsername,
					})
					.then(() => {
						SwalReact.fire({
							title: "Success",
							text: `Name has been updated to ${newUsername}`,
							icon: "success",
							confirmButtonText: "Close",
						});
					})
					.catch(() => {
						//TODO log to firebase logger
						SwalReact.fire({
							title: "Error",
							text: "Something went wrong while updating the database",
							icon: "error",
							confirmButtonText: "Close",
						});
					});
			} else if (isCommuterUser) {
				database
					.collection("Users")
					.doc("Commuters")
					.collection("Users")
					.doc(authUser.user.uid)
					.update({
						Name: newUsername,
					})
					.then(() => {
						SwalReact.fire({
							title: "Success",
							text: `Name has been update to ${newUsername}`,
							icon: "success",
							confirmButtonText: "Close",
						});
					})
					.catch(() => {
						//TODO log to firebase logger
						SwalReact.fire({
							title: "Error",
							text: "Something went wrong while updating the database",
							icon: "error",
							confirmButtonText: "Close",
						});
					});
			}
		}
		return () => abortController.abort();
	}

	// TODO add image upload
	return (
		<div className="container">
			<div className="row">
				{/* TODO animate-box */}
				<div className="col-md-12 text-center">
					<div id="profile-box" className="panel panel-default mb-2">
						<img
							id="profile-edit"
							src="/images/edit.svg"
							onClick={editProfilePopup}
						/>
						<img id="profile-picture" src={picture} />
						<h2 id="name">{username}</h2>
						<h3 id="role">{role}</h3>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Profile;
