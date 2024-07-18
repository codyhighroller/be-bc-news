exports.psqlErrorHandler = (err, request, response, next) => {
	if (err.code === "22P02") {
		response.status(400).send({ message: "Invalid input type" });
	}
	if (err.code === "23503") {
		response.status(404).send({ message: "Input not found" });
	}
	if (err.code === "23502") {
		response.status(400).send({ message: "Missing required fields" });
	} else {
		next(err);
	}
};

exports.customErrorHandler = (err, request, response, next) => {
	if (err.status && err.message) {
		response.status(err.status).send({ message: err.message });
	} else {
		next(err);
	}
};

exports.serverErrorHandler = (err, request, response, next) => {
	response.status(500).send({ message: "Internal server error" });
};
