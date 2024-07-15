const { selectTopics, selectArticleById } = require("../models/model");

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
			next(err);
		});
};

exports.getArticleById = (req, res, next) => {
	const { article_id } = req.params;
	selectArticleById(article_id)
		.then((article) => {
			if (!article) {
				const error = {
					status: 404,
					message: "Article not found",
				};
				throw error;
			}
			res.status(200).send({ article });
		})
		.catch((err) => {
			next(err);
		});
};
