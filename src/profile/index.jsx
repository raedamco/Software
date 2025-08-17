import { useState, useEffect } from "react";
import { database } from "../FirebaseSetup";
import "./profile.css";
import Swal from "sweetalert2";
import { collection, doc, getDocs, query, where, updateDoc } from "firebase/firestore";

const Profile = ({ organization, authUser }) => {
	const [picture, setPicture] = useState("/images/profile.svg");
	const [username, setUsername] = useState("");
	const [role, setRole] = useState("");
	const [isCompanyUser, setIsCompanyUser] = useState(false);
	const [isCommuterUser, setIsCommuteUser] = useState(false);

	useEffect(() => {
		const fetchUserInfo = async () => {
			try {
				// Store promise in variable to let both database queries run asynchronously
				//TODO try to find a way to reduce this to one database call
				let companyInfo = await getCompanyUserInfo(authUser);
				let commuterInfo = await getCommuterUserInfo(authUser);
				
				if (companyInfo) {
					setUsername(companyInfo.Name);
					setRole(companyInfo.Role);
					setIsCompanyUser(true);
				} else if (commuterInfo) {
					setUsername(commuterInfo.Name);
					setRole(commuterInfo.Role);
					setIsCommuteUser(true);
				}
			} catch (error) {
				console.error("Error fetching user info:", error);
			}
		};

		fetchUserInfo();
	}, [authUser, organization]);

	//TODO switch to onSnapshot
	async function getCompanyUserInfo(authUser) {
		try {
			const q = query(
				collection(database, "Users", "Companies", organization),
				where("UUID", "==", authUser.user.uid)
			);
			const querySnapshot = await getDocs(q);
			let result = null;
			querySnapshot.forEach((doc) => {
				if (doc.data().Name && doc.data().Role) {
					result = doc.data();
				}
			});
			return result;
		} catch (error) {
			console.error("Error:", error);
			return null;
		}
	}

	//TODO switch to onSnapshot
	async function getCommuterUserInfo(authUser) {
		try {
			const q = query(
				collection(database, "Users", "Commuters", "Users"),
				where("UUID", "==", authUser.user.uid)
			);
			const querySnapshot = await getDocs(q);
			let result = null;
			querySnapshot.forEach((doc) => {
				if (doc.data().Name && doc.data().Role) {
					result = doc.data();
				}
			});
			return result;
		} catch (error) {
			console.error("Error:", error);
			return null;
		}
	}

	function editProfilePopup() {
		Swal.fire({
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

	async function updateUsername(newUsername) {
		if (authUser) {
			try {
				if (isCompanyUser) {
					await updateDoc(
						doc(database, "Users", "Companies", organization, authUser.user.uid),
						{
							Name: newUsername,
						}
					);
				} else if (isCommuterUser) {
					await updateDoc(
						doc(database, "Users", "Commuters", "Users", authUser.user.uid),
						{
							Name: newUsername,
						}
					);
				}
				
				Swal.fire({
					title: "Success",
					text: `Name has been updated to ${newUsername}`,
					icon: "success",
					confirmButtonText: "Close",
				});
			} catch (error) {
				console.error("Error updating username:", error);
				Swal.fire({
					title: "Error",
					text: "Something went wrong while updating the database",
					icon: "error",
					confirmButtonText: "Close",
				});
			}
		}
	}

	// TODO add image upload
	return (
		<div className="profile-container">
			<div className="profile-card">
				<div className="profile-edit-button">
					<img
						id="profile-edit"
						src="/images/edit.svg"
						onClick={editProfilePopup}
						alt="Edit Profile"
					/>
				</div>
				<div className="profile-picture-container">
					<img id="profile-picture" src={picture} alt="Profile" />
				</div>
				<div className="profile-info">
					<h2 id="name">{username}</h2>
					<h3 id="role">{role}</h3>
				</div>
			</div>
		</div>
	);
};

export default Profile;
