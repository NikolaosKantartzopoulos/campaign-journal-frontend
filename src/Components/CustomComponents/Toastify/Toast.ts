import Toastify from "toastify-js";

export const toastMessage = (
	text: string,
	type: "info" | "success" | "error" | "warning"
) =>
	Toastify({
		position: "center",
		text: text,
		duration: 3000,
		style: {
			color: "black",
			background:
				type === "info"
					? "lightblue"
					: type === "success"
					? "lightgreen"
					: type === "warning"
					? "lightyellow"
					: "lightcoral",
		},
	}).showToast();
