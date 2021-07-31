import React, {  useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useRouteMatch } from "react-router";

import { database } from "../FirebaseSetup";
export default function NewLocation(){
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const handleAddressChange = (event) => setAddress(event.target.value);
  const handleNameChange = (event) => setName(event.target.value);
  const history = useHistory();
  const { params } = useRouteMatch();
  const submitHandler = (event) => {
      event.preventDefault();

      createLocation(name,address,params.organization).then(()=> history.push(`/${params.organization}/facilities`))

  }
    return (
        <form name="Create Location" onSubmit={submitHandler}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              name="name"
              onChange={handleNameChange}
              value={name}
              placeholder="Location Name"
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="Address">Address</label>
            <input
              id="Address"
              type="text"
              name="Address"
              value={address}
              placeholder="Street Address "
              className="form-control"
              onChange={handleAddressChange}
            ></input>
          </div>
          <Link className="btn btn-danger mr-1" to={`/`}>
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      );
}
async function createLocation(name,address,organization){

    organization = organization.replaceAll('-', ' ')
    console.log(name,address, organization)
    const test = database
			.collection("Companies")
			.doc(organization)
			.collection("Data")
            .doc(name).set({name: name, address : address})
         await console.log(test)
    //update database with new Location 
    // COmpanies/ organization / new Location
}