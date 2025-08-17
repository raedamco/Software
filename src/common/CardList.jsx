import { useEffect, useState } from "react";
import { useParams } from "react-router";

const CardList = ({ getJsx }) => {
	const params = useParams();
	const [jsx, setJsx] = useState([]);
	const [title, setTitle] = useState("");

	useEffect(() => {
		const abortController = new AbortController();
		getJsx(setJsx, setTitle, params);

		return () => abortController.abort();
	}, [getJsx, params]);

	return (
		<div className="card-list-container">
			<div className="main" id="main">
				<h1 className="page-title" id="structureTitle">
					{title}
				</h1>
				<div className="card-list-content">{jsx}</div>
			</div>
		</div>
	);
};

export default CardList;
