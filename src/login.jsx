import { useHistory } from "react-router";

const Login = ({ setAuthUser }) => {
	const history = useHistory();

	return (
		<div>
			{/* TODO replace divs with semantic tags */}
			<section
				id="home"
				className="cover-hero"
				style={{
					height: "350px",
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
				datasection="home"
			>
				<div className="overlay"></div>
				<div className="display-t display-t2 text-center">
					<div className="display-tc display-tc2">
						<div className="container">
							<div className="col-md-12 col-md-offset-0">
								<div className="">
									{/*TODO animate box*/}
									<h2>Raedam for Business Clients</h2>
									<br />
									<h3 style={{ color: "black" }}>Client Login</h3>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<div className="tp-services">
				<div className="container">
					<div className="row">
						<div className="col-md-12 text-center">
							{/*TODO animate box*/}
							<div className="row form-group">
								<div className="col-md-4 col-md-offset-4">
									<input
										type="text"
										id="emailInput"
										className="form-control"
										placeholder="Email address"
									/>
								</div>
							</div>
							<div className="row form-group">
								<div className="col-md-4 col-md-offset-4">
									<input
										type="password"
										id="passwordInput"
										className="form-control"
										placeholder="Password"
									/>
								</div>
							</div>
							<div className="form-group" style={{ paddingTop: "30px" }}>
								<input
									type="submit"
									id="loginButton"
									value="Login"
									className="btn btn-primary"
									onClick={async () => {
										window.signIn().then((user) => {
											console.log("signin:", user);
											setAuthUser(user);
											localStorage.setItem("authUser", JSON.stringify(user));
											//history.push("/");
										});
									}}
								/>
							</div>
							<div className="form-group">
								<input
									type="submit"
									value="Forgot Password?"
									className="btn btn-secondary"
									onClick={window.forgotPassword}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
