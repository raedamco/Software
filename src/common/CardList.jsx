import { useEffect, useState } from "react";
import { useRouteMatch } from "react-router";

const CardList = ({ getJsx, addFunction }) => {
	const { path, url, params } = useRouteMatch();
	const [jsx, setJsx] = useState([]);
	const [title, setTitle] = useState("");

	useEffect(() => {
		const abortController = new AbortController();
		getJsx(setJsx, setTitle, params);

		return () => abortController.abort();
	}, [getJsx]);

	return (
		//TODO animate-box was causing issues with below div
		<div className="col-md-12 text-center">
			<div className="main" id="main">
				<h1
					id="structureTitle"
					style={{ paddingTop: "50px", paddingBottom: "50px" }}
				>
					{title}
				</h1>
				{addFunction ? (
					<button className="btn btn-primary" onClick={addFunction}>
						Add to {title}
					</button>
				) : (
					<></>
				)}
				<div>{jsx}</div>
			</div>
		</div>
	);
};

export default CardList;
