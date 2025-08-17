import { signIn, forgotPassword } from "./FirebaseSetup";

const Login = ({ setAuthUser }) => {
	return (
		<div className="login-container">
			<section className="hero-section">
				<div className="hero-overlay"></div>
				<div className="hero-content">
					<div className="container">
						<div className="hero-text">
							<h1>Raedam for Business Clients</h1>
							<h2>Client Login</h2>
						</div>
					</div>
				</div>
			</section>

			<div className="login-form-section">
				<div className="container">
					<div className="login-form-container">
						<div className="form-group">
							<label htmlFor="emailInput" className="form-label">Email Address</label>
							<input
								type="email"
								id="emailInput"
								className="form-input"
								placeholder="Enter your email address"
							/>
						</div>
						<div className="form-group">
							<label htmlFor="passwordInput" className="form-label">Password</label>
							<input
								type="password"
								id="passwordInput"
								className="form-input"
								placeholder="Enter your password"
							/>
						</div>
						<div className="form-actions">
							<button
								id="loginButton"
								className="btn btn-primary"
								onClick={() => {
									signIn().then((user) => {
										setAuthUser(user);
									});
								}}
							>
								Login
							</button>
							<button
								className="btn btn-secondary"
								onClick={forgotPassword}
							>
								Forgot Password?
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
