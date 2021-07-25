const Card = ({
	children,
	leftClickHandler,
	toggleHandler,
	enabled,
	rightClickHandler,
	...props
}) => {
	function toggle(event) {
		if (event.target.checked != undefined) {
			toggleHandler(event.target.checked);
		}
	}

	return (
		<div className="card-custom aligncenter" {...props}>
			<div
				className="card-body card-btn"
				disabled={toggleHandler && !enabled ? true : false}
				tabIndex="0"
				onClick={leftClickHandler}
				onContextMenu={rightClickHandler}
			>
				{children}
			</div>
			{/* </Link> */}
			{/* Toggle only changes when the database is updated */}
			{toggleHandler && (
				<div className="toggle normal" onClick={toggle}>
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
				// <div className="toggle checkcross" onClick={toggleHandler}>
				// 	<input
				// 		id="checkcross"
				// 		type="checkbox"
				// 		readOnly
				// 		checked={enabled}
				// 		onClick={(e) => {
				// 			e.preventDefault();
				// 		}}
				// 	></input>
				// 	<label className="toggle-item" htmlFor="checkcross">
				// 		<div className="check"></div>
				// 	</label>
				// </div>
			)}
		</div>
	);
};

export default Card;
