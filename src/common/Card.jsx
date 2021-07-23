import { Link } from "react-router-dom";

const Card = ({
	children,
	link,
	toggleDatabase,
	enabled,
	rightClickHandler,
	...props
}) => {
	function toggleHandler(event) {
		if (event.target.checked != undefined) {
			toggleDatabase(event.target.checked);
		}
	}

	return (
		<div className="card-custom aligncenter" {...props}>
			<Link to={link}>
				<div
					className={`card-body card-btn ${
						toggleDatabase ? (enabled ? "bg-success" : "bg-danger") : ""
					}`}
					onContextMenu={rightClickHandler}
				>
					{children}
				</div>
			</Link>
			{/* TODO decide whether to change toggle when database changes or user clicks */}
			{toggleDatabase && (
				<div className="toggle normal" onClick={toggleHandler}>
					<input
						id="normal"
						type="checkbox"
						readOnly
						checked={enabled}
						onClick={(e) => {
							e.preventDefault();
						}}
					></input>
					<label className="toggle-item" htmlFor="normal"></label>
				</div>
			)}
			{/* <div className="toggle checkcross">
		<input id="checkcross" type="checkbox"></input>
		<label className="toggle-item" for="checkcross">
			<div className="check"></div>
		</label>
	</div> */}
		</div>
	);
};

export default Card;
