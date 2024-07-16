const db = require("../db/connection");

exports.insertComment = async (article_id, username, body) => {
	// First, check if the article exists
	const articleCheck = await db.query(
		"SELECT * FROM articles WHERE article_id = $1",
		[article_id]
	);

	if (articleCheck.rows.length === 0) {
		throw { status: 404, message: "Article not found" };
	}

	// Then, check if the user exists
	const userCheck = await db.query(
		"SELECT * FROM users WHERE username = $1",
		[username]
	);

	if (userCheck.rows.length === 0) {
		throw { status: 404, message: "User not found" };
	}
	const result = await db.query(
		`INSERT INTO comments 
         (body, article_id, author, votes, created_at) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *`,
		[body, article_id, username, 0, new Date()]
	);

	return result.rows[0];
};
