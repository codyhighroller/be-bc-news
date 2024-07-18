const {
	selectTopics,
	selectArticleById,
	selectAllArticles,
	selectCommentsByArticleId,
	selectUsers,
} = require("../models/get-models");

exports.getTopics = (req, res, next) => {
	selectTopics()
		.then((topics) => {
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
			res.status(200).send({ article });
		})
		.catch((err) => {
			next(err);
		});
};

exports.getAllArticles = (req, res, next) => {
	selectAllArticles()
		.then((articles) => {
			res.status(200).send({ articles });
		})
		.catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
	const { article_id } = req.params;
	selectArticleById(article_id)
		.then(() => selectCommentsByArticleId(article_id))
		.then((comments) => {
			res.status(200).send({ comments });
		})
		.catch(next);
};

exports.getUsers = (req, res, next) => {
	selectUsers()
		.then((users) => {
			res.status(200).send({ users });
		})
		.catch((err) => {
			next(err);
		});
};
