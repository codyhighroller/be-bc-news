const { insertComment } = require("../models/post-models");

exports.postComment = (req, res, next) => {
	const { article_id } = req.params;
	const { username, body } = req.body;

	if (!username || !body) {
		return next({ status: 400, message: "Missing required fields" });
	}

	insertComment(article_id, username, body)
		.then((comment) => {
			res.status(201).send({ comment });
		})
		.catch(next);
};
