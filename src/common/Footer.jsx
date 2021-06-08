import { useEffect } from "react";

const Footer = () => {
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
			<div class="gototop js-top">
				<a href="#" class="js-gotop">
					<i class="icon-arrow-up2"></i>
				</a>
			</div>
		</>
	);
};

export default Footer;
