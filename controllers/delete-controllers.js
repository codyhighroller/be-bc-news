const { checkCommentExists } = require("../db/seeds/utils");
const { removeComment } = require("../models/delete-models");

exports.deleteComment = (req, res, next) => {
	const { comment_id } = req.params;
	checkCommentExists(comment_id)
		.then((exists) => {
			return removeComment(comment_id, exists);
		})
		.then(() => {
			res.status(204).send();
		})
		.catch(next);
};
