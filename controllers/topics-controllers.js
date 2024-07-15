const { selectTopics } = require("../models/topics-models");

exports.getTopics = (req, res, next) => {
	selectTopics()
		.then((topics) => {
			if (topics.length === 0) {
				const error = {
					status: 404,
					message: "No topics found",
				};
				throw error;
			}
			res.status(200).send({ topics });
		})
		.catch((err) => {
			console.log(err, "<<<< getTopics Err in the cont");
			next(err);
		});
};
