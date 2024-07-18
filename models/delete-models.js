const db = require("../db/connection");

exports.removeComment = (comment_id, exists) => {
	if (!exists) {
		return Promise.reject({
			status: 404,
			message: "Comment not found",
		});
	}
	return db.query(
		`
      DELETE FROM comments
      WHERE comment_id = $1
      `,
		[comment_id]
	);
};
