import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const SwalReact = withReactContent(Swal);

// formHtml is all the html that shows up in the popup
// formData is passed to the formHandler callback
// formData contains a list of form inputs indexed by their id
function SwalForm(popupHtml, formHandler = undefined, footerHtml = undefined) {
	const formHtml = <form>{popupHtml}</form>;

	SwalReact.fire({
		html: formHtml,
		footer: footerHtml,
		showCancelButton: true,
		focusConfirm: false,
		preConfirm: () => {
			if (formHandler) {
				const formData = SwalReact.getPopup().querySelector("form").elements;
				formHandler(formData);
			}
		},
	});
}

function SwalSuccess(msg) {
	SwalReact.fire({
		title: "Success",
		text: msg ? msg : "Update successful!",
		icon: "success",
		confirmButtonText: "Close",
	});
}

function SwalFail(msg, error) {
	//TODO log to firebase logger
	SwalReact.fire({
		title: "Error",
		text: msg ? msg : "Something went wrong",
		icon: "error",
		confirmButtonText: "Close",
	});
}

function SwalInfo(msg) {
	SwalReact.fire({
		title: "Info",
		html: msg,
		icon: "info",
		confirmButtonText: "Close",
	});
}

export default SwalForm;
export { SwalForm, SwalSuccess, SwalFail, SwalInfo };
