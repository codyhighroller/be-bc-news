const db = require("../db/connection");

exports.selectTopics = () => {
	return db.query("SELECT * FROM topics;").then(({ rows }) => {
		return rows;
	});
};

exports.selectArticleById = (article_id) => {
	return db
		.query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
		.then(({ rows }) => {
			if (rows.length === 0) {
				return Promise.reject({
					status: 404,
					message: "Article not found",
				});
			}
			return rows[0];
		});
};

exports.selectArticles = (sort_by = "created_at", order = "desc", topic) => {
	const whitelistSortBy = [
		"article_id",
		"title",
		"topic",
		"author",
		"created_at",
		"votes",
		"comment_count",
	];
	const whitelistOrder = ["asc", "desc"];

	let queryString = `
    SELECT
        articles.article_id,
        articles.title,
        articles.topic,
        articles.author,
        articles.created_at,
        articles.votes,
        articles.article_img_url,
        COALESCE (comment_count, 0) :: INTEGER AS comment_count
    FROM articles
    LEFT JOIN (
        SELECT
            article_id,
            COUNT (comment_id) AS comment_count
        FROM comments
        GROUP BY article_id
    ) AS comment_counts
    USING (article_id)
    `;

	const queryValues = [];

	if (topic) {
		queryString += ` WHERE topic = $1`;
		queryValues.push(topic);
	}

	if (whitelistSortBy.includes(sort_by.toLowerCase())) {
		queryString += ` ORDER BY ${sort_by}`;
	} else {
		return Promise.reject({ status: 400, message: "Invalid sort query" });
	}

	if (whitelistOrder.includes(order.toLowerCase())) {
		queryString += ` ${order.toUpperCase()}`;
	} else {
		return Promise.reject({ status: 400, message: "Invalid order query" });
	}
	return db.query(queryString, queryValues).then(({ rows }) => {
		return rows.map(
			({ body, ...articleWithoutBody }) => articleWithoutBody
		);
	});
};

exports.selectCommentsByArticleId = (articleId) => {
	return db
		.query(
			`SELECT comment_id, votes, created_at, author, body, article_id
            FROM comments
            WHERE article_id = $1
            ORDER BY created_at DESC`,
			[articleId]
		)
		.then(({ rows }) => rows);
};

exports.selectUsers = () => {
	return db.query("SELECT * FROM users;").then(({ rows }) => {
		return rows;
	});
};
