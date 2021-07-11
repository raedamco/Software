import { useEffect } from "react";

const Footer = () => {
	//TODO update top button to use react
	// jQuery way
	// $(window).scroll(function(){
	// 	var $win = $(window);
	// 	if ($win.scrollTop() > 200) {
	// 		$('.js-top').addClass('active');
	// 	} else {
	// 		$('.js-top').removeClass('active');
	// 	}
	// });

	useEffect(() => {
		window.addEventListener("scroll", () => {
			//console.log("Scroll:", document.documentElement.scrollTop);
			//if ()
		});
	}, []);

	return (
		<>
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
			<div className="gototop js-top">
				<a href="#" className="js-gotop">
					<i className="icon-arrow-up2"></i>
				</a>
			</div>
		</>
	);
};

export default Footer;
