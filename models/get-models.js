const db = require("../db/connection");

exports.selectTopics = () => {
	return db.query("SELECT * FROM topics;").then(({ rows }) => {
		return rows;
	});
};

exports.selectArticleById = (article_id) => {
	const query = `
	  SELECT 
		articles.*,
		COUNT(comments.comment_id)::INT AS comment_count
	  FROM 
		articles
	  LEFT JOIN
		comments ON articles.article_id = comments.article_id
	  WHERE 
		articles.article_id = $1
	  GROUP BY
		articles.article_id
	`;

	return db.query(query, [article_id]).then(({ rows }) => {
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
	const whitelistTopic = ["football", "coding", "cooking"];

	if (!whitelistSortBy.includes(sort_by.toLowerCase())) {
		return Promise.reject({ status: 400, message: "Invalid sort query" });
	}

	if (!whitelistOrder.includes(order.toLowerCase())) {
		return Promise.reject({ status: 400, message: "Invalid order query" });
	}

	if (topic && !whitelistTopic.includes(topic.toLowerCase())) {
		return Promise.reject({ status: 404, message: "Topic not found" });
	}

	let queryString = `
    SELECT
        articles.article_id,
        articles.title,
        articles.topic,
        articles.author,
        articles.created_at,
        articles.votes,
        articles.article_img_url,
        COALESCE(comment_count, 0)::INTEGER AS comment_count
    FROM articles
    LEFT JOIN (
        SELECT article_id, COUNT(comment_id) AS comment_count
        FROM comments
        GROUP BY article_id
    ) AS comment_counts USING (article_id)
    `;

	const queryValues = [];

	if (topic) {
		queryString += `WHERE articles.topic = $1`;
		queryValues.push(topic);
	}

	queryString += ` ORDER BY ${sort_by} ${order.toUpperCase()}`;

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
