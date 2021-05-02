const Footer = () => {
	return (
		<footer id="tp-footer">
			<div className="copy">
				<div className="container">
					<div className="row">
						<div
							className="col-md-12 text-left"
							style={{ paddingBottom: "50px" }}
						>
							<p>
								Copyright &copy; {new Date().getFullYear()} Raedam Inc. All
								rights reserved.
							</p>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
