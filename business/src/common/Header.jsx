import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const database = window.firebase.firestore();
const Header = ({ organization }) => {
  const [organizationUrl, setOrganizationUrl] = useState(null);
  useEffect(() => {
    if (organization) {
      database
        .collection("Companies")
        .doc(organization)
        .get()
        .then((doc) => {
          setOrganizationUrl("/" + doc.data().Info.Subdomain);
        });
    }
  }, [organization]);
  return (
    <nav className="tp-nav" role="navigation">
      <div className="top-menu">
        <div className="container">
          <div className="row">
            <div className="col-md-2">
              <div id="tp-logo">
                <Link to={`${organizationUrl}/facilities`}>Raedam</Link>
              </div>
            </div>
            <div className="col-md-10 text-right menu-1">
              <ul>
                <li className="active">
                  <Link to={`${organizationUrl}/facilities`}>Facilities</Link>
                </li>
                <li>
                  <Link to={`${organizationUrl}/summary`}>Summary</Link>
                </li>
                <li>
                  <Link to={`${organizationUrl}/enforcement`}>Enforcement</Link>
                </li>
                <li className="has-dropdown">
                  <a>Account</a>
                  <ul className="dropdown">
                    <li>
                      <Link to={`${organizationUrl}/organization`}>
                        Organization
                      </Link>
                    </li>
                    <li>
                      <Link to={`${organizationUrl}/profile`}>Profile</Link>
                    </li>
                    <li>
                      <Link to={`${organizationUrl}/messages`}>Messages</Link>
                    </li>
                    <li onClick={window.signOut}>
                      <a>Logout</a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
