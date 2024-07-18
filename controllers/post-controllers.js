const { insertComment } = require("../models/post-models");

exports.postComment = (req, res, next) => {
	const { article_id } = req.params;
	const { username, body } = req.body;

	insertComment(article_id, username, body)
		.then((comment) => {
			res.status(201).json({ comment });
		})
		.catch(next);
};
